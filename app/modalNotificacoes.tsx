import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLayoutEffect, useState } from 'react';
import { useNavigation } from 'expo-router';

// Dados fictícios de notificação
const notifications = [
  { id: 1, person: 'João Silva', petName: 'Rex' },
  { id: 2, person: 'Maria Souza', petName: 'Luna' },
  { id: 3, person: 'Carlos Oliveira', petName: 'Bobby' },
  { id: 4, person: 'Ana Lima', petName: 'Mia' },
];

export default function ModalNotificacoes() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    // Define o título do modal
    navigation.setOptions({
      title: 'Notificações',
    });
  }, [navigation]);

  const handleNotificationPress = (petName) => {
    // Redireciona para a tela de informações do pet
    navigation.navigate('PetInfoScreen', { petName });
  };

  return (
    <View style={styles.container}>

      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={styles.notificationCard}
          onPress={() => handleNotificationPress(notification.petName)}
        >
          <Text style={styles.notificationText}>
            {`${notification.person} está interessado em adotar ${notification.petName}!`}
          </Text>
        </TouchableOpacity>
      ))}

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  notificationCard: {
    width: '100%',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  notificationText: {
    fontSize: 16,
    color: '#000',
  },
});
