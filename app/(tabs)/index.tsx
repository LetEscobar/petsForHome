import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Card from '@/components/Card'; 
import { useNavigation } from '@react-navigation/native';
import { db } from '../../assets/firebaseConfig.js'; 
import { collection, getDocs } from 'firebase/firestore';
import { router } from 'expo-router';

export default function Feed() {
  const navigation = useNavigation();

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [pets, setPets] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 

const fetchPets = async () => {
  try {
    const petsCollectionRef = collection(db, 'pets'); 
    const snapshot = await getDocs(petsCollectionRef);
    const petList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(), 
    }));
    setPets(petList); 
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredData = selectedFilter
    ? pets.filter(item => item.type === selectedFilter)
    : pets;

  return (
    <FlatList
      style={styles.background}
      ListHeaderComponent={
        <View style={styles.container}>
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
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() => router.push(`/modalAdotarPet?id=${item.id}`)}

        >
          <Card
            name={item.name} 
            sex={item.sex} 
            type={item.type} 
            images={item.images || []} 
          />
        </TouchableOpacity>
      )}
      numColumns={2} 
      columnWrapperStyle={styles.columnWrapper} 
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={loading ? <Text>Carregando...</Text> : null} 
    />
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#f9f9f9',
  },
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
    padding: 8, 
    maxWidth: '50%', 
    backgroundColor: '#f9f9f9',
  },
  columnWrapper: {
    justifyContent: 'space-between', 
  },
  listContent: {
    paddingBottom: 16,
  },
});
