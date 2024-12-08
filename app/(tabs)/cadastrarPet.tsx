import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db, auth } from '../../assets/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dvjtr3on8/image/upload';
const UPLOAD_PRESET = 'pets-cadastrados';

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
  const [userId, setUserId] = useState('');

  const handleUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos de permissão para acessar suas mídias!');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      const formData = new FormData();
  
      formData.append('file', {
        uri: localUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', UPLOAD_PRESET);
  
      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        const data = await response.json();
  
        if (response.ok && data.secure_url) {
          setImages([...images, data.secure_url]);
          alert('Upload realizado com sucesso!');
        } else {
          console.error('Erro na resposta do Cloudinary:', data);
          alert('Erro ao fazer upload da imagem.');
        }
      } catch (error) {
        console.error('Erro ao enviar imagem para o Cloudinary:', error);
        alert('Erro ao fazer upload da imagem.');
      }
    }
  };

  const handleDeleteImage = (uri) => {
    Alert.alert('Excluir Imagem', 'Tem certeza que deseja excluir esta imagem?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        onPress: () => {
          setImages(images.filter((image) => image !== uri));
        },
      },
    ]);
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Você precisa estar logado para cadastrar um pet!');
        return;
      }

      const petData = {
        name,
        sex,
        type,
        age: { years: ageYears, months: ageMonths },
        requirements,
        castrado,
        vacinasEmDia,
        images,
        userId: user.uid,
      };

      const docRef = await addDoc(collection(db, 'pets'), petData);
      console.log('Pet registrado com ID: ', docRef.id);
      alert('Informações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar pet: ', error);
      alert('Erro ao salvar informações do pet');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastre seu pet aqui</Text>
      <Text style={styles.label}>Nome do pet</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do pet"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Sexo</Text>
      <Picker selectedValue={sex} style={styles.picker} onValueChange={(itemValue) => setSex(itemValue)}>
        <Picker.Item label="Feminino" value="Feminino" />
        <Picker.Item label="Masculino" value="Masculino" />
      </Picker>
      <Text style={styles.label}>Tipo de animal</Text>
      <Picker selectedValue={type} style={styles.picker} onValueChange={(itemValue) => setType(itemValue)}>
        <Picker.Item label="Gato" value="Gato" />
        <Picker.Item label="Cachorro" value="Cachorro" />
      </Picker>
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
      <Text style={styles.label}>Requisitos de Adoção</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Descreva os requisitos de adoção"
        multiline
        numberOfLines={4}
        value={requirements}
        onChangeText={setRequirements}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>Fazer upload de mídias</Text>
        <Icon name="upload" size={20} color="#004dd3" />
      </TouchableOpacity>
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.imageCarousel} />
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(uri)}>
                <Icon name="delete" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 24,
    backgroundColor: '#E1E1E1',
    borderRadius: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004dd3',
    marginRight: 8,
  },
  carousel: {
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  imageCarousel: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 5,
  },
  saveButton: {
    backgroundColor: '#004dd3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default PetRegistrationScreen;
