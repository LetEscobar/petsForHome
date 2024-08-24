import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from 'expo-router';

// Função para gerar informações aleatórias caso não haja pets cadastrados
const getRandomInterestedPeople = () => [
  {
    name: 'João Silva',
    phone: '(11) 99999-9999',
    housing: 'Apartamento',
    reason: 'Sempre quis ter um pet para fazer companhia.',
  },
  {
    name: 'Maria Souza',
    phone: '(21) 98888-8888',
    housing: 'Casa com quintal',
    reason: 'Tenho espaço e quero adotar um cachorro para meus filhos.',
  },
  {
    name: 'Carlos Oliveira',
    phone: '(31) 97777-7777',
    housing: 'Casa',
    reason: 'Gosto muito de animais e quero oferecer um lar.',
  },
];

// Função para gerar informações aleatórias de pets caso não haja pets cadastrados
const getRandomPetData = () => ({
  name: 'Bobby',
  type: 'Cachorro',
  age: '2 anos',
  sex: 'Masculino',
  castrated: 'Sim',
  vaccines: 'Sim',
  adoptionRequirements: 'Precisa de um quintal grande e uma família que esteja sempre presente.',
  images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
});

export default function ModalScreen({ route }) {
  const [reason] = useState('');
  const [housingType] = useState('');
  const [error, setError] = useState('');
  const [interestedPeople, setInterestedPeople] = useState([]);

  // Dados do pet vindos do card ou aleatórios
  const petData = route?.params?.petData || getRandomPetData();

  // Use o useEffect para popular o array de interessados quando o componente for montado
  useEffect(() => {
    const fetchedPeople = getRandomInterestedPeople();
    setInterestedPeople(fetchedPeople);
  }, []);
  
  const navigation = useNavigation();

  useLayoutEffect(() => {
    // Define o título do modal
    navigation.setOptions({
      title: 'Adotar Pet',
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Informações do Pet</Text>

      {/* Exibindo as imagens do pet em uma galeria */}
      <ScrollView horizontal contentContainerStyle={styles.gallery}>
        {petData.images.map((image, index) => (
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

      <Text style={styles.label}>Requisitos para adoção</Text>
      <Text style={[styles.info, styles.requisitos]}>{petData.adoptionRequirements}</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <Text style={styles.label}>Lista de interessados em adotar</Text>
      
      {/* Verifica se o array interestedPeople não está vazio */}
      {interestedPeople.length > 0 ? (
        interestedPeople.map((person, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Nome:</Text>
              <Text style={styles.info}>{person.name}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Telefone:</Text>
              <Text style={styles.info}>{person.phone}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Moradia:</Text>
              <Text style={styles.info}>{person.housing}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Motivo da adoção:</Text>
              <Text style={styles.info}>{person.reason}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.info}>Nenhum interessado por enquanto.</Text>
      )}

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
    color: '#000',
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
    borderStyle: 'solid',
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
  requisitos: {
    marginBottom: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
  },
});
