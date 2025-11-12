# AVC Alerta 🏥# AVC Alerta 🏥



Aplicativo móvel para prevenção, identificação e monitoramento de AVC (Acidente Vascular Cerebral).Aplicativo móvel para prevenção, identificação e monitoramento de AVC (Acidente Vascular Cerebral).



## 📱 Sobre o Projeto## 📱 Sobre o Projeto



O **AVC Alerta** é um aplicativo desenvolvido com React Native/Expo que auxilia na identificação precoce de sintomas de AVC, fornece informações educacionais sobre prevenção e acompanhamento de pacientes.O **AVC Alerta** é um aplicativo desenvolvido com React Native/Expo que auxilia na identificação precoce de sintomas de AVC, fornece informações educacionais sobre prevenção e acompanhamento de pacientes.



## 🚀 Tecnologias## 🚀 Tecnologias



- [React Native](https://reactnative.dev/) - Framework mobile- [React Native](https://reactnative.dev/) - Framework mobile

- [Expo](https://expo.dev/) - Plataforma de desenvolvimento- [Expo](https://expo.dev/) - Plataforma de desenvolvimento

- [Expo Router](https://docs.expo.dev/router/introduction/) - Navegação baseada em arquivos- [Expo Router](https://docs.expo.dev/router/introduction/) - Navegação baseada em arquivos

- [Supabase](https://supabase.com/) - Backend as a Service (autenticação, banco de dados, storage)- [Supabase](https://supabase.com/) - Backend as a Service (autenticação, banco de dados)

- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática

- [Expo Google Fonts (Poppins)](https://docs.expo.dev/guides/using-custom-fonts/) - Tipografia

## 📱 Funcionalidades

## 📱 Funcionalidades

- ✅ **Autenticação Segura**: Sistema completo de login/registro com Supabase Auth

- ✅ **Autenticação Segura**: Sistema completo de login/registro com Supabase Auth- 🔍 **Verificação de Sintomas**: Método FAST para identificação rápida de AVC

- 🔍 **Verificação de Sintomas**: Método FAST para identificação rápida de AVC- 🚨 **Emergência**: Acesso rápido a contatos de emergência

- 🚨 **Emergência**: Acesso rápido a contatos de emergência- 📊 **Monitoramento de Saúde**: Acompanhamento de sinais vitais

- 📊 **Monitoramento de Saúde**: Acompanhamento de sinais vitais- 🥗 **Nutrição**: Planos alimentares para prevenção

- 🥗 **Nutrição**: Planos alimentares para prevenção- 📚 **Educação**: Conteúdo informativo sobre AVC

- 📚 **Educação**: Conteúdo informativo sobre AVC

## 🚀 Como Executar

## 🏗️ Arquitetura

### Pré-requisitos

O projeto utiliza uma arquitetura **Backend as a Service (BaaS)** com Supabase:

- Node.js 18+ instalado

```- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

┌─────────────────┐- Conta no [Supabase](https://supabase.com/) (gratuita)

│   React Native  │

│   (Expo App)    │### Configuração

└────────┬────────┘

         │1. **Clone o repositório:**

         │ @supabase/supabase-js```bash

         │git clone https://github.com/seu-usuario/avc-alerta.git

         ▼cd avc-alerta

┌─────────────────┐```

│    Supabase     │

│  ┌───────────┐  │2. **Instale as dependências:**

│  │   Auth    │  │```bash

│  ├───────────┤  │npm install

│  │ PostgreSQL│  │```

│  ├───────────┤  │

│  │  Storage  │  │3. **Configure as variáveis de ambiente:**

│  └───────────┘  │

└─────────────────┘Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

``````bash

EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase

**Benefícios:**EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

- ✅ Sem necessidade de servidor Node.js```

- ✅ Builds mais simples e rápidos

- ✅ Sem custos de hospedagem de servidorPara obter essas credenciais:

- ✅ Autenticação gerenciada pelo Supabase- Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com/)

- ✅ Real-time pronto para uso- Vá em **Settings** → **API**

- ✅ Escalabilidade automática- Copie a **URL** e a **anon/public key**



## 🚀 Como Executar4. **Inicie o aplicativo:**

```bash

### Pré-requisitosnpx expo start

```

- Node.js 18+ instalado

- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))5. **Abra no celular:**

- Conta no [Supabase](https://supabase.com/) (gratuita)- Escaneie o QR Code com o app Expo Go

- Ou pressione `a` para Android emulator / `i` para iOS simulator

### Configuração

## � Estrutura do Projeto

1. **Clone o repositório:**

```bash```

git clone https://github.com/Welto12072007/AVC-Alerta.gitAVC-Alerta/

cd AVC-Alerta├── app/                    # Telas e rotas (Expo Router)

```│   ├── (tabs)/            # Abas principais do app

│   ├── auth/              # Telas de autenticação

2. **Instale as dependências:**│   └── _layout.tsx        # Layout raiz

```bash├── config/                # Configurações

npm install│   └── supabase.ts        # Cliente Supabase

```├── services/              # Serviços e APIs

│   └── supabaseAuth.ts    # Serviço de autenticação

3. **Configure as variáveis de ambiente:**├── hooks/                 # Custom React hooks

├── assets/                # Imagens e recursos

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:└── backend/               # [DEPRECATED] Backend Node.js (não mais usado)

```env```

EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase

EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase## �️ Banco de Dados

```

O projeto usa **Supabase** (PostgreSQL) como backend. Principais tabelas:

Para obter essas credenciais:

- Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com/)- `users` - Perfis de usuários

- Vá em **Settings** → **API**- `health_readings` - Leituras de sinais vitais

- Copie a **URL** e a **anon/public key**- `symptom_checks` - Histórico de verificações de sintomas

- `emergency_contacts` - Contatos de emergência

4. **Configure o banco de dados no Supabase:**

### Criação das Tabelas

Execute no **SQL Editor** do Supabase:

Execute no **SQL Editor** do Supabase:

```sql

-- Users table (extends Supabase auth.users)```sql

create table users (-- Users table (extends Supabase auth.users)

  id uuid references auth.users primary key,create table users (

  email text unique not null,  id uuid references auth.users primary key,

  full_name text,  email text unique not null,

  created_at timestamp with time zone default now()  full_name text,

);  created_at timestamp with time zone default now()

);

-- Enable RLS

alter table users enable row level security;-- Enable RLS

alter table users enable row level security;

-- Policies

create policy "Users can view own profile"-- Policies

  on users for selectcreate policy "Users can view own profile"

  using (auth.uid() = id);  on users for select

  using (auth.uid() = id);

create policy "Users can update own profile"

  on users for updatecreate policy "Users can update own profile"

  using (auth.uid() = id);  on users for update

  using (auth.uid() = id);

-- Add user on signup```

create function public.handle_new_user()

returns trigger as $$## 🔐 Autenticação

begin

  insert into public.users (id, email, full_name)O sistema usa **Supabase Auth** com os seguintes recursos:

  values (new.id, new.email, new.raw_user_meta_data->>'full_name');

  return new;- Registro de novos usuários

end;- Login com email/senha

$$ language plpgsql security definer;- Validação de senha forte (8+ chars, maiúscula, minúscula, número, especial)

- Persistência de sessão com AsyncStorage

create trigger on_auth_user_created- Recuperação de senha

  after insert on auth.users

  for each row execute procedure public.handle_new_user();## 📱 Estrutura de Navegação

```

- React Native + Expo

5. **Inicie o aplicativo:**

```bash- TypeScript- 📊 **Monitoramento de Saúde**: Registro de pressão arterial, glicose, peso, etc- Informações sobre tipos de AVC

npx expo start

```- Node.js + Express



6. **Abra no celular:**- Supabase (PostgreSQL)- 🥗 **Plano Nutricional**: Orientações alimentares para prevenção- Guia nutricional

- Escaneie o QR Code com o app Expo Go

- Ou pressione `a` para Android emulator / `i` para iOS simulator

- 📚 **Conteúdo Educacional**: Informações sobre prevenção, tratamento e recuperação- Monitoramento de sinais vitais

## 📁 Estrutura do Projeto

- 🔔 **Notificações**: Lembretes de medicação e consultas- Contatos de emergência

```

AVC-Alerta/

├── app/                    # Telas e rotas (Expo Router)

│   ├── (tabs)/            # Abas principais do app## 🏗️ Arquitetura## 🛠️ Pré-requisitos

│   │   ├── index.tsx      # Dashboard

│   │   ├── emergency.tsx  # Emergência

│   │   ├── monitoring.tsx # Monitoramento

│   │   ├── nutrition.tsx  # NutriçãoO projeto está organizado em duas partes principais:- [Node.js](https://nodejs.org/) (versão 18 ou superior)

│   │   ├── symptom-checker.tsx  # Verificador de sintomas

│   │   └── information.tsx # Informações- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

│   ├── auth/              # Telas de autenticação

│   │   ├── welcome.tsx    # Tela inicial### Frontend (React Native + Expo)- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)

│   │   ├── login.tsx      # Login

│   │   └── register.tsx   # Registro- Framework: Expo SDK 54

│   └── _layout.tsx        # Layout raiz

├── config/                # Configurações- Navegação: Expo Router## ⚙️ Instalação

│   └── supabase.ts        # Cliente Supabase

├── services/              # Serviços e APIs- Estado: Context API

│   └── supabaseAuth.ts    # Serviço de autenticação

├── hooks/                 # Custom React hooks- UI: React Native Components1. Clone o repositório:

│   ├── useSystemUI.ts     # Hook para StatusBar/NavigationBar

│   └── useFrameworkReady.ts```bash

├── assets/                # Imagens e recursos

│   └── images/### Backend (Node.js + Express)git clone https://github.com/seu-usuario/avc-alerta.git

├── .env                   # Variáveis de ambiente (não commitar)

├── .env.example           # Exemplo de variáveis- Runtime: Node.jscd avc-alerta

├── app.json               # Configuração do Expo

├── package.json           # Dependências- Framework: Express.js```

└── tsconfig.json          # Configuração TypeScript

```- Banco de Dados: Supabase (PostgreSQL)



## 🔐 Autenticação- Autenticação: JWT + Bcrypt2. Instale as dependências:



O sistema usa **Supabase Auth** diretamente (sem backend customizado):- Validação: Express Validator```bash



**Recursos:**npm install

- ✅ Registro de novos usuários

- ✅ Login com email/senha## 📂 Estrutura de Diretórios```

- ✅ Validação de senha forte:

  - Mínimo 8 caracteres

  - Pelo menos uma letra maiúscula

  - Pelo menos uma letra minúscula```3. Inicie o servidor de desenvolvimento:

  - Pelo menos um número

  - Pelo menos um caractere especial (!@#$%^&*)AVC-Alerta/```bash

- ✅ Persistência de sessão com AsyncStorage

- ✅ Recuperação de senha├── app/                    # Frontend (Expo/React Native)npx expo start

- ✅ Logout seguro

│   ├── (tabs)/            # Telas com navegação por tabs```

**Exemplo de uso:**

│   ├── (auth)/            # Telas de autenticação

```typescript

import { supabaseAuthService } from '@/services/supabaseAuth';│   └── _layout.tsx        # Layout principal4. Acesse o aplicativo:



// Registrar├── backend/               # Backend (Node.js/Express)   - Web: Abra [http://localhost:8081](http://localhost:8081) no navegador

const result = await supabaseAuthService.register({

  email: 'usuario@email.com',│   ├── database/          # Schema SQL e migrações   - iOS/Android: Escaneie o QR code com o aplicativo Expo Go

  password: 'SenhaForte123!',

  fullName: 'Nome do Usuário'│   ├── src/

});

│   │   ├── config/        # Configurações## 📱 Estrutura do Projeto

// Login

const result = await supabaseAuthService.login('usuario@email.com', 'SenhaForte123!');│   │   ├── controllers/   # Controladores



// Verificar usuário logado│   │   ├── middleware/    # Middlewares```

const user = await supabaseAuthService.getCurrentUser();

│   │   ├── models/        # Modelos de dadosavc-alerta/

// Logout

await supabaseAuthService.logout();│   │   ├── routes/        # Rotas da API├── app/                    # Rotas e telas do aplicativo

```

│   │   ├── services/      # Lógica de negócio│   ├── (tabs)/            # Navegação por tabs

## 🗄️ Banco de Dados

│   │   ├── utils/         # Utilitários│   └── _layout.tsx        # Layout principal

O projeto usa **Supabase** (PostgreSQL) como banco de dados.

│   │   └── server.ts      # Servidor principal├── assets/                # Recursos estáticos

### Tabelas Principais

├── components/            # Componentes reutilizáveis├── components/            # Componentes reutilizáveis

- `auth.users` - Usuários do Supabase Auth (gerenciado automaticamente)

- `users` - Perfis de usuários (estende auth.users)├── services/              # Serviços (API, Supabase)└── hooks/                 # Hooks personalizados

- `health_readings` - Leituras de sinais vitais

- `symptom_checks` - Histórico de verificações de sintomas├── hooks/                 # Custom hooks React```

- `emergency_contacts` - Contatos de emergência

- `nutrition_plans` - Planos nutricionais├── types/                 # TypeScript types

- `educational_content` - Conteúdo educacional

└── constants/             # Constantes do app## 🤝 Contribuindo

### Row Level Security (RLS)



Todas as tabelas usam RLS para garantir que:

- Usuários só podem ver/editar seus próprios dados```1. Faça um fork do projeto

- Dados sensíveis estão protegidos

- Não há necessidade de middleware de autorização2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)



## 🎨 Design## 🚀 Como Executar3. Faça commit das mudanças (`git commit -m 'Adiciona nova feature'`)



- **Tipografia**: Poppins (todos os textos exceto logo)4. Faça push para a branch (`git push origin feature/nova-feature`)

- **Cores**: Gradientes de vermelho/rosa para tema de saúde

- **UI/UX**: ### Pré-requisitos5. Abra um Pull Request

  - StatusBar oculta globalmente

  - NavigationBar oculta (Android)

  - Safe areas respeitadas

  - Toggle de visibilidade de senha com ícone de olho- Node.js 18+## 📄 Licença



## 📦 Dependências Principais- npm ou yarn



```json- Conta no Supabase (para banco de dados)Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

{

  "@supabase/supabase-js": "^2.39.0",- Expo Go (para testar no celular)

  "@react-native-async-storage/async-storage": "^2.1.0",

  "expo": "~54.0.0",## 👥 Autores

  "expo-router": "~6.0.0",

  "react-native": "0.81.5",### Instalação

  "@expo-google-fonts/poppins": "^0.2.3"

}- Seu Nome - [GitHub](https://github.com/seu-usuario)

```

1. **Clone o repositório**

## 🚧 Migração de Arquitetura

```bash## 📞 Contatos de Emergência

**Antes (com backend Node.js):**

```git clone https://github.com/Welto12072007/AVC-Alerta.git

Frontend → Node.js API → Supabase

```cd AVC-Alerta- SAMU: 192



**Depois (BaaS direto):**```- Bombeiros: 193

```

Frontend → Supabase- Polícia: 190

```2. **Instale as dependências do Frontend**

```bash

**Arquivos deprecados:**npm install

- `backend/` - Todo o código do servidor Node.js (não mais necessário)```

- `services/auth.ts` - Substituído por `services/supabaseAuth.ts`

- `services/api.ts` - Configuração de API REST (não mais necessário)3. **Instale as dependências do Backend**

```bash

## 🤝 Contribuindocd backend

npm install

1. Fork o projetocd ..

2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)```

3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)

4. Push para a branch (`git push origin feature/nova-feature`)4. **Configure as variáveis de ambiente**

5. Abra um Pull Request

Crie um arquivo `.env` na pasta `backend`:

## 👥 Autor```env

PORT=3000

- **Wellington** - [GitHub](https://github.com/Welto12072007)NODE_ENV=development



## 📄 Licença# Supabase

SUPABASE_URL=sua_url_do_supabase

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC).SUPABASE_ANON_KEY=sua_chave_anonima

SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

## 📞 Contatos de Emergência

# JWT

- **SAMU**: 192JWT_SECRET=seu_jwt_secret_aqui

- **Bombeiros**: 193JWT_EXPIRES_IN=24h

- **Polícia**: 190REFRESH_TOKEN_EXPIRES_IN=7d



---# Frontend URL (CORS)

FRONTEND_URL=http://localhost:8081

**Desenvolvido com ❤️ para ajudar na prevenção e identificação precoce de AVC**```


5. **Configure o banco de dados**

Acesse o Supabase SQL Editor e execute o script:
```bash
backend/database/schema.sql
```

### Executando o Projeto

**Terminal 1 - Frontend (Expo):**
```bash
npm run dev
# ou
npx expo start
```

**Terminal 2 - Backend (API):**
```bash
cd backend
npm run dev
```

O frontend estará disponível em:
- 📱 Expo Go: Escaneie o QR Code
- 🌐 Web: http://localhost:8081
- 📱 Android: Pressione `a`
- 🍎 iOS: Pressione `i`

O backend estará rodando em: http://localhost:3000

## 🗄️ Banco de Dados

O projeto utiliza Supabase (PostgreSQL) com as seguintes tabelas principais:

- `users` - Usuários do sistema
- `user_profiles` - Perfis detalhados
- `health_monitoring` - Monitoramento de saúde
- `symptom_checks` - Verificações de sintomas
- `emergency_calls` - Chamadas de emergência
- `nutrition_plans` - Planos nutricionais
- `meal_logs` - Registro de refeições
- `educational_content` - Conteúdo educacional
- `notifications` - Notificações do sistema

Para mais detalhes, veja: `backend/database/schema.sql`

## 🔐 Autenticação

O sistema implementa autenticação completa com:

- ✅ Registro de usuários
- ✅ Login com email/senha
- ✅ Hash de senhas com Bcrypt (12 rounds)
- ✅ Tokens JWT (Access + Refresh)
- ✅ Verificação de email
- ✅ Recuperação de senha
- ✅ Proteção de rotas

## 🧪 Tecnologias Utilizadas

### Frontend
- React Native 0.79
- Expo SDK 54
- Expo Router 6
- TypeScript
- React Navigation
- Lucide React Native (ícones)
- @supabase/supabase-js

### Backend
- Node.js
- Express.js
- TypeScript
- Supabase
- Bcrypt (hash de senhas)
- JWT (autenticação)
- Express Validator
- Helmet (segurança)
- CORS

## 📖 Documentação Adicional

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada do projeto
- [backend/database/schema.sql](./backend/database/schema.sql) - Schema completo do banco

## 👥 Autor

- **Wellington** - [GitHub](https://github.com/Welto12072007)

## 📄 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC).

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através das issues do GitHub.

---

**Desenvolvido com ❤️ para ajudar na prevenção e identificação precoce de AVC**
