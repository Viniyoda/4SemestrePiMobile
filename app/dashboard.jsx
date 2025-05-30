import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem-vindo(a) ao Dashboard!</Text>
      <Text style={styles.emailText}>Você está logado como: {userEmail}</Text>
      <View style={{ marginTop: 20 }}>
        <Button title="Sair" onPress={handleLogout} color="#052338" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#052338',
  },
  emailText: {
    fontSize: 16,
    color: '#333',
  },
});
