import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { TriangleAlert as AlertTriangle, Heart, Utensils, Activity, Clock, Info, PhoneCall } from 'lucide-react-native';

export default function HomeScreen() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <ScrollView style={styles.container}>
      {showWelcome && (
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Bem-vindo ao AVC Alerta</Text>
          <Text style={styles.welcomeText}>
            Este aplicativo ajuda na identificação rápida dos sintomas de AVC e fornece informações importantes para prevenção e recuperação.
          </Text>
          <TouchableOpacity 
            style={styles.welcomeButton} 
            onPress={() => setShowWelcome(false)}
          >
            <Text style={styles.welcomeButtonText}>Entendi</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.emergencyCard}>
        <AlertTriangle color="#FFFFFF" size={24} />
        <Text style={styles.emergencyText}>
          Suspeita de AVC? Ligue imediatamente para o SAMU: 192
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>
      
      <View style={styles.quickAccessGrid}>
        <Link href="/(tabs)/symptom-checker" asChild>
          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#EF4444' }]}>
              <Heart color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickAccessText}>Verificar Sintomas</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/(tabs)/nutrition" asChild>
          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
              <Utensils color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickAccessText}>Guia Nutricional</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/(tabs)/information" asChild>
          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#3B82F6' }]}>
              <Info color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickAccessText}>Sobre AVC</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/(tabs)/emergency" asChild>
          <TouchableOpacity style={styles.quickAccessItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#F97316' }]}>
              <PhoneCall color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.quickAccessText}>Emergência</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Text style={styles.sectionTitle}>Você Sabia?</Text>
      <View style={styles.factCard}>
        <Activity color="#3B82F6" size={24} />
        <Text style={styles.factText}>
          O AVC é a segunda principal causa de morte no Brasil, com mais de 90 mil óbitos por ano.
        </Text>
      </View>

      <View style={styles.factCard}>
        <Clock color="#3B82F6" size={24} />
        <Text style={styles.factText}>
          O tempo é crucial! Cada minuto durante um AVC, cerca de 1,9 milhão de neurônios são perdidos.
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg' }}
          style={styles.infoImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <Text style={styles.imageTitle}>Prevenção é o melhor caminho</Text>
          <Text style={styles.imageText}>
            Manter hábitos saudáveis e conhecer os fatores de risco pode diminuir significativamente as chances de um AVC.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  welcomeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
  },
  welcomeButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 16,
  },
  emergencyCard: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 16,
    marginTop: 8,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAccessItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickAccessText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  factCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  factText: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 12,
    flex: 1,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    height: 200,
  },
  infoImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  imageText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});