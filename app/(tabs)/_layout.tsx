import { Tabs } from 'expo-router';
import { Heart, Chrome as Home, Info, Utensils, PhoneCall, BarChart3} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'AVC Alerta',
        }}
      />
      <Tabs.Screen
        name="symptom-checker"
        options={{
          title: 'Sintomas',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
          headerTitle: 'Identificar Sintomas',
        }}
      />
      <Tabs.Screen
        name="information"
        options={{
          title: 'Informações',
          tabBarIcon: ({ color, size }) => <Info size={size} color={color} />,
          headerTitle: 'Sobre AVC',
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrição',
          tabBarIcon: ({ color, size }) => <Utensils size={size} color={color} />,
          headerTitle: 'Guia Nutricional',
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: 'Emergência',
          tabBarIcon: ({ color, size }) => <PhoneCall size={size} color={color} />,
          headerTitle: 'Contatos de Emergência',
          tabBarActiveTintColor: '#EF4444',
        }}
      />
      <Tabs.Screen
        name="monitoring"
        options={{
          title: 'Monitoramento',
          tabBarIcon: ({color, size}) => <BarChart3 size={size} color={color}/>,
          headerTitle: 'Monitoramento',
          tabBarActiveTintColor: '#EF4444',
        }}
      />
    
    </Tabs>
  );
}