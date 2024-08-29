import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Card from '@/components/Card'; // Importando o Card
import { useNavigation } from '@react-navigation/native';

export default function Feed() {
  const navigation = useNavigation();
  
  // Estado para controlar o filtro ativo
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Lista completa de dados dos cards
  const cardData = [
    { id: '1', title: 'Caramelo', subtitle: 'MACHO', description: 'Cachorro', imageSource: 'https://picsum.photos/200/600', type: 'Cachorro' },
    { id: '2', title: 'Luna', subtitle: 'FÊMEA', description: 'Gato', imageSource: 'https://picsum.photos/200/301', type: 'Gato' },
    { id: '3', title: 'Bobby', subtitle: 'MACHO', description: 'Cachorro', imageSource: 'https://picsum.photos/200/302', type: 'Cachorro' },
    { id: '4', title: 'Bella', subtitle: 'FÊMEA', description: 'Gato', imageSource: 'https://picsum.photos/200/303', type: 'Gato' },
    { id: '5', title: 'Max', subtitle: 'MACHO', description: 'Cachorro', imageSource: 'https://picsum.photos/200/304', type: 'Cachorro' },
    { id: '6', title: 'Mia', subtitle: 'FÊMEA', description: 'Gato', imageSource: 'https://picsum.photos/200/305', type: 'Gato' },
    { id: '7', title: 'Rex', subtitle: 'MACHO', description: 'Cachorro', imageSource: 'https://picsum.photos/200/306', type: 'Cachorro' },
  ];

  // Filtra os cards com base no filtro selecionado
  const filteredData = selectedFilter
    ? cardData.filter(item => item.type === selectedFilter)
    : cardData;

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          {/* Título e texto de filtro */}
          <Text style={styles.heading}>Que tipo de pet está procurando?</Text>

          {/* Filtro de tags */}
          <View style={styles.tagContainer}>
            <TouchableOpacity
              style={[styles.tag, selectedFilter === 'Cachorro' && styles.selectedTag]}
              onPress={() => setSelectedFilter('Cachorro')}
            >
              <Text style={styles.tagText}>Cachorro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tag, selectedFilter === 'Gato' && styles.selectedTag]}
              onPress={() => setSelectedFilter('Gato')}
            >
              <Text style={styles.tagText}>Gato</Text>
            </TouchableOpacity>

            {/* Botão para limpar o filtro */}
            <TouchableOpacity
              style={[styles.tag, selectedFilter === null && styles.selectedTag]}
              onPress={() => setSelectedFilter(null)}
            >
              <Text style={styles.tagText}>Todos</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heading1}>Escolha um bichinho para adotar!</Text>
        </View>
      }
      data={filteredData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.cardContainer}
          onPress={() => navigation.navigate('modalAdotarPet', { pet: item })}
        >
          <Card
            title={item.title}
            subtitle={item.subtitle}
            description={item.description}
            imageSource={item.imageSource}
          />
        </TouchableOpacity>
      )}
      numColumns={2} // Define que cada linha terá 2 colunas
      columnWrapperStyle={styles.columnWrapper} // Garante espaçamento entre as colunas
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  heading1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11181c',
    textAlign: 'center',
    marginVertical: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181c',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#fff',
    borderColor: '#e3ebf6',
    borderWidth: 1.5,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  tagText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#515151',
  },
  selectedTag: {
    backgroundColor: '#e3ebf6',
  },
  cardContainer: {
    flex: 1,
    padding: 8, // Espaçamento entre os cards
    maxWidth: '50%', // Garante que cada card ocupe 50% da largura
    backgroundColor: '#f9f9f9',
  },
  columnWrapper: {
    justifyContent: 'space-between', // Espaçamento igual entre as colunas
  },
  listContent: {
    paddingHorizontal: 8,
  },
});
