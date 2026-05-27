import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { API_URL } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

const diasDaSemanaNome = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
// Horários padrões para simular a disponibilidade
const horariosPadrao = [
  "08:00",
  "09:00",
  "10:00",
  "14:00",
  "15:00",
  "16:00",
  "18:00",
  "19:00",
];

export default function ProfessorDetalhes() {
  const { id } = useLocalSearchParams();
  const { usuarioId } = useAuth();

  const [professor, setProfessor] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  // ESTADOS DO MODAL DE AGENDAMENTO
  const [modalAgendamentoVisivel, setModalAgendamentoVisivel] = useState(false);
  const [diasDisponiveis, setDiasDisponiveis] = useState<Date[]>([]);
  const [dataSelecionadaObj, setDataSelecionadaObj] = useState<Date | null>(
    null,
  );
  const [horaSelecionada, setHoraSelecionada] = useState<string>("");
  const [salvando, setSalvando] = useState(false);

  // 1. CARREGA OS DETALHES DO PROFESSOR
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
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setCarregando(false);
      }
    };
    buscarDetalhesProfessor();
  }, [id]);

  // 2. GERA OS PRÓXIMOS 14 DIAS PARA O CALENDÁRIO
  useEffect(() => {
    const gerarDias = () => {
      const dias = [];
      const hoje = new Date();
      for (let i = 1; i <= 14; i++) {
        const proximoDia = new Date(hoje);
        proximoDia.setDate(hoje.getDate() + i);
        // Pula os domingos (opcional, ajustável na sua regra de negócio)
        if (proximoDia.getDay() !== 0) {
          dias.push(proximoDia);
        }
      }
      setDiasDisponiveis(dias);
    };
    gerarDias();
  }, []);

  // 3. FUNÇÃO QUE ENVIA PARA O BACK-END
  const solicitarAgendamento = async () => {
    if (!dataSelecionadaObj || !horaSelecionada) {
      Alert.alert("Atenção", "Selecione um dia e um horário para agendar.");
      return;
    }

    setSalvando(true);
    try {
      // Formata a data para YYYY-MM-DD para o Java
      const dataFormatada = dataSelecionadaObj.toISOString().split("T")[0];
      const horaFormatada = `${horaSelecionada}:00`;

      const payload = {
        aluno: { id: usuarioId || 1 },
        professor: { id: professor.id },
        data: dataFormatada,
        hora: horaFormatada,
      };

      await axios.post(`${API_URL}/agendamentos`, payload);

      Alert.alert(
        "Solicitação Enviada!",
        "O professor receberá seu pedido e poderá confirmar em breve.",
        [
          {
            text: "Ver minha Agenda",
            onPress: () => {
              setModalAgendamentoVisivel(false);
              router.push("/agenda");
            },
          },
        ],
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Horário Indisponível",
        "Este horário já foi reservado por outro aluno. Escolha outro horário.",
      );
    } finally {
      setSalvando(false);
    }
  };

  // Funções de Interface Segura
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
        {/* Cabeçalho */}
        <View style={estilos.cabecalhoNav}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={32} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Perfil */}
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
          </View>
        </View>

        {/* Bio */}
        <View style={estilos.cardSecao}>
          <Text style={estilos.tituloSecao}>Sobre mim</Text>
          <Text style={estilos.textoDescritivo}>
            {professor.bioProfessor || "Professor sem descrição."}
          </Text>
        </View>

        {/* Preço */}
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

        {/* Botão Agendar */}
        <TouchableOpacity
          style={estilos.botaoAgendar}
          onPress={() => setModalAgendamentoVisivel(true)}
        >
          <Feather name="calendar" size={22} color="#FFF" />
          <Text style={estilos.textoBotaoAgendar}>Solicitar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ===================================== */}
      {/* 🟢 MODAL DE AGENDAMENTO INTERATIVO    */}
      {/* ===================================== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAgendamentoVisivel}
        onRequestClose={() => setModalAgendamentoVisivel(false)}
      >
        <View style={estilos.modalFundo}>
          <View style={estilos.modalCartao}>
            <View style={estilos.modalCabecalho}>
              <Text style={estilos.modalTitulo}>Escolha um horário</Text>
              <TouchableOpacity
                onPress={() => setModalAgendamentoVisivel(false)}
              >
                <Feather name="x" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            {/* 1. SELEÇÃO DE DIA */}
            <Text style={estilos.modalLabel}>Próximos dias disponíveis:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={estilos.scrollDias}
            >
              {diasDisponiveis.map((diaObj, index) => {
                const isSelecionado =
                  dataSelecionadaObj?.getTime() === diaObj.getTime();
                const diaNumero = String(diaObj.getDate()).padStart(2, "0");
                const diaSemana = diasDaSemanaNome[diaObj.getDay()];

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      estilos.cardDia,
                      isSelecionado && estilos.cardDiaSelecionado,
                    ]}
                    onPress={() => {
                      setDataSelecionadaObj(diaObj);
                      setHoraSelecionada(""); // Reseta a hora ao trocar de dia
                    }}
                  >
                    <Text
                      style={[
                        estilos.textoDiaSemana,
                        isSelecionado && estilos.textoBranco,
                      ]}
                    >
                      {diaSemana}
                    </Text>
                    <Text
                      style={[
                        estilos.textoDiaNumero,
                        isSelecionado && estilos.textoBranco,
                      ]}
                    >
                      {diaNumero}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 2. SELEÇÃO DE HORÁRIO (Só aparece se escolher um dia) */}
            {dataSelecionadaObj && (
              <>
                <Text style={estilos.modalLabel}>Horários:</Text>
                <View style={estilos.gridHorarios}>
                  {horariosPadrao.map((hora) => {
                    const isHoraSelecionada = horaSelecionada === hora;
                    return (
                      <TouchableOpacity
                        key={hora}
                        style={[
                          estilos.cardHora,
                          isHoraSelecionada && estilos.cardHoraSelecionada,
                        ]}
                        onPress={() => setHoraSelecionada(hora)}
                      >
                        <Text
                          style={[
                            estilos.textoHora,
                            isHoraSelecionada && estilos.textoBranco,
                          ]}
                        >
                          {hora}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {/* BOTOES DE AÇÃO */}
            <View style={estilos.modalBotoes}>
              <TouchableOpacity
                style={[
                  estilos.modalBotaoSalvar,
                  (!dataSelecionadaObj || !horaSelecionada) && {
                    backgroundColor: "#CCC",
                  },
                ]}
                onPress={solicitarAgendamento}
                disabled={salvando || !dataSelecionadaObj || !horaSelecionada}
              >
                {salvando ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={estilos.modalTextoBotaoSalvar}>
                    Enviar Solicitação
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ==========================================
// ESTILOS ATUALIZADOS
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

  // 🟢 ESTILOS DO NOVO MODAL INTERATIVO
  modalFundo: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalCartao: {
    backgroundColor: "#FFF",
    width: "100%",
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 400,
  },
  modalCabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitulo: { fontSize: 22, fontWeight: "bold", color: "#111" },
  modalLabel: {
    fontSize: 15,
    color: "#555",
    marginBottom: 12,
    fontWeight: "bold",
    marginTop: 10,
  },

  scrollDias: { flexDirection: "row", marginBottom: 15, maxHeight: 85 },
  cardDia: {
    width: 65,
    height: 75,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#FFF",
  },
  cardDiaSelecionado: { backgroundColor: "#FF6B1A", borderColor: "#FF6B1A" },
  textoDiaSemana: { fontSize: 12, color: "#777", marginBottom: 4 },
  textoDiaNumero: { fontSize: 20, fontWeight: "bold", color: "#111" },
  textoBranco: { color: "#FFF" },

  gridHorarios: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  cardHora: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#FFF",
  },
  cardHoraSelecionada: { backgroundColor: "#0057B8", borderColor: "#0057B8" },
  textoHora: { fontSize: 15, fontWeight: "600", color: "#333" },

  modalBotoes: { marginTop: 10 },
  modalBotaoSalvar: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#FF6B1A",
  },
  modalTextoBotaoSalvar: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
