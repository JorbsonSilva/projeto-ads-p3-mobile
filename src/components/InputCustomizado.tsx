import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, TextInput } from "react-native";


interface InputCustomizadoProps {
    placeholder: string;
    valor: string;
    aoMudarTexto: (texto: string) => void;
    seguro?: boolean; // O sinal de interrogação diz que essa propriedade não é obrigatória
}

export function InputCustomizado({ placeholder, valor, aoMudarTexto, seguro = false}: InputCustomizadoProps){
    return (
        <TextInput 
            style={style.input}
            placeholder= {placeholder} // Texto que desaparece quando vai escrever.
            value= {valor} // Lê o que está na memória
            onChangeText={aoMudarTexto} // Atualiza a memória a cada letra digitada
            secureTextEntry={seguro}
            placeholderTextColor="#888"
        />
    );
}

const style = StyleSheet.create({
    input: {
      backgroundColor: 'white',
      height: 50,
      borderWidth: 1, // Definir a espessura da borda ao redor de um componente.
      borderRadius: 15,
      borderColor: Colors.border, // Definir a cor da borda de um componente.
      elevation: 2,
      paddingHorizontal: 15,
      marginBottom: 15
      
    }
})