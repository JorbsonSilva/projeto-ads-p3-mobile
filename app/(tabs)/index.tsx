import { Colors } from '@/constants/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ==========================================
// 1. O CENÁRIO DO ALUNO (Baseado na sua imagem)
// ==========================================
const HomeAluno = () => {
  return (
    <ScrollView style={estilos.tela} showsVerticalScrollIndicator={false}>
      
      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <Text style={estilos.tituloLogo}>Orienta</Text>
      </View>

      {/* Barra de Pesquisa */}
      <View style={estilos.recipientePesquisa}>
        <TextInput 
          style={estilos.inputPesquisa} 
          placeholder="Descubra seu novo saber"
          placeholderTextColor="#A0A0A0"
        />
        <TouchableOpacity style={estilos.botaoPesquisa}>
          <FontAwesome5 name="search" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Categorias */}
      <View style={estilos.recipienteCategorias}>
        {/* Em construção botões de Matemática, Idiomas, etc */}
        <Text style={{color: Colors.text, fontStyle: 'italic'}}>Área das categorias (Em construção...)</Text>
      </View>

      {/* Lista de Professores */}
      <View style={estilos.recipienteLista}>
        <Text style={estilos.tituloSessao}>Professores Próximos</Text>
        
        {/* Exemplo de Cartão de Professor */}
        <View style={estilos.cartaoProfessor}>
          <View style={estilos.fotoPerfilFake} />
          <View style={estilos.infoProfessor}>
            <Text style={estilos.nomeProfessor}>Profª. Ana Souza</Text>
            <Text style={estilos.materiaProfessor}>Matemática & Física</Text>
            <Text style={estilos.avaliacaoProfessor}>⭐ 4.8 | 112 avaliações</Text>
          </View>
          <TouchableOpacity style={estilos.botaoVerPerfil}>
            <Text style={estilos.textoBotaoPerfil}>Ver Perfil</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

// ==========================================
// 2. O CENÁRIO DO PROFESSOR (Para o futuro)
// ==========================================
const HomeProfessor = () => {
  return (
    <View style={[estilos.tela, { justifyContent: 'center', alignItems: 'center' }]}>
      <FontAwesome5 name="chalkboard-teacher" size={50} color={Colors.secondary} />
      <Text style={[estilos.tituloSessao, { marginTop: 20 }]}>Painel do Professor</Text>
      <Text style={{color: Colors.text, textAlign: 'center', marginTop: 10}}>
        Aqui aparecerão os seus alunos agendados e os seus ganhos.
      </Text>
    </View>
  );
};

// ==========================================
// A tela principal que decide o que mostrar)
// ==========================================
export default function Index() {
  const [perfilAtivo, setPerfilAtivo] = useState<string | null>(null);

  useEffect(() => {
    // Quando a tela abre, ela vai no AsyncStorage ler o que foi salvo no Login
    const carregarPerfil = async () => {
      try {
        const perfilSalvo = await AsyncStorage.getItem('@orienta_perfil');
        if (perfilSalvo) {
          setPerfilAtivo(perfilSalvo); // Pode ser 'Aluno' ou 'Professor'
        } else {
          setPerfilAtivo('Aluno'); // Prevenção de erro: se não achar nada, vira Aluno por padrão
        }
      } catch (error) {
        console.error("Erro ao ler o perfil: ", error);
        setPerfilAtivo('Aluno');
      }
    };

    carregarPerfil();
  }, []);

  // Enquanto está indo no "cofre" buscar a informação, mostra uma bolinha girando
  if (perfilAtivo === null) {
    return (
      <SafeAreaView style={[estilos.telaSegura, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.telaSegura}>
      {/* A Mágica da Renderização Condicional! */}
      {perfilAtivo === 'Aluno' ? <HomeAluno /> : <HomeProfessor />}
    </SafeAreaView>
  );
}

// ==========================================
// DICIONÁRIO DE ESTILOS
// ==========================================
const estilos = StyleSheet.create({
  avaliacaoProfessor: { 
    color: '#888',
    fontSize: 12, 
    marginTop: 5 
  },
  botaoPesquisa: { 
    alignItems: 'center', 
    backgroundColor: Colors.secondary, 
    borderRadius: 20, 
    height: 40, 
    justifyContent: 'center', 
    width: 40 
  },
  botaoVerPerfil: { 
    backgroundColor: Colors.secondary, 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    paddingVertical: 8 
  },
  cabecalho: { 
    marginBottom: 20, 
    marginTop: 10 
  },
  cartaoProfessor: { 
    alignItems: 'center', 
    backgroundColor: Colors.card, 
    borderRadius: 20, 
    elevation: 3, 
    flexDirection: 'row', 
    marginBottom: 15, 
    padding: 15, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5 
  },
  fotoPerfilFake: { 
    backgroundColor: '#E0E0E0', 
    borderRadius: 25, 
    height: 50, 
    marginRight: 15, 
    width: 50 
  },
  infoProfessor: { 
    flex: 1 
  },
  inputPesquisa: { 
    color: Colors.text, 
    flex: 1, 
    fontSize: 16, 
    marginRight: 10 
  },
  materiaProfessor: { 
    color: '#666', 
    fontSize: 13 
  },
  nomeProfessor: { 
    color: Colors.text, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  recipienteCategorias: { 
    marginBottom: 30, 
    marginTop: 10 
  },
  recipienteLista: { 
    paddingBottom: 20 
  },
  recipientePesquisa: { 
    alignItems: 'center', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 25, 
    flexDirection: 'row', 
    paddingHorizontal: 15, 
    paddingVertical: 5 
  },
  tela: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  telaSegura: { 
    backgroundColor: Colors.background, 
    flex: 1 
  },
  textoBotaoPerfil: { 
    color: 'white', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  tituloLogo: { 
    color: Colors.primary, 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  tituloSessao: { 
    color: Colors.text, 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
});