# 🚀 Guia de Configuração - AVC Alerta

## Problemas com QR Code do Expo - Soluções

### 1. Verificar Rede
```bash
# Verificar IP da máquina
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig               # Windows
```

### 2. Limpar Cache do Expo
```bash
cd frontend
npx expo start --clear
```

### 3. Usar Túnel (se rede não funcionar)
```bash
cd frontend
npx expo start --tunnel
```

### 4. Verificar Firewall
- **Windows**: Desabilitar temporariamente o Windows Defender
- **macOS**: Sistema > Segurança > Firewall > Permitir Expo
- **Linux**: `sudo ufw allow 8081`

## 🔥 Configuração do Firebase

### 1. Criar Projeto
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome: `avc-alerta-app`
4. Desabilite Google Analytics (opcional)

### 2. Configurar Authentication
1. No console, vá em "Authentication"
2. Clique em "Começar"
3. Aba "Sign-in method"
4. Habilite "Email/senha"

### 3. Configurar Firestore
1. Vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Modo de teste (para desenvolvimento)
4. Escolha localização (southamerica-east1 para Brasil)

### 4. Obter Credenciais
1. Configurações do projeto (ícone engrenagem)
2. Aba "Contas de serviço"
3. "Gerar nova chave privada"
4. Baixar arquivo JSON

### 5. Configurar Frontend
```bash
cd frontend
npm install firebase
```

Criar `frontend/config/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "avc-alerta-app.firebaseapp.com",
  projectId: "avc-alerta-app",
  storageBucket: "avc-alerta-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 🗄️ Alternativas de Banco de Dados

### 1. Firebase (Recomendado)
```bash
# Já configurado acima
```

### 2. PlanetScale
```bash
# Instalar cliente
npm install @planetscale/database

# Configurar conexão
DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"
```

### 3. Railway PostgreSQL
```bash
# Instalar dependências
npm install pg @types/pg

# String de conexão fornecida pelo Railway
DATABASE_URL="postgresql://user:password@host:port/database"
```

### 4. Neon PostgreSQL
```bash
# Mesmo setup do Railway
npm install pg @types/pg

# String de conexão do Neon
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

## 🏃‍♂️ Executar o Projeto

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas configurações
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Testar Conexão
1. Backend rodando em: `http://localhost:3000`
2. Teste: `curl http://localhost:3000/health`
3. Frontend: Escaneie QR code com Expo Go

## 🔧 Troubleshooting

### QR Code não funciona
```bash
# Tentar com IP específico
npx expo start --host 192.168.1.100

# Ou usar túnel
npx expo start --tunnel

# Limpar cache
npx expo start --clear
```

### Erro de CORS
No backend, arquivo `.env`:
```env
CORS_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081
```

### Firebase não conecta
1. Verificar credenciais no `.env`
2. Confirmar se Firestore está habilitado
3. Verificar regras de segurança do Firestore

### Expo não instala
```bash
# Atualizar Expo CLI
npm install -g @expo/cli@latest

# Ou usar npx
npx expo@latest start
```

## 📱 Testar no Dispositivo

### Android
1. Instalar Expo Go na Play Store
2. Escanear QR code
3. Ou usar: `npx expo start --android`

### iOS
1. Instalar Expo Go na App Store
2. Escanear QR code com câmera nativa
3. Ou usar: `npx expo start --ios`

## 🚀 Deploy

### Backend (Railway)
1. Conectar repositório no Railway
2. Configurar variáveis de ambiente
3. Deploy automático

### Frontend (Netlify)
```bash
cd frontend
npx expo export --platform web
# Upload da pasta dist/ para Netlify
```

## 📞 Suporte

Se ainda tiver problemas:
1. Verificar versões do Node.js (18+)
2. Verificar versões do Expo CLI
3. Tentar em rede diferente
4. Usar hotspot do celular
5. Verificar antivírus/firewall