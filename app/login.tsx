import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      if (userCredential) {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            router.push('/');
          } else {
            Alert.alert('Erro', 'Não foi possível autenticar o usuário.');
          }
        });
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Erro de Login', 'Usuário não encontrado.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Erro de Login', 'Senha incorreta.');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao realizar o login.');
      }
    }
  };

  const handleCreateAccount = () => {
    router.push('/cadastroUsuario');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.title}>Seja Bem-Vindo ao Pets For Home!</Text>

      <TextInput
        placeholder="E-mail"
        style={[styles.input, { marginBottom: 12 }]}
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Senha"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <FontAwesome
            name={showPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="#333"
          />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Fazer login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>ou</Text>

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
    aspectRatio: 1, 
    marginBottom: 20,
    resizeMode: 'contain',
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
    right: 10,
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
