# AVC Alerta# AVC Alerta 🏥# AVC Alerta



Aplicativo para prevenção e identificação de sintomas de AVC.



## 🚀 Como ExecutarSistema completo para prevenção, identificação e monitoramento de AVC (Acidente Vascular Cerebral).Aplicativo móvel para auxiliar na identificação dos primeiros sintomas de AVC (Acidente Vascular Cerebral) e fornecer informações essenciais para a recuperação do paciente.



### Frontend (Expo)

```bash

npx expo start## 📱 Sobre o Projeto## 🚀 Tecnologias

```

Escaneie o QR Code com Expo Go para visualizar no celular.



### Backend (API - Opcional)O **AVC Alerta** é um aplicativo móvel desenvolvido com React Native/Expo que visa auxiliar na identificação precoce de sintomas de AVC, fornecer informações educacionais sobre prevenção e acompanhamento de pacientes.- [React Native](https://reactnative.dev/)

```bash

cd backend- [Expo](https://expo.dev/)

npm run dev

```### Funcionalidades Principais- [Expo Router](https://docs.expo.dev/router/introduction/)



## 📱 Estrutura

- `app/` - Telas do aplicativo (React Native/Expo)

- `backend/` - API REST (Node.js/Express)- ✅ **Autenticação Segura**: Sistema completo de login/registro com criptografia## 📱 Funcionalidades

- `services/` - Serviços e configurações

- `hooks/` - Custom React hooks- 🔍 **Verificação de Sintomas**: Método FAST para identificação rápida de AVC



## 🔧 Tecnologias- 🚨 **Emergência**: Acesso rápido a contatos de emergência e localização- Identificação rápida de sintomas de AVC

- React Native + Expo

- TypeScript- 📊 **Monitoramento de Saúde**: Registro de pressão arterial, glicose, peso, etc- Informações sobre tipos de AVC

- Node.js + Express

- Supabase (PostgreSQL)- 🥗 **Plano Nutricional**: Orientações alimentares para prevenção- Guia nutricional


- 📚 **Conteúdo Educacional**: Informações sobre prevenção, tratamento e recuperação- Monitoramento de sinais vitais

- 🔔 **Notificações**: Lembretes de medicação e consultas- Contatos de emergência



## 🏗️ Arquitetura## 🛠️ Pré-requisitos



O projeto está organizado em duas partes principais:- [Node.js](https://nodejs.org/) (versão 18 ou superior)

- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Frontend (React Native + Expo)- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)

- Framework: Expo SDK 54

- Navegação: Expo Router## ⚙️ Instalação

- Estado: Context API

- UI: React Native Components1. Clone o repositório:

```bash

### Backend (Node.js + Express)git clone https://github.com/seu-usuario/avc-alerta.git

- Runtime: Node.jscd avc-alerta

- Framework: Express.js```

- Banco de Dados: Supabase (PostgreSQL)

- Autenticação: JWT + Bcrypt2. Instale as dependências:

- Validação: Express Validator```bash

npm install

## 📂 Estrutura de Diretórios```



```3. Inicie o servidor de desenvolvimento:

AVC-Alerta/```bash

├── app/                    # Frontend (Expo/React Native)npx expo start

│   ├── (tabs)/            # Telas com navegação por tabs```

│   ├── (auth)/            # Telas de autenticação

│   └── _layout.tsx        # Layout principal4. Acesse o aplicativo:

├── backend/               # Backend (Node.js/Express)   - Web: Abra [http://localhost:8081](http://localhost:8081) no navegador

│   ├── database/          # Schema SQL e migrações   - iOS/Android: Escaneie o QR code com o aplicativo Expo Go

│   ├── src/

│   │   ├── config/        # Configurações## 📱 Estrutura do Projeto

│   │   ├── controllers/   # Controladores

│   │   ├── middleware/    # Middlewares```

│   │   ├── models/        # Modelos de dadosavc-alerta/

│   │   ├── routes/        # Rotas da API├── app/                    # Rotas e telas do aplicativo

│   │   ├── services/      # Lógica de negócio│   ├── (tabs)/            # Navegação por tabs

│   │   ├── utils/         # Utilitários│   └── _layout.tsx        # Layout principal

│   │   └── server.ts      # Servidor principal├── assets/                # Recursos estáticos

├── components/            # Componentes reutilizáveis├── components/            # Componentes reutilizáveis

├── services/              # Serviços (API, Supabase)└── hooks/                 # Hooks personalizados

├── hooks/                 # Custom hooks React```

├── types/                 # TypeScript types

└── constants/             # Constantes do app## 🤝 Contribuindo



```1. Faça um fork do projeto

2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)

## 🚀 Como Executar3. Faça commit das mudanças (`git commit -m 'Adiciona nova feature'`)

4. Faça push para a branch (`git push origin feature/nova-feature`)

### Pré-requisitos5. Abra um Pull Request



- Node.js 18+## 📄 Licença

- npm ou yarn

- Conta no Supabase (para banco de dados)Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

- Expo Go (para testar no celular)

## 👥 Autores

### Instalação

- Seu Nome - [GitHub](https://github.com/seu-usuario)

1. **Clone o repositório**

```bash## 📞 Contatos de Emergência

git clone https://github.com/Welto12072007/AVC-Alerta.git

cd AVC-Alerta- SAMU: 192

```- Bombeiros: 193

- Polícia: 190
2. **Instale as dependências do Frontend**
```bash
npm install
```

3. **Instale as dependências do Backend**
```bash
cd backend
npm install
cd ..
```

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na pasta `backend`:
```env
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# JWT
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:8081
```

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
