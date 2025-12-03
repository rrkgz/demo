import { Request, Response } from 'express';
import Reserva from '../models/Reserva';
import Cliente from '../models/Cliente';
import Mascota from '../models/Mascota';
import Veterinario from '../models/Veterinario';
import Servicio from '../models/Servicio';

// Crear reserva
export const crearReserva = async (request: Request, response: Response) => {
    const { rut_cliente, id_mascota, id_veterinario, id_servicio, fecha, hora } = request.body;
    
    if (!rut_cliente || !id_mascota || !fecha || !hora) {
        response.status(400).json({ error: 'RUT cliente, mascota, fecha y hora son obligatorios' });
        return;
    }

    try {
        const nuevaReserva = await Reserva.create({ 
            rut_cliente, 
            id_mascota, 
            id_veterinario, 
            id_servicio, 
            fecha, 
            hora 
        });
        response.status(201).json({ message: 'Reserva creada correctamente', reserva: nuevaReserva });
    } catch (error) {
        console.error('Error al crear reserva', error);
        response.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Listar reservas (con relaciones)
export const listarReservas = async (request: Request, response: Response) => {
    try {
        const reservas = await Reserva.findAll({
            include: [
                { model: Cliente, as: 'cliente' },
                { model: Mascota, as: 'mascota' },
                { model: Veterinario, as: 'veterinario', attributes: ['email', 'nombre', 'especialidad'] },
                { model: Servicio, as: 'servicio' }
            ]
        });
        response.json(reservas);
    } catch (error) {
        console.error('Error al listar reservas', error);
        response.status(500).json({ error: 'Error al obtener reservas' });
    }
};

// Obtener reserva por ID
export const obtenerReserva = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const reserva = await Reserva.findByPk(id, {
            include: [
                { model: Cliente, as: 'cliente' },
                { model: Mascota, as: 'mascota' },
                { model: Veterinario, as: 'veterinario', attributes: ['email', 'nombre', 'especialidad'] },
                { model: Servicio, as: 'servicio' }
            ]
        });
        if (!reserva) {
            response.status(404).json({ error: 'Reserva no encontrada' });
            return;
        }
        response.json(reserva);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener reserva' });
    }
};

// Modificar reserva
export const modificarReserva = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { rut_cliente, id_mascota, id_veterinario, id_servicio, fecha, hora } = request.body;
    
    try {
        const reserva = await Reserva.findByPk(id);
        if (!reserva) {
            response.status(404).json({ error: 'Reserva no encontrada' });
            return;
        }

        if (rut_cliente !== undefined) reserva.rut_cliente = rut_cliente;
        if (id_mascota !== undefined) reserva.id_mascota = id_mascota;
        if (id_veterinario !== undefined) reserva.id_veterinario = id_veterinario;
        if (id_servicio !== undefined) reserva.id_servicio = id_servicio;
        if (fecha !== undefined) reserva.fecha = fecha;
        if (hora !== undefined) reserva.hora = hora;

        await reserva.save();
        response.json({ message: 'Reserva actualizada correctamente', reserva });
    } catch (error) {
        response.status(500).json({ error: 'Error al modificar reserva' });
    }
};

// Eliminar reserva
export const eliminarReserva = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const reserva = await Reserva.findByPk(id);
        if (!reserva) {
            response.status(404).json({ error: 'Reserva no encontrada' });
            return;
        }
        await reserva.destroy();
        response.json({ message: 'Reserva eliminada correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al eliminar reserva' });
    }
};
