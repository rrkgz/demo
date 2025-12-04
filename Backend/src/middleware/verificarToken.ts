import { Request, Response, NextFunction } from 'express';
import { verificarTokenUtil } from '../utils/jwt';

export function verificarToken(request: Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ Sin token en header');
        response.status(401).json({ error: 'Token no proporcionado' });
        return;
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = verificarTokenUtil(token);
    if (!decoded) {
        console.log('❌ Token inválido o expirado');
        response.status(403).json({ error: 'Token inválido o expirado' });
        return;
    }
    
    console.log('✅ Token válido para:', decoded.email, 'ID Cliente:', decoded.id_cliente);
    ;(request as any).user = decoded
    next()
}