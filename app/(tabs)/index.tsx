import { Colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    // SafeAreaView: Garante que o conteúdo comece abaixo do relógio/bateria.
    <SafeAreaView style={estilos.recipientePrincipal}>
      
      <View style={estilos.conteudo}>
        <Text style={estilos.textoTitulo}>Home</Text>
        <Text>Tela em Contrução!</Text>
      </View>

    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  recipientePrincipal: {
    flex: 1,
    backgroundColor: Colors.background, // Mantém o fundo padrão do app
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 20, // Dá um respiro nas laterais
    paddingTop: 10,
  },
  textoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  }
});