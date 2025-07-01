# AVC Alerta - Frontend

Frontend do aplicativo AVC Alerta, desenvolvido em React Native com Expo.

## 🚀 Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TypeScript](https://www.typescriptlang.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## 📱 Funcionalidades

- Autenticação de usuários (login/registro)
- Identificação rápida de sintomas de AVC
- Monitoramento de sinais vitais (pressão arterial, frequência cardíaca, peso)
- Gerenciamento de contatos de emergência
- Informações sobre tipos de AVC
- Guia nutricional
- Interface responsiva e acessível

## 🛠️ Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)
- Backend da aplicação rodando (veja backend/README.md)

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/avc-alerta.git
cd avc-alerta/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API:
   - Edite o arquivo `src/services/api.ts`
   - Altere `API_BASE_URL` para apontar para seu backend

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse o aplicativo:
   - Web: Abra [http://localhost:8081](http://localhost:8081) no navegador
   - iOS/Android: Escaneie o QR code com o aplicativo Expo Go

## 📁 Estrutura do Projeto

```
frontend/
├── app/                    # Rotas e telas do aplicativo
│   ├── (tabs)/            # Navegação por tabs
│   │   ├── index.tsx      # Tela inicial
│   │   ├── symptom-checker.tsx
│   │   ├── information.tsx
│   │   ├── nutrition.tsx
│   │   ├── emergency.tsx
│   │   └── monitoring.tsx
│   ├── _layout.tsx        # Layout principal
│   └── +not-found.tsx     # Tela 404
├── src/
│   ├── contexts/          # Contextos React (Auth, etc.)
│   ├── services/          # Serviços (API, etc.)
│   └── types/             # Tipos TypeScript
├── hooks/                 # Hooks personalizados
├── assets/                # Recursos estáticos
└── package.json           # Dependências e scripts
```

## 🔐 Autenticação

O aplicativo utiliza Context API para gerenciar o estado de autenticação:

```typescript
import { useAuth } from '@/src/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Usar os dados do usuário e métodos de autenticação
}
```

## 📡 Integração com API

O serviço de API está localizado em `src/services/api.ts` e fornece métodos para:

- Autenticação (login, registro, logout)
- Gerenciamento de perfil
- Monitoramento de saúde
- Contatos de emergência
- Verificação de sintomas

Exemplo de uso:

```typescript
import ApiService from '@/src/services/api';

// Criar uma leitura de pressão arterial
const reading = await ApiService.createHealthReading({
  type: 'blood_pressure',
  systolic: 120,
  diastolic: 80,
  notes: 'Medição matinal'
});
```

## 🎨 Componentes e Telas

### Telas Principais

1. **Home** (`app/(tabs)/index.tsx`) - Tela inicial com acesso rápido
2. **Verificação de Sintomas** (`app/(tabs)/symptom-checker.tsx`) - Teste FAST
3. **Informações** (`app/(tabs)/information.tsx`) - Informações sobre AVC
4. **Nutrição** (`app/(tabs)/nutrition.tsx`) - Guia nutricional
5. **Emergência** (`app/(tabs)/emergency.tsx`) - Contatos de emergência
6. **Monitoramento** (`app/(tabs)/monitoring.tsx`) - Monitoramento de saúde

### Navegação

O aplicativo usa navegação por tabs como estrutura principal, implementada com Expo Router.

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente

Configure as variáveis no arquivo `src/services/api.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Desenvolvimento
  : 'https://sua-api-producao.com/api';  // Produção
```

### Debug

Para debug no dispositivo físico, certifique-se de que:

1. O dispositivo está na mesma rede que o computador
2. O backend está acessível na rede local
3. Use o IP local ao invés de `localhost` se necessário

## 📱 Plataformas Suportadas

- **Web** - Funciona no navegador
- **iOS** - Via Expo Go ou build nativo
- **Android** - Via Expo Go ou build nativo

### Limitações da Web

Algumas funcionalidades podem ter limitações na web:
- Câmera
- Notificações push
- Alguns sensores nativos

## 🚀 Build e Deploy

### Build para Web

```bash
npm run build:web
```

### Build Nativo

Para builds nativos, use o EAS Build:

```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Configurar projeto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 🧪 Testes

Para adicionar testes ao projeto:

```bash
# Instalar dependências de teste
npm install --save-dev jest @testing-library/react-native

# Executar testes
npm test
```

## 📊 Monitoramento e Analytics

Para adicionar analytics:

```bash
# Expo Analytics
expo install expo-analytics-amplitude

# Firebase Analytics
expo install @react-native-firebase/analytics
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico:

- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento
- Consulte a documentação do Expo: https://docs.expo.dev/

## 🔗 Links Úteis

- [Documentação do Expo](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)