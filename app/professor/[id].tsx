import { Feather, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🟢 IMPORTAÇÃO DA API
import { API_URL } from "../../config/api";

export default function ProfessorDetalhes() {
  // Pega o ID passado pela navegação da Home
  const { id } = useLocalSearchParams();

  const [professor, setProfessor] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDetalhesProfessor = async () => {
      try {
        if (!id) return;
        const resposta = await fetch(`${API_URL}/api/usuarios/${id}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setProfessor(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do professor:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDetalhesProfessor();
  }, [id]);

  if (carregando) {
    return (
      <View style={estilos.telaCarregamento}>
        <ActivityIndicator size="large" color="#FF6B1A" />
      </View>
    );
  }

  if (!professor) {
    return (
      <View style={estilos.telaCarregamento}>
        <Text style={estilos.textoErro}>Professor não encontrado.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "#0057B8", fontWeight: "bold" }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Extração inteligente de dados do banco
  const aptidoes = professor.aptidoes || [];
  const materiaPrincipal =
    aptidoes.length > 0 ? aptidoes[0].saber.nome : "Professor Mestre";
  const precoHora = aptidoes.length > 0 ? aptidoes[0].precoHora : 0;
  const precoFormatado = precoHora.toFixed(2).replace(".", ",");
  const notaFormatada = professor.notaMedia
    ? professor.notaMedia.toString().replace(".", ",")
    : "5,0";

  return (
    <View style={estilos.telaGeral}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.conteudoScroll}
      >
        {/* Cabeçalho de Navegação */}
        <View style={estilos.cabecalhoNav}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={32} color="#111" />
          </TouchableOpacity>

          <View style={estilos.iconesAcao}>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="heart-outline" size={28} color="#FF6B1A" />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="share-social-outline" size={28} color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Perfil Principal */}
        <View style={estilos.perfilHeader}>
          <Image
            source={{
              uri: professor.fotoUrl || "https://i.pravatar.cc/300?img=68",
            }}
            style={estilos.fotoPerfil}
          />

          <View style={estilos.infoPerfilGeral}>
            <Text style={estilos.nomeProfessor}>{professor.nome}</Text>
            <Text style={estilos.materiaPrincipal}>{materiaPrincipal}</Text>

            <View style={estilos.linhaAvaliacao}>
              <Text style={estilos.textoAvaliacao}>
                ⭐ {notaFormatada} ({professor.totalAvaliacoes || 0} avaliações)
              </Text>
            </View>

            {/* Simulação de um título acadêmico (pode vir do banco no futuro) */}
            <Text style={estilos.tituloAcademico}>
              🎓 Especialista Verificado
            </Text>
          </View>
        </View>

        {/* Bio do Professor */}
        <View style={estilos.cardSecao}>
          <Text style={estilos.tituloSecao}>Sobre mim</Text>
          <Text style={estilos.textoDescritivo}>
            {professor.bioProfessor ||
              "Este professor ainda não adicionou uma descrição detalhada. Mas não se preocupe, a excelência é garantida!"}
          </Text>
        </View>

        {/* Preço (Adaptado para a realidade atual do banco de dados) */}
        <View style={estilos.cardSecao}>
          <Text style={estilos.tituloSecao}>Valor do Investimento</Text>

          <View style={estilos.containerPrecos}>
            <View style={estilos.cardPrecoUnico}>
              <Ionicons name="time-outline" size={32} color="#FF6B1A" />
              <Text style={estilos.tituloCardPreco}>Hora / Aula</Text>
              <Text style={estilos.valorCardPreco}>R$ {precoFormatado}</Text>
            </View>
          </View>
        </View>

        {/* Matérias (Lidas dinamicamente do banco) */}
        <View style={estilos.cardSecao}>
          <Text style={estilos.tituloSecao}>Matérias que leciono</Text>

          <View style={estilos.containerTags}>
            {aptidoes.length > 0 ? (
              aptidoes.map((apt: any) => (
                <View key={apt.id} style={estilos.tagMateria}>
                  <Text style={estilos.textoTagMateria}>{apt.saber.nome}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#777", fontStyle: "italic" }}>
                Nenhuma matéria cadastrada.
              </Text>
            )}
          </View>
        </View>

        {/* Botão de Agendamento */}
        <TouchableOpacity
          style={estilos.botaoAgendar}
          onPress={() => console.log("Iniciar Fluxo de Agendamento")}
        >
          <Feather name="calendar" size={22} color="#FFF" />
          <Text style={estilos.textoBotaoAgendar}>Solicitar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ==========================================
// ESTILOS
// ==========================================
const estilos = StyleSheet.create({
  telaCarregamento: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  textoErro: { fontSize: 18, color: "#444" },
  telaGeral: { flex: 1, backgroundColor: "#FFF" },
  conteudoScroll: { padding: 20, paddingBottom: 50 },

  cabecalhoNav: {
    marginTop: 45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconesAcao: { flexDirection: "row", gap: 18 },

  perfilHeader: { flexDirection: "row", marginTop: 30, alignItems: "center" },
  fotoPerfil: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#EEE",
  },
  infoPerfilGeral: { flex: 1, marginLeft: 18 },
  nomeProfessor: { fontSize: 24, fontWeight: "bold", color: "#111" },
  materiaPrincipal: { fontSize: 16, color: "#666", marginTop: 4 },
  linhaAvaliacao: { marginTop: 8 },
  textoAvaliacao: { fontSize: 16, fontWeight: "bold", color: "#333" },
  tituloAcademico: { fontSize: 14, color: "#555", marginTop: 8 },

  cardSecao: {
    marginTop: 24,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111",
  },
  textoDescritivo: { fontSize: 15, lineHeight: 24, color: "#444" },

  containerPrecos: { flexDirection: "row", gap: 12 },
  cardPrecoUnico: {
    flex: 1,
    backgroundColor: "#FFF0E7",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  tituloCardPreco: { fontWeight: "bold", marginTop: 10, color: "#333" },
  valorCardPreco: {
    color: "#FF6B1A",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 6,
  },

  containerTags: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tagMateria: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  textoTagMateria: { color: "#333", fontWeight: "500" },

  botaoAgendar: {
    backgroundColor: "#FF6B1A",
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 30,
  },
  textoBotaoAgendar: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
});
