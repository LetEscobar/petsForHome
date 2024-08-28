import React, { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter(); // Para navegação

  // Função para gerenciar o logout
  const handleLogout = () => {
    Alert.alert(
      'Confirmação de Logout',
      'Tem certeza que deseja sair do app?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim, sair',
          onPress: () => {
            // Aqui você pode implementar a lógica de logout,
            // como limpar o estado de autenticação ou tokens
            router.replace('/login'); // Redireciona para a página de login
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modalNotificacoes" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color="blue"
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="cadastrarPet"
        options={{
          title: 'Cadastrar Pet',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />

      <Tabs.Screen
        name="petsCadastrados"
        options={{
          title: 'Meus Pets',
          tabBarIcon: ({ color }) => <TabBarIcon name="check" color={color} />,
        }}
      />

      <Tabs.Screen
        name="perfilUsuario"
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
          headerRight: () => (
            <Pressable onPress={handleLogout}>
              <FontAwesome
                name="sign-out"
                size={25}
                color="red"
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}
