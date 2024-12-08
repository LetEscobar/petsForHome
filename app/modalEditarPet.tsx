import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, Alert, View } from 'react-native';
import { Text } from '@/components/Themed';
import { useLayoutEffect, useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from 'expo-router';
import { db } from '../assets/firebaseConfig.js'; 

const EditPetScreen = ({ route }) => {
  const petId = route?.params?.petId;  
  const [petData, setPetData] = useState(null);  

  const [name, setName] = useState('');
  const [sex, setSex] = useState('Feminino');
  const [type, setType] = useState('Gato');
  const [ageYears, setAgeYears] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [requirements, setRequirements] = useState('');
  const [images, setImages] = useState([]);
  const [castrado, setCastrado] = useState(false);
  const [vacinasEmDia, setVacinasEmDia] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Editar Pet',
    });
  }, [navigation]);

  useEffect(() => {
    if (petId) {
      db.collection('pets')  // Assumindo que você tenha uma coleção 'pets' no Firestore
        .doc(petId)
        .get()
        .then(docSnapshot => {
          if (docSnapshot.exists) {
            const pet = docSnapshot.data();
            setPetData(pet);
  
            // Preenchendo os campos com os dados do pet
            setName(pet.name);
            setSex(pet.sex);
            setType(pet.type);
  
            // Ajustando o formato de idade para preencher os campos de anos e meses
            if (pet.age && pet.age.years && pet.age.months) {
              setAgeYears(pet.age.years.toString());
              setAgeMonths(pet.age.months.toString());
            }
  
            setRequirements(pet.requirements);
            setImages(pet.images || []);
            setCastrado(pet.castrado);
            setVacinasEmDia(pet.vacinasEmDia);
          } else {
            Alert.alert('Erro', 'Pet não encontrado!');
          }
        })
        .catch(error => {
          console.error('Erro ao buscar dados do pet:', error);
          Alert.alert('Erro', 'Falha ao buscar dados do pet');
        });
    }
  }, [petId]);

  const handleUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas mídias!');
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
    if (!name || !ageYears || !ageMonths || !requirements) {
      Alert.alert('Erro', 'Todos os campos obrigatórios devem ser preenchidos!');
      return;
    }

    const age = {
      years: parseInt(ageYears),  
      months: parseInt(ageMonths), 
    };

    db.collection('pets')
      .doc(petId)
      .update({
        name,
        sex,
        type,
        age,  
        requirements,
        castrado,
        vacinasEmDia,
        images,
      })
      .then(() => {
        Alert.alert('Sucesso', 'Informações do pet atualizadas com sucesso!');
        navigation.goBack(); 
      })
      .catch((error) => {
        console.error('Erro ao salvar pet:', error);
        Alert.alert('Erro', 'Falha ao salvar as informações do pet');
      });
  };

  if (!petData) {
    return <Text>Carregando...</Text>;  
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Atualize as Informações do Pet</Text>

      <Text style={styles.label}>Nome do pet</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do pet"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Sexo</Text>
      <Picker
        selectedValue={sex}
        style={styles.picker}
        onValueChange={(itemValue) => setSex(itemValue)}
      >
        <Picker.Item label="Feminino" value="Feminino" />
        <Picker.Item label="Masculino" value="Masculino" />
      </Picker>

      <Text style={styles.label}>Tipo de animal</Text>
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
      >
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

      <Text style={styles.label}>Requisitos de Adoção</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Requisitos para adoção"
        multiline
        value={requirements}
        onChangeText={setRequirements}
      />

      <Text style={styles.label}>Imagens do Pet</Text>
      <View style={styles.imageGallery}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity onPress={() => handleDeleteImage(uri)} style={styles.deleteImageButton}>
              <Icon name="delete" size={24} color="#ff0000" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Adicionar Imagem</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  ageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ageInput: {
    width: '45%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  booleanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  booleanButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 8,
  },
  booleanSelected: {
    backgroundColor: '#4caf50',
  },
  booleanButtonText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 50,
    padding: 5,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default EditPetScreen;
