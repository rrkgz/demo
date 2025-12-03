import { Request, Response } from 'express';
import Boleta from '../models/Boleta';
import DetalleReserva from '../models/DetalleReserva';

// Crear boleta
export const crearBoleta = async (request: Request, response: Response) => {
    const { id_detalle_reserva, fecha_pago, monto_total } = request.body;
    
    if (!id_detalle_reserva || !fecha_pago || monto_total === undefined) {
        response.status(400).json({ error: 'ID detalle reserva, fecha de pago y monto total son obligatorios' });
        return;
    }

    try {
        const nuevaBoleta = await Boleta.create({ id_detalle_reserva, fecha_pago, monto_total });
        response.status(201).json({ message: 'Boleta creada correctamente', boleta: nuevaBoleta });
    } catch (error) {
        console.error('Error al crear boleta', error);
        response.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Listar boletas (con detalle de reserva)
export const listarBoletas = async (request: Request, response: Response) => {
    try {
        const boletas = await Boleta.findAll({
            include: [
                { model: DetalleReserva, as: 'detalle' }
            ]
        });
        response.json(boletas);
    } catch (error) {
        console.error('Error al listar boletas', error);
        response.status(500).json({ error: 'Error al obtener boletas' });
    }
};

// Obtener boleta por ID
export const obtenerBoleta = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const boleta = await Boleta.findByPk(id, {
            include: [
                { model: DetalleReserva, as: 'detalle' }
            ]
        });
        if (!boleta) {
            response.status(404).json({ error: 'Boleta no encontrada' });
            return;
        }
        response.json(boleta);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener boleta' });
    }
};

// Modificar boleta
export const modificarBoleta = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { id_detalle_reserva, fecha_pago, monto_total } = request.body;
    
    try {
        const boleta = await Boleta.findByPk(id);
        if (!boleta) {
            response.status(404).json({ error: 'Boleta no encontrada' });
            return;
        }

        if (id_detalle_reserva !== undefined) boleta.id_detalle_reserva = id_detalle_reserva;
        if (fecha_pago !== undefined) boleta.fecha_pago = fecha_pago;
        if (monto_total !== undefined) boleta.monto_total = monto_total;

        await boleta.save();
        response.json({ message: 'Boleta actualizada correctamente', boleta });
    } catch (error) {
        response.status(500).json({ error: 'Error al modificar boleta' });
    }
};

// Eliminar boleta
export const eliminarBoleta = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const boleta = await Boleta.findByPk(id);
        if (!boleta) {
            response.status(404).json({ error: 'Boleta no encontrada' });
            return;
        }
        await boleta.destroy();
        response.json({ message: 'Boleta eliminada correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al eliminar boleta' });
    }
};
