import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

const VerPerfilUsuario = () => {
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

  const renderTabContent = () => {
    const fieldsSeusDados = [
      { label: 'Nome completo', placeholder: 'Nome completo', value: '', editable: true },
      { label: 'CPF', placeholder: 'CPF', value: '', editable: false },
      { label: 'E-mail', placeholder: 'E-mail', value: '', editable: true },
      { label: 'Telefone', placeholder: 'Telefone', value: '', editable: true },
      { label: 'Data de nascimento', placeholder: 'Data de nascimento', value: '', editable: true },
    ];

    const fieldsEndereco = [
      { label: 'CEP', placeholder: 'CEP', value: cep, editable: true, onChangeText: handleCepChange },
      { label: 'Endereço', placeholder: 'Endereço', value: addressData.endereco, editable: true },
      { label: 'Número', placeholder: 'Número', value: addressData.numero, editable: true },
      { label: 'Bairro', placeholder: 'Bairro', value: addressData.bairro, editable: true },
      { label: 'Cidade', placeholder: 'Cidade', value: addressData.cidade, editable: true },
      { label: 'UF', placeholder: 'UF', value: addressData.uf, editable: true },
      { label: 'Complemento', placeholder: 'Complemento', value: addressData.complemento, editable: true },
    ];

    const data = currentTab === 'Seus dados' ? fieldsSeusDados : fieldsEndereco;

    return (
      <FlatList style={styles.background}
        data={data}
        keyExtractor={(item, index) => `${item.label}-${index}`}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.label}>{item.label}</Text>
            <TextInput
              style={[styles.input, !item.editable && styles.disabledInput]}
              placeholder={item.placeholder}
              value={item.value}
              editable={item.editable}
              onChangeText={item.onChangeText}
            />
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity style={styles.saveButton}>
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
      </View>
      {renderTabContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#f9f9f9',
  },
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

export default VerPerfilUsuario;
