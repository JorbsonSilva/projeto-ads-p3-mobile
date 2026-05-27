import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BarraBusca from "../components/BarraBusca";
import CardProfessor from "../components/CardProfessor";
import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function BuscaProfessores() {
  const { usuarioId } = useAuth();

  // Estados de Dados
  const [professoresBanco, setProfessoresBanco] = useState<any[]>([]);
  const [professoresFiltrados, setProfessoresFiltrados] = useState<any[]>([]);
  const [saberes, setSaberes] = useState<string[]>(["Todas"]); // 🟢 Estado para a lista oficial de matérias
  const [carregando, setCarregando] = useState(false);

  // Estados de Filtro
  const [busca, setBusca] = useState("");
  const [filtroMateria, setFiltroMateria] = useState("Todas");
  const [filtroPrecoMax, setFiltroPrecoMax] = useState(150);

  // Estados de Interface
  const [modalMateriaVisivel, setModalMateriaVisivel] = useState(false);
  const [modalPrecoVisivel, setModalPrecoVisivel] = useState(false);

  // 1. BUSCA INICIAL NO BANCO DE DADOS
  useEffect(() => {
    const buscarDadosIniciais = async () => {
      setCarregando(true);
      try {
        // 🟢 Busca as matérias oficiais (Saberes) do Banco
        const resSaberes = await fetch(`${API_URL}/api/saberes`);
        if (resSaberes.ok) {
          const dadosSaberes = await resSaberes.json();
          // Pega só os nomes e junta com a opção "Todas"
          const nomesSaberes = dadosSaberes.map((s: any) => s.nome);
          setSaberes(["Todas", ...nomesSaberes]);
        }

        // Busca os professores
        const resProfs = await fetch(
          `${API_URL}/api/usuarios/professores/destaque/${usuarioId || 1}`,
        );
        if (resProfs.ok) {
          const dadosProfs = await resProfs.json();
          setProfessoresBanco(dadosProfs);
          setProfessoresFiltrados(dadosProfs);
        }
      } catch (e) {
        console.error("Erro ao buscar dados da tela de busca:", e);
      } finally {
        setCarregando(false);
      }
    };
    buscarDadosIniciais();
  }, [usuarioId]);

  // 2. MOTOR DE BUSCA EM TEMPO REAL
  useEffect(() => {
    let resultado = professoresBanco;

    if (busca.trim() !== "") {
      const termo = busca.toLowerCase();
      resultado = resultado.filter((prof) => {
        const nomeProf = prof.nome?.toLowerCase() || "";
        const materiaProf =
          prof.aptidoes?.[0]?.saber?.nome?.toLowerCase() || "";
        return nomeProf.includes(termo) || materiaProf.includes(termo);
      });
    }

    if (filtroMateria !== "Todas") {
      resultado = resultado.filter((prof) => {
        const materiaProf = prof.aptidoes?.[0]?.saber?.nome || "";
        return materiaProf === filtroMateria;
      });
    }

    resultado = resultado.filter((prof) => {
      const precoProf = prof.aptidoes?.[0]?.precoHora || 0;
      return precoProf <= filtroPrecoMax;
    });

    setProfessoresFiltrados(resultado);
  }, [busca, filtroMateria, filtroPrecoMax, professoresBanco]);

  return (
    <View style={estilos.container}>
      {/* Header */}
      <View style={estilos.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#111" />
        </TouchableOpacity>
        <Text style={estilos.tituloPagina}>Buscar professores</Text>
      </View>

      {/* Barra de Busca Live */}
      <View style={{ paddingHorizontal: 20 }}>
        <BarraBusca
          valor={busca}
          aoMudarTexto={setBusca}
          placeholder="Buscar por matéria ou professor..."
          exibirFiltro={false}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Chips de Busca Rápida */}
        <Text style={estilos.labelSecao}>Buscas populares</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={estilos.scrollChips}
        >
          {["Matemática", "Programação", "Física", "Biologia"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[estilos.chip, busca === item && estilos.chipAtivo]}
              onPress={() => setBusca(item === busca ? "" : item)}
            >
              <Text
                style={[
                  estilos.textoChip,
                  busca === item && estilos.textoChipAtivo,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Botões de Filtros Avançados */}
        <Text style={estilos.labelSecao}>Filtros</Text>
        <View style={estilos.containerFiltros}>
          <TouchableOpacity
            style={estilos.botaoFiltroLargo}
            onPress={() => setModalMateriaVisivel(true)}
          >
            <Feather name="book" size={20} color="#555" />
            <Text style={estilos.textoFiltroBotao}>
              {filtroMateria === "Todas" ? "Todas as matérias" : filtroMateria}
            </Text>
            <Feather name="chevron-down" size={18} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoFiltroLargo}
            onPress={() => setModalPrecoVisivel(true)}
          >
            <Feather name="dollar-sign" size={20} color="#555" />
            <Text style={estilos.textoFiltroBotao}>
              Até R$ {filtroPrecoMax.toFixed(2).replace(".", ",")}
            </Text>
            <Feather name="chevron-down" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Contador */}
        <View style={estilos.linhaInfo}>
          <Text style={estilos.textoResultados}>
            {carregando
              ? "Buscando..."
              : `${professoresFiltrados.length} professores encontrados`}
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text style={{ color: "#0057B8", fontWeight: "600" }}>
              Mais relevantes{" "}
            </Text>
            <Feather name="chevron-down" size={14} color="#0057B8" />
          </TouchableOpacity>
        </View>

        {/* Renderização dos Cartões */}
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          {carregando ? (
            <ActivityIndicator
              size="large"
              color="#FF6B1A"
              style={{ marginTop: 40 }}
            />
          ) : (
            professoresFiltrados.map((prof) => (
              <CardProfessor
                key={prof.id}
                nome={prof.nome}
                materia={prof.aptidoes?.[0]?.saber?.nome || "Geral"}
                nota={prof.notaMedia || 5.0}
                avaliacoes={prof.totalAvaliacoes || 0}
                precoHora={prof.aptidoes?.[0]?.precoHora || 0}
                fotoUrl={
                  prof.fotoUrl || "https://i.pravatar.cc/150?u=" + prof.id
                }
                onPress={() => router.push(`/professor/${prof.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* ===================================== */}
      {/* MODAIS DE FILTRO */}
      {/* ===================================== */}

      {/* Modal Matéria 🟢 AGORA USANDO A LISTA OFICIAL DO BANCO */}
      <Modal visible={modalMateriaVisivel} transparent animationType="slide">
        <View style={estilos.fundoModal}>
          <View style={estilos.containerModal}>
            <Text style={estilos.tituloModal}>Filtrar por Matéria</Text>

            {/* Adicionamos um ScrollView para caso tenha muitas matérias no banco */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            >
              {saberes.map((mat) => (
                <TouchableOpacity
                  key={mat}
                  style={estilos.opcaoModal}
                  onPress={() => {
                    setFiltroMateria(mat);
                    setModalMateriaVisivel(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: filtroMateria === mat ? "#FF6B1A" : "#333",
                      fontWeight: filtroMateria === mat ? "bold" : "normal",
                    }}
                  >
                    {mat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={estilos.botaoFecharModal}
              onPress={() => setModalMateriaVisivel(false)}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Preço */}
      <Modal visible={modalPrecoVisivel} transparent animationType="slide">
        <View style={estilos.fundoModal}>
          <View style={estilos.containerModal}>
            <Text style={estilos.tituloModal}>Preço Máximo da Hora</Text>
            {[40, 60, 80, 100, 150].map((preco) => (
              <TouchableOpacity
                key={preco}
                style={estilos.opcaoModal}
                onPress={() => {
                  setFiltroPrecoMax(preco);
                  setModalPrecoVisivel(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: filtroPrecoMax === preco ? "#FF6B1A" : "#333",
                    fontWeight: filtroPrecoMax === preco ? "bold" : "normal",
                  }}
                >
                  Até R$ {preco},00
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={estilos.botaoFecharModal}
              onPress={() => setModalPrecoVisivel(false)}
            >
              <Text style={{ color: "#FFF", fontWeight: "bold" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tituloPagina: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    flex: 1,
    marginLeft: 15,
  },

  labelSecao: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 15,
  },

  scrollChips: { paddingLeft: 20, marginBottom: 5 },
  chip: {
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  chipAtivo: { backgroundColor: "#FFF0E7", borderColor: "#FF6B1A" },
  textoChip: { fontWeight: "600", color: "#444" },
  textoChipAtivo: { color: "#FF6B1A" },

  containerFiltros: { paddingHorizontal: 20, gap: 12 },
  botaoFiltroLargo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    justifyContent: "space-between",
  },
  textoFiltroBotao: { flex: 1, marginLeft: 12, fontSize: 15, color: "#333" },

  linhaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 30,
    alignItems: "center",
  },
  textoResultados: { color: "#888", fontSize: 14 },

  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  containerModal: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 300,
    paddingBottom: 40,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  opcaoModal: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    alignItems: "center",
  },
  botaoFecharModal: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
  },
});
