# AVC Alerta - Backend API

Backend API para o aplicativo AVC Alerta, construído com Node.js, Express e Firebase.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Firebase Admin SDK** - Autenticação e banco de dados
- **Firestore** - Banco de dados NoSQL
- **JWT** - Autenticação
- **Helmet** - Segurança
- **CORS** - Cross-Origin Resource Sharing

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Firebase
- Projeto Firebase configurado

## ⚙️ Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Vá em "Configurações do projeto" > "Contas de serviço"
4. Clique em "Gerar nova chave privada"
5. Baixe o arquivo JSON

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com

# JWT Secret
JWT_SECRET=seu_jwt_secret_super_seguro_aqui

# CORS Origins
CORS_ORIGINS=http://localhost:8081,exp://192.168.1.100:8081
```

### 4. Configurar Firestore

No Console do Firebase:
1. Vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione uma localização

## 🏃‍♂️ Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Usuários
- `GET /api/users/profile` - Buscar perfil
- `PUT /api/users/profile` - Atualizar perfil
- `POST /api/users/medical-info` - Salvar info médica
- `GET /api/users/medical-info` - Buscar info médica
- `DELETE /api/users/account` - Deletar conta

### Dados de Saúde
- `POST /api/health/save` - Salvar dados
- `GET /api/health/history/:type?` - Buscar histórico
- `DELETE /api/health/:id` - Deletar registro
- `GET /api/health/stats` - Estatísticas

### Emergência
- `POST /api/emergency/contacts` - Salvar contatos
- `GET /api/emergency/contacts` - Buscar contatos
- `POST /api/emergency/contacts/add` - Adicionar contato
- `DELETE /api/emergency/contacts/:id` - Remover contato
- `POST /api/emergency/call-log` - Registrar chamada
- `GET /api/emergency/call-logs` - Histórico de chamadas

### Health Check
- `GET /health` - Status da API

## 🔒 Autenticação

A API usa Firebase Authentication. O frontend deve:

1. Autenticar com Firebase Auth
2. Obter o ID Token
3. Enviar o token no header: `Authorization: Bearer <token>`

## 📊 Estrutura do Banco de Dados

### Coleções Firestore:

#### `users`
```json
{
  "name": "string",
  "email": "string", 
  "phone": "string",
  "medicalInfo": {
    "allergies": ["string"],
    "medications": ["string"],
    "conditions": ["string"],
    "bloodType": "string",
    "height": "number",
    "weight": "number"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `healthData`
```json
{
  "userId": "string",
  "type": "bp|heartRate|weight",
  "data": {
    "systolic": "number", // para BP
    "diastolic": "number", // para BP
    "value": "number", // para HR e weight
    "notes": "string"
  },
  "timestamp": "timestamp",
  "createdAt": "timestamp"
}
```

#### `emergencyContacts`
```json
{
  "userId": "string",
  "contacts": [
    {
      "id": "string",
      "name": "string",
      "number": "string",
      "relation": "string",
      "type": "personal|medical"
    }
  ],
  "updatedAt": "timestamp"
}
```

## 🧪 Testes

```bash
npm test
```

## 📦 Deploy

### Heroku
1. Instale o Heroku CLI
2. Faça login: `heroku login`
3. Crie app: `heroku create avc-alerta-api`
4. Configure variáveis: `heroku config:set FIREBASE_PROJECT_ID=...`
5. Deploy: `git push heroku main`

### Railway
1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático

## 🔧 Troubleshooting

### Erro de CORS
- Verifique se o frontend está na lista `CORS_ORIGINS`
- Para desenvolvimento local, use: `http://localhost:8081`
- Para Expo, use: `exp://SEU_IP:8081`

### Erro de Firebase
- Verifique se as credenciais estão corretas
- Confirme se o projeto Firebase existe
- Verifique se o Firestore está habilitado

### Erro de autenticação
- Confirme se o token está sendo enviado corretamente
- Verifique se o token não expirou
- Confirme se o usuário existe no Firebase Auth

## 📝 Logs

Os logs são exibidos no console durante desenvolvimento. Em produção, considere usar um serviço como:
- **Loggly**
- **Papertrail** 
- **Winston** com transports

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request