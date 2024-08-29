import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Certifique-se de que você está usando o React Navigation

const CadastroUsuario = () => {
  const [currentTab, setCurrentTab] = useState('Seus dados');
  const [cep, setCep] = useState('');
  const [addressData, setAddressData] = useState({
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    complemento: ''
  });
  const [userData, setUserData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: ''
  });
  const [finalizarData, setFinalizarData] = useState({
    usuario: '',
    senha: '',
    confirmarSenha: ''
  });
  const navigation = useNavigation(); // Use a navegação

  const handleCepChange = async (value) => {
    setCep(value);
    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
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
        if (finalizarData.usuario.trim() !== '' && finalizarData.senha.trim() !== '' && finalizarData.confirmarSenha.trim() !== '' && finalizarData.senha === finalizarData.confirmarSenha) {
          saveData();
        } else {
          Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos obrigatórios e verifique se as senhas coincidem.');
        }
        break;
      default:
        break;
    }
  };

  const saveData = async () => {
    try {
      // Armazenar dados no AsyncStorage
      await AsyncStorage.setItem('@user_data', JSON.stringify({
        nome: userData.nome,
        cpf: userData.cpf,
        email: userData.email,
        telefone: userData.telefone,
        dataNascimento: userData.dataNascimento,
        endereco: addressData.endereco,
        numero: addressData.numero,
        bairro: addressData.bairro,
        cidade: addressData.cidade,
        uf: addressData.uf,
        complemento: addressData.complemento,
        usuario: finalizarData.usuario,
        senha: finalizarData.senha
      }));
      Alert.alert('Cadastro completo', 'Seu cadastro foi realizado com sucesso.');
      navigation.navigate('login'); // Redirecionar para a tela de login
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados.');
    }
  };

  const renderTabContent = () => {
    const fieldsSeusDados = [
      { label: 'Nome completo', placeholder: 'Nome completo', value: userData.nome, onChangeText: text => setUserData({ ...userData, nome: text }) },
      { label: 'CPF', placeholder: 'CPF', value: userData.cpf, onChangeText: text => setUserData({ ...userData, cpf: text }) },
      { label: 'E-mail', placeholder: 'E-mail', value: userData.email, onChangeText: text => setUserData({ ...userData, email: text }) },
      { label: 'Telefone', placeholder: 'Telefone', value: userData.telefone, onChangeText: text => setUserData({ ...userData, telefone: text }) },
      { label: 'Data de nascimento', placeholder: 'Data de nascimento', value: userData.dataNascimento, onChangeText: text => setUserData({ ...userData, dataNascimento: text }) },
    ];

    const fieldsEndereco = [
      { label: 'CEP', placeholder: 'CEP', value: cep, onChangeText: handleCepChange },
      { label: 'Endereço', placeholder: 'Endereço', value: addressData.endereco, onChangeText: text => setAddressData({ ...addressData, endereco: text }) },
      { label: 'Número', placeholder: 'Número', value: addressData.numero, onChangeText: text => setAddressData({ ...addressData, numero: text }) },
      { label: 'Bairro', placeholder: 'Bairro', value: addressData.bairro, onChangeText: text => setAddressData({ ...addressData, bairro: text }) },
      { label: 'Cidade', placeholder: 'Cidade', value: addressData.cidade, onChangeText: text => setAddressData({ ...addressData, cidade: text }) },
      { label: 'UF', placeholder: 'UF', value: addressData.uf, onChangeText: text => setAddressData({ ...addressData, uf: text }) },
      { label: 'Complemento', placeholder: 'Complemento', value: addressData.complemento, onChangeText: text => setAddressData({ ...addressData, complemento: text }) },
    ];

    const fieldsFinalizar = [
      { label: 'Usuário', placeholder: 'Usuário', value: finalizarData.usuario, onChangeText: text => setFinalizarData({ ...finalizarData, usuario: text }) },
      { label: 'Senha', placeholder: 'Senha', value: finalizarData.senha, secureTextEntry: true, onChangeText: text => setFinalizarData({ ...finalizarData, senha: text }) },
      { label: 'Confirmar Senha', placeholder: 'Confirmar Senha', value: finalizarData.confirmarSenha, secureTextEntry: true, onChangeText: text => setFinalizarData({ ...finalizarData, confirmarSenha: text }) },
    ];

    const data = currentTab === 'Seus dados' ? fieldsSeusDados : currentTab === 'Endereço' ? fieldsEndereco : fieldsFinalizar;

    const navigation = useNavigation();

    useLayoutEffect(() => {
      // Define o título do modal
      navigation.setOptions({
        title: 'Criar conta',
      });
    }, [navigation]);

    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.label}-${index}`}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.label}>{item.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={item.placeholder}
              value={item.value}
              secureTextEntry={item.secureTextEntry}
              onChangeText={item.onChangeText}
              editable={!item.disabled}
            />
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>{currentTab === 'Finalizar cadastro' ? 'Salvar' : 'Continuar cadastro'}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.tabContent}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <Text
          style={[styles.tabItem, currentTab === 'Seus dados' && styles.activeTab]}
          onPress={() => setCurrentTab('Seus dados')}
        >
          Seus dados
        </Text>
        <Text
          style={[styles.tabItem, currentTab === 'Endereço' && styles.activeTab]}
          onPress={() => setCurrentTab('Endereço')}
        >
          Endereço
        </Text>
        <Text
          style={[styles.tabItem, currentTab === 'Finalizar cadastro' && styles.activeTab]}
          onPress={() => setCurrentTab('Finalizar cadastro')}
        >
          Finalizar
        </Text>
      </View>
      {renderTabContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  tabHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  tabContent: {
    paddingBottom: 100, // Espaço para não sobrepor o botão salvar ao fim da tela
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
    borderColor: '#e4e4e7',
  },
  nextButton: {
    backgroundColor: '#004dd3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CadastroUsuario;
