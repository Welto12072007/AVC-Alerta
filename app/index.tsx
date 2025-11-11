import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: Verificar se usuário está logado
  // Por enquanto, sempre redireciona para welcome
  return <Redirect href="/auth/welcome" />;
}