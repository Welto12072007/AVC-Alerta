# 🚀 Migração para Supabase + PostgreSQL

Este projeto foi migrado do Firebase para Supabase, utilizando PostgreSQL como banco de dados e o sistema de autenticação do Supabase.

## ✨ Vantagens da Migração

### 🆚 **Firebase vs Supabase**

| Aspecto | Firebase | Supabase |
|---------|----------|----------|
| **Banco de Dados** | NoSQL (Firestore) | PostgreSQL (Relacional) |
| **Autenticação** | Firebase Auth | Supabase Auth (baseado em PostgreSQL) |
| **Preço** | Caro para grandes volumes | Muito mais barato |
| **SQL** | Não suporta | SQL completo |
| **Open Source** | Não | Sim ✅ |
| **Self-Hosting** | Impossível | Possível ✅ |
| **Real-time** | Sim | Sim (via PostgreSQL) |

## 🔧 **Configuração do Supabase**

### **1. Criar Projeto no Supabase**

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Start your project"**
3. Conecte com GitHub/Google
4. Clique em **"New project"**
5. Escolha nome: `avc-alerta`
6. Crie uma senha forte para o banco
7. Escolha região: `South America (São Paulo)`
8. Clique em **"Create new project"**

### **2. Configurar Banco de Dados**

1. Vá em **"SQL Editor"** no painel lateral
2. Copie e cole o conteúdo do arquivo `backend/database/schema.sql`
3. Clique em **"Run"** para executar o script
4. Verifique se as tabelas foram criadas em **"Table Editor"**

### **3. Obter Credenciais**

1. Vá em **"Settings"** > **"API"**
2. Copie as seguintes informações:
   - **Project URL** (SUPABASE_URL)
   - **anon public** (SUPABASE_ANON_KEY)
   - **service_role** (SUPABASE_SERVICE_ROLE_KEY)

## 🔐 **Configuração do Backend**

### **1. Variáveis de Ambiente**

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Supabase Configuration
SUPABASE_URL=https://seu-projeto-id.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### **2. Instalar Dependências**

```bash
npm install
```

### **3. Executar Backend**

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

## 📱 **Configuração do Frontend**

### **1. Atualizar Credenciais**

Edite o arquivo `frontend/services/supabase.ts`:

```typescript
const supabaseUrl = 'https://seu-projeto-id.supabase.co';
const supabaseAnonKey = 'sua-anon-key';
```

### **2. Instalar Dependências**

```bash
cd frontend
npm install
```

### **3. Executar Frontend**

```bash
npm run dev
```

## 🗄️ **Estrutura do Banco PostgreSQL**

### **Tabelas Criadas:**

1. **`auth.users`** - Usuários (gerenciada pelo Supabase)
2. **`profiles`** - Perfis dos usuários
3. **`health_readings`** - Registros de saúde
4. **`emergency_contacts`** - Contatos de emergência

### **Relacionamentos:**

```sql
profiles.id → auth.users.id
health_readings.user_id → auth.users.id
emergency_contacts.user_id → auth.users.id
```

## 🔐 **Sistema de Autenticação**

### **Fluxo de Autenticação:**

1. **Registro**: Cliente → Supabase Auth → Perfil criado
2. **Login**: Cliente → Supabase Auth → Token JWT
3. **Requests**: Header `Authorization: Bearer <token>`
4. **Verificação**: Backend valida token com Supabase

### **Endpoints da API:**

- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/health/readings` - Registros de saúde
- `POST /api/health/readings` - Adicionar registro
- `GET /api/emergency/contacts` - Contatos de emergência
- `POST /api/emergency/contacts` - Adicionar contato

## 🚀 **Como Rodar o Projeto Completo**

### **1. Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas credenciais
npm run dev
```

### **2. Frontend:**
```bash
cd frontend
npm install
# Editar frontend/services/supabase.ts
npm run dev
```

### **3. Testando:**

1. Abra o Expo no celular/emulador
2. Escaneie o QR Code
3. Teste registro/login
4. Verifique dados no Supabase Dashboard

## 🔧 **Principais Mudanças**

### **Backend:**
- ✅ Supabase substituiu Firebase
- ✅ PostgreSQL substituiu Firestore
- ✅ Autenticação com Supabase Auth
- ✅ Queries SQL diretas
- ✅ Row Level Security (RLS)

### **Frontend:**
- ✅ `@supabase/supabase-js` substituiu Firebase SDK
- ✅ Autenticação simplificada
- ✅ Real-time opcional

### **Banco de Dados:**
- ✅ Tabelas relacionais
- ✅ Constraints e validações
- ✅ Índices para performance
- ✅ Triggers automáticos
- ✅ Políticas de segurança

## 💰 **Custos Supabase vs Firebase**

### **Supabase (Gratuito até):**
- 500MB de banco
- 2GB de largura de banda
- 50MB de armazenamento
- 100.000 usuários ativos mensais

### **Firebase (Gratuito até):**
- 1GB de Firestore
- 10GB de largura de banda
- 1GB de armazenamento
- Autenticação gratuita

**💡 Para projetos médios/grandes, Supabase é significativamente mais barato!**

## 🛡️ **Segurança**

- ✅ **RLS (Row Level Security)**: Cada usuário só acessa seus dados
- ✅ **JWT Tokens**: Autenticação baseada em tokens seguros
- ✅ **HTTPS**: Todas as comunicações criptografadas
- ✅ **Validação**: Validação rigorosa de dados no backend
- ✅ **Rate Limiting**: Proteção contra ataques DDoS

## 📊 **Monitoramento**

Acesse o dashboard do Supabase para:
- Ver logs em tempo real
- Monitorar performance
- Analisar consultas SQL
- Verificar uso de recursos
- Gerenciar usuários

---

**🎉 Migração concluída com sucesso!** 

O projeto agora utiliza Supabase + PostgreSQL, oferecendo melhor performance, menor custo e maior flexibilidade.
