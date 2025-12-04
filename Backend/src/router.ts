import { Router } from 'express'
import { crearUsuario, inicioSesion, listarUsuarios, eliminarUsuario, modificarUsuario, cambiarPassword } from './handlers/usuarios'
import { crearVeterinario, listarVeterinarios, obtenerVeterinario, modificarVeterinario, eliminarVeterinario } from './handlers/veterinarios'
import { inicioSesionAdmin } from './handlers/admin'
import { crearCliente, listarClientes, obtenerCliente, modificarCliente, eliminarCliente } from './handlers/clientes'
import { crearMascota, listarMascotas, obtenerMascota, modificarMascota, eliminarMascota } from './handlers/mascotas'
import { crearServicio, listarServicios, obtenerServicio, modificarServicio, eliminarServicio } from './handlers/servicios'
import { crearReserva, listarReservas, obtenerReserva, modificarReserva, eliminarReserva } from './handlers/reservas'
import { crearBoleta, listarBoletas, obtenerBoleta, modificarBoleta, eliminarBoleta } from './handlers/boletas'
import { crearTratamiento, listarTratamientos, obtenerTratamiento, modificarTratamiento, eliminarTratamiento } from './handlers/tratamientos'
import { verificarToken } from './middleware/verificarToken'

const router = Router()

// ===== RUTAS PÚBLICAS (SIN AUTENTICACIÓN) =====
router.post('/crear-cuenta', crearUsuario)
router.post('/iniciar-sesion', inicioSesion)
router.post('/iniciar-sesion-admin', inicioSesionAdmin)

// Listar servicios y veterinarios (público)
router.get('/veterinarios', listarVeterinarios)
router.get('/servicios', listarServicios)

// ===== RUTAS PROTEGIDAS (CON AUTENTICACIÓN) =====

// Cambiar contraseña
router.post('/cambiar-password', verificarToken, cambiarPassword)

// Usuarios (admin)
router.get('/usuarios', verificarToken, listarUsuarios)
router.delete('/usuarios/:email', verificarToken, eliminarUsuario)
router.put('/usuarios/:email', verificarToken, modificarUsuario)

// Veterinarios (admin)
router.get('/veterinarios/:email', verificarToken, obtenerVeterinario)
router.post('/veterinarios', verificarToken, crearVeterinario)
router.put('/veterinarios/:email', verificarToken, modificarVeterinario)
router.delete('/veterinarios/:email', verificarToken, eliminarVeterinario)

// Clientes (admin)
router.post('/clientes', verificarToken, crearCliente)
router.get('/clientes', verificarToken, listarClientes)
router.get('/clientes/:id', verificarToken, obtenerCliente)
router.put('/clientes/:id', verificarToken, modificarCliente)
router.delete('/clientes/:id', verificarToken, eliminarCliente)

// Mascotas (usuario)
router.post('/mascotas', verificarToken, crearMascota)
router.get('/mascotas', verificarToken, listarMascotas)
router.get('/mascotas/:id', verificarToken, obtenerMascota)
router.put('/mascotas/:id', verificarToken, modificarMascota)
router.delete('/mascotas/:id', verificarToken, eliminarMascota)

// Servicios (admin)
router.post('/servicios', verificarToken, crearServicio)
router.get('/servicios/:id', verificarToken, obtenerServicio)
router.put('/servicios/:id', verificarToken, modificarServicio)
router.delete('/servicios/:id', verificarToken, eliminarServicio)

// Reservas (usuario)
router.post('/reservas', verificarToken, crearReserva)
router.get('/reservas', verificarToken, listarReservas)
router.get('/reservas/:id', verificarToken, obtenerReserva)
router.put('/reservas/:id', verificarToken, modificarReserva)
router.delete('/reservas/:id', verificarToken, eliminarReserva)

// Boletas (usuario)
router.post('/boletas', verificarToken, crearBoleta)
router.get('/boletas', verificarToken, listarBoletas)
router.get('/boletas/:id', verificarToken, obtenerBoleta)
router.put('/boletas/:id', verificarToken, modificarBoleta)
router.delete('/boletas/:id', verificarToken, eliminarBoleta)

// Tratamientos (usuario)
router.post('/tratamientos', verificarToken, crearTratamiento)
router.get('/tratamientos', verificarToken, listarTratamientos)
router.get('/tratamientos/:id', verificarToken, obtenerTratamiento)
router.put('/tratamientos/:id', verificarToken, modificarTratamiento)
router.delete('/tratamientos/:id', verificarToken, eliminarTratamiento)

export default router