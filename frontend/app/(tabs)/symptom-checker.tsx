import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle as XCircle, PhoneCall } from 'lucide-react-native';

export default function SymptomCheckerScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState({
    face: null,
    arms: null,
    speech: null,
  });

  const steps = [
    {
      id: 'intro',
      title: 'Teste FAST para Identificar AVC',
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            O método FAST é uma forma rápida de identificar os principais sintomas de um AVC:
          </Text>
          <View style={styles.fastExplanation}>
            <Text style={styles.fastLetter}>F</Text>
            <Text style={styles.fastText}>Face (Rosto): Verifique se há queda facial</Text>
          </View>
          <View style={styles.fastExplanation}>
            <Text style={styles.fastLetter}>A</Text>
            <Text style={styles.fastText}>Arms (Braços): Verifique fraqueza nos braços</Text>
          </View>
          <View style={styles.fastExplanation}>
            <Text style={styles.fastLetter}>S</Text>
            <Text style={styles.fastText}>Speech (Fala): Verifique dificuldade na fala</Text>
          </View>
          <View style={styles.fastExplanation}>
            <Text style={styles.fastLetter}>T</Text>
            <Text style={styles.fastText}>Time (Tempo): Ligue imediatamente para emergência</Text>
          </View>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/8460280/pexels-photo-8460280.jpeg' }}
            style={styles.stepImage}
            resizeMode="cover"
          />
        </View>
      ),
      actions: (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setCurrentStep(1)}
        >
          <Text style={styles.primaryButtonText}>Iniciar Verificação</Text>
        </TouchableOpacity>
      ),
    },
    {
      id: 'face',
      title: 'Verificação Facial',
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            Peça para a pessoa sorrir. O sorriso está uniforme ou um lado do rosto está caído?
          </Text>
          <View style={styles.imagesContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg' }}
                style={styles.comparisonImage}
                resizeMode="cover"
              />
              <Text style={styles.imageCaption}>Normal: Sorriso simétrico</Text>
            </View>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg' }}
                style={styles.comparisonImage}
                resizeMode="cover"
              />
              <Text style={styles.imageCaption}>Possível AVC: Sorriso assimétrico</Text>
            </View>
          </View>
        </View>
      ),
      actions: (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: '#EF4444' }]}
            onPress={() => {
              setResults({ ...results, face: true });
              setCurrentStep(2);
            }}
          >
            <Text style={styles.optionButtonText}>Sorriso Assimétrico</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: '#10B981' }]}
            onPress={() => {
              setResults({ ...results, face: false });
              setCurrentStep(2);
            }} 
          >
            <Text style={styles.optionButtonText}>Sorriso Normal</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      id: 'arms',
      title: 'Verificação dos Braços',
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            Peça para a pessoa levantar os dois braços. Um braço cai ou não consegue ser levantado?
          </Text>
          <View style={styles.imagesContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/6551144/pexels-photo-6551144.jpeg' }}
                style={styles.comparisonImage}
                resizeMode="cover"
              />
              <Text style={styles.imageCaption}>Normal: Ambos os braços se mantêm elevados</Text>
            </View>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg' }}
                style={styles.comparisonImage}
                resizeMode="cover"
              />
              <Text style={styles.imageCaption}>Possível AVC: Um braço cai</Text>
            </View>
          </View>
        </View>
      ),
      actions: (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: '#EF4444' }]}
            onPress={() => {
              setResults({ ...results, arms: true });
              setCurrentStep(3);
            }}
          >
            <Text style={styles.optionButtonText}>Um Braço Cai</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: '#10B981' }]}
            onPress={() => {
              setResults({ ...results, arms: false });
              setCurrentStep(3);
            }}
          >
            <Text style={styles.optionButtonText}>Braços Normais</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      id: 'speech',
      title: 'Verificação da Fala',
      content: (
        <View style={styles.stepContent}>
          <Text style={styles.stepDescription}>
            Peça para a pessoa repetir uma frase simples. A fala está arrastada ou incompreensível?
          </Text>
          <View style={styles.speechExample}>
            <Text style={styles.speechExampleTitle}>Peça para repetir:</Text>
            <Text style={styles.speechExampleText}>"O céu está muito azul hoje"</Text>
          </View>
          <View style={styles.imagesContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg' }}
                style={styles.comparisonImage}
                resizeMode="cover"
              />
              <Text style={styles.imageCaption}>Normal: Fala clara e compreensível</Text>
            </View>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg' }}
                style={styles.comparisonImage}
                resizeMode="cover"
              />
              <Text style={styles.imageCaption}>Possível AVC: Fala arrastada ou incompreensível</Text>
            </View>
          </View>
        </View>
      ),
      actions: (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: '#EF4444' }]}
            onPress={() => {
              setResults({ ...results, speech: true });
              setCurrentStep(4);
            }}
          >
            <Text style={styles.optionButtonText}>Fala Comprometida</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, { backgroundColor: '#10B981' }]}
            onPress={() => {
              setResults({ ...results, speech: false });
              setCurrentStep(4);
            }}
          >
            <Text style={styles.optionButtonText}>Fala Normal</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      id: 'result',
      title: 'Resultado',
      content: () => {
        const hasSymptoms = results.face || results.arms || results.speech;
        
        return (
          <View style={styles.resultContainer}>
            {hasSymptoms ? (
              <>
                <AlertCircle size={64} color="#EF4444" style={styles.resultIcon} />
                <Text style={[styles.resultTitle, { color: '#EF4444' }]}>
                  Possíveis sinais de AVC detectados!
                </Text>
                <Text style={styles.resultDescription}>
                  Ligue imediatamente para o SAMU (192) ou dirija-se ao hospital mais próximo.
                  Tempo é cérebro - cada minuto conta!
                </Text>
                <TouchableOpacity
                  style={styles.emergencyButton}
                  onPress={() => {/* Implement emergency call */}}
                >
                  <PhoneCall size={20} color="#FFFFFF" />
                  <Text style={styles.emergencyButtonText}>Ligar para 192</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <CheckCircle size={64} color="#10B981" style={styles.resultIcon} />
                <Text style={[styles.resultTitle, { color: '#10B981' }]}>
                  Nenhum sinal de AVC detectado
                </Text>
                <Text style={styles.resultDescription}>
                  Não foram identificados sinais claros de AVC nesta verificação.
                  No entanto, se você ainda estiver preocupado ou notar outros sintomas,
                  consulte um médico.
                </Text>
              </>
            )}
            
            <View style={styles.resultDetails}>
              <Text style={styles.resultDetailsTitle}>Detalhes da verificação:</Text>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLabel}>Facial:</Text>
                {results.face === null ? (
                  <Text style={styles.resultItemValue}>Não verificado</Text>
                ) : results.face ? (
                  <View style={styles.resultItemValueContainer}>
                    <XCircle size={18} color="#EF4444" />
                    <Text style={[styles.resultItemValue, { color: '#EF4444' }]}>Sorriso assimétrico</Text>
                  </View>
                ) : (
                  <View style={styles.resultItemValueContainer}>
                    <CheckCircle size={18} color="#10B981" />
                    <Text style={[styles.resultItemValue, { color: '#10B981' }]}>Normal</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLabel}>Braços:</Text>
                {results.arms === null ? (
                  <Text style={styles.resultItemValue}>Não verificado</Text>
                ) : results.arms ? (
                  <View style={styles.resultItemValueContainer}>
                    <XCircle size={18} color="#EF4444" />
                    <Text style={[styles.resultItemValue, { color: '#EF4444' }]}>Um braço cai</Text>
                  </View>
                ) : (
                  <View style={styles.resultItemValueContainer}>
                    <CheckCircle size={18} color="#10B981" />
                    <Text style={[styles.resultItemValue, { color: '#10B981' }]}>Normal</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLabel}>Fala:</Text>
                {results.speech === null ? (
                  <Text style={styles.resultItemValue}>Não verificado</Text>
                ) : results.speech ? (
                  <View style={styles.resultItemValueContainer}>
                    <XCircle size={18} color="#EF4444" />
                    <Text style={[styles.resultItemValue, { color: '#EF4444' }]}>Comprometida</Text>
                  </View>
                ) : (
                  <View style={styles.resultItemValueContainer}>
                    <CheckCircle size={18} color="#10B981" />
                    <Text style={[styles.resultItemValue, { color: '#10B981' }]}>Normal</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        );
      },
      actions: (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setCurrentStep(0);
              setResults({ face: null, arms: null, speech: null });
            }}
          >
            <Text style={styles.secondaryButtonText}>Iniciar Novo Teste</Text>
          </TouchableOpacity>
          <Link href="/(tabs)/information" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Mais Informações</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{currentStepData.title}</Text>
        
        {typeof currentStepData.content === 'function' 
          ? currentStepData.content() 
          : currentStepData.content}
        
        <View style={styles.actions}>
          {currentStepData.actions}
        </View>
        
        {currentStep > 0 && currentStep < 4 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepContent: {
    marginBottom: 24,
  },
  stepDescription: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 16,
    lineHeight: 24,
  },
  fastExplanation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fastLetter: {
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
  fastText: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
  },
  stepImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  imageWrapper: {
    width: '48%',
  },
  comparisonImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageCaption: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  speechExample: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  speechExampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  speechExampleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  actions: {
    marginTop: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 16,
  },
  optionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  optionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 16,
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultIcon: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  resultDetails: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 16,
  },
  resultDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultItemLabel: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  resultItemValue: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  resultItemValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});