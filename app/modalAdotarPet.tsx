import React from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ModalAdotarPet = ({ visible, onClose, petData }) => {
  if (!petData) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Esse é seu novo pet!</Text>

          {/* Exibindo imagem */}
          <Image source={{ uri: petData.imageSource }} style={styles.petImage} />

          {/* Dados do pet */}
          <Text style={styles.petInfo}>Nome: {petData.title}</Text>
          <Text style={styles.petInfo}>Tipo: {petData.description}</Text>
          <Text style={styles.petInfo}>Sexo: {petData.subtitle}</Text>
          <Text style={styles.petInfo}>Idade: {petData.age} anos</Text>
          <Text style={styles.petInfo}>Castrado: {petData.castrado ? 'Sim' : 'Não'}</Text>
          <Text style={styles.petInfo}>Vacinas em Dia: {petData.vacinas ? 'Sim' : 'Não'}</Text>

          {/* Requisitos de adoção */}
          <Text style={styles.requisitosTitle}>Requisitos de Adoção</Text>
          <Text style={styles.requisitosText}>{petData.requisitos}</Text>

          {/* Botão de fechar */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  petImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  petInfo: {
    fontSize: 16,
    marginVertical: 5,
  },
  requisitosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  requisitosText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ModalAdotarPet;
