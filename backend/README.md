# AVC Alerta - Backend

Backend API para o aplicativo AVC Alerta, construído com Node.js, Express e Firebase.

## 🚀 Tecnologias

- **Node.js** + **Express** - Servidor web
- **TypeScript** - Tipagem estática
- **Firebase Admin SDK** - Autenticação e banco de dados
- **Express Validator** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - Logging de requisições

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Projeto Firebase configurado

## ⚙️ Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
```

3. **Editar o arquivo `.env`** com suas credenciais do Firebase

4. **Executar em desenvolvimento:**
```bash
npm run dev
```

5. **Build para produção:**
```bash
npm run build
npm start
```

## 🔧 Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com)
2. Crie um novo projeto ou use um existente
3. Vá em **Configurações do Projeto** > **Contas de Serviço**
4. Clique em **Gerar nova chave privada**
5. Baixe o arquivo JSON e extraia as informações para o `.env`

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login (informativo)

### Saúde
- `GET /api/health/readings` - Obter registros de saúde
- `POST /api/health/readings` - Adicionar registro
- `DELETE /api/health/readings/:id` - Deletar registro

### Contatos de Emergência
- `GET /api/emergency/contacts` - Obter contatos
- `POST /api/emergency/contacts` - Adicionar contato
- `PUT /api/emergency/contacts/:id` - Atualizar contato
- `DELETE /api/emergency/contacts/:id` - Deletar contato

### Usuários
- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/stats` - Estatísticas do usuário

## 🔒 Autenticação

Todas as rotas protegidas requerem um token JWT do Firebase no header:

```
Authorization: Bearer <firebase-jwt-token>
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Executar em modo desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Executar versão de produção
- `npm run lint` - Verificar código com ESLint
- `npm test` - Executar testes

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (Firebase, etc)
│   ├── middleware/      # Middlewares (auth, error handling)
│   ├── routes/          # Rotas da API
│   └── server.ts        # Servidor principal
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json
└── tsconfig.json
```

## 🔍 Monitoramento

- **Logs**: Morgan para logging de requisições HTTP
- **Rate Limiting**: Proteção contra spam (100 req/15min por IP)
- **Helmet**: Headers de segurança HTTP
- **CORS**: Configurado para aceitar apenas origens permitidas

## 🚀 Deploy

Para deploy em produção, configure as variáveis de ambiente no seu provedor de hospedagem e execute:

```bash
npm run build
npm start
```

## 📞 Suporte

Em caso de dúvidas ou problemas, verifique:
1. Se todas as variáveis de ambiente estão configuradas
2. Se o Firebase está configurado corretamente
3. Se as dependências estão instaladas
4. Os logs do servidor para erros específicos