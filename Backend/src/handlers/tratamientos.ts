import { Request, Response } from 'express';
import Tratamiento from '../models/Tratamiento';
import Boleta from '../models/Boleta';

// Crear tratamiento
export const crearTratamiento = async (request: Request, response: Response) => {
    const { id_boleta, fecha, descripcion, medicamentos, tratamiento, diagnostico } = request.body;
    
    if (!id_boleta || !fecha) {
        response.status(400).json({ error: 'ID boleta y fecha son obligatorios' });
        return;
    }

    try {
        const nuevoTratamiento = await Tratamiento.create({ 
            id_boleta, 
            fecha, 
            descripcion, 
            medicamentos, 
            tratamiento, 
            diagnostico 
        });
        response.status(201).json({ message: 'Tratamiento creado correctamente', tratamiento: nuevoTratamiento });
    } catch (error) {
        console.error('Error al crear tratamiento', error);
        response.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Listar tratamientos (con boleta)
export const listarTratamientos = async (request: Request, response: Response) => {
    try {
        const tratamientos = await Tratamiento.findAll({
            include: [
                { model: Boleta, as: 'boleta' }
            ]
        });
        response.json(tratamientos);
    } catch (error) {
        console.error('Error al listar tratamientos', error);
        response.status(500).json({ error: 'Error al obtener tratamientos' });
    }
};

// Obtener tratamiento por ID
export const obtenerTratamiento = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const tratamiento = await Tratamiento.findByPk(id, {
            include: [
                { model: Boleta, as: 'boleta' }
            ]
        });
        if (!tratamiento) {
            response.status(404).json({ error: 'Tratamiento no encontrado' });
            return;
        }
        response.json(tratamiento);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener tratamiento' });
    }
};

// Modificar tratamiento
export const modificarTratamiento = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { id_boleta, fecha, descripcion, medicamentos, tratamiento, diagnostico } = request.body;
    
    try {
        const tratamientoExistente = await Tratamiento.findByPk(id);
        if (!tratamientoExistente) {
            response.status(404).json({ error: 'Tratamiento no encontrado' });
            return;
        }

        if (id_boleta !== undefined) tratamientoExistente.id_boleta = id_boleta;
        if (fecha !== undefined) tratamientoExistente.fecha = fecha;
        if (descripcion !== undefined) tratamientoExistente.descripcion = descripcion;
        if (medicamentos !== undefined) tratamientoExistente.medicamentos = medicamentos;
        if (tratamiento !== undefined) tratamientoExistente.tratamiento = tratamiento;
        if (diagnostico !== undefined) tratamientoExistente.diagnostico = diagnostico;

        await tratamientoExistente.save();
        response.json({ message: 'Tratamiento actualizado correctamente', tratamiento: tratamientoExistente });
    } catch (error) {
        response.status(500).json({ error: 'Error al modificar tratamiento' });
    }
};

// Eliminar tratamiento
export const eliminarTratamiento = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const tratamiento = await Tratamiento.findByPk(id);
        if (!tratamiento) {
            response.status(404).json({ error: 'Tratamiento no encontrado' });
            return;
        }
        await tratamiento.destroy();
        response.json({ message: 'Tratamiento eliminado correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al eliminar tratamiento' });
    }
};
