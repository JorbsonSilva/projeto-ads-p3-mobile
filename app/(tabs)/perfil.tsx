import { API_URL } from "@/config/api";
import { Colors } from "@/constants/colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilPeca1() {
  const roteador = useRouter();
  const URL_BACKEND = `${API_URL}`;

  // ==========================================
  // 1. ESTADOS DO COMPONENTE
  // ==========================================
  const [carregando, setCarregando] = useState(true);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  // 🟢 ESTADO DO CHAVEADOR (Aluno ou Professor)
  const [perfilAtivo, setPerfilAtivo] = useState("Aluno");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [cpf, setCpf] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarConfirmLogout, setMostrarConfirmLogout] = useState(false);

  const [expandirInfo, setExpandirInfo] = useState(false);
  const [expandirSeguranca, setExpandirSeguranca] = useState(false);

  // ==========================================
  // ESTADOS DA PEÇA 2 (Área do Aluno)
  // ==========================================
  const [bioAluno, setBioAluno] = useState("");
  const [buscaSaber, setBuscaSaber] = useState("");
  const [catalogoSaberesBD, setCatalogoSaberesBD] = useState<any[]>([]); // Matérias vindas do banco
  const [interesses, setInteresses] = useState<any[]>([]); // Matérias que o aluno selecionou

  // ==========================================
  // ESTADOS DA PEÇA 3 (Área do Professor)
  // ==========================================
  const [bioProfessor, setBioProfessor] = useState("");
  const [aptidoes, setAptidoes] = useState<any[]>([]); // Lista de aptidões salvas

  // Controles do Formulário de nova aptidão
  const [buscaSaberProf, setBuscaSaberProf] = useState("");
  const [saberProfSelecionado, setSaberProfSelecionado] = useState<any>(null);
  const [nivelProf, setNivelProf] = useState("Iniciante");
  const [precoProf, setPrecoProf] = useState("");

  // ==========================================
  // 2. CICLO DE VIDA (Busca e Inicialização)
  // ==========================================
  useEffect(() => {
    const inicializarPerfil = async () => {
      try {
        const idSalvo = await AsyncStorage.getItem("@orienta_usuario_id");
        const perfilSalvo = await AsyncStorage.getItem("@orienta_perfil"); // 🟢 Lendo o perfil do Login

        if (!idSalvo) return roteador.replace("/login");

        setUsuarioId(idSalvo);

        // 🟢 Respeita a pre-seleção do Login
        if (perfilSalvo) setPerfilAtivo(perfilSalvo);

        const resposta = await fetch(`${URL_BACKEND}/api/usuarios/${idSalvo}`);
        if (resposta.ok) {
          const dadosUsuario = await resposta.json();
          setNome(dadosUsuario.nome || "");
          setEmail(dadosUsuario.email || "");
          setNascimento(dadosUsuario.dataNascimento || "");
          setCpf(dadosUsuario.cpf || "");
          // 🟢 Puxa os dados específicos do Aluno (se já existirem no banco)
          setBioAluno(dadosUsuario.bioAluno || "");
          setInteresses(dadosUsuario.interesses || []);
          // 🟢 Puxa os dados específicos do Professor
          setBioProfessor(dadosUsuario.bioProfessor || "");
          setAptidoes(dadosUsuario.aptidoes || []);
        } // <-- Aqui é a chave fechando o if (resposta.ok) original
        // 🟢 Busca o catálogo de disciplinas cadastradas no banco (tb_saberes)
        const respostaSaberes = await fetch(`${URL_BACKEND}/api/saberes`);
        if (respostaSaberes.ok) {
          const dadosSaberes = await respostaSaberes.json();
          setCatalogoSaberesBD(dadosSaberes);
        }
      } catch (error) {
        console.error("Erro ao inicializar:", error);
      } finally {
        setCarregando(false);
      }
    };
    inicializarPerfil();
  }, []);

  // ==========================================
  // 3. REGRAS DE NEGÓCIO
  // ==========================================
  const alternarPerfil = async (novoPerfil: string) => {
    setPerfilAtivo(novoPerfil);
    // Opcional: Salva a preferência atual para a próxima vez que ele abrir
    await AsyncStorage.setItem("@orienta_perfil", novoPerfil);
  };

  

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["@orienta_perfil", "@orienta_usuario_id"]);
    } catch (error) {
      console.error("Erro ao limpar storage:", error);
    } finally {
      roteador.replace("/login");
    }
  };

  const deslogarSistema = () => {
    setMostrarConfirmLogout(true);
  };

  const confirmarLogout = async () => {
    setMostrarConfirmLogout(false);
    await handleLogout();
  };

  const cancelarLogout = () => {
    setMostrarConfirmLogout(false);
  };

  const atualizarDadosPessoais = async () => {
    if (!nome)
      return Alert.alert(
        "Erro",
        "O campo Nome Completo não pode ficar em branco.",
      );
    try {
      const resposta = await fetch(`${URL_BACKEND}/api/usuarios/${usuarioId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, dataNascimento: nascimento, cpf }),
      });
      if (resposta.ok) {
        Alert.alert("Sucesso", "Dados atualizados!");
        setExpandirInfo(false);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha de conexão.");
    }
  };

  const processarTrocaSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha)
      return Alert.alert("Atenção", "Preencha tudo.");
    try {
      const resposta = await fetch(
        `${URL_BACKEND}/api/usuarios/${usuarioId}/senha`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senhaAtual, novaSenha }),
        },
      );
      if (resposta.ok) {
        Alert.alert("Sucesso", "Senha alterada.");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
        setExpandirSeguranca(false);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na troca.");
    }
  };

  // ==========================================
  // LÓGICA DA PEÇA 2: INTERESSES (ALUNO)
  // ==========================================
  const saberesFiltrados =
    buscaSaber.length > 0
      ? catalogoSaberesBD.filter((saber) =>
          saber.nome.toLowerCase().includes(buscaSaber.toLowerCase()),
        )
      : [];

  const adicionarInteresse = (saberSelecionado: any) => {
    // Valida se a matéria já está na lista (tratando o formato do Java)
    if (
      interesses.some(
        (item) =>
          item.saber?.id === saberSelecionado.id ||
          item.id === saberSelecionado.id,
      )
    ) {
      return Alert.alert("Aviso", "Você já adicionou esta matéria.");
    }
    setInteresses([...interesses, { saber: saberSelecionado }]);
    setBuscaSaber(""); // Limpa a barra
  };

  const removerInteresse = (saberIdParaRemover: number) => {
    setInteresses(
      interesses.filter(
        (item) =>
          item.saber?.id !== saberIdParaRemover &&
          item.id !== saberIdParaRemover,
      ),
    );
  };

  const salvarPerfilAluno = async () => {
    try {
      const resposta = await fetch(
        `${URL_BACKEND}/api/usuarios/${usuarioId}/aluno`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bio: bioAluno,
            // Extraímos apenas os IDs para mandar para o Java depois
            interessesIds: interesses.map((item) => item.saber?.id || item.id),
          }),
        },
      );

      if (resposta.ok) {
        Alert.alert("Sucesso", "Seu perfil de Aluno foi salvo com sucesso!");
      } else {
        const erroMsg = await resposta.text();
        Alert.alert(
          "Erro",
          erroMsg || "Falha ao sincronizar o perfil de aluno no servidor.",
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Falha de conexão com o banco de dados.");
    }
  };

  // ==========================================
  // LÓGICA DA PEÇA 3: APTIDÕES (PROFESSOR)
  // ==========================================
  const saberesProfFiltrados =
    buscaSaberProf.length > 0
      ? catalogoSaberesBD.filter((saber) =>
          saber.nome.toLowerCase().includes(buscaSaberProf.toLowerCase()),
        )
      : [];

  const prepararAptidao = (saberSelecionado: any) => {
    // Verifica se já adicionou a matéria antes de abrir o mini-formulário
    if (
      aptidoes.some(
        (item) => (item.saber?.id || item.saberId) === saberSelecionado.id,
      )
    ) {
      return Alert.alert("Aviso", "Você já ensina esta matéria.");
    }
    setSaberProfSelecionado(saberSelecionado);
    setBuscaSaberProf("");
  };

  const confirmarAdicaoAptidao = () => {
    if (!precoProf) return Alert.alert("Aviso", "Defina o valor da hora/aula.");

    const novaApt = {
      saberId: saberProfSelecionado.id,
      nomeExibicao: saberProfSelecionado.nome,
      nivelDominio: nivelProf,
      precoHora: parseFloat(precoProf.replace(",", ".")) || 0,
    };

    setAptidoes([...aptidoes, novaApt]);
    setSaberProfSelecionado(null); // Fecha o mini-formulário
    setPrecoProf("");
    setNivelProf("Iniciante");
  };

  const removerAptidao = (saberIdParaRemover: number) => {
    setAptidoes(
      aptidoes.filter(
        (item) => (item.saber?.id || item.saberId) !== saberIdParaRemover,
      ),
    );
  };

  const salvarPerfilProfessor = async () => {
    try {
      const aptidoesMapeadas = aptidoes.map((apt) => ({
        saberId: apt.saber?.id || apt.saberId,
        nivelDominio: apt.nivelDominio,
        precoHora: apt.precoHora,
      }));

      const resposta = await fetch(
        `${URL_BACKEND}/api/usuarios/${usuarioId}/professor`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bio: bioProfessor,
            aptidoesNova: aptidoesMapeadas,
          }),
        },
      );

      if (resposta.ok) {
        Alert.alert("Sucesso", "Perfil de Professor atualizado com sucesso!");
      } else {
        Alert.alert("Erro", "Falha ao sincronizar o perfil no servidor.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha de conexão com o banco de dados.");
    }
  };

  // ==========================================
  // 4. RENDERIZAÇÃO
  // ==========================================
  if (carregando) {
    return (
      <SafeAreaView
        style={[
          estilos.telaSegura,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.telaSegura}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={estilos.conteudoTela}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilos.cabecalho}>
            <TouchableOpacity onPress={() => roteador.back()}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={estilos.tituloCabecalho}>Meu Perfil</Text>
            <TouchableOpacity
              onPress={deslogarSistema}
              style={estilos.botaoLogout}
            >
              <MaterialIcons name="logout" size={24} color="#E74C3C" />
            </TouchableOpacity>
          </View>

          <View style={estilos.containerAvatar}>
            <View style={estilos.avatarNeumorfico}>
              <Text style={estilos.letraAvatar}>
                {nome ? nome.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
            <Text style={estilos.nomeExibicao}>{nome || "Usuário"}</Text>
          </View>

          {/* ACORDEÃO 1: INFORMAÇÕES PESSOAIS */}
          <View style={estilos.blocoFormulario}>
            <TouchableOpacity
              style={estilos.cabecalhoAcordeao}
              onPress={() => setExpandirInfo(!expandirInfo)}
            >
              <Text style={estilos.tituloSessao}>Informações Pessoais</Text>
              <MaterialIcons
                name={
                  expandirInfo ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                size={28}
                color={Colors.secondary}
              />
            </TouchableOpacity>
            {expandirInfo && (
              <View style={estilos.conteudoAcordeao}>
                <View style={[estilos.inputNeumorfico, estilos.inputBloqueado]}>
                  <TextInput
                    value={email}
                    editable={false}
                    style={estilos.textoInputBloqueado}
                  />
                  <MaterialIcons name="lock" size={18} color="#A6ACAF" />
                </View>
                <View style={estilos.inputNeumorfico}>
                  <TextInput
                    value={nome}
                    onChangeText={setNome}
                    style={estilos.textoInput}
                    placeholder="Nome Completo"
                  />
                </View>
                <View style={estilos.inputNeumorfico}>
                  <TextInput
                    value={cpf}
                    onChangeText={setCpf}
                    keyboardType="numeric"
                    style={estilos.textoInput}
                    placeholder="CPF"
                    maxLength={14}
                  />
                  <FontAwesome5
                    name="id-card"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
                <View style={estilos.inputNeumorfico}>
                  <TextInput
                    value={nascimento}
                    onChangeText={setNascimento}
                    style={estilos.textoInput}
                    placeholder="Nascimento"
                    maxLength={10}
                  />
                  <FontAwesome5
                    name="calendar-alt"
                    size={16}
                    color={Colors.secondary}
                  />
                </View>
                <TouchableOpacity
                  style={estilos.botaoSalvarSeccional}
                  onPress={atualizarDadosPessoais}
                >
                  <Text style={estilos.textoBotaoSeccional}>Salvar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={estilos.divisorVisual} />

          {/* ACORDEÃO 2: SEGURANÇA */}
          <View style={estilos.blocoFormulario}>
            <TouchableOpacity
              style={estilos.cabecalhoAcordeao}
              onPress={() => setExpandirSeguranca(!expandirSeguranca)}
            >
              <Text style={estilos.tituloSessao}>Segurança e Acesso</Text>
              <MaterialIcons
                name={
                  expandirSeguranca
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={28}
                color={Colors.secondary}
              />
            </TouchableOpacity>
            {expandirSeguranca && (
              <View style={estilos.conteudoAcordeao}>
                <View style={estilos.inputNeumorfico}>
                  <TextInput
                    value={senhaAtual}
                    onChangeText={setSenhaAtual}
                    secureTextEntry
                    style={estilos.textoInput}
                    placeholder="Senha Atual"
                  />
                </View>
                <View style={estilos.inputNeumorfico}>
                  <TextInput
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    secureTextEntry
                    style={estilos.textoInput}
                    placeholder="Nova Senha"
                  />
                </View>
                <View style={estilos.inputNeumorfico}>
                  <TextInput
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry
                    style={estilos.textoInput}
                    placeholder="Confirmar"
                  />
                </View>
                <TouchableOpacity
                  style={estilos.botaoMudarSenha}
                  onPress={processarTrocaSenha}
                >
                  <Text style={estilos.textoMudarSenha}>Mudar Senha</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ========================================== */}
          {/* 🟢 NOVO: CHAVEADOR DE PERFIL (ALUNO/PROF)  */}
          {/* ========================================== */}
          <View style={estilos.containerSelector}>
            <TouchableOpacity
              style={[
                estilos.botaoSelector,
                perfilAtivo === "Aluno" && estilos.botaoSelectorAtivo,
              ]}
              onPress={() => alternarPerfil("Aluno")}
            >
              <Text
                style={[
                  estilos.textoSelector,
                  perfilAtivo === "Aluno" && estilos.textoSelectorAtivo,
                ]}
              >
                Config. Aluno
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                estilos.botaoSelector,
                perfilAtivo === "Professor" && estilos.botaoSelectorAtivo,
              ]}
              onPress={() => alternarPerfil("Professor")}
            >
              <Text
                style={[
                  estilos.textoSelector,
                  perfilAtivo === "Professor" && estilos.textoSelectorAtivo,
                ]}
              >
                Config. Professor
              </Text>
            </TouchableOpacity>
          </View>

          {/* ========================================== */}
          {/* RENDERIZAÇÃO CONDICIONAL DAS PEÇAS 2 E 3   */}
          {/* ========================================== */}

          {perfilAtivo === "Aluno" ? (
            <View style={estilos.blocoEspecifico}>
              <Text style={[estilos.tituloSessao, { alignSelf: "flex-start" }]}>
                Sua Apresentação (Bio)
              </Text>

              <View
                style={[
                  estilos.inputNeumorfico,
                  {
                    height: 100,
                    alignItems: "flex-start",
                    paddingVertical: 10,
                    width: "100%",
                  },
                ]}
              >
                <TextInput
                  value={bioAluno}
                  onChangeText={setBioAluno}
                  multiline
                  style={[estilos.textoInput, { textAlignVertical: "top" }]}
                  placeholder="Fale um pouco sobre seus objetivos de estudo..."
                  placeholderTextColor="#A6ACAF"
                />
              </View>

              <Text
                style={[
                  estilos.tituloSessao,
                  { marginTop: 10, alignSelf: "flex-start" },
                ]}
              >
                O que você quer aprender?
              </Text>

              {/* Barra de Pesquisa */}
              <View style={[estilos.inputNeumorfico, { width: "100%" }]}>
                <MaterialIcons
                  name="search"
                  size={20}
                  color={Colors.secondary}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  value={buscaSaber}
                  onChangeText={setBuscaSaber}
                  style={estilos.textoInput}
                  placeholder="Pesquise uma matéria (ex: Java)..."
                  placeholderTextColor="#A6ACAF"
                />
              </View>

              {/* Caixa Suspensa de Resultados */}
              {saberesFiltrados.length > 0 && (
                <View style={estilos.caixaResultados}>
                  {saberesFiltrados.map((saber, i) => (
                    <TouchableOpacity
                      key={i}
                      style={estilos.itemResultado}
                      onPress={() => adicionarInteresse(saber)}
                    >
                      <Text style={estilos.textoResultado}>{saber.nome}</Text>
                      <FontAwesome5
                        name="plus-circle"
                        size={16}
                        color={Colors.secondary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Nuvem de Tags */}
              <View style={estilos.containerTags}>
                {interesses.map((item, i) => (
                  <View key={i} style={estilos.tagInteresse}>
                    <Text style={estilos.textoTag}>
                      {item.saber?.nome || item.nome}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        removerInteresse(item.saber?.id || item.id)
                      }
                      style={{ marginLeft: 8 }}
                    >
                      <FontAwesome5
                        name="times"
                        size={12}
                        color={Colors.card}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Botão de Salvar Específico */}
              <TouchableOpacity
                style={[
                  estilos.botaoSalvarSeccional,
                  { width: "100%", marginTop: 20 },
                ]}
                onPress={salvarPerfilAluno}
              >
                <Text style={estilos.textoBotaoSeccional}>
                  Salvar Perfil de Aluno
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={estilos.blocoEspecifico}>
              <Text style={[estilos.tituloSessao, { alignSelf: "flex-start" }]}>
                Sua Metodologia (Bio)
              </Text>

              <View
                style={[
                  estilos.inputNeumorfico,
                  {
                    height: 100,
                    alignItems: "flex-start",
                    paddingVertical: 10,
                    width: "100%",
                  },
                ]}
              >
                <TextInput
                  value={bioProfessor}
                  onChangeText={setBioProfessor}
                  multiline
                  style={[estilos.textoInput, { textAlignVertical: "top" }]}
                  placeholder="Explique como são suas aulas e sua experiência..."
                  placeholderTextColor="#A6ACAF"
                />
              </View>

              <Text
                style={[
                  estilos.tituloSessao,
                  { marginTop: 10, alignSelf: "flex-start" },
                ]}
              >
                O que você ensina?
              </Text>

              {/* Barra de Pesquisa */}
              <View style={[estilos.inputNeumorfico, { width: "100%" }]}>
                <MaterialIcons
                  name="search"
                  size={20}
                  color={Colors.primary}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  value={buscaSaberProf}
                  onChangeText={setBuscaSaberProf}
                  style={estilos.textoInput}
                  placeholder="Pesquise uma matéria (ex: Python)..."
                  placeholderTextColor="#A6ACAF"
                />
              </View>

              {/* Caixa Suspensa de Resultados */}
              {saberesProfFiltrados.length > 0 && (
                <View style={estilos.caixaResultados}>
                  {saberesProfFiltrados.map((saber, i) => (
                    <TouchableOpacity
                      key={i}
                      style={estilos.itemResultado}
                      onPress={() => prepararAptidao(saber)}
                    >
                      <Text style={estilos.textoResultado}>{saber.nome}</Text>
                      <FontAwesome5
                        name="arrow-right"
                        size={14}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Mini-Formulário de Detalhes da Aula */}
              {saberProfSelecionado && (
                <View style={estilos.miniFormAptidao}>
                  <Text style={estilos.textoDestaqueAptidao}>
                    Configurando: {saberProfSelecionado.nome}
                  </Text>

                  <Text style={estilos.labelAptidao}>Nível de Domínio:</Text>
                  <View style={estilos.botoesNivel}>
                    {["Iniciante", "Intermediário", "Avançado"].map((nivel) => (
                      <TouchableOpacity
                        key={nivel}
                        style={[
                          estilos.botaoNivel,
                          nivelProf === nivel && estilos.botaoNivelAtivo,
                        ]}
                        onPress={() => setNivelProf(nivel)}
                      >
                        <Text
                          style={[
                            estilos.textoNivel,
                            nivelProf === nivel && estilos.textoNivelAtivo,
                          ]}
                        >
                          {nivel}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={estilos.labelAptidao}>
                    Preço da Hora/Aula (R$):
                  </Text>
                  <View
                    style={[
                      estilos.inputNeumorfico,
                      { height: 45, marginBottom: 15 },
                    ]}
                  >
                    <TextInput
                      value={precoProf}
                      onChangeText={setPrecoProf}
                      keyboardType="numeric"
                      style={estilos.textoInput}
                      placeholder="Ex: 50,00"
                    />
                  </View>

                  <TouchableOpacity
                    style={estilos.botaoConfirmarMini}
                    onPress={confirmarAdicaoAptidao}
                  >
                    <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                      Adicionar ao meu catálogo
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Lista Cartões de Aptidões Adicionadas */}
              <View style={{ width: "100%", marginTop: 15 }}>
                {aptidoes.map((item, i) => (
                  <View key={i} style={estilos.cartaoAptidao}>
                    <View>
                      <Text style={estilos.tituloCartaoAptidao}>
                        {item.nomeExibicao || item.saber?.nome}
                      </Text>
                      <Text style={estilos.textoDetalheAptidao}>
                        Nível: {item.nivelDominio} • R$ {item.precoHora}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        removerAptidao(item.saber?.id || item.saberId)
                      }
                    >
                      <FontAwesome5 name="trash" size={16} color="#E74C3C" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  estilos.botaoSalvarSeccional,
                  {
                    width: "100%",
                    marginTop: 20,
                    backgroundColor: Colors.primary,
                  },
                ]}
                onPress={salvarPerfilProfessor}
              >
                <Text style={estilos.textoBotaoSeccional}>
                  Salvar Perfil de Professor
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        <Modal transparent visible={mostrarConfirmLogout} animationType="fade">
          <View style={estilos.modalOverlay}>
            <View style={estilos.modalCard}>
              <Text style={estilos.modalTitulo}>Encerrar sessão?</Text>
              <Text style={estilos.modalTexto}>
                Deseja realmente sair do aplicativo?
              </Text>
              <View style={estilos.modalBotoes}>
                <TouchableOpacity
                  style={[estilos.modalBotao, estilos.modalBotaoCancelar]}
                  onPress={cancelarLogout}
                >
                  <Text style={estilos.modalBotaoTextoCancelar}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[estilos.modalBotao, estilos.modalBotaoConfirmar]}
                  onPress={confirmarLogout}
                >
                  <Text style={estilos.modalBotaoTexto}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  telaSegura: { backgroundColor: Colors.background, flex: 1 },
  conteudoTela: { padding: 20, paddingBottom: 40 },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  tituloCabecalho: { fontSize: 18, fontWeight: "600", color: Colors.text },
  botaoLogout: { padding: 5 },
  containerAvatar: {
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 25,
  },
  avatarNeumorfico: {
    backgroundColor: Colors.card,
    width: 85,
    height: 85,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  letraAvatar: { fontSize: 32, color: Colors.secondary, fontWeight: "bold" },
  nomeExibicao: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 10,
    textAlign: "center",
  },
  blocoFormulario: { width: "100%", marginBottom: 5 },
  cabecalhoAcordeao: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: Colors.card,
    borderRadius: 15,
  },
  conteudoAcordeao: { marginTop: 15 },
  tituloSessao: { fontSize: 16, color: Colors.text, fontWeight: "bold" },
  inputNeumorfico: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
  },
  textoInput: { flex: 1, fontSize: 14, color: Colors.text },
  inputBloqueado: { backgroundColor: Colors.input },
  textoInputBloqueado: { flex: 1, fontSize: 14, color: "#7f8c8d" },
  botaoSalvarSeccional: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  textoBotaoSeccional: { color: Colors.card, fontSize: 14, fontWeight: "bold" },
  divisorVisual: {
    height: 1,
    backgroundColor: Colors.border,
    width: "100%",
    marginVertical: 10,
  },
  botaoMudarSenha: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    borderRadius: 12,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  textoMudarSenha: { color: Colors.primary, fontSize: 14, fontWeight: "bold" },

  // 🟢 Estilos do Chaveador Aluno/Professor
  containerSelector: {
    flexDirection: "row",
    backgroundColor: Colors.input,
    borderRadius: 15,
    padding: 5,
    marginVertical: 20,
    width: "100%",
  },
  botaoSelector: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  botaoSelectorAtivo: {
    backgroundColor: Colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  textoSelector: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7f8c8d",
  },
  textoSelectorAtivo: {
    color: Colors.card,
  },

  // Estilos da área condicional
  blocoEspecifico: {
    padding: 20,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  textoPlaceholder: {
    color: "#A6ACAF",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  caixaResultados: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 5,
    marginTop: -10,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  itemResultado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  textoResultado: { fontSize: 14, color: Colors.text, fontWeight: "500" },
  containerTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 5,
    width: "100%",
  },
  tagInteresse: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  textoTag: { color: Colors.card, fontSize: 13, fontWeight: "bold" },
  // Estilos da Área do Professor
  miniFormAptidao: {
    width: "100%",
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 15,
  },
  textoDestaqueAptidao: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  labelAptidao: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 5,
    fontWeight: "500",
  },
  botoesNivel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  botaoNivel: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 2,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  botaoNivelAtivo: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  textoNivel: { fontSize: 12, color: Colors.text },
  textoNivelAtivo: { color: "#FFF", fontWeight: "bold" },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitulo: {
    color: Colors.secondary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalTexto: {
    color: Colors.text,
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalBotao: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBotaoCancelar: {
    backgroundColor: Colors.border,
  },
  modalBotaoConfirmar: {
    backgroundColor: Colors.secondary,
  },
  modalBotaoTexto: {
    color: "white",
    fontWeight: "bold",
  },
  modalBotaoTextoCancelar: {
    color: Colors.text,
    fontWeight: "bold",
  },
  
  botaoConfirmarMini: {
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cartaoAptidao: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: 8,
  },
  tituloCartaoAptidao: { fontSize: 14, fontWeight: "bold", color: Colors.text },
  textoDetalheAptidao: { fontSize: 12, color: "#7f8c8d", marginTop: 2 },
});
