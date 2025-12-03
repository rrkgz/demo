import { Request, Response } from 'express';
import Cliente from '../models/Cliente';

// Crear cliente
export const crearCliente = async (request: Request, response: Response) => {
    const { nombre, direccion, telefono, email } = request.body;
    
    if (!nombre || !email) {
        response.status(400).json({ error: 'Nombre y email son obligatorios' });
        return;
    }

    try {
        const nuevoCliente = await Cliente.create({ nombre, direccion, telefono, email });
        response.status(201).json({ message: 'Cliente creado correctamente', cliente: nuevoCliente });
    } catch (error) {
        console.error('Error al crear cliente', error);
        response.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Listar clientes
export const listarClientes = async (request: Request, response: Response) => {
    try {
        const clientes = await Cliente.findAll();
        response.json(clientes);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener clientes' });
    }
};

// Obtener cliente por ID
export const obtenerCliente = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            response.status(404).json({ error: 'Cliente no encontrado' });
            return;
        }
        response.json(cliente);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener cliente' });
    }
};

// Modificar cliente
export const modificarCliente = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { nombre, direccion, telefono, email } = request.body;
    
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            response.status(404).json({ error: 'Cliente no encontrado' });
            return;
        }

        if (nombre !== undefined) cliente.nombre = nombre;
        if (direccion !== undefined) cliente.direccion = direccion;
        if (telefono !== undefined) cliente.telefono = telefono;
        if (email !== undefined) cliente.email = email;

        await cliente.save();
        response.json({ message: 'Cliente actualizado correctamente', cliente });
    } catch (error) {
        response.status(500).json({ error: 'Error al modificar cliente' });
    }
};

// Eliminar cliente
export const eliminarCliente = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            response.status(404).json({ error: 'Cliente no encontrado' });
            return;
        }
        await cliente.destroy();
        response.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al eliminar cliente' });
    }
};
