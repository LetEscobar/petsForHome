import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
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
  const [images, setImages] = useState([]);
  const [castrado, setCastrado] = useState(false);
  const [vacinasEmDia, setVacinasEmDia] = useState(false);

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
      setImages([...images, result.assets[0].uri]);
    }
  };

  // Função para excluir uma imagem
  const handleDeleteImage = (uri) => {
    Alert.alert(
      'Excluir Imagem',
      'Tem certeza que deseja excluir esta imagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            setImages(images.filter(image => image !== uri));
          },
        },
      ]
    );
  };

  const handleSave = () => {
    console.log({
      name,
      sex,
      type,
      ageYears,
      ageMonths,
      requirements,
      castrado,
      vacinasEmDia,
      images,
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

      {/* Campo Castrado */}
      <Text style={styles.label}>Castrado</Text>
      <View style={styles.booleanContainer}>
        <TouchableOpacity
          style={[styles.booleanButton, castrado ? styles.booleanSelected : null]}
          onPress={() => setCastrado(true)}
        >
          <Text style={styles.booleanButtonText}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.booleanButton, !castrado ? styles.booleanSelected : null]}
          onPress={() => setCastrado(false)}
        >
          <Text style={styles.booleanButtonText}>Não</Text>
        </TouchableOpacity>
      </View>

      {/* Campo Vacinas em Dia */}
      <Text style={styles.label}>Vacinas em dia</Text>
      <View style={styles.booleanContainer}>
        <TouchableOpacity
          style={[styles.booleanButton, vacinasEmDia ? styles.booleanSelected : null]}
          onPress={() => setVacinasEmDia(true)}
        >
          <Text style={styles.booleanButtonText}>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.booleanButton, !vacinasEmDia ? styles.booleanSelected : null]}
          onPress={() => setVacinasEmDia(false)}
        >
          <Text style={styles.booleanButtonText}>Não</Text>
        </TouchableOpacity>
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
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.imageCarousel} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteImage(uri)}
              >
                <Icon name="delete" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#f9f9f9',
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
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderColor: '#e4e4e7',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderStyle: 'solid',
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
    borderStyle: 'solid',
    borderColor: '#e4e4e7',
  },
  textarea: {
    height: 100,
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderColor: '#e4e4e7',
  },
  uploadButton: {
    borderRadius: 12,
    borderStyle: 'solid',
    borderColor: '#004dd3',
    borderWidth: 1,
    backgroundColor: '#fff',
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
    fontWeight: '600',
  },
  carousel: {
    marginVertical: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  imageCarousel: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#d9534f',
    borderRadius: 12,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '600',
    fontSize: 16,
  },
  booleanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  booleanButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#e4e4e7',
    alignItems: 'center',
  },
  booleanButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  booleanSelected: {
    backgroundColor: '#e3ebf6',
    borderColor: '#004dd3',
  },
});

export default PetRegistrationScreen;
