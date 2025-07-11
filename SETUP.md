# 🚀 Guia de Configuração - AVC Alerta

Este guia te ajudará a configurar o projeto completo do AVC Alerta.

## 📋 Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- Conta no **Firebase** ([Criar conta](https://firebase.google.com/))

## 🔥 1. Configurar Firebase

### 1.1 Criar Projeto
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em **"Criar um projeto"**
3. Digite o nome: `avc-alerta`
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 1.2 Configurar Authentication
1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Começar"**
3. Na aba **"Sign-in method"**:
   - Ative **"Email/senha"**
   - Desabilite **"Link de email"**

### 1.3 Configurar Firestore
1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Iniciar no modo de teste"**
4. Selecione uma localização próxima (ex: `southamerica-east1`)

### 1.4 Obter Credenciais

#### Para o Frontend:
1. Clique no ícone de **engrenagem** > **"Configurações do projeto"**
2. Role até **"Seus aplicativos"**
3. Clique no ícone **"Web"** (`</>`)
4. Digite o nome: `avc-alerta-frontend`
5. **NÃO** marque "Firebase Hosting"
6. Clique em **"Registrar app"**
7. **Copie** a configuração que aparece

#### Para o Backend:
1. Vá em **"Configurações do projeto"** > **"Contas de serviço"**
2. Clique em **"Gerar nova chave privada"**
3. Clique em **"Gerar chave"**
4. Salve o arquivo JSON baixado

## 🖥️ 2. Configurar Backend

### 2.1 Instalar Dependências
```bash
cd backend
npm install
```

### 2.2 Configurar Variáveis de Ambiente
```bash
cp .env.example .env
```

### 2.3 Editar arquivo `.env`
Abra o arquivo `backend/.env` e preencha:

```env
# Porta do servidor
PORT=3000

# Ambiente
NODE_ENV=development

# Firebase Admin SDK (do arquivo JSON baixado)
FIREBASE_PROJECT_ID=avc-alerta-xxxxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@avc-alerta-xxxxx.iam.gserviceaccount.com

# CORS Origins
CORS_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANTE**: 
- Substitua `avc-alerta-xxxxx` pelo ID real do seu projeto
- A `PRIVATE_KEY` deve manter as quebras de linha como `\n`
- Substitua `192.168.1.100` pelo seu IP local

### 2.4 Testar Backend
```bash
npm run dev
```

Se tudo estiver correto, você verá:
```
🚀 Servidor rodando na porta 3000
📱 Ambiente: development
🔗 URL: http://localhost:3000
```

Teste acessando: http://localhost:3000

## 📱 3. Configurar Frontend

### 3.1 Instalar Dependências
```bash
cd frontend
npm install
```

### 3.2 Configurar Firebase
Edite o arquivo `frontend/services/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "avc-alerta-xxxxx.firebaseapp.com",
  projectId: "avc-alerta-xxxxx",
  storageBucket: "avc-alerta-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

**⚠️ IMPORTANTE**: Use a configuração que você copiou do Firebase Console.

### 3.3 Configurar API
Edite o arquivo `frontend/services/api.ts` se necessário:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://SEU_IP_LOCAL:3000/api'  // Substitua pelo seu IP
  : 'https://your-production-api.com/api';
```

### 3.4 Testar Frontend
```bash
npm run dev
```

## 🔧 4. Solucionar Problemas do QR Code

### Problema 1: QR Code não funciona
**Solução**: Verificar se celular e PC estão na mesma Wi-Fi

### Problema 2: Erro de conexão
**Solução**: Usar IP específico
```bash
# Descubra seu IP local
ipconfig  # Windows
ifconfig  # Mac/Linux

# Use o IP específico
npx expo start --host 192.168.1.100
```

### Problema 3: Cache corrompido
**Solução**: Limpar cache
```bash
npx expo start --clear --reset-cache
```

### Problema 4: Rede restritiva
**Solução**: Usar túnel
```bash
npx expo start --tunnel
```

## 🧪 5. Testar Integração

### 5.1 Testar Backend
1. Acesse: http://localhost:3000
2. Deve mostrar: `"AVC Alerta API está funcionando!"`

### 5.2 Testar Frontend
1. Abra o app no celular/emulador
2. Tente registrar um usuário
3. Verifique se os dados aparecem no Firebase Console

### 5.3 Testar Comunicação
1. No app, vá para **"Monitoramento"**
2. Adicione um registro de pressão arterial
3. Verifique se aparece no Firestore Console

## 🚀 6. Deploy (Opcional)

### Backend - Railway
1. Acesse [Railway](https://railway.app)
2. Conecte seu GitHub
3. Deploy o projeto
4. Configure as variáveis de ambiente

### Frontend - Expo EAS
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android
```

## 📞 7. Suporte

### Problemas Comuns:

**Erro: "Firebase project not found"**
- Verifique se o `PROJECT_ID` está correto no `.env`

**Erro: "CORS policy"**
- Adicione seu IP/URL no `CORS_ORIGINS` do backend

**Erro: "Network request failed"**
- Verifique se o backend está rodando
- Confirme o IP no `API_BASE_URL` do frontend

**QR Code não funciona**
- Siga as soluções da seção 4

### Logs Úteis:
```bash
# Backend
npm run dev

# Frontend  
npx expo start --clear

# Ver logs do dispositivo
npx expo logs
```

---

🎉 **Parabéns!** Seu projeto AVC Alerta está configurado e funcionando!

Para dúvidas, verifique os logs ou abra uma issue no repositório.