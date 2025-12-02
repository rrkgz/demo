import { Request, Response } from 'express';
import Veterinario from '../models/Veterinario';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET_KEY || 'super_secreto_123';

export const inicioSesionAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const veterinario = await Veterinario.findByPk(email);

    if (!veterinario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const passwordValido = await bcrypt.compare(password, veterinario.password);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    if (veterinario.estado !== 'activo') {
      return res.status(403).json({ error: 'Usuario inactivo. Contacte al administrador' });
    }

    const token = jwt.sign(
      { email: veterinario.email, tipo: 'admin' },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      email: veterinario.email,
      nombre: veterinario.nombre,
    });
  } catch (error) {
    console.error('Error en inicio de sesión admin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
