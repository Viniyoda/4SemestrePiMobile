import React, { useState } from "react";
import { 
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
    
  const handleCadastro = () => {
    router.push("/")
  }

  return (
    <View style={styles.loginContainer}>
        <Text style={styles.textwhite}>Bem vindo ao dashboard do P.I</Text>
        <Text style={styles.textTitle}>Fazer login</Text>

        <Text style={styles.textwhite}>Ainda não possui uma conta?</Text>
          <TouchableOpacity>
            <Text style={styles.link} onPress={handleCadastro}>Cadastrar</Text>
          </TouchableOpacity>

          <TextInput
          style={styles.inputs}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

          <TouchableOpacity style={styles.button}>
            <Text>Login</Text>
          </TouchableOpacity>
    </View>
  )  
};

const styles = StyleSheet.create({

  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#052338',
    color: '#fff',
    textDecorationColor: '#fff',
  },
  textTitle: {
    marginBottom: '3%',
    color: '#fff',
    fontSize: 50,
  },
  textwhite: {
    color: '#fff',
    fontSize: 17,
  },
  link: {
    marginBottom: '4%',
    color: '#60a5fa',
    textDecorationLine: 'none',
  },
  inputs: {
    borderWidth: 1,
    color: 'black',
    backgroundColor: '#fff',
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 12,
    width: "80%",
  },
  button: {
    color: 'black',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "35%",
    alignItems: "center",
  },
});