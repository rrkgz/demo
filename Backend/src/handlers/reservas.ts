import { Request, Response } from 'express';
import Reserva from '../models/Reserva';
import Cliente from '../models/Cliente';
import Mascota from '../models/Mascota';
import Veterinario from '../models/Veterinario';
import Servicio from '../models/Servicio';
import Usuario from '../models/Usuario';

// Crear reserva
export const crearReserva = async (request: Request, response: Response) => {
    const { id_mascota, id_veterinario, id_servicio, fecha, hora } = request.body;
    const user = (request as any).user;
    const userEmail = user?.email;
    const clienteId = user?.id_cliente;
    
    console.log('\n📅 ===== CREAR RESERVA =====');
    console.log('📧 Email Usuario:', userEmail);
    console.log('👤 Cliente ID:', clienteId);
    console.log('📝 Datos:', { id_mascota, id_veterinario, id_servicio, fecha, hora });
    
    if (!clienteId || !id_mascota || !id_veterinario || !id_servicio || !fecha || !hora) {
        console.log('❌ Datos incompletos');
        response.status(400).json({ error: 'Todos los campos son obligatorios' });
        return;
    }

    try {
        // Buscar el usuario para obtener su RUT
        const usuario = await Usuario.findByPk(userEmail);
        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            response.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        
        const rutCliente = usuario.rut_cliente;
        console.log('✅ Usuario encontrado - RUT:', rutCliente);
        
        if (!rutCliente) {
            console.log('❌ Usuario sin RUT registrado');
            response.status(400).json({ error: 'Tu cuenta no tiene RUT registrado' });
            return;
        }
        
        const nuevaReserva = await Reserva.create({ 
            rut_cliente: rutCliente as any,  // Type casting porque la tabla aún es INT pero guardaremos como string
            id_mascota, 
            id_veterinario, 
            id_servicio, 
            fecha, 
            hora 
        });
        console.log('✅ Reserva creada:', nuevaReserva.id_reserva);
        console.log('✅ RUT guardado en reserva:', rutCliente, '\n');
        response.status(201).json({ message: 'Reserva creada correctamente', reserva: nuevaReserva });
    } catch (error) {
        console.error('❌ Error al crear reserva:', error);
        response.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Listar reservas (con relaciones)
export const listarReservas = async (request: Request, response: Response) => {
    try {
        const user = (request as any).user;
        const userEmail = user?.email;
        
        console.log('\n📋 ===== LISTAR RESERVAS =====');
        console.log('📧 Email Usuario:', userEmail);
        
        // Si es cliente, obtener su RUT del usuario
        let rutCliente = null;
        if (userEmail) {
            const usuario = await Usuario.findByPk(userEmail);
            if (usuario) {
                rutCliente = usuario.rut_cliente;
                console.log('✅ RUT del cliente:', rutCliente);
            }
        }
        
        // Construir filtro: si es cliente, solo sus reservas; si es admin, todas
        const where = rutCliente ? { rut_cliente: rutCliente } : {};
        
        const reservas = await Reserva.findAll({
            where,
            include: [
                { model: Mascota, as: 'mascota' },
                { model: Veterinario, as: 'veterinario', attributes: ['email', 'nombre', 'especialidad'] },
                { model: Servicio, as: 'servicio' }
            ],
            raw: false
        });
        
        console.log(`✅ Reservas encontradas: ${reservas.length}`);
        
        // Obtener cliente manualmente para cada reserva basado en el RUT
        const reservasConCliente = await Promise.all(
            reservas.map(async (reserva) => {
                let cliente = null;
                if (reserva.rut_cliente) {
                    cliente = await Cliente.findOne({ where: { rut: reserva.rut_cliente } });
                }
                return {
                    ...reserva.toJSON(),
                    cliente
                };
            })
        );
        
        response.json(reservasConCliente);
    } catch (error) {
        console.error('❌ Error al listar reservas', error);
        response.status(500).json({ error: 'Error al obtener reservas' });
    }
};

// Obtener reserva por ID
export const obtenerReserva = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const reserva = await Reserva.findByPk(id, {
            include: [
                { model: Mascota, as: 'mascota' },
                { model: Veterinario, as: 'veterinario', attributes: ['email', 'nombre', 'especialidad'] },
                { model: Servicio, as: 'servicio' }
            ]
        });
        if (!reserva) {
            response.status(404).json({ error: 'Reserva no encontrada' });
            return;
        }
        
        // Obtener cliente basado en el RUT
        let cliente = null;
        if (reserva.rut_cliente) {
            cliente = await Cliente.findOne({ where: { rut: reserva.rut_cliente } });
        }
        
        const reservaConCliente = {
            ...reserva.toJSON(),
            cliente
        };
        
        response.json(reservaConCliente);
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
