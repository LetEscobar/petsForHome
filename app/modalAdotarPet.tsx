import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRef, useState } from 'react';

// Função para gerar informações aleatórias caso não haja pets cadastrados
const getRandomPetData = () => ({
  name: 'Pet Aleatório',
  type: 'Cachorro',
  age: '2 anos e 3 meses',
  sex: 'Macho',
  castrated: 'Sim',
  vaccines: 'Sim',
  adoptionRequirements: 'O pet precisa de um ambiente espaçoso e seguro, preferencialmente com um quintal grande para que possa brincar e se exercitar.',
  images: [
    'https://picsum.photos/200/300', 
    'https://picsum.photos/200/301', 
    'https://picsum.photos/200/302', 
    'https://picsum.photos/200/303'
  ],
});

export default function ModalScreen({ route }) {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [reason, setReason] = useState('');
  const [housingType, setHousingType] = useState('');
  const [error, setError] = useState('');

  // Dados do pet vindos do card ou aleatórios
  const petData = route?.params?.petData || getRandomPetData();

  const handleAdoptButtonClick = () => {
    if (!reason.trim() || !housingType.trim()) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    setError('');
    Alert.alert('Sucesso', 'Sua solicitação de adoção foi enviada com sucesso.');
    // Lógica para enviar os dados do formulário
  };

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

      <Text style={styles.label}>Requisitos para adoção:</Text>
      <Text style={styles.info}>{petData.adoptionRequirements}</Text>
      
      
      <View style={styles.separator} />

      <Text style={styles.formLabel}>Por que você deseja adotar esse pet?</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Digite sua resposta aqui..."
        multiline
        value={reason}
        onChangeText={setReason}
      />

      <Text style={styles.formLabel}>Qual o seu tipo de moradia?</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu tipo de moradia aqui..."
        value={housingType}
        onChangeText={setHousingType}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Botão Quero Adotar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleAdoptButtonClick}>
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
    color:'#000'
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
  formLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: '#000',
    alignItems: 'flex-start',
    width: '100%',
  },
  textarea: {
    height: 100,
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderStyle: "solid",
    borderColor: '#e4e4e7',
    width: '100%',
  },
  input: {
    height: 56,
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderStyle: "solid",
    borderColor: '#e4e4e7',
    width: '100%',
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
    backgroundColor: '#e4e4e7',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
  },
});
