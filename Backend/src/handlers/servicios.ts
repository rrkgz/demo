import { Request, Response } from 'express';
import Servicio from '../models/Servicio';

// Crear servicio
export const crearServicio = async (request: Request, response: Response) => {
    const { nombre, descripcion, precio } = request.body;
    
    if (!nombre || precio === undefined) {
        response.status(400).json({ error: 'Nombre y precio son obligatorios' });
        return;
    }

    try {
        const nuevoServicio = await Servicio.create({ nombre, descripcion, precio });
        response.status(201).json({ message: 'Servicio creado correctamente', servicio: nuevoServicio });
    } catch (error) {
        console.error('Error al crear servicio', error);
        response.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Listar servicios
export const listarServicios = async (request: Request, response: Response) => {
    try {
        const servicios = await Servicio.findAll();
        response.json(servicios);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener servicios' });
    }
};

// Obtener servicio por ID
export const obtenerServicio = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            response.status(404).json({ error: 'Servicio no encontrado' });
            return;
        }
        response.json(servicio);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener servicio' });
    }
};

// Modificar servicio
export const modificarServicio = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { nombre, descripcion, precio } = request.body;
    
    try {
        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            response.status(404).json({ error: 'Servicio no encontrado' });
            return;
        }

        if (nombre !== undefined) servicio.nombre = nombre;
        if (descripcion !== undefined) servicio.descripcion = descripcion;
        if (precio !== undefined) servicio.precio = precio;

        await servicio.save();
        response.json({ message: 'Servicio actualizado correctamente', servicio });
    } catch (error) {
        response.status(500).json({ error: 'Error al modificar servicio' });
    }
};

// Eliminar servicio
export const eliminarServicio = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const servicio = await Servicio.findByPk(id);
        if (!servicio) {
            response.status(404).json({ error: 'Servicio no encontrado' });
            return;
        }
        await servicio.destroy();
        response.json({ message: 'Servicio eliminado correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al eliminar servicio' });
    }
};
