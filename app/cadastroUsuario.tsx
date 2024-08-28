import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

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
    dataNascimento: '',
    usuario: '',
    senha: '',
    confirmacaoSenha: ''
  });

  const handleCepChange = async (value: string) => {
    setCep(value);

    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          Alert.alert('CEP inválido');
        } else {
          setAddressData({
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
            complemento: ''
          });
        }
      } catch (error) {
        Alert.alert('Erro ao buscar o CEP');
      }
    }
  };

  const handleSave = () => {
    // Lógica para salvar os dados do usuário
    Alert.alert('Cadastro', 'Cadastro realizado com sucesso!');
  };

  const renderTabContent = () => {
    const fieldsSeusDados = [
      { label: 'Nome completo', placeholder: 'Nome completo', value: userData.nome, key: 'nome', onChangeText: text => setUserData({...userData, nome: text}) },
      { label: 'CPF', placeholder: 'CPF', value: userData.cpf, key: 'cpf', onChangeText: text => setUserData({...userData, cpf: text}) },
      { label: 'E-mail', placeholder: 'E-mail', value: userData.email, key: 'email', onChangeText: text => setUserData({...userData, email: text}) },
      { label: 'Telefone', placeholder: 'Telefone', value: userData.telefone, key: 'telefone', onChangeText: text => setUserData({...userData, telefone: text}) },
      { label: 'Data de nascimento', placeholder: 'Data de nascimento', value: userData.dataNascimento, key: 'dataNascimento', onChangeText: text => setUserData({...userData, dataNascimento: text}) },
    ];

    const fieldsEndereco = [
      { label: 'CEP', placeholder: 'CEP', value: cep, key: 'cep', onChangeText: handleCepChange },
      { label: 'Endereço', placeholder: 'Endereço', value: addressData.endereco, key: 'endereco', onChangeText: text => setAddressData({...addressData, endereco: text}) },
      { label: 'Número', placeholder: 'Número', value: addressData.numero, key: 'numero', onChangeText: text => setAddressData({...addressData, numero: text}) },
      { label: 'Bairro', placeholder: 'Bairro', value: addressData.bairro, key: 'bairro', onChangeText: text => setAddressData({...addressData, bairro: text}) },
      { label: 'Cidade', placeholder: 'Cidade', value: addressData.cidade, key: 'cidade', onChangeText: text => setAddressData({...addressData, cidade: text}) },
      { label: 'UF', placeholder: 'UF', value: addressData.uf, key: 'uf', onChangeText: text => setAddressData({...addressData, uf: text}) },
      { label: 'Complemento', placeholder: 'Complemento', value: addressData.complemento, key: 'complemento', onChangeText: text => setAddressData({...addressData, complemento: text}) },
    ];

    const fieldsFinalizarCadastro = [
      { label: 'Usuário', placeholder: 'Usuário', value: userData.usuario, key: 'usuario', onChangeText: text => setUserData({...userData, usuario: text}) },
      { label: 'Senha', placeholder: 'Senha', secureTextEntry: true, value: userData.senha, key: 'senha', onChangeText: text => setUserData({...userData, senha: text}) },
      { label: 'Confirmar Senha', placeholder: 'Confirmar Senha', secureTextEntry: true, value: userData.confirmacaoSenha, key: 'confirmacaoSenha', onChangeText: text => setUserData({...userData, confirmacaoSenha: text}) },
    ];

    const data = currentTab === 'Seus dados' ? fieldsSeusDados : currentTab === 'Endereço' ? fieldsEndereco : fieldsFinalizarCadastro;

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.label}>{item.label}</Text>
            <TextInput
              style={[styles.input, !item.editable && styles.disabledInput]}
              placeholder={item.placeholder}
              value={item.value}
              secureTextEntry={item.secureTextEntry}
              editable={item.editable !== false}
              onChangeText={item.onChangeText}
            />
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar</Text>
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
          Finalizar cadastro
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
  disabledInput: {
    backgroundColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#004dd3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CadastroUsuario;
