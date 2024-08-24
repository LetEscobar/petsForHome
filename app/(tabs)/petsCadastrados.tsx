import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, Modal, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const initialPetsData = [
  { id: '1', name: 'Rex', gender: 'Macho', type: 'Cachorro', image: 'https://picsum.photos/200/600' },
  { id: '2', name: 'Luna', gender: 'Fêmea', type: 'Gato', image: 'https://picsum.photos/200/601' },
  { id: '3', name: 'Bobby', gender: 'Macho', type: 'Cachorro', image: 'https://picsum.photos/200/602' },
  { id: '4', name: 'Mia', gender: 'Fêmea', type: 'Gato', image: 'https://picsum.photos/200/603' },
  { id: '5', name: 'Rocky', gender: 'Macho', type: 'Cachorro', image: 'https://picsum.photos/200/604' },
  { id: '6', name: 'Bella', gender: 'Fêmea', type: 'Gato', image: 'https://picsum.photos/200/605' },
  { id: '7', name: 'Thor', gender: 'Macho', type: 'Cachorro', image: 'https://picsum.photos/200/606' },
];

const PetCard = ({ pet, onDelete }) => (
  <View style={styles.card}>
    <Image source={{ uri: pet.image }} style={styles.petImage} />
    <View style={styles.infoContainer}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petDetails}>{pet.gender}</Text>
      <Text style={styles.petDetails}>{pet.type}</Text>
    </View>
    <View style={styles.iconContainer}>
      <TouchableOpacity style={styles.iconButton}>
        <FontAwesome name="info-circle" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
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
  const [selectedPet, setSelectedPet] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const confirmDelete = (pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const handleDelete = () => {
    setPetsData(petsData.filter((pet) => pet.id !== selectedPet.id));
    setModalVisible(false);
    Alert.alert("Pet Excluído", `${selectedPet.name} foi excluído da sua lista de pets cadastrados.`);
    setSelectedPet(null);
  };

  const cancelDelete = () => {
    setModalVisible(false);
    setSelectedPet(null);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Pets Cadastrados</Text>
      <FlatList
        data={petsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PetCard pet={item} onDelete={confirmDelete} />}
        contentContainerStyle={styles.container}
      />

      {/* Modal de confirmação */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza que deseja excluir {selectedPet?.name} da sua lista de pets?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleDelete}>
                <Text style={styles.modalButtonText}>Sim, excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={cancelDelete}>
                <Text style={styles.modalButtonText}>Não, cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 4,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#ff5252',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginLeft: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default RegisteredPetsScreen;
