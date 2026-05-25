import { Colors } from "@/constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface InputCustomizadoProps {
  placeholder: string;
  valor: string;
  aoMudarTexto: (texto: string) => void;
  seguro?: boolean; // O sinal de interrogação diz que essa propriedade não é obrigatória
  mostrarSenha?: boolean;
  aoAlternarSenha?: () => void;
}

export function InputCustomizado({
  placeholder,
  valor,
  aoMudarTexto,
  seguro = false,
  mostrarSenha = false,
  aoAlternarSenha,
}: InputCustomizadoProps) {
  return (
    <View style={style.container}>
      <TextInput
        style={[style.input, seguro ? style.inputComIcone : null]}
        placeholder={placeholder}
        value={valor}
        onChangeText={aoMudarTexto}
        secureTextEntry={seguro && !mostrarSenha}
        placeholderTextColor="#888"
      />
      {seguro && aoAlternarSenha ? (
        <TouchableOpacity
          style={style.iconButton}
          onPress={aoAlternarSenha}
          activeOpacity={0.7}
        >
          <FontAwesome
            name={mostrarSenha ? "eye" : "eye-slash"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    marginBottom: 15,
    position: "relative",
  },
  input: {
    backgroundColor: "white",
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.border,
    elevation: 2,
    paddingHorizontal: 15,
  },
  inputComIcone: {
    paddingRight: 45,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    width: 40,
  },
});