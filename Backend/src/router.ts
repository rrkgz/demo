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


router.post('/crear-cuenta', crearUsuario)
router.post('/iniciar-sesion', inicioSesion)
router.post('/iniciar-sesion-admin', inicioSesionAdmin)

// Rutas protegidas para administración
router.use(verificarToken)
router.post('/cambiar-password', cambiarPassword)

// Usuarios
router.get('/usuarios', listarUsuarios)
router.delete('/usuarios/:email', eliminarUsuario)
router.put('/usuarios/:email', modificarUsuario)

// Veterinarios
router.post('/veterinarios', crearVeterinario)
router.get('/veterinarios', listarVeterinarios)
router.get('/veterinarios/:email', obtenerVeterinario)
router.put('/veterinarios/:email', modificarVeterinario)
router.delete('/veterinarios/:email', eliminarVeterinario)

// Clientes
router.post('/clientes', crearCliente)
router.get('/clientes', listarClientes)
router.get('/clientes/:id', obtenerCliente)
router.put('/clientes/:id', modificarCliente)
router.delete('/clientes/:id', eliminarCliente)

// Mascotas (protegidas con token)
router.post('/mascotas', verificarToken, crearMascota)
router.get('/mascotas', verificarToken, listarMascotas)
router.get('/mascotas/:id', verificarToken, obtenerMascota)
router.put('/mascotas/:id', verificarToken, modificarMascota)
router.delete('/mascotas/:id', verificarToken, eliminarMascota)

// Servicios
router.post('/servicios', crearServicio)
router.get('/servicios', listarServicios)
router.get('/servicios/:id', obtenerServicio)
router.put('/servicios/:id', modificarServicio)
router.delete('/servicios/:id', eliminarServicio)

// Reservas
router.post('/reservas', crearReserva)
router.get('/reservas', listarReservas)
router.get('/reservas/:id', obtenerReserva)
router.put('/reservas/:id', modificarReserva)
router.delete('/reservas/:id', eliminarReserva)

// Boletas
router.post('/boletas', crearBoleta)
router.get('/boletas', listarBoletas)
router.get('/boletas/:id', obtenerBoleta)
router.put('/boletas/:id', modificarBoleta)
router.delete('/boletas/:id', eliminarBoleta)

// Tratamientos
router.post('/tratamientos', crearTratamiento)
router.get('/tratamientos', listarTratamientos)
router.get('/tratamientos/:id', obtenerTratamiento)
router.put('/tratamientos/:id', modificarTratamiento)
router.delete('/tratamientos/:id', eliminarTratamiento)

export default router