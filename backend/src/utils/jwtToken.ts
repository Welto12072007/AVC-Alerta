import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

/**
 * Gera um access token JWT
 * @param userId - ID do usuário
 * @param email - Email do usuário
 * @returns Token JWT
 */
export function generateAccessToken(userId: string, email: string): string {
  const payload: JWTPayload = {
    userId,
    email,
    type: 'access',
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'avc-alerta-api',
    audience: 'avc-alerta-app',
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Gera um refresh token JWT
 * @param userId - ID do usuário
 * @param email - Email do usuário
 * @returns Token JWT de refresh
 */
export function generateRefreshToken(userId: string, email: string): string {
  const payload: JWTPayload = {
    userId,
    email,
    type: 'refresh',
  };

  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'avc-alerta-api',
    audience: 'avc-alerta-app',
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifica e decodifica um token JWT
 * @param token - Token JWT para verificar
 * @returns Payload decodificado
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'avc-alerta-api',
      audience: 'avc-alerta-app',
    }) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expirado');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token inválido');
    }
    throw new Error('Erro ao verificar token');
  }
}

/**
 * Decodifica um token sem verificar assinatura (útil para debugging)
 * @param token - Token JWT para decodificar
 * @returns Payload decodificado ou null
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Gera um token aleatório para verificação de email ou reset de senha
 * @param length - Comprimento do token em bytes (padrão: 32)
 * @returns Token hexadecimal
 */
export function generateVerificationToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Calcula a data de expiração baseada em um período
 * @param period - Período (ex: '24h', '7d', '30m')
 * @returns Data de expiração
 */
export function calculateExpirationDate(period: string): Date {
  const regex = /^(\d+)([smhd])$/;
  const match = period.match(regex);

  if (!match) {
    throw new Error('Formato de período inválido. Use: 30s, 15m, 24h, 7d');
  }

  const [, amount, unit] = match;
  const now = new Date();
  const value = parseInt(amount, 10);

  switch (unit) {
    case 's': // segundos
      return new Date(now.getTime() + value * 1000);
    case 'm': // minutos
      return new Date(now.getTime() + value * 60 * 1000);
    case 'h': // horas
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case 'd': // dias
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    default:
      throw new Error('Unidade de tempo inválida');
  }
}

/**
 * Verifica se um token expirou
 * @param expiresAt - Data de expiração
 * @returns true se o token expirou
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt);
}

/**
 * Extrai o token do header Authorization
 * @param authHeader - Header Authorization
 * @returns Token extraído ou null
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
}
