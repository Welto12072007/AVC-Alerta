# AVC Alerta - Aplicativo Completo

Aplicativo móvel para auxiliar na identificação dos primeiros sintomas de AVC (Acidente Vascular Cerebral) e fornecer informações essenciais para a recuperação do paciente.

## 🏗️ Estrutura do Projeto

```
avc-alerta/
├── frontend/          # React Native + Expo
│   ├── app/          # Rotas e telas
│   ├── services/     # API e Firebase
│   └── hooks/        # Hooks personalizados
├── backend/          # Node.js + Express + Firebase
│   ├── src/
│   │   ├── config/   # Configurações
│   │   ├── middleware/ # Middlewares
│   │   └── routes/   # Rotas da API
│   └── .env.example  # Variáveis de ambiente
└── README.md
```

## 🚀 Tecnologias

### Frontend
- **React Native** + **Expo** - Framework mobile
- **Expo Router** - Navegação
- **Firebase Auth** - Autenticação
- **TypeScript** - Tipagem estática

### Backend
- **Node.js** + **Express** - Servidor web
- **Firebase Admin SDK** - Banco de dados e autenticação
- **TypeScript** - Tipagem estática
- **Express Validator** - Validação de dados

## 📱 Funcionalidades

- ✅ Identificação rápida de sintomas de AVC (Teste FAST)
- ✅ Informações detalhadas sobre tipos de AVC
- ✅ Guia nutricional completo
- ✅ Monitoramento de sinais vitais
- ✅ Contatos de emergência personalizáveis
- ✅ Autenticação de usuários
- ✅ Sincronização de dados na nuvem

## 🛠️ Configuração

### 1. Configurar Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative **Authentication** e **Firestore**
4. Baixe as credenciais para backend e frontend

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas credenciais do Firebase
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
# Edite frontend/services/firebase.ts com sua config
npm run dev
```

## 🔧 Soluções para Problemas do QR Code

Se o QR code do Expo não funcionar:

### Método 1: Verificar Rede
```bash
# Certifique-se que celular e PC estão na mesma Wi-Fi
npx expo start --clear
```

### Método 2: IP Específico
```bash
# Substitua pelo seu IP local
npx expo start --host 192.168.1.100
```

### Método 3: Túnel (se a rede não funcionar)
```bash
npx expo start --tunnel
```

### Método 4: Limpar Cache
```bash
npx expo start --clear --reset-cache
```

## 🗄️ Alternativas de Banco de Dados

### 🔥 Firebase (Recomendado)
- ✅ **Gratuito** até 1GB
- ✅ **Real-time** database
- ✅ **Autenticação** integrada
- ✅ **Fácil** integração

### Outras Opções:
1. **PlanetScale** - MySQL serverless
2. **Railway** - PostgreSQL/MySQL
3. **Neon** - PostgreSQL serverless
4. **MongoDB Atlas** - NoSQL

## 📚 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login

### Saúde
- `GET /api/health/readings` - Obter registros
- `POST /api/health/readings` - Adicionar registro
- `DELETE /api/health/readings/:id` - Deletar registro

### Emergência
- `GET /api/emergency/contacts` - Obter contatos
- `POST /api/emergency/contacts` - Adicionar contato
- `PUT /api/emergency/contacts/:id` - Atualizar contato
- `DELETE /api/emergency/contacts/:id` - Deletar contato

### Usuários
- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/stats` - Estatísticas

## 🚀 Deploy

### Backend
- **Railway**, **Render**, **Heroku**, **Vercel**

### Frontend
- **Expo EAS Build** para apps nativos
- **Netlify/Vercel** para versão web

## 📞 Contatos de Emergência Padrão

- **SAMU**: 192
- **Bombeiros**: 193
- **Polícia**: 190

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**⚠️ IMPORTANTE**: Este aplicativo é para fins educacionais e informativos. Em caso de emergência médica real, sempre procure ajuda médica profissional imediatamente.