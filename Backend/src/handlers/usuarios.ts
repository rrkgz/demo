import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import Usuario from "../models/Usuario"
import { crearToken } from "../utils/jwt"



export const inicioSesion = async(request: Request, response: Response)=>{
    const {email, password} = request.body
    
    console.log('\n🔐 ===== INICIO DE SESIÓN =====');
    console.log('📧 Email:', email);
    
    try {
        // Buscar usuario
        const usuario = await Usuario.findByPk(email)
        
        if(!usuario) {
            console.log('❌ Usuario no encontrado');
            response.status(401).json({error: 'Usuario o contraseña incorrectos'})
            return;
        }
        
        console.log('✅ Usuario encontrado:', usuario.email);
        
        // Verificar contraseña
        const passwordValida = bcrypt.compareSync(password, usuario.password);
        if(!passwordValida) {
            console.log('❌ Contraseña inválida');
            response.status(401).json({error: 'Usuario o contraseña incorrectos'})
            return;
        }
        
        console.log('✅ Contraseña correcta');

        // Buscar cliente asociado
        const Cliente = require('../models/Cliente').default;
        const cliente = await Cliente.findOne({ where: { email: usuario.email } });
        
        console.log('🔍 Cliente encontrado:', cliente ? cliente.id_cliente : 'NO ENCONTRADO');
        
        // Crear token
        const token = crearToken({
            email: usuario.email,
            id_cliente: cliente?.id_cliente || undefined
        });
        
        console.log('🎉 Login exitoso\n');
        
        response.json({ token });
    } catch (error) {
        console.log('❌ Error en login:', error);
        response.status(500).json({error: 'Error interno del servidor'})
    }
}



export const crearUsuario = async (request: Request, response: Response) => {
    const { email, password, rut, nombre, direccion, telefono } = request.body;
    
    console.log('\n👤 ===== CREAR USUARIO =====');
    console.log('📧 Email:', email);
    console.log('📋 RUT:', rut);
    console.log('👨 Nombre:', nombre);
    
    if (!email || !password || !rut || !nombre) {
        console.log('❌ Datos incompletos');
        response.status(400).json({ error: 'Email, contraseña, RUT y nombre son obligatorios' });
        return;
    }

    try {
        const existente = await Usuario.findByPk(email);
        if (existente) {
            console.log('❌ Email ya registrado');
            response.status(400).json({ error: 'Ese email ya está registrado' });
            return;
        }

        console.log('✅ Creando nuevo usuario...');

        const nuevoUsuario = await Usuario.create({ 
            email, 
            password,
            rut_cliente: rut,
            nombre,
            direccion: direccion || '',
            telefono: telefono || ''
        });

        // Crear cliente asociado automáticamente
        const Cliente = require('../models/Cliente').default;
        const cliente = await Cliente.create({
            rut: rut,
            nombre: nombre,
            direccion: direccion || 'Sin dirección',
            telefono: telefono || 'Sin teléfono',
            email: email
        });

        console.log('✅ Usuario creado:', email);
        console.log('✅ Cliente creado con ID:', cliente.id_cliente, '\n');
        response.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        if (error instanceof Error) {
            response.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
        } else {
            response.status(500).json({ error: 'Error interno del servidor' });
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