import React, { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter } from 'expo-router';
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
  const router = useRouter();

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
            router.replace('/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#004DD3', 
        tabBarInactiveTintColor: '#484848', 
        tabBarStyle: {
          height: 70, 
          paddingBottom: 10, 
          paddingTop: 10,
        },
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Pressable onPress={handleLogout}>
              <FontAwesome
                name="sign-out"
                size={25}
                color="#484848"
                style={{ marginRight: 15 }}
              />
            </Pressable>
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
        }}
      />
    </Tabs>
  );
}
