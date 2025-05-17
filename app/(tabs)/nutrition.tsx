import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Search, Filter, X } from 'lucide-react-native';

export default function NutritionScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'recommended', label: 'Recomendados' },
    { id: 'avoid', label: 'Evitar' },
    { id: 'moderately', label: 'Moderação' },
  ];

  const foods = [
    {
      id: 1,
      name: 'Peixes Ricos em Ômega-3',
      category: 'recommended',
      image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg',
      description: 'Salmão, sardinha, atum e outros peixes são ricos em ácidos graxos ômega-3, que ajudam a reduzir inflamação e prevenir coágulos.',
      benefits: [
        'Reduz inflamação',
        'Diminui pressão arterial',
        'Previne coágulos sanguíneos'
      ]
    },
    {
      id: 2,
      name: 'Frutas e Vegetais Coloridos',
      category: 'recommended',
      image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
      description: 'Frutas e vegetais são ricos em antioxidantes, vitaminas e minerais que protegem os vasos sanguíneos.',
      benefits: [
        'Ricos em antioxidantes',
        'Baixos em calorias',
        'Ricos em fibras',
        'Contêm potássio (regulador da pressão)'
      ]
    },
    {
      id: 3,
      name: 'Grãos Integrais',
      category: 'recommended',
      image: 'https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg',
      description: 'Alimentos como aveia, arroz integral e pão integral são ricos em fibras e ajudam a controlar o colesterol e a pressão arterial.',
      benefits: [
        'Ricos em fibras',
        'Ajudam a controlar o colesterol',
        'Estabilizam os níveis de açúcar no sangue'
      ]
    },
    {
      id: 4,
      name: 'Nozes e Sementes',
      category: 'recommended',
      image: 'https://images.pexels.com/photos/1067665/pexels-photo-1067665.jpeg',
      description: 'Nozes, castanhas, amêndoas e sementes contêm ácidos graxos saudáveis, proteínas e fibras que protegem o coração.',
      benefits: [
        'Gorduras saudáveis',
        'Proteínas vegetais',
        'Vitamina E e antioxidantes'
      ]
    },
    {
      id: 5,
      name: 'Azeite de Oliva Extra Virgem',
      category: 'recommended',
      image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg',
      description: 'Rico em ácidos graxos monoinsaturados e polifenóis, o azeite ajuda a reduzir o colesterol ruim (LDL) e a inflamação.',
      benefits: [
        'Reduz o colesterol LDL',
        'Anti-inflamatório',
        'Rico em antioxidantes'
      ]
    },
    {
      id: 6,
      name: 'Alimentos Ricos em Sal',
      category: 'avoid',
      image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg',
      description: 'Alimentos industrializados, embutidos, conservas e fast food geralmente contêm altos níveis de sódio, que aumenta a pressão arterial.',
      reasons: [
        'Aumentam a pressão arterial',
        'Causam retenção de líquidos',
        'Sobrecarregam os rins'
      ]
    },
    {
      id: 7,
      name: 'Gorduras Trans e Saturadas',
      category: 'avoid',
      image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg',
      description: 'Alimentos fritos, fast food, biscoitos recheados e alimentos ultraprocessados contêm gorduras prejudiciais que aumentam o colesterol ruim.',
      reasons: [
        'Aumentam o colesterol LDL',
        'Promovem inflamação',
        'Danificam os vasos sanguíneos'
      ]
    },
    {
      id: 8,
      name: 'Açúcares Refinados',
      category: 'avoid',
      image: 'https://images.pexels.com/photos/1528013/pexels-photo-1528013.jpeg',
      description: 'Refrigerantes, doces, bolos e outros alimentos ricos em açúcar aumentam o risco de obesidade, diabetes e inflamação.',
      reasons: [
        'Provocam inflamação',
        'Aumentam o risco de diabetes',
        'Contribuem para a obesidade',
        'Elevam os triglicerídeos'
      ]
    },
    {
      id: 9,
      name: 'Bebidas Alcoólicas',
      category: 'moderately',
      image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg',
      description: 'O consumo excessivo de álcool aumenta a pressão arterial e o risco de AVC hemorrágico. Limite o consumo a no máximo uma dose por dia.',
      recommendations: [
        'Limite a 1 dose diária para mulheres',
        'Limite a 2 doses diárias para homens',
        'Evite completamente se tiver hipertensão',
        'Prefira vinho tinto em pequenas quantidades'
      ]
    },
    {
      id: 10,
      name: 'Carnes Vermelhas',
      category: 'moderately',
      image: 'https://images.pexels.com/photos/1639561/pexels-photo-1639561.jpeg',
      description: 'Carnes vermelhas contêm gorduras saturadas e seu consumo excessivo está associado a maior risco cardiovascular. Prefira cortes magros e consuma com moderação.',
      recommendations: [
        'Limite a 2-3 porções por semana',
        'Escolha cortes magros',
        'Remova a gordura visível',
        'Prefira métodos de preparo saudáveis (grelhado, assado)'
      ]
    },
    {
      id: 11,
      name: 'Laticínios Integrais',
      category: 'moderately',
      image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg',
      description: 'Leite integral, queijos gordurosos e creme de leite contêm gorduras saturadas. Opte pelas versões desnatadas ou com baixo teor de gordura.',
      recommendations: [
        'Prefira versões desnatadas ou com baixo teor de gordura',
        'Consuma queijos com moderação',
        'Substitua creme de leite por iogurte natural',
        'Escolha leites vegetais fortificados como alternativa'
      ]
    }
  ];

  const filteredFoods = foods
    .filter(food => 
      (activeFilter === 'all' || food.category === activeFilter) &&
      (searchQuery === '' || food.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const renderFoodCard = (food) => {
    const categoryColor = food.category === 'recommended' 
      ? '#10B981' 
      : food.category === 'avoid' 
        ? '#EF4444' 
        : '#F97316';
        
    const categoryLabel = food.category === 'recommended' 
      ? 'Recomendado' 
      : food.category === 'avoid' 
        ? 'Evitar' 
        : 'Moderação';

    return (
      <View key={food.id} style={styles.foodCard}>
        <Image
          source={{ uri: food.image }}
          style={styles.foodImage}
          resizeMode="cover"
        />
        <View style={[styles.categoryTag, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{categoryLabel}</Text>
        </View>
        <View style={styles.foodContent}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodDescription}>{food.description}</Text>
          
          {food.benefits && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Benefícios:</Text>
              {food.benefits.map((benefit, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.listDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}
          
          {food.reasons && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Por que evitar:</Text>
              {food.reasons.map((reason, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.listDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.listText}>{reason}</Text>
                </View>
              ))}
            </View>
          )}
          
          {food.recommendations && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Recomendações:</Text>
              {food.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.listDot, { backgroundColor: '#F97316' }]} />
                  <Text style={styles.listText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guia Nutricional</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            {showSearch ? <X size={24} color="#334155" /> : <Search size={24} color="#334155" />}
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar alimentos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={styles.categoryFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterButton,
                activeFilter === category.id && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter(category.id)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === category.id && styles.activeFilterButtonText
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.introContainer}>
        <Text style={styles.introTitle}>Alimentação e AVC</Text>
        <Text style={styles.introText}>
          A dieta desempenha um papel crucial na prevenção do AVC. Alimentos que controlam a pressão
          arterial, reduzem inflamação e melhoram a saúde vascular podem diminuir significativamente o risco.
        </Text>
      </View>

      <ScrollView style={styles.foodsList} showsVerticalScrollIndicator={false}>
        {filteredFoods.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>Nenhum alimento encontrado</Text>
          </View>
        ) : (
          filteredFoods.map(renderFoodCard)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginLeft: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#334155',
  },
  categoryFilters: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filtersContainer: {
    paddingHorizontal: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#F1F5F9',
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  introContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  foodsList: {
    flex: 1,
    padding: 16,
  },
  foodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: '100%',
    height: 160,
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  foodContent: {
    padding: 16,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  listContainer: {
    marginTop: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    marginRight: 8,
  },
  listText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    lineHeight: 20,
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#64748B',
  },
});