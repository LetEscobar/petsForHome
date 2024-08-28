import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData) {
        const { usuario: storedUsuario, senha: storedSenha } = JSON.parse(userData);
        if (username === storedUsuario && password === storedSenha) {
          // Login bem-sucedido
          router.push('/'); // Redireciona para a tela principal
        } else {
          Alert.alert('Erro de Login', 'Usuário ou senha incorretos.');
        }
      } else {
        Alert.alert('Erro', 'Nenhum usuário encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao realizar o login.');
    }
  };

  const handleCreateAccount = () => {
    router.push('/cadastroUsuario'); // Redireciona para a tela de cadastro
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      {/* Título */}
      <Text style={styles.title}>Bem-vindo ao Pets For Home!</Text>

      {/* Campo de usuário */}
      <TextInput
        placeholder="Usuário"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      {/* Campo de senha */}
      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Esqueci minha senha */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
      </TouchableOpacity>

      {/* Botão de login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Fazer login</Text>
      </TouchableOpacity>

      {/* Divisor com "ou" */}
      <Text style={styles.orText}>ou</Text>

      {/* Botão de criar conta */}
      <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
        <Text style={styles.createAccountText}>Criar uma conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#0066cc',
  },
  loginButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 10,
    fontSize: 16,
    color: '#999',
  },
  createAccountButton: {
    marginTop: 10,
  },
  createAccountText: {
    color: '#0066cc',
    fontSize: 16,
  },
});

export default LoginScreen;
