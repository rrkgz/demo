import { Request, Response } from 'express';
import Mascota from '../models/Mascota';
import Cliente from '../models/Cliente';

// Crear mascota
export const crearMascota = async (request: Request, response: Response) => {
    const { nombre, especie, raza, edad, peso, sexo } = request.body;
    const user = (request as any).user;
    
    const clienteId = user?.id_cliente;
    
    console.log('\n🐾 ===== CREAR MASCOTA =====');
    console.log('📧 Usuario:', user?.email);
    console.log('👤 Cliente ID:', clienteId);
    console.log('📝 Datos:', { nombre, especie, raza, edad, peso, sexo });
    
    if (!clienteId || !nombre || !especie) {
        console.log('❌ Datos incompletos');
        response.status(400).json({ error: 'Cliente, nombre y especie son obligatorios' });
        return;
    }

    try {
        const dataMascota: any = { 
            rut_cliente: clienteId, 
            nombre, 
            especie, 
            raza: raza || '', 
            sexo: Boolean(sexo)
        };
        
        // Solo incluir edad si viene definida
        if (edad !== undefined && edad !== null) {
            dataMascota.edad = edad;
        }
        
        // Solo incluir peso si viene definida
        if (peso !== undefined && peso !== null) {
            dataMascota.peso = peso;
        }
        
        console.log('💾 Guardando en BD:', dataMascota);
        const nuevaMascota = await Mascota.create(dataMascota);
        console.log('✅ Mascota creada:', nuevaMascota.id_mascota, '\n');
        response.status(201).json({ message: 'Mascota creada correctamente', mascota: nuevaMascota });
    } catch (error) {
        console.error('❌ Error al crear mascota:', error);
        response.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Listar mascotas (con datos del cliente y veterinario)
export const listarMascotas = async (request: Request, response: Response) => {
    const user = (request as any).user;
    const clienteId = user?.id_cliente;

    console.log('📋 Listando mascotas para cliente:', clienteId);

    try {
        const mascotas = await Mascota.findAll({
            where: clienteId ? { rut_cliente: clienteId } : {},
            include: [
                { model: Cliente, as: 'cliente' }
            ]
        });
        console.log('✅ Mascotas encontradas:', mascotas.length);
        response.json(mascotas);
    } catch (error) {
        console.error('❌ Error al listar mascotas:', error);
        response.status(500).json({ error: 'Error al obtener mascotas' });
    }
};

// Obtener mascota por ID
export const obtenerMascota = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const mascota = await Mascota.findByPk(id, {
            include: [
                { model: Cliente, as: 'cliente' }
            ]
        });
        if (!mascota) {
            response.status(404).json({ error: 'Mascota no encontrada' });
            return;
        }
        response.json(mascota);
    } catch (error) {
        response.status(500).json({ error: 'Error al obtener mascota' });
    }
};

// Modificar mascota
export const modificarMascota = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { rut_cliente, nombre, especie, raza, edad, peso, sexo } = request.body;
    
    try {
        const mascota = await Mascota.findByPk(id);
        if (!mascota) {
            response.status(404).json({ error: 'Mascota no encontrada' });
            return;
        }

        if (rut_cliente !== undefined) mascota.rut_cliente = rut_cliente;
        if (nombre !== undefined) mascota.nombre = nombre;
        if (especie !== undefined) mascota.especie = especie;
        if (raza !== undefined) mascota.raza = raza;
        if (edad !== undefined) mascota.edad = edad;
        if (peso !== undefined) mascota.peso = peso;
        if (sexo !== undefined) mascota.sexo = sexo;

        await mascota.save();
        response.json({ message: 'Mascota actualizada correctamente', mascota });
    } catch (error) {
        response.status(500).json({ error: 'Error al modificar mascota' });
    }
};

// Eliminar mascota
export const eliminarMascota = async (request: Request, response: Response) => {
    const { id } = request.params;
    try {
        const mascota = await Mascota.findByPk(id);
        if (!mascota) {
            response.status(404).json({ error: 'Mascota no encontrada' });
            return;
        }
        await mascota.destroy();
        response.json({ message: 'Mascota eliminada correctamente' });
    } catch (error) {
        response.status(500).json({ error: 'Error al eliminar mascota' });
    }
};
