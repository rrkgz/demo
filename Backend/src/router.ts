import { Router } from 'express'
import { crearUsuario, inicioSesion, listarUsuarios, eliminarUsuario, modificarUsuario, cambiarPassword } from './handlers/usuarios'
import { verificarToken } from './middleware/verificarToken'

const router = Router()


router.post('/crear-cuenta', crearUsuario)
router.post('/iniciar-sesion', inicioSesion)

// Rutas protegidas para administración de usuarios
router.use(verificarToken)
router.post('/cambiar-password', cambiarPassword)
router.get('/usuarios', listarUsuarios)
router.delete('/usuarios/:email', eliminarUsuario)
router.put('/usuarios/:email', modificarUsuario)

export default router