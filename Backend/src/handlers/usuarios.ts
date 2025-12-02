import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import Usuario from "../models/Usuario"
import jwt from 'jsonwebtoken'



export const inicioSesion = async(request: Request, response: Response)=>{
    const {email,password} = request.body
    const SECRET = process.env.SECRET_KEY    
    try {
        const usuario = await Usuario.findByPk(email)
        console.log(usuario);
        
        if(!usuario || !bcrypt.compareSync(password, usuario.password)){
            response.status(401).json({error: 'Credenciales Incorrectas aa'})
            return;
        }

        const token = jwt.sign({email: usuario.email}, SECRET, {expiresIn: '1h'})
        response.json({token})
    } catch (error) {
        console.log('Error de login', error);
        response.status(500).json({error: 'Error interno del servidor'})
    }
}



export const crearUsuario = async (request: Request, response: Response) => {
    const { email, password } = request.body;
    if (!email || !password) {
        response.status(400).json({ error: 'Email y contraseña son obligatorios' });
        return;
    }

    try {
        const existente = await Usuario.findByPk(email);
        if (existente) {
            response.status(400).json({ error: 'Ese email ya está registrado' });
            return;
        }

        

        console.log('Creando usuario:', { email });

        const nuevoUsuario = await Usuario.create({ email, password });

        console.log('Usuario creado:', nuevoUsuario);
        response.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error('Error al registrar usuario', error);
        if (error instanceof Error) {
            response.status(500).json({ error: 'Error interno del servidor', detalle: error.message, stack: error.stack });
        } else {
            response.status(500).json({ error: 'Error interno del servidor', detalle: error });
        }
    }
};

// Listar todos los usuarios (solo admin)
export const listarUsuarios = async (request: Request, response: Response) => {
    try {
        const usuarios = await Usuario.findAll({ attributes: ['email'] });
        response.json(usuarios);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Eliminar usuario por email (solo admin)
export const eliminarUsuario = async (request: Request, response: Response) => {
    const { email } = request.params;
    try {
        const usuario = await Usuario.findByPk(email);
        if (!usuario) {
            response.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        await usuario.destroy();
        response.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

// Modificar usuario (solo admin)
export const modificarUsuario = async (request: Request, response: Response) => {
    const { email } = request.params;
    const { password } = request.body;
    try {
        const usuario = await Usuario.findByPk(email);
        if (!usuario) {
            response.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        if (password) {
            // aseguramos hash al actualizar contraseña
            usuario.password = await bcrypt.hash(password, 10);
        }
        await usuario.save();
        response.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al modificar usuario' });
    }
};

// Cambiar contraseña del usuario autenticado
export const cambiarPassword = async (request: Request, response: Response) => {
    try {
        const user = (request as any).user as { email: string };
        const { actualPassword, nuevaPassword } = request.body as { actualPassword: string; nuevaPassword: string };
        if (!actualPassword || !nuevaPassword) {
            response.status(400).json({ error: 'Parámetros incompletos' });
            return;
        }
        const usuario = await Usuario.findByPk(user.email);
        if (!usuario) {
            response.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        const ok = await bcrypt.compare(actualPassword, usuario.password);
        if (!ok) {
            response.status(401).json({ error: 'Contraseña actual incorrecta' });
            return;
        }
        usuario.password = await bcrypt.hash(nuevaPassword, 10);
        await usuario.save();
        response.json({ message: 'Contraseña actualizada' });
    } catch (error) {
        response.status(500).json({ error: 'Error al cambiar contraseña' });
    }
}