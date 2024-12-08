import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, DocumentData, updateDoc } from 'firebase/firestore'; // Importando Firestore

interface UserData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento: string;
  cep: string;
}

const VerPerfilUsuario: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    complemento: '',
    cep: ''
  });

  const [cep, setCep] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(false); // Controle de edição

  // Função para buscar os dados do usuário no Firestore
  const fetchUserData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userRef = doc(db, 'usuarios', user.uid);
      try {
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as DocumentData;
          setUserData({
            nome: data.nome || '',
            cpf: data.cpf || '',
            email: data.email || '',
            telefone: data.telefone || '',
            dataNascimento: data.dataNascimento || '',
            endereco: data.endereco || '',
            numero: data.numero || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            uf: data.uf || '',
            complemento: data.complemento || '',
            cep: data.cep || ''
          });
          setCep(data.cep || '');
        } else {
          Alert.alert('Erro', 'Dados do usuário não encontrados.');
        }
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar os dados do usuário.');
      }
    } else {
      Alert.alert('Erro', 'Usuário não autenticado.');
    }
  };

  // Função para permitir edição dos campos
  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  // Função para salvar os dados alterados
  const saveChanges = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userRef = doc(db, 'usuarios', user.uid);
      try {
        await updateDoc(userRef, {
          telefone: userData.telefone,
          endereco: userData.endereco,
          numero: userData.numero,
          bairro: userData.bairro,
          cidade: userData.cidade,
          uf: userData.uf,
          complemento: userData.complemento,
          cep: userData.cep
        });
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        setIsEditable(false); // Desabilita o modo de edição após salvar
      } catch (error) {
        Alert.alert('Erro', 'Erro ao salvar os dados.');
      }
    }
  };

  const handleCepChange = async (value: string) => {
    setCep(value);

    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          Alert.alert('CEP inválido');
        } else {
          setUserData({
            ...userData,
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

  const renderField = (label: string, value: string, onChangeText: (text: string) => void, editable: boolean) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, editable ? styles.editable : styles.readOnly]}
          placeholder={label}
          value={value}
          onChangeText={onChangeText}
          editable={editable} // Permitir edição
        />
      </View>
    );
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Usuário</Text>
      <FlatList
        data={[
          { label: 'Nome completo', value: userData.nome, editable: false },
          { label: 'CPF', value: userData.cpf, editable: false },
          { label: 'E-mail', value: userData.email, editable: false },
          { label: 'Telefone', value: userData.telefone, editable: isEditable, onChangeText: (text: string) => setUserData({ ...userData, telefone: text }) },
          { label: 'Data de nascimento', value: userData.dataNascimento, editable: false },
          { label: 'CEP', value: cep, editable: isEditable, onChangeText: handleCepChange },
          { label: 'Endereço', value: userData.endereco, editable: isEditable, onChangeText: (text: string) => setUserData({ ...userData, endereco: text }) },
          { label: 'Número', value: userData.numero, editable: isEditable, onChangeText: (text: string) => setUserData({ ...userData, numero: text }) },
          { label: 'Bairro', value: userData.bairro, editable: isEditable, onChangeText: (text: string) => setUserData({ ...userData, bairro: text }) },
          { label: 'Cidade', value: userData.cidade, editable: isEditable, onChangeText: (text: string) => setUserData({ ...userData, cidade: text }) },
          { label: 'UF', value: userData.uf, editable: isEditable, onChangeText: (text: string) => setUserData({ ...userData, uf: text }) },
          { label: 'Complemento', value: userData.complemento, editable: isEditable, onChangeText: (text: string) => setUserData({ ...userData, complemento: text }) }
        ]}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => renderField(item.label, item.value, item.onChangeText, item.editable)}
        ListFooterComponent={() => (
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
        <Text style={styles.editButtonText}>{isEditable ? 'Cancelar edição' : 'Editar dados'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 8,
    fontSize: 14,
  },
  editable: {
    backgroundColor: '#fff',
  },
  readOnly: {
    backgroundColor: '#e0e0e0', // Cor de fundo para campos não editáveis
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    marginBottom: 60,
  },
});

export default VerPerfilUsuario;
