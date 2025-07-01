# AVC Alerta - Backend API

Backend API para o aplicativo AVC Alerta, desenvolvido em Node.js com Express.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Knex.js** - Query builder e migrations
- **SQLite** - Banco de dados (desenvolvimento)
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **express-validator** - Validação de dados
- **helmet** - Segurança HTTP
- **cors** - Cross-Origin Resource Sharing
- **express-rate-limit** - Rate limiting

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (database, cors)
│   ├── controllers/     # Controladores da aplicação
│   ├── middleware/      # Middlewares (auth, validation, etc.)
│   ├── models/          # Modelos de dados
│   ├── routes/          # Definição das rotas
│   ├── database/        # Migrations e seeds
│   ├── utils/           # Utilitários
│   └── server.js        # Arquivo principal do servidor
├── .env                 # Variáveis de ambiente
├── .env.example         # Exemplo de variáveis de ambiente
└── package.json         # Dependências e scripts
```

## ⚙️ Instalação e Configuração

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
PORT=3000
NODE_ENV=development
DB_CLIENT=sqlite3
DB_FILENAME=./src/database/avc_alerta.db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:8081
```

### 3. Executar Migrações

```bash
npm run migrate
```

### 4. Executar Seeds (opcional)

```bash
npm run seed
```

### 5. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📚 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/refresh` - Renovar token

### Usuários

- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `PUT /api/users/password` - Alterar senha
- `DELETE /api/users/account` - Deletar conta

### Monitoramento de Saúde

- `POST /api/health/readings` - Criar leitura
- `GET /api/health/readings` - Listar leituras
- `GET /api/health/readings/:id` - Obter leitura específica
- `PUT /api/health/readings/:id` - Atualizar leitura
- `DELETE /api/health/readings/:id` - Deletar leitura
- `GET /api/health/stats` - Estatísticas de saúde

### Contatos de Emergência

- `POST /api/emergency/contacts` - Criar contato
- `GET /api/emergency/contacts` - Listar contatos
- `GET /api/emergency/contacts/:id` - Obter contato específico
- `PUT /api/emergency/contacts/:id` - Atualizar contato
- `DELETE /api/emergency/contacts/:id` - Deletar contato
- `GET /api/emergency/contacts/primary/:type` - Obter contato primário

### Verificação de Sintomas

- `POST /api/symptoms/checks` - Criar verificação
- `GET /api/symptoms/checks` - Listar verificações
- `GET /api/symptoms/checks/:id` - Obter verificação específica
- `PUT /api/symptoms/checks/:id` - Atualizar verificação
- `DELETE /api/symptoms/checks/:id` - Deletar verificação
- `GET /api/symptoms/stats` - Estatísticas de sintomas

### Status

- `GET /api/status` - Status da API
- `GET /health` - Health check

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:

```
Authorization: Bearer <seu_token_jwt>
```

## 📊 Banco de Dados

### Tabelas

1. **users** - Dados dos usuários
2. **health_readings** - Leituras de saúde (pressão, peso, etc.)
3. **emergency_contacts** - Contatos de emergência
4. **symptom_checks** - Verificações de sintomas

### Migrations

Para criar uma nova migration:

```bash
npx knex migrate:make nome_da_migration --knexfile src/config/database.js
```

Para executar migrations:

```bash
npm run migrate
```

Para reverter migrations:

```bash
npm run migrate:rollback
```

## 🛡️ Segurança

- **Helmet** - Headers de segurança HTTP
- **CORS** - Configuração de Cross-Origin
- **Rate Limiting** - Limitação de requisições
- **JWT** - Tokens seguros para autenticação
- **bcryptjs** - Hash seguro de senhas
- **Validação** - Validação rigorosa de entrada

## 🧪 Testando a API

### Usando curl

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@email.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'

# Obter perfil (com token)
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Usando Postman

1. Importe a collection (se disponível)
2. Configure a variável `baseUrl` como `http://localhost:3000/api`
3. Configure a variável `token` após fazer login

## 🚀 Deploy

### Variáveis de Ambiente para Produção

```env
NODE_ENV=production
PORT=3000
DB_CLIENT=sqlite3
DB_FILENAME=/app/data/avc_alerta.db
JWT_SECRET=sua_chave_super_secreta_de_producao
FRONTEND_URL=https://seu-frontend.com
```

### Docker (opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Logs

Os logs são configurados usando Morgan e incluem:

- Requisições HTTP
- Erros de aplicação
- Status do banco de dados
- Informações de inicialização

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.