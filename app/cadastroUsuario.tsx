import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../assets/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import MaskInput, { Masks } from 'react-native-mask-input';

interface AddressData {
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento: string;
}

interface UserData {
  nome: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
}

interface FinalizarData {
  email: string;
  senha: string;
  confirmarSenha: string;
}

const CadastroUsuario: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'Seus dados' | 'Endereço' | 'Finalizar cadastro'>('Seus dados');
  const [cep, setCep] = useState<string>('');
  const [addressData, setAddressData] = useState<AddressData>({
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    complemento: ''
  });
  const [userData, setUserData] = useState<UserData>({
    nome: '',
    cpf: '',
    telefone: '',
    dataNascimento: ''
  });
  const [finalizarData, setFinalizarData] = useState<FinalizarData>({
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const navigation = useNavigation();
  const db = getFirestore();

  const handleCepChange = async (value: string) => {
    const cleanCep = value.replace(/\D/g, '');
    setCep(cleanCep);
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (data.erro) {
          Alert.alert('CEP inválido');
        } else {
          setAddressData(prevState => ({
            ...prevState,
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
            complemento: ''
          }));
        }
      } catch (error) {
        Alert.alert('Erro ao buscar o CEP');
      }
    }
  };

  const handleNextStep = () => {
    switch (currentTab) {
      case 'Seus dados':
        if (Object.values(userData).every(value => value.trim() !== '')) {
          setCurrentTab('Endereço');
        } else {
          Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios.');
        }
        break;
      case 'Endereço':
        if (addressData.endereco.trim() === '' || addressData.bairro.trim() === '' || addressData.cidade.trim() === '' || addressData.uf.trim() === '' || addressData.numero.trim() === '') {
          Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios.');
        } else {
          setCurrentTab('Finalizar cadastro');
        }
        break;
      case 'Finalizar cadastro':
        if (finalizarData.email.trim() !== '' && finalizarData.senha.trim() !== '' && finalizarData.confirmarSenha.trim() !== '' && finalizarData.senha === finalizarData.confirmarSenha) {
          createUserInFirebase();
        } else {
          Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios e verifique se as senhas coincidem.');
        }
        break;
      default:
        break;
    }
  };

  const createUserInFirebase = async () => {
    try {
      // Criação do usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, finalizarData.email, finalizarData.senha);
      const user = userCredential.user;

      // Salvar os dados do usuário no Firestore
      const userRef = doc(db, 'usuarios', user.uid);  // Usando o UID do usuário como o ID no Firestore
      await setDoc(userRef, {
        nome: userData.nome,
        cpf: userData.cpf,
        telefone: userData.telefone,
        dataNascimento: userData.dataNascimento,
        endereco: addressData.endereco,
        numero: addressData.numero,
        bairro: addressData.bairro,
        cidade: addressData.cidade,
        uf: addressData.uf,
        complemento: addressData.complemento,
        cep: cep,
        email: finalizarData.email
      });

      // Efetuar o login após cadastro
      await signInWithEmailAndPassword(auth, finalizarData.email, finalizarData.senha);

      Alert.alert('Cadastro completo', 'Seu cadastro foi realizado com sucesso!');
      navigation.navigate('login');
    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'E-mail inválido.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      } else if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Esse e-mail já está em uso.');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao criar o usuário: ' + error.message);
      }
    }
  };

  const renderTabContent = () => {
    const fieldsSeusDados = [
      { label: 'Nome completo', placeholder: 'Nome completo', value: userData.nome, onChangeText: (text: string) => setUserData({ ...userData, nome: text }), secureTextEntry: false },
      { label: 'CPF', placeholder: '000.000.000-00', value: userData.cpf, onChangeText: (text: string) => setUserData({ ...userData, cpf: text }), mask: Masks.BRL_CPF, secureTextEntry: false },
      { label: 'Telefone', placeholder: '(00) 00000-0000', value: userData.telefone, onChangeText: (text: string) => setUserData({ ...userData, telefone: text }), mask: Masks.BRL_PHONE, secureTextEntry: false },
      { label: 'Data de nascimento', placeholder: 'DD/MM/AAAA', value: userData.dataNascimento, onChangeText: (text: string) => setUserData({ ...userData, dataNascimento: text }), mask: Masks.DATE_DDMMYYYY, secureTextEntry: false },
    ];

    const fieldsEndereco = [
      { label: 'CEP', placeholder: '00000-000', value: cep, onChangeText: handleCepChange, mask: Masks.ZIP_CODE, secureTextEntry: false },
      { label: 'Endereço', placeholder: 'Endereço', value: addressData.endereco, onChangeText: (text: string) => setAddressData({ ...addressData, endereco: text }), secureTextEntry: false },
      { label: 'Número', placeholder: 'Número', value: addressData.numero, onChangeText: (text: string) => setAddressData({ ...addressData, numero: text }), secureTextEntry: false },
      { label: 'Bairro', placeholder: 'Bairro', value: addressData.bairro, onChangeText: (text: string) => setAddressData({ ...addressData, bairro: text }), secureTextEntry: false },
      { label: 'Cidade', placeholder: 'Cidade', value: addressData.cidade, onChangeText: (text: string) => setAddressData({ ...addressData, cidade: text }), secureTextEntry: false },
      { label: 'UF', placeholder: 'UF', value: addressData.uf, onChangeText: (text: string) => setAddressData({ ...addressData, uf: text }), secureTextEntry: false },
      { label: 'Complemento', placeholder: 'Complemento', value: addressData.complemento, onChangeText: (text: string) => setAddressData({ ...addressData, complemento: text }), secureTextEntry: false },
    ];

    const fieldsFinalizar = [
      { label: 'E-mail', placeholder: 'E-mail', value: finalizarData.email, onChangeText: (text: string) => setFinalizarData({ ...finalizarData, email: text }) },
      { label: 'Senha', placeholder: 'Senha', value: finalizarData.senha, secureTextEntry: true, onChangeText: (text: string) => setFinalizarData({ ...finalizarData, senha: text }) },
      { label: 'Confirmar Senha', placeholder: 'Confirmar Senha', value: finalizarData.confirmarSenha, secureTextEntry: true, onChangeText: (text: string) => setFinalizarData({ ...finalizarData, confirmarSenha: text }) },
    ];

    const renderFields = (fields: any[]) => {
      return fields.map((field, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.label}>{field.label}</Text>
          {field.mask ? (
            <MaskInput
              value={field.value}
              onChangeText={field.onChangeText}
              mask={field.mask}
              style={styles.input}
              placeholder={field.placeholder}
            />
          ) : (
            <TextInput
              value={field.value}
              onChangeText={field.onChangeText}
              style={styles.input}
              placeholder={field.placeholder}
              secureTextEntry={field.secureTextEntry}
            />
          )}
        </View>
      ));
    };

    switch (currentTab) {
      case 'Seus dados':
        return renderFields(fieldsSeusDados);
      case 'Endereço':
        return renderFields(fieldsEndereco);
      case 'Finalizar cadastro':
        return renderFields(fieldsFinalizar);
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de usuário</Text>
      <FlatList
        data={[{ key: currentTab }]}
        renderItem={({ item }) => renderTabContent()}
        keyExtractor={(item) => item.key}
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
        <Text style={styles.nextButtonText}>
          {currentTab === 'Finalizar cadastro' ? 'Finalizar cadastro' : 'Próximo'}
        </Text>
      </TouchableOpacity>
    </View>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#007bff',
    padding: 12,
    marginTop: 20,
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default CadastroUsuario;
