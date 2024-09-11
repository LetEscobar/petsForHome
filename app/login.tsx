import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome'; // Importar o ícone

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar ou ocultar a senha
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
      <Text style={styles.title}>Seja Bem-Vindo ao Pets For Home!</Text>

      {/* Campo de usuário */}
      <TextInput
        placeholder="Usuário"
        style={[styles.input, { marginBottom: 12 }]}
        value={username}
        onChangeText={setUsername}
      />

      {/* Campo de senha com ícone de olho dentro */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Senha"
          secureTextEntry={!showPassword} // Alternar visibilidade da senha
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)} // Alterna entre mostrar e ocultar a senha
          style={styles.eyeIcon}
        >
          <FontAwesome
            name={showPassword ? 'eye-slash' : 'eye'} // Ícone muda de acordo com o estado
            size={20}
            color="#333"
          />
        </TouchableOpacity>
      </View>

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
    backgroundColor: '#f9f9f9',
  },
  logo: {
    width: 150,
    height: undefined,
    aspectRatio: 1, // Mantém a proporção da imagem
    marginBottom: 20,
    resizeMode: 'contain', // Redimensiona a imagem para caber no contêiner sem cortar
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    width: '65%',
  },
  input: {
    height: 56,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderColor: '#e4e4e7',
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10, // Alinha o ícone à direita
    padding: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#0066cc',
  },
  loginButton: {
    backgroundColor: '#004dd3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 20,
    width: '100%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 24,
    fontSize: 16,
    color: '#999',
  },
  createAccountButton: {
    borderColor: '#0066cc',
    borderWidth: 2,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  createAccountText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
