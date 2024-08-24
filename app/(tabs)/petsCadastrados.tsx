import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const initialPetsData = [
  { id: '1', name: 'Rex', gender: 'Macho', type: 'Cachorro', image: 'https://picsum.photos/200/600' },
  { id: '2', name: 'Luna', gender: 'Fêmea', type: 'Gato', image: 'https://picsum.photos/200/601' },
  { id: '3', name: 'Bobby', gender: 'Macho', type: 'Cachorro', image: 'https://picsum.photos/200/602' },
  { id: '4', name: 'Mia', gender: 'Fêmea', type: 'Gato', image: 'https://picsum.photos/200/603' },
  { id: '5', name: 'Rocky', gender: 'Macho', type: 'Cachorro', image: 'https://picsum.photos/200/604' },
  { id: '6', name: 'Bella', gender: 'Fêmea', type: 'Gato', image: 'https://picsum.photos/200/605' },
  { id: '7', name: 'Thor', gender: 'Macho', type: 'Cachorro', image: 'https://picsum.photos/200/606' },
];

const PetCard = ({ pet, onDelete, navigation }) => (
  <View style={styles.card}>
    <Image source={{ uri: pet.image }} style={styles.petImage} />
    <View style={styles.infoContainer}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petDetails}>{pet.gender}</Text>
      <Text style={styles.petDetails}>{pet.type}</Text>
    </View>
    <View style={styles.iconContainer}>
      <TouchableOpacity style={styles.iconButton}>
        <FontAwesome name="info-circle" size={24} color="black" 
        onPress={() => navigation.navigate('modalInfoPet', { pet })}/>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('modalEditarPet', { pet })}
      >
        <FontAwesome name="edit" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={() => onDelete(pet)}>
        <FontAwesome name="trash" size={24} color="black" />
      </TouchableOpacity>
    </View>
  </View>
);


const RegisteredPetsScreen = () => {
  const [petsData, setPetsData] = useState(initialPetsData);
  const navigation = useNavigation(); // Mova isso para dentro do componente

  const confirmDelete = (pet) => {
    Alert.alert(
      "Confirmação de Exclusão",
      `Tem certeza que deseja excluir ${pet.name} da sua lista de pets?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => handleDelete(pet),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = (pet) => {
    setPetsData(petsData.filter((p) => p.id !== pet.id));
    Alert.alert("Pet Excluído", `${pet.name} foi excluído da sua lista de pets cadastrados.`);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Pets Cadastrados</Text>
      <FlatList
        data={petsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard pet={item} onDelete={confirmDelete} navigation={navigation} />
        )}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginTop: 32,
    marginBottom: 24,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  petDetails: {
    fontSize: 14,
    color: '#666',
  },
  iconContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
});

export default RegisteredPetsScreen;
