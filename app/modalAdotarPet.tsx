import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRef, useState, useEffect } from 'react';
import { db } from '../assets/firebaseConfig.js'; 
import { doc, getDoc } from 'firebase/firestore'; 

// Função para gerar informações aleatórias caso não haja pets cadastrados
const getRandomPetData = () => ({
  name: 'Pet Aleatório',
  type: 'Cachorro',
  age: '2 anos e 3 meses',
  sex: 'Macho',
  castrated: 'Sim',
  vaccines: 'Em dia',
  adoptionRequirements: 'O pet precisa de um ambiente espaçoso e seguro, preferencialmente com um quintal grande para que possa brincar e se exercitar.',
  images: [
    'https://picsum.photos/200/300', 
    'https://picsum.photos/200/301', 
    'https://picsum.photos/200/302', 
    'https://picsum.photos/200/303'
  ],
});

import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  ModalScreen: { petId: string }; 
};

type ModalScreenRouteProp = RouteProp<RootStackParamList, 'ModalScreen'>;

export default function ModalScreen({ route }: { route: ModalScreenRouteProp }) {
  const [petData, setPetData] = useState<any>(getRandomPetData()); // Inicializa com dados locais
  const [loading, setLoading] = useState<boolean>(true); 
  const bottomSheetRef = useRef(null);

  const petId = route?.params?.petId;

  const fetchPetData = async (petId: string) => {
    try {
      const petDocRef = doc(db, 'pets', petId);
      const petDoc = await getDoc(petDocRef); 

      if (petDoc.exists()) {
        setPetData(petDoc.data());  // Atualiza com dados do Firestore
      } else {
        console.log('Pet não encontrado!');
        setPetData(getRandomPetData()); // Caso pet não exista, use os dados locais
      }
    } catch (error) {
      console.error('Erro ao buscar dados do pet:', error);
      setPetData(getRandomPetData());  // Caso erro na requisição, use dados locais
    } finally {
      setLoading(false); // Finaliza carregamento
    }
  };

  useEffect(() => {
    if (petId) {
      fetchPetData(petId); // Carrega dados se petId for fornecido
    } else {
      setPetData(getRandomPetData());  
      setLoading(false); 
    }
  }, [petId]);

  if (loading) {
    return <Text>Carregando...</Text>; // Exibe mensagem de carregamento
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Informações do Pet</Text>

      <ScrollView horizontal contentContainerStyle={styles.gallery}>
        {petData.images.map((image: string, index: number) => (
          <Image key={index} source={{ uri: image }} style={styles.image} resizeMode="cover" />
        ))}
      </ScrollView>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.info}>{petData.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.info}>{petData.type}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Idade:</Text>
          <Text style={styles.info}>{petData.age}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Sexo:</Text>
          <Text style={styles.info}>{petData.sex}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Castrado:</Text>
          <Text style={styles.info}>{petData.castrated}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Vacinas em dia:</Text>
          <Text style={styles.info}>{petData.vaccines}</Text>
        </View>
      </View>

      <Text style={styles.label}>Requisitos para adoção:</Text>
      <Text style={styles.info}>{petData.adoptionRequirements}</Text>

      {/* Botão Quero Adotar */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Quero adotar</Text>
      </TouchableOpacity>

      {/* Status bar */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000'
  },
  gallery: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  card: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#111',
    shadowOpacity: 0.4,
    elevation: 1,
    gap: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderStyle: "solid",
    borderColor: '#e4e4e7',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  info: {
    fontSize: 14,
    color: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#004dd3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginVertical: 24,
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: "600",
    fontSize: 16,
  },
});
