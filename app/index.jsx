import React, { useState } from "react";
import { 
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Cadastro() {
  const router = useRouter();

  // Estados para capturar os valores dos inputs
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Função para realizar o cadastro
  const onSubmit = async () => {
    const data = { nome, sobrenome, email, senha };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
        console.log("Usuário registrado:", result.user);
        router.push("/login"); // Redireciona para login
      } else {
        Alert.alert("Erro", result.error || "Erro ao realizar cadastro");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
      console.error("Erro na requisição:", error);
    }
  };

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
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Sobrenome"
          value={sobrenome}
          onChangeText={setSobrenome}
        />
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

          <TouchableOpacity style={styles.button} onPress={onSubmit}>
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
