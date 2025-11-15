import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react-native';

export default function InformationScreen() {
  const [expandedSections, setExpandedSections] = useState({
    types: false,
    symptoms: false,
    causes: false,
    treatment: false,
    prevention: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>O que é AVC?</Text>
        </View>
        <Text style={styles.headerText}>
          O Acidente Vascular Cerebral (AVC) ocorre quando há interrupção do fluxo sanguíneo para o cérebro, 
          causando morte das células cerebrais por falta de oxigênio e nutrientes.
        </Text>
      </View>

      <Image
        source={{ uri: 'https://images.pexels.com/photos/8460059/pexels-photo-8460059.jpeg' }}
        style={styles.mainImage}
        resizeMode="cover"
      />

      <View style={styles.statisticsCard}>
        <Text style={styles.statisticsTitle}>AVC em Números - Brasil</Text>
        
        <View style={styles.factItem}>
          <Text style={styles.factBullet}>•</Text>
          <Text style={styles.factText}>
            Uma pessoa morre a cada 6 minutos em decorrência do AVC.
          </Text>
        </View>

        <View style={styles.factItem}>
          <Text style={styles.factBullet}>•</Text>
          <Text style={styles.factText}>
            O AVC é a principal causa de incapacitação física e a segunda maior causa de comprometimento cognitivo.
          </Text>
        </View>

        <View style={styles.factItem}>
          <Text style={styles.factBullet}>•</Text>
          <Text style={styles.factText}>
            O número de internações por AVC aumentou, com mais de 85 mil hospitalizações recentes, e os custos hospitalares se aproximam de R$ 910 milhões.
          </Text>
        </View>

        <View style={styles.factItem}>
          <Text style={styles.factBullet}>•</Text>
          <Text style={styles.factText}>
            Casos de AVC estão crescendo entre adultos jovens, com aumento de 66% em menores de 45 anos na última década.
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection('types')}
        >
          <Text style={styles.sectionTitle}>Tipos de AVC</Text>
          {expandedSections.types ? 
            <ChevronUp color="#3B82F6" size={24} /> : 
            <ChevronDown color="#3B82F6" size={24} />
          }
        </TouchableOpacity>
        
        {expandedSections.types && (
          <View style={styles.sectionContent}>
            <View style={styles.typeContainer}>
              <View style={[styles.typeIcon, { backgroundColor: '#EF4444' }]}>
                <Text style={styles.typeIconText}>H</Text>
              </View>
              <View style={styles.typeInfo}>
                <Text style={styles.typeName}>AVC Hemorrágico</Text>
                <Text style={styles.typeDescription}>
                  Ocorre quando um vaso sanguíneo se rompe, causando sangramento no cérebro. 
                  Representa cerca de 15% dos casos, mas é mais grave e letal.
                </Text>
              </View>
            </View>
            
            <View style={styles.typeContainer}>
              <View style={[styles.typeIcon, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.typeIconText}>I</Text>
              </View>
              <View style={styles.typeInfo}>
                <Text style={styles.typeName}>AVC Isquêmico</Text>
                <Text style={styles.typeDescription}>
                  Ocorre quando há bloqueio no fluxo sanguíneo por um coágulo. 
                  É o tipo mais comum, representando cerca de 85% dos casos.
                </Text>
              </View>
            </View>
            
            <View style={styles.typeContainer}>
              <View style={[styles.typeIcon, { backgroundColor: '#F97316' }]}>
                <Text style={styles.typeIconText}>T</Text>
              </View>
              <View style={styles.typeInfo}>
                <Text style={styles.typeName}>AIT (Ataque Isquêmico Transitório)</Text>
                <Text style={styles.typeDescription}>
                  Conhecido como "mini-AVC", é um bloqueio temporário que não causa danos permanentes, 
                  mas é um sinal de alerta importante para risco futuro de AVC.
                </Text>
              </View>
            </View>
            
            <Image
              source={{ uri: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg' }}
              style={styles.sectionImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection('symptoms')}
        >
          <Text style={styles.sectionTitle}>Sintomas</Text>
          {expandedSections.symptoms ? 
            <ChevronUp color="#3B82F6" size={24} /> : 
            <ChevronDown color="#3B82F6" size={24} />
          }
        </TouchableOpacity>
        
        {expandedSections.symptoms && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              Os sintomas de AVC geralmente aparecem de forma súbita e podem incluir:
            </Text>
            
            <View style={styles.symptomList}>
              <View style={styles.symptomItem}>
                <View style={styles.symptomDot} />
                <Text style={styles.symptomText}>Fraqueza ou dormência na face, braço ou perna, geralmente em um lado do corpo</Text>
              </View>
              <View style={styles.symptomItem}>
                <View style={styles.symptomDot} />
                <Text style={styles.symptomText}>Confusão, dificuldade para falar ou entender</Text>
              </View>
              <View style={styles.symptomItem}>
                <View style={styles.symptomDot} />
                <Text style={styles.symptomText}>Dificuldade para enxergar em um ou ambos os olhos</Text>
              </View>
              <View style={styles.symptomItem}>
                <View style={styles.symptomDot} />
                <Text style={styles.symptomText}>Dificuldade para caminhar, tontura ou perda de equilíbrio</Text>
              </View>
              <View style={styles.symptomItem}>
                <View style={styles.symptomDot} />
                <Text style={styles.symptomText}>Dor de cabeça súbita e intensa sem causa conhecida</Text>
              </View>
            </View>
            
            <Text style={styles.sectionText}>
              Lembre-se do método FAST para identificar rapidamente os principais sintomas:
            </Text>
            
            <View style={styles.fastContainer}>
              <View style={styles.fastItem}>
                <Text style={styles.fastItemLetter}>F</Text>
                <Text style={styles.fastItemText}>Face (Rosto): Está caído de um lado?</Text>
              </View>
              <View style={styles.fastItem}>
                <Text style={styles.fastItemLetter}>A</Text>
                <Text style={styles.fastItemText}>Arms (Braços): Consegue elevar ambos?</Text>
              </View>
              <View style={styles.fastItem}>
                <Text style={styles.fastItemLetter}>S</Text>
                <Text style={styles.fastItemText}>Speech (Fala): Está embolada?</Text>
              </View>
              <View style={styles.fastItem}>
                <Text style={styles.fastItemLetter}>T</Text>
                <Text style={styles.fastItemText}>Time (Tempo): Ligue para emergência!</Text>
              </View>
            </View>
            
            <Link href="/(tabs)/emergency" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Contatos de Emergência</Text>
                <ArrowRight color="#FFFFFF" size={20} />
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection('causes')}
        >
          <Text style={styles.sectionTitle}>Causas e Fatores de Risco</Text>
          {expandedSections.causes ? 
            <ChevronUp color="#3B82F6" size={24} /> : 
            <ChevronDown color="#3B82F6" size={24} />
          }
        </TouchableOpacity>
        
        {expandedSections.causes && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              Diversos fatores podem aumentar o risco de AVC:
            </Text>
            
            <View style={styles.causesList}>
              <View style={styles.causeItem}>
                <Text style={styles.causeTitle}>Não modificáveis</Text>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Idade avançada (risco dobra a cada década após 55 anos)</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Histórico familiar de AVC</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Etnia (afrodescendentes têm maior risco)</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Sexo (homens têm maior incidência, mas mulheres maior letalidade)</Text>
                </View>
              </View>
              
              <View style={styles.causeItem}>
                <Text style={styles.causeTitle}>Modificáveis</Text>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Hipertensão arterial (principal fator de risco)</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Diabetes</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Tabagismo</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Colesterol elevado</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Sedentarismo</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Obesidade</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Consumo excessivo de álcool</Text>
                </View>
                <View style={styles.causeSubItem}>
                  <View style={styles.causeDot} />
                  <Text style={styles.causeText}>Uso de contraceptivos orais (principalmente em mulheres fumantes)</Text>
                </View>
              </View>
            </View>
            
            <Image
              source={{ uri: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg' }}
              style={styles.sectionImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection('treatment')}
        >
          <Text style={styles.sectionTitle}>Tratamento</Text>
          {expandedSections.treatment ? 
            <ChevronUp color="#3B82F6" size={24} /> : 
            <ChevronDown color="#3B82F6" size={24} />
          }
        </TouchableOpacity>
        
        {expandedSections.treatment && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              O tratamento do AVC depende do tipo e da gravidade, mas o fator mais importante é o tempo:
            </Text>
            
            <View style={styles.timelineContainer}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Janela Terapêutica</Text>
                  <Text style={styles.timelineText}>
                    Para o AVC isquêmico, o tratamento com trombolíticos (medicamentos que dissolvem coágulos) 
                    deve ser iniciado nas primeiras 4,5 horas após o início dos sintomas.
                  </Text>
                </View>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Fase Aguda</Text>
                  <Text style={styles.timelineText}>
                    - AVC Isquêmico: trombolíticos, anticoagulantes ou trombectomia mecânica{'\n'}
                    - AVC Hemorrágico: controle da pressão arterial, reversão de anticoagulantes,
                    possível intervenção cirúrgica
                  </Text>
                </View>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Reabilitação</Text>
                  <Text style={styles.timelineText}>
                    Após a fase aguda, inicia-se o processo de reabilitação com uma equipe multidisciplinar,
                    que pode incluir fisioterapia, fonoaudiologia, terapia ocupacional e acompanhamento psicológico.
                  </Text>
                </View>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Prevenção Secundária</Text>
                  <Text style={styles.timelineText}>
                    Após um AVC, é crucial adotar medidas para evitar novos episódios,
                    incluindo controle de fatores de risco e uso de medicamentos conforme prescrição médica.
                  </Text>
                </View>
              </View>
            </View>
            
            <Image
              source={{ uri: 'https://images.pexels.com/photos/8460287/pexels-photo-8460287.jpeg' }}
              style={styles.sectionImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection('prevention')}
        >
          <Text style={styles.sectionTitle}>Prevenção</Text>
          {expandedSections.prevention ? 
            <ChevronUp color="#3B82F6" size={24} /> : 
            <ChevronDown color="#3B82F6" size={24} />
          }
        </TouchableOpacity>
        
        {expandedSections.prevention && (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              A prevenção do AVC está diretamente relacionada ao controle dos fatores de risco modificáveis:
            </Text>
            
            <View style={styles.preventionGrid}>
              <View style={styles.preventionItem}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg' }}
                  style={styles.preventionImage}
                  resizeMode="cover"
                />
                <Text style={styles.preventionTitle}>Controle a Pressão</Text>
                <Text style={styles.preventionText}>
                  Monitore regularmente e mantenha abaixo de 120/80 mmHg
                </Text>
              </View>
              
              <View style={styles.preventionItem}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg' }}
                  style={styles.preventionImage}
                  resizeMode="cover"
                />
                <Text style={styles.preventionTitle}>Alimentação Saudável</Text>
                <Text style={styles.preventionText}>
                  Dieta rica em frutas, vegetais e baixa em sódio e gorduras
                </Text>
              </View>
              
              <View style={styles.preventionItem}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/4662438/pexels-photo-4662438.jpeg' }}
                  style={styles.preventionImage}
                  resizeMode="cover"
                />
                <Text style={styles.preventionTitle}>Atividade Física</Text>
                <Text style={styles.preventionText}>
                  Pelo menos 150 minutos por semana de atividade moderada
                </Text>
              </View>
              
              <View style={styles.preventionItem}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg' }}
                  style={styles.preventionImage}
                  resizeMode="cover"
                />
                <Text style={styles.preventionTitle}>Não Fume</Text>
                <Text style={styles.preventionText}>
                  O tabagismo aumenta em até 6 vezes o risco de AVC
                </Text>
              </View>
            </View>
            
            <Link href="/(tabs)/nutrition" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Ver Guia Nutricional</Text>
                <ArrowRight color="#FFFFFF" size={20} />
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  statisticsCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statisticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statisticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statisticItem: {
    alignItems: 'center',
    width: '48%',
  },
  statisticNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statisticLabel: {
    fontSize: 14,
    color: '#E0E7FF',
    textAlign: 'center',
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  factBullet: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 12,
    marginTop: -2,
  },
  factText: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    flex: 1,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  sectionContent: {
    padding: 16,
  },
  sectionText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  symptomList: {
    marginBottom: 16,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  symptomDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 6,
    marginRight: 12,
  },
  symptomText: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
    lineHeight: 22,
  },
  fastContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  fastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fastItemLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  fastItemText: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  causesList: {
    marginBottom: 16,
  },
  causeItem: {
    marginBottom: 16,
  },
  causeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  causeSubItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  causeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748B',
    marginTop: 6,
    marginRight: 8,
  },
  causeText: {
    fontSize: 15,
    color: '#64748B',
    flex: 1,
    lineHeight: 20,
  },
  timelineContainer: {
    paddingLeft: 8,
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    marginRight: 12,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  timelineText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 20,
  },
  preventionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  preventionItem: {
    width: '48%',
    marginBottom: 16,
  },
  preventionImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  preventionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  preventionText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});