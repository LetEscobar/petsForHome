import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PetRegistrationScreen = () => {
  const [name, setName] = useState('');
  const [sex, setSex] = useState('Feminino');
  const [type, setType] = useState('Gato');
  const [ageYears, setAgeYears] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [requirements, setRequirements] = useState('');
  const [images, setImages] = useState([]); // Armazena várias imagens

  // Função para fazer upload de imagem
  const handleUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos de permissão para acessar suas mídias!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]); // Adiciona a nova imagem ao array de imagens
    }
  };

  const handleSave = () => {
    console.log({
      name,
      sex,
      type,
      ageYears,
      ageMonths,
      requirements,
      images, // Todas as imagens
    });
    alert('Informações salvas com sucesso!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastre seu pet aqui</Text>

      {/* Input de Nome */}
      <Text style={styles.label}>Nome do pet</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do pet"
        value={name}
        onChangeText={setName}
      />

      {/* Dropdown de Sexo */}
      <Text style={styles.label}>Sexo</Text>
      <Picker
        selectedValue={sex}
        style={styles.picker}
        onValueChange={(itemValue) => setSex(itemValue)}
      >
        <Picker.Item label="Feminino" value="Feminino" />
        <Picker.Item label="Masculino" value="Masculino" />
      </Picker>

      {/* Dropdown de Tipo */}
      <Text style={styles.label}>Tipo de animal</Text>
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Gato" value="Gato" />
        <Picker.Item label="Cachorro" value="Cachorro" />
      </Picker>

      {/* Idade Aproximada */}
      <Text style={styles.label}>Idade Aproximada</Text>
      <View style={styles.ageContainer}>
        <TextInput
          style={styles.ageInput}
          placeholder="Anos"
          keyboardType="numeric"
          value={ageYears}
          onChangeText={setAgeYears}
        />
        <TextInput
          style={styles.ageInput}
          placeholder="Meses"
          keyboardType="numeric"
          value={ageMonths}
          onChangeText={setAgeMonths}
        />
      </View>

      {/* Requisitos de Adoção */}
      <Text style={styles.label}>Requisitos de Adoção</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Descreva os requisitos de adoção"
        multiline
        numberOfLines={4}
        value={requirements}
        onChangeText={setRequirements}
      />

      {/* Upload de Mídias */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>Fazer upload de mídias</Text>
        <Icon name="upload" size={20} color="#004dd3" />
      </TouchableOpacity>

      {/* Carrossel de Imagens */}
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.imageCarousel} />
          ))}
        </ScrollView>
      )}

      {/* Botão de Salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar informações do pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
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
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderStyle: "solid",
    borderColor: '#e4e4e7',
  },
  ageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  ageInput: {
    width: '48%',
    height: 56,
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderStyle: "solid",
    borderColor: '#e4e4e7',
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
  },
  uploadButton: {
    borderRadius: 12,
    borderStyle: "solid",
    borderColor: '#004dd3',
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    gap: 24,
    alignContent: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#004dd3',
    fontWeight: "600",
  },
  carousel: {
    marginVertical: 10,
  },
  imageCarousel: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#004dd3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 48,
    marginBottom: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: "600",
    fontSize: 16,
  },
});

export default PetRegistrationScreen;
