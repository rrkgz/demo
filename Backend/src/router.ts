import { Router } from 'express'
import { crearUsuario, inicioSesion, listarUsuarios, eliminarUsuario, modificarUsuario, cambiarPassword } from './handlers/usuarios'
import { crearVeterinario, listarVeterinarios, obtenerVeterinario, modificarVeterinario, eliminarVeterinario } from './handlers/veterinarios'
import { inicioSesionAdmin } from './handlers/admin'
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

export default router