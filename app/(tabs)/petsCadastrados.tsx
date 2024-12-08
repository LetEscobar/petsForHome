import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../assets/firebaseConfig'; // Importe a configuração do Firebase
import { collection, getDocs } from 'firebase/firestore';

interface Pet {
  id: string;
  name: string;
  gender: string;
  type: string;
  image: string;
}

const PetCard = ({ pet, onDelete, navigation }: { pet: Pet; onDelete: (pet: Pet) => void; navigation: any }) => (
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
  const [petsData, setPetsData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsSnapshot = await getDocs(collection(db, 'pets')); // Acesse a coleção "pets" no Firestore
        const petsList = petsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPetsData(petsList);
      } catch (error) {
        console.error("Erro ao buscar os pets:", error);
      }
    };

    fetchPets();
  }, []);

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
    // Função para excluir o pet do Firestore (pode ser implementada depois)
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
