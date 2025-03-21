import React, { useState } from "react";
import { 
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function Cadastro() {
  const router = useRouter();
  const navigate = useNavigation();

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <View style={styles.loginContainer}>
        <Text style={styles.textwhite}>Bem vindo ao dashboard do P.I</Text>
        <Text style={styles.textTitle}>Criar uma conta</Text>

        <Text style={styles.textwhite}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.link} >Login</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.inputs}
            placeholder="Nome" required
          />
            <TextInput
            style={styles.inputs}
            placeholder="Sobrenome" required
            />
            <TextInput
            style={styles.inputs}
            placeholder="Email"
            />
            <TextInput
            style={styles.inputs}
            placeholder="Senha"
            />

            <TouchableOpacity style={styles.button}>
              <Text>Cadastrar</Text>
            </TouchableOpacity>
    </View>
  );
}

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
    color: '#fff',
    fontSize: 30,
  },
  textwhite: {
    color: '#fff',
  },
  link: {
    color: '#60a5fa',
    textDecorationLine: 'none',
  },
  inputs: {
    borderWidth: 1,
    color: '#fff',
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "80%",
  },
  fullWidth: {
    width: '100%',
    marginTop: 10,
  },
  divider: {
    textAlign: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  button: {
    borderWidth: 1,
    color: 'black',
    backgroundColor: '#ccc',
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "40%",
    alignItems: "center",
  },
});
