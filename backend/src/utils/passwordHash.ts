import bcrypt from 'bcryptjs';

/**
 * Hash de senha usando bcrypt
 * @param password - Senha em texto plano
 * @returns Senha hasheada
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Maior = mais seguro, mas mais lento
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compara senha em texto plano com hash
 * @param password - Senha em texto plano
 * @param hash - Hash da senha armazenada
 * @returns true se a senha coincide
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Valida força da senha
 * @param password - Senha para validar
 * @returns Objeto com resultado da validação
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Gera uma senha temporária aleatória
 * @param length - Comprimento da senha
 * @returns Senha aleatória
 */
export function generateRandomPassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const all = uppercase + lowercase + numbers + special;

  let password = '';
  
  // Garantir pelo menos um de cada tipo
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Preencher o resto aleatoriamente
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Embaralhar a senha
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
