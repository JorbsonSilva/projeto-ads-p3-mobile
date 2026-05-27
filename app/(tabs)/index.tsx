import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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
import BannerCallToAction from "../../components/BannerCallToAction";
import BarraBusca from "../../components/BarraBusca";
import CabecalhoBoasVindas from "../../components/CabecalhoBoasVindas";
import CardProfessor from "../../components/CardProfessor"; // 🟢 NOVO COMPONENTE IMPORTADO
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
  const { usuarioId } = useAuth(); // 🟢 Puxa o ID do aluno logado
  const [categorias, setCategorias] = useState<any[]>([]);
  const [professoresDestaque, setProfessoresDestaque] = useState<any[]>([]);
  const [textoBusca, setTextoBusca] = useState("");

  useEffect(() => {
    const buscarDadosAluno = async () => {
      try {
        // 1. Busca Categorias
        const resSaberes = await fetch(`${API_URL}/api/saberes`);
        if (resSaberes.ok) {
          const dadosSaberes = await resSaberes.json();
          setCategorias(dadosSaberes);
        }

        // 2. 🟢 Busca Professores Dinâmicos
        if (usuarioId) {
          const resProfs = await fetch(
            `${API_URL}/api/usuarios/professores/destaque/${usuarioId}`,
          );
          if (resProfs.ok) {
            const dadosProfs = await resProfs.json();
            setProfessoresDestaque(dadosProfs);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do aluno", error);
      }
    };
    buscarDadosAluno();
  }, [usuarioId]);

  return (
    <View style={estilos.telaGeral}>
      <ScrollView
        style={estilos.telaGeral}
        contentContainerStyle={estilos.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho Reutilizável (Aluno) */}
        <CabecalhoBoasVindas
          nome={nome}
          fraseInicio="Encontre o professor ideal e "
          palavraDestaque="avance"
          fraseFim=" nos seus estudos."
          onNotificationPress={() => console.log("Abrir Notificações")}
        />

        {/* Barra de Pesquisa Reutilizável */}
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

        {/* Banner Call to Action (Via Componente) */}
        <BannerCallToAction
          tituloLinha1="Aprenda com quem"
          palavraDestaque="entende do assunto."
          subtitulo="Mentorias personalizadas para te ajudar a chegar mais longe."
          textoBotao="Explorar professores"
          iconeDestaque="school"
          onPress={() => router.push("/professor/1")}
        />

        {/* Lista de Disciplinas */}
        <SectionTitle
          titulo="Disciplinas disponíveis"
          onPressLink={() => console.log("Ver todas as matérias")}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorias.length > 0 ? (
            categorias.map((item) => (
              <TouchableOpacity key={item.id} style={estilos.cardCategoria}>
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

        {/* 🟢 LISTA DE PROFESSORES (AGORA ROLANDO PARA BAIXO NO FEED) */}
        <SectionTitle titulo="Professores em destaque" />

        <View style={{ width: "100%" }}>
          {professoresDestaque.length > 0 ? (
            professoresDestaque.map((prof) => {
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
// 3. TELA DO PROFESSOR (DASHBOARD)
// ==========================================
function HomeProfessor({ nome }: { nome: string }) {
  const [proximasAulas, setProximasAulas] = useState<any[]>([]);

  return (
    <View style={estilos.telaGeral}>
      <ScrollView
        style={estilos.telaGeral}
        contentContainerStyle={estilos.conteudoScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho Reutilizável (Professor) */}
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
              titulo="Aulas realizadas"
              valor="0"
              fundo="#FFF0E7"
            />
            <ResumoProfessor
              icon="users"
              titulo="Alunos atendidos"
              valor="0"
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
              titulo="Horas ministradas"
              valor="0h"
              fundo="#F5EEFF"
            />
          </View>
        </View>

        <Text style={estilos.tituloSecaoRapida}>Acesso rápido</Text>
        <View style={estilos.containerAcessoRapido}>
          <BotaoRapido icon="calendar" texto="Minha Agenda" />
          <BotaoRapido icon="users" texto="Alunos" />
          <BotaoRapido icon="message-square" texto="Mentorias" />
          <BotaoRapido icon="dollar-sign" texto="Ganhos" />
        </View>

        {/* Banner Call to Action (Via Componente) */}
        <BannerCallToAction
          tituloLinha1="Defina suas aulas"
          tituloLinha2="como pagas ou"
          palavraDestaque="gratuitas"
          subtitulo="Você decide o valor do seu conhecimento."
          textoBotao="Gerenciar aulas"
          iconeDestaque="school"
          onPress={() => console.log("Navegar para gerenciamento")}
        />

        <SectionTitle
          titulo="Próximas aulas"
          onPressLink={() => console.log("Ver todas as aulas")}
        />

        <View style={estilos.listaAulasContainer}>
          {proximasAulas.length > 0 ? (
            proximasAulas.map((aula, index) => (
              <AulaProfessor
                key={index}
                nome={aula.aluno.nome}
                materia={aula.materia.nome}
                data={aula.data}
                hora={aula.hora}
                status={aula.status}
                foto="https://i.pravatar.cc/150"
              />
            ))
          ) : (
            <Text style={estilos.textoVazioCentralizado}>
              Não há aulas agendadas.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ==========================================
// 4. COMPONENTES LOCAIS MENORES
// ==========================================
function MiniInfo({ icon, title }: { icon: any; title: string }) {
  return (
    <View style={estilos.miniInfoContainer}>
      <Feather name={icon} size={24} color="#FF6B1A" />
      <Text style={estilos.miniInfoTexto}>{title}</Text>
    </View>
  );
}

function ResumoProfessor({
  icon,
  titulo,
  valor,
  fundo,
}: {
  icon: any;
  titulo: string;
  valor: string;
  fundo: string;
}) {
  return (
    <View style={[estilos.metricaCard, { backgroundColor: fundo }]}>
      <Feather name={icon} size={22} color="#FF6B1A" />
      <Text style={estilos.metricaTitulo}>{titulo}</Text>
      <Text style={estilos.metricaValor}>{valor}</Text>
    </View>
  );
}

function BotaoRapido({ icon, texto }: { icon: any; texto: string }) {
  return (
    <TouchableOpacity style={estilos.botaoRapidoCard}>
      <Feather name={icon} size={24} color="#0057B8" />
      <Text style={estilos.botaoRapidoTexto}>{texto}</Text>
    </TouchableOpacity>
  );
}

function AulaProfessor({
  nome,
  materia,
  data,
  hora,
  status,
  foto,
}: {
  nome: string;
  materia: string;
  data: string;
  hora: string;
  status: string;
  foto: string;
}) {
  const pendente = status === "Pendente";
  return (
    <View style={estilos.aulaListaItem}>
      <Image source={{ uri: foto }} style={estilos.aulaListaFoto} />
      <View style={{ flex: 1 }}>
        <Text style={estilos.aulaListaNome}>{nome}</Text>
        <Text style={estilos.aulaListaMateria}>{materia}</Text>
        <Text style={estilos.aulaListaData}>
          📅 {data} • {hora}
        </Text>
      </View>
      <View
        style={[
          estilos.aulaTagStatus,
          { backgroundColor: pendente ? "#FFF0D9" : "#DDF8E8" },
        ]}
      >
        <Text
          style={[
            estilos.aulaTagTexto,
            { color: pendente ? "#D88400" : "#008A46" },
          ]}
        >
          {status}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color="#999" />
    </View>
  );
}

// ==========================================
// 5. DICIONÁRIO DE ESTILOS LIMPO (STYLESHEET)
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

  // Disciplinas
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

  // Mini Infos Inferiores
  containerMiniInfos: {
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  miniInfoContainer: { width: "24%", alignItems: "center" },
  miniInfoTexto: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 6,
    fontSize: 12,
  },

  // Dashboard Professor
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
  metricaCard: {
    width: "48%",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  metricaTitulo: { fontSize: 12, fontWeight: "bold", marginTop: 10 },
  metricaValor: { fontSize: 26, fontWeight: "bold", marginTop: 6 },

  tituloSecaoRapida: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 14,
  },
  containerAcessoRapido: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoRapidoCard: {
    width: "23%",
    height: 78,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoRapidoTexto: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },

  listaAulasContainer: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#FFF",
  },
  aulaListaItem: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  aulaListaFoto: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  aulaListaNome: { fontWeight: "bold" },
  aulaListaMateria: { color: "#555", fontSize: 12 },
  aulaListaData: { color: "#777", fontSize: 12, marginTop: 4 },
  aulaTagStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  aulaTagTexto: { fontSize: 11 },
});
