import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Veterinario from '../models/Veterinario';

// Crear veterinario
export const crearVeterinario = async (request: Request, response: Response) => {
    const { email, nombre, especialidad, estado, password } = request.body;
    
    if (!email || !nombre || !password) {
        response.status(400).json({ error: 'Email, nombre y contraseña son obligatorios' });
        return;
    }

    try {
        const existente = await Veterinario.findByPk(email);
        if (existente) {
            response.status(400).json({ error: 'Ese email ya está registrado' });
            return;
        }

        await Veterinario.create({ email, nombre, especialidad, estado: estado || 'activo', password });
        response.status(201).json({ message: 'Veterinario creado correctamente' });
    } catch (error) {
        console.error('Error al crear veterinario', error);
        response.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Listar veterinarios
export const listarVeterinarios = async (request: Request, response: Response) => {
    try {
        const veterinarios = await Veterinario.findAll({ attributes: ['email', 'nombre', 'especialidad', 'estado'] });
        response.json(veterinarios);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener veterinarios' });
    }
};

// Obtener veterinario por email
export const obtenerVeterinario = async (request: Request, response: Response) => {
    const { email } = request.params;
    try {
        const veterinario = await Veterinario.findByPk(email, { attributes: ['email', 'nombre', 'especialidad', 'estado'] });
        if (!veterinario) {
            response.status(404).json({ error: 'Veterinario no encontrado' });
            return;
        }
        response.json(veterinario);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener veterinario' });
    }
};

// Modificar veterinario
export const modificarVeterinario = async (request: Request, response: Response) => {
    const { email } = request.params;
    const { nombre, especialidad, estado, password } = request.body;
    
    try {
        const veterinario = await Veterinario.findByPk(email);
        if (!veterinario) {
            response.status(404).json({ error: 'Veterinario no encontrado' });
            return;
        }

        if (nombre !== undefined) veterinario.nombre = nombre;
        if (especialidad !== undefined) veterinario.especialidad = especialidad;
        if (estado !== undefined) veterinario.estado = estado;
        if (password) {
            veterinario.password = await bcrypt.hash(password, 10);
        }

        await veterinario.save();
        response.json({ message: 'Veterinario actualizado correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al modificar veterinario' });
    }
};

// Eliminar veterinario
export const eliminarVeterinario = async (request: Request, response: Response) => {
    const { email } = request.params;
    try {
        const veterinario = await Veterinario.findByPk(email);
        if (!veterinario) {
            response.status(404).json({ error: 'Veterinario no encontrado' });
            return;
        }
        await veterinario.destroy();
        response.json({ message: 'Veterinario eliminado correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al eliminar veterinario' });
    }
};
