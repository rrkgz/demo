import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET_KEY || 'super_secreto_123';

export interface TokenPayload {
  email: string;
  id_cliente?: number;
}

export const crearToken = (payload: TokenPayload): string => {
  console.log('🎫 Creando token con payload:', payload);
  const token = jwt.sign(payload, SECRET, { expiresIn: '24h' });
  console.log('✅ Token creado:', token.substring(0, 30) + '...');
  return token;
};

export const verificarTokenUtil = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;
    console.log('🔓 Token verificado para:', decoded.email);
    return decoded;
  } catch (error) {
    console.log('❌ Error al verificar token:', error);
    return null;
  }
};
