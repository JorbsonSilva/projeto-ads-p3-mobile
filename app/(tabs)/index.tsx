import BotaoRapido from "@/components/BotaoRapido";
import ResumoProfessor from "@/components/ResumoProfessor";
import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BannerCallToAction from "../../components/BannerCallToAction";
import BarraBusca from "../../components/BarraBusca";
import CabecalhoBoasVindas from "../../components/CabecalhoBoasVindas";
import CardProfessor from "../../components/CardProfessor";
import SectionTitle from "../../components/SectionTitle";
import { API_URL } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

// ==========================================
// 1. COMPONENTE PRINCIPAL (CHAVEADOR)
// ==========================================
export default function Index() {
  const { perfilAtivo, nomeUsuario, carregandoAuth } = useAuth();

  if (carregandoAuth) {
    return (
      <View style={estilos.telaCarregamento}>
        <ActivityIndicator size="large" color="#FF6B1A" />
      </View>
    );
  }

  return perfilAtivo === "Professor" ? (
    <HomeProfessor nome={nomeUsuario} />
  ) : (
    <HomeAluno nome={nomeUsuario} />
  );
}

// ==========================================
// 2. TELA DO ALUNO (INTEGRADA COM BANCO REAL)
// ==========================================
function HomeAluno({ nome }: { nome: string }) {
  const { usuarioId } = useAuth();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [professoresDestaque, setProfessoresDestaque] = useState<any[]>([]);
  const [carregandoProfessores, setCarregandoProfessores] = useState(false);

  const buscarDadosAluno = useCallback(async () => {
    try {
      // 1. Busca Categorias
      const resSaberes = await fetch(`${API_URL}/api/saberes`);
      if (resSaberes.ok) {
        const dadosSaberes = await resSaberes.json();
        setCategorias(dadosSaberes);
      }

      // 2. Busca Professores Dinâmicos
      if (usuarioId) {
        setCarregandoProfessores(true);
        const resProfs = await fetch(
          `${API_URL}/api/usuarios/professores/destaque/${usuarioId}`,
        );
        if (resProfs.ok) {
          const dadosProfs = await resProfs.json();
          setProfessoresDestaque(dadosProfs);
        }
        setCarregandoProfessores(false);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do aluno", error);
      setCarregandoProfessores(false);
    }
  }, [usuarioId]);

  useFocusEffect(
    useCallback(() => {
      buscarDadosAluno();
    }, [buscarDadosAluno]),
  );

  return (
    <View style={estilos.telaGeral}>
      <ScrollView
        style={estilos.telaGeral}
        contentContainerStyle={estilos.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        <CabecalhoBoasVindas
          nome={nome}
          fraseInicio="Encontre o professor ideal e "
          palavraDestaque="avance"
          fraseFim=" nos seus estudos."
          onNotificationPress={() => console.log("Abrir Notificações")}
        />

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => router.push("/busca-professores")}
        >
          <View pointerEvents="none">
            <BarraBusca
              valor=""
              aoMudarTexto={() => {}}
              placeholder="Buscar professores ou matérias..."
              exibirFiltro={false}
            />
          </View>
        </TouchableOpacity>

        <BannerCallToAction
          tituloLinha1="Aprenda com quem"
          palavraDestaque="entende do assunto."
          subtitulo="Mentorias personalizadas para te ajudar a chegar mais longe."
          textoBotao="Explorar professores"
          iconeDestaque="school"
          onPress={() => router.push("/busca-professores")}
        />

        <SectionTitle
          titulo="Disciplinas disponíveis"
          onPressLink={() => router.push("/busca-professores")}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorias.length > 0 ? (
            categorias.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={estilos.cardCategoria}
                onPress={() => router.push("/busca-professores")}
              >
                <Feather name="book-open" size={28} color="#FF6B1A" />
                <Text style={estilos.textoCategoria} numberOfLines={2}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={estilos.textoVazio}>
              Carregando disciplinas do banco...
            </Text>
          )}
        </ScrollView>

        <SectionTitle titulo="Professores em destaque" />

        <View style={{ width: "100%" }}>
          {carregandoProfessores ? (
            <ActivityIndicator
              size="large"
              color="#FF6B1A"
              style={{ marginTop: 24, marginBottom: 16 }}
            />
          ) : professoresDestaque.length > 0 ? (
            professoresDestaque.slice(0, 5).map((prof) => {
              const primeiraMateria =
                prof.aptidoes && prof.aptidoes.length > 0
                  ? prof.aptidoes[0].saber.nome
                  : "Professor";

              const precoHoraDefinido =
                prof.aptidoes && prof.aptidoes.length > 0
                  ? prof.aptidoes[0].precoHora
                  : 0.0;

              return (
                <CardProfessor
                  key={prof.id}
                  nome={prof.nome}
                  materia={primeiraMateria}
                  nota={prof.notaMedia || 5.0}
                  avaliacoes={prof.totalAvaliacoes || 0}
                  precoHora={precoHoraDefinido}
                  fotoUrl={prof.fotoUrl || "https://i.pravatar.cc/150?img=68"}
                  onPress={() => router.push(`/professor/${prof.id}`)}
                  onPressFavorito={() =>
                    console.log("Favoritou o id:", prof.id)
                  }
                />
              );
            })
          ) : (
            <Text style={estilos.textoVazio}>
              Nenhum professor encontrado para seus interesses.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ==========================================
// 3. TELA DO PROFESSOR (DASHBOARD INTEGRADO)
// ==========================================
function HomeProfessor({ nome }: { nome: string }) {
  const { usuarioId } = useAuth();
  const [proximasAulas, setProximasAulas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const buscarAulasProfessor = useCallback(async () => {
    if (!usuarioId) return;
    try {
      const res = await fetch(`${API_URL}/agendamentos/professor/${usuarioId}`);
      if (res.ok) {
        const dados = await res.json();
        setProximasAulas(dados);
      }
    } catch (error) {
      console.error("Erro ao buscar aulas do professor", error);
    } finally {
      setCarregando(false);
    }
  }, [usuarioId]);

  useFocusEffect(
    useCallback(() => {
      buscarAulasProfessor();
    }, [buscarAulasProfessor]),
  );

  const lidarComAceite = async (idAgendamento: number) => {
    try {
      const res = await fetch(
        `${API_URL}/agendamentos/${idAgendamento}/aceitar`,
        { method: "PUT" },
      );
      if (res.ok) {
        alert("Aula confirmada com sucesso!");
        buscarAulasProfessor();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const lidarComRecusa = async (idAgendamento: number) => {
    try {
      const res = await fetch(
        `${API_URL}/agendamentos/${idAgendamento}/cancelar`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ justificativa: "Recusado pelo professor" }),
        },
      );
      if (res.ok) {
        alert("Agendamento recusado.");
        buscarAulasProfessor();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const aulasRealizadas = proximasAulas.filter(
    (a) => a.status === "CONFIRMADO",
  ).length;
  const alunosPendentes = proximasAulas.filter(
    (a) => a.status === "PENDENTE",
  ).length;

  return (
    <View style={estilos.telaGeral}>
      <ScrollView
        style={estilos.telaGeral}
        contentContainerStyle={estilos.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        <CabecalhoBoasVindas
          nome={nome}
          fraseInicio={"Gerencie suas aulas,\ninspire e "}
          palavraDestaque="transforme vidas."
          onNotificationPress={() => console.log("Abrir Notificações")}
        />

        <View style={estilos.cardResumoGeral}>
          <View style={estilos.resumoGeralHeader}>
            <Text style={estilos.resumoGeralTitulo}>Resumo geral</Text>
            <TouchableOpacity style={estilos.botaoFiltroMes}>
              <Text>Este mês ⌄</Text>
            </TouchableOpacity>
          </View>
          <View style={estilos.containerMetricas}>
            <ResumoProfessor
              icon="award"
              titulo="Aulas ativas"
              valor={String(aulasRealizadas)}
              fundo="#FFF0E7"
            />
            <ResumoProfessor
              icon="users"
              titulo="Solicitações"
              valor={String(alunosPendentes)}
              fundo="#EEF5FF"
            />
            <ResumoProfessor
              icon="dollar-sign"
              titulo="Ganhos (R$)"
              valor="0,00"
              fundo="#EFFBF4"
            />
            <ResumoProfessor
              icon="clock"
              titulo="Horas"
              valor="0h"
              fundo="#F5EEFF"
            />
          </View>
        </View>

        <Text style={estilos.tituloSecaoRapida}>Acesso rápido</Text>
        <View style={estilos.containerAcessoRapido}>
          <BotaoRapido
            icon="calendar"
            texto="Minha Agenda"
            onPress={() => router.push("/agenda")}
          />
          <BotaoRapido icon="users" texto="Alunos" />
          <BotaoRapido icon="message-square" texto="Mentorias" />
          <BotaoRapido icon="dollar-sign" texto="Ganhos" />
        </View>

        <BannerCallToAction
          tituloLinha1="Defina suas aulas"
          tituloLinha2="como pagas ou"
          palavraDestaque="gratuitas"
          subtitulo="Você decide o valor do seu conhecimento."
          textoBotao="Gerenciar aulas"
          iconeDestaque="school"
          onPress={() => router.push("/perfil")}
        />

        <SectionTitle
          titulo="Solicitações e Próximas aulas"
          onPressLink={() => router.push("/agenda")}
        />

        <View style={estilos.listaAulasContainer}>
          {carregando ? (
            <ActivityIndicator
              size="small"
              color="#FF6B1A"
              style={{ padding: 20 }}
            />
          ) : proximasAulas.length > 0 ? (
            proximasAulas.map((aula) => (
              <AulaProfessor
                key={aula.id}
                id={aula.id}
                nome={aula.aluno?.nome || "Aluno"}
                materia="Aula particular"
                data={aula.data}
                hora={aula.hora.substring(0, 5)}
                status={aula.status}
                foto={"https://i.pravatar.cc/150?u=" + aula.aluno?.id}
                onAceitar={lidarComAceite}
                onRecusar={lidarComRecusa}
              />
            ))
          ) : (
            <Text style={estilos.textoVazioCentralizado}>
              Não há aulas agendadas ou solicitações.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ==========================================
// 4. SUBCOMPONENTES ESPECÍFICOS
// ==========================================
function AulaProfessor({
  id,
  nome,
  materia,
  data,
  hora,
  status,
  foto,
  onAceitar,
  onRecusar,
}: {
  id: number;
  nome: string;
  materia: string;
  data: string;
  hora: string;
  status: string;
  foto: string;
  onAceitar: (id: number) => void;
  onRecusar: (id: number) => void;
}) {
  const pendente = status === "PENDENTE";
  const confirmado = status === "CONFIRMADO";

  return (
    <View style={estilos.aulaListaItem}>
      <Image source={{ uri: foto }} style={estilos.aulaListaFoto} />

      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={estilos.aulaListaNome}>{nome}</Text>
        <Text style={estilos.aulaListaMateria}>{materia}</Text>
        <Text style={estilos.aulaListaData}>
          📅 {data} • {hora}
        </Text>

        {/* 🟢 REESTRUTURAÇÃO PREMIUM DOS BOTÕES DE AÇÃO */}
        {pendente && (
          <View style={estilos.containerAcoesRacionais}>
            <TouchableOpacity
              style={estilos.botaoAcaoAceitar}
              activeOpacity={0.7}
              onPress={() => onAceitar(id)}
            >
              <Feather
                name="check"
                size={14}
                color="#FFF"
                style={{ marginRight: 4 }}
              />
              <Text style={estilos.textoBotaoAcao}>Aceitar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={estilos.botaoAcaoRecusar}
              activeOpacity={0.7}
              onPress={() => onRecusar(id)}
            >
              <Feather
                name="x"
                size={14}
                color="#FFF"
                style={{ marginRight: 4 }}
              />
              <Text style={estilos.textoBotaoAcao}>Recusar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View
        style={[
          estilos.aulaTagStatus,
          {
            backgroundColor: pendente
              ? "#FFF0D9"
              : confirmado
                ? "#DDF8E8"
                : "#F0F0F0",
          },
        ]}
      >
        <Text
          style={[
            estilos.aulaTagTexto,
            { color: pendente ? "#D88400" : confirmado ? "#008A46" : "#777" },
          ]}
        >
          {status}
        </Text>
      </View>

      {!pendente && <Feather name="chevron-right" size={20} color="#999" />}
    </View>
  );
}

// ==========================================
// 5. DICIONÁRIO DE ESTILOS (STYLESHEET)
// ==========================================
const estilos = StyleSheet.create({
  telaCarregamento: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  telaGeral: { flex: 1, backgroundColor: "#FFF" },
  conteudoScroll: { padding: 20, paddingBottom: 30 },
  textoVazio: { color: "#999", fontStyle: "italic", paddingVertical: 20 },
  textoVazioCentralizado: {
    color: "#999",
    fontStyle: "italic",
    padding: 20,
    textAlign: "center",
  },

  cardCategoria: {
    width: 105,
    height: 100,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 14,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  textoCategoria: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },

  cardResumoGeral: {
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#FFF",
  },
  resumoGeralHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  resumoGeralTitulo: { fontSize: 16, fontWeight: "bold" },
  botaoFiltroMes: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  containerMetricas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  tituloSecaoRapida: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 14,
  },
  containerAcessoRapido: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  listaAulasContainer: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#FFF",
    marginTop: 10,
  },
  aulaListaItem: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  aulaListaFoto: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  aulaListaNome: { fontWeight: "bold", fontSize: 15, color: "#111" },
  aulaListaMateria: { color: "#666", fontSize: 12, marginTop: 2 },
  aulaListaData: { color: "#888", fontSize: 12, marginTop: 4 },
  aulaTagStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  aulaTagTexto: { fontSize: 11, fontWeight: "bold" },

  // Estilos específicos para os novos botões táteis do Professor
  containerAcoesRacionais: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    width: "100%",
  },
  botaoAcaoAceitar: {
    flexDirection: "row",
    backgroundColor: "#008A46",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  botaoAcaoRecusar: {
    flexDirection: "row",
    backgroundColor: "#D93838",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  textoBotaoAcao: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
