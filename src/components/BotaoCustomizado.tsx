    import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";


    interface BotaoCustomizadoProps {
        text: string;
        aoClicar: () => void;
    }

    export function BotaoCustomizado({ text, aoClicar}: BotaoCustomizadoProps){
        return(
            <TouchableOpacity 
                style = {style.botao}
                onPress = {aoClicar}>
                <Text style = {style.textBotao}>{text}</Text>
            </TouchableOpacity>
        );
    }

    const style = StyleSheet.create({
        botao: {
            backgroundColor: Colors.secondary,
            height: 55, // Definir o tamanho vertical(altura) de um componente, pode ser fixa ou proporcional.
            borderRadius: 30,
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center'
        },
        textBotao: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
        }
    })