import { BotaoCustomizado } from "@/src/components/BotaoCustomizado";
import { InputCustomizado } from "@/src/components/InputCustomizado";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../config/api";
import { Colors } from "../constants/colors";

// 🟢 IMPORTAÇÃO DO CONTEXTO
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const roteador = useRouter();

  // 🟢 PUXANDO A FUNÇÃO GLOBAL DE LOGIN
  const { loginGlobal } = useAuth() as any;

  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [perfil, definirPerfil] = useState("Aluno");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modalErroVisivel, setModalErroVisivel] = useState(false);
  const [modalErroTexto, setModalErroTexto] = useState("");
  const [emailErro, setEmailErro] = useState("");
  const [senhaErro, setSenhaErro] = useState("");

  const executarLogin = async () => {
    const emailValido = !!email.trim();
    const senhaValida = !!senha.trim();

    if (!emailValido || !senhaValida) {
      setEmailErro(emailValido ? "" : "Por favor, insira seu e-mail.");
      setSenhaErro(senhaValida ? "" : "Por favor, insira sua senha.");
      return;
    }

    setEmailErro("");
    setSenhaErro("");

    const credenciais = { email, senha };

    try {
      const resposta = await fetch(`${API_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credenciais),
      });

      if (resposta.ok) {
        const dadosDoUsuario = await resposta.json();

        // 🟢 A MÁGICA ACONTECE AQUI:
        // Em vez de usar o AsyncStorage solto, chamamos o Contexto.
        // Ele salva no disco E na memória RAM ao mesmo tempo!
        if (loginGlobal) {
          await loginGlobal(dadosDoUsuario.id.toString(), perfil);
        }

        roteador.replace("/(tabs)");
      } else {
        let bodyError = "";
        try {
          const json = await resposta.json();
          bodyError = json?.message || json?.error || "";
        } catch {
          bodyError = await resposta.text();
        }
        setModalErroTexto(bodyError || "E-mail ou senha incorretos.");
        setModalErroVisivel(true);
      }
    } catch (error) {
      Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor.");
      console.error("Erro no login: ", error);
    }
  };

  return (
    <SafeAreaView style={estilos.recipientePrincipal}>
      <View style={estilos.areaCentral}>
        <View style={estilos.cartao}>
          <View style={estilos.cabecalhoCartao}>
            <Text style={estilos.textoBemVindo}>Bem-vindo!</Text>
            <Text style={estilos.subtitulo}>Acesse sua conta</Text>
          </View>

          <View style={estilos.formulario}>
            <Text style={estilos.rotuloEntrada}>Como você deseja entrar?</Text>

            <View style={estilos.recipienteAlternador}>
              <TouchableOpacity
                style={[
                  estilos.botaoAlternador,
                  perfil === "Aluno"
                    ? estilos.botaoAlternadorAtivo
                    : estilos.botaoAlternadorInativo,
                ]}
                onPress={() => definirPerfil("Aluno")}
              >
                <Text
                  style={[
                    estilos.textoAlternador,
                    perfil === "Aluno"
                      ? estilos.textoAlternadorAtivo
                      : estilos.textoAlternadorInativo,
                  ]}
                >
                  Aluno
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  estilos.botaoAlternador,
                  perfil === "Professor"
                    ? estilos.botaoAlternadorAtivo
                    : estilos.botaoAlternadorInativo,
                ]}
                onPress={() => definirPerfil("Professor")}
              >
                <Text
                  style={[
                    estilos.textoAlternador,
                    perfil === "Professor"
                      ? estilos.textoAlternadorAtivo
                      : estilos.textoAlternadorInativo,
                  ]}
                >
                  Professor
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={estilos.rotuloEntrada}>Email</Text>
            <InputCustomizado
              placeholder="Digite seu email"
              valor={email}
              aoMudarTexto={(texto) => {
                definirEmail(texto);
                if (texto.trim()) setEmailErro("");
              }}
            />
            {emailErro ? (
              <Text style={estilos.textoErro}>{emailErro}</Text>
            ) : null}

            <Text style={estilos.rotuloEntrada}>Senha</Text>
            <InputCustomizado
              placeholder="Digite sua senha"
              valor={senha}
              aoMudarTexto={(texto) => {
                definirSenha(texto);
                if (texto.trim()) setSenhaErro("");
              }}
              seguro={true}
              mostrarSenha={mostrarSenha}
              aoAlternarSenha={() => setMostrarSenha((anterior) => !anterior)}
            />
            {senhaErro ? (
              <Text style={estilos.textoErro}>{senhaErro}</Text>
            ) : null}

            <BotaoCustomizado text="Entrar" aoClicar={executarLogin} />
          </View>
        </View>
      </View>

      <View style={estilos.rodape}>
        <View style={estilos.recipienteDivisor}>
          <View style={estilos.linhaDivisora} />
          <View style={estilos.textoOu}>
            <Text>ou</Text>
          </View>
          <View style={estilos.linhaDivisora} />
        </View>

        <View style={estilos.recipienteSocial}>
          <TouchableOpacity style={estilos.iconeSocial}>
            <FontAwesome name="google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={estilos.iconeSocial}>
            <FontAwesome name="facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
        </View>

        <View style={estilos.recipienteLinkCadastro}>
          <Text style={estilos.textoFixoRodape}>Não tem conta? </Text>
          <Text
            onPress={() => roteador.push("/cadastro")}
            style={estilos.linkCadastro}
          >
            Cadastre-se.
          </Text>
        </View>
      </View>

      <Modal transparent visible={modalErroVisivel} animationType="fade">
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalCard}>
            <Text style={estilos.modalTitulo}>Erro</Text>
            <Text style={estilos.modalTexto}>{modalErroTexto}</Text>
            <TouchableOpacity
              style={estilos.modalBotao}
              onPress={() => setModalErroVisivel(false)}
            >
              <Text style={estilos.modalBotaoTexto}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ... (Mantenha o bloco de estilos exatamente como já estava no seu código original)
const estilos = StyleSheet.create({
  areaCentral: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  botaoAlternador: {
    alignItems: "center",
    borderRadius: 15,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 10,
  },
  botaoAlternadorAtivo: { backgroundColor: Colors.secondary, elevation: 3 },
  botaoAlternadorInativo: { backgroundColor: "#F0F0F0" },
  cabecalhoCartao: {
    backgroundColor: Colors.primary,
    paddingBottom: 50,
    paddingHorizontal: 30,
    paddingTop: 30,
    width: "100%",
  },
  cartao: {
    backgroundColor: Colors.card,
    borderRadius: 30,
    elevation: 5,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "90%",
  },
  formulario: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    padding: 30,
  },
  iconeSocial: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  linhaDivisora: { backgroundColor: "#CCCCCC", flex: 1, height: 1 },
  linkCadastro: { color: Colors.secondary, fontWeight: "bold" },
  recipienteAlternador: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  recipienteDivisor: {
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  recipienteLinkCadastro: { alignItems: "center", flexDirection: "row" },
  recipientePrincipal: { backgroundColor: Colors.background, flex: 1 },
  recipienteSocial: { flexDirection: "row", gap: 20 },
  rodape: {
    alignItems: "center",
    gap: 20,
    marginTop: -20,
    paddingBottom: 40,
    width: "100%",
  },
  rotuloEntrada: { color: Colors.text, fontWeight: "600", marginBottom: 5 },
  subtitulo: { color: "white", fontSize: 14 },
  textoAlternador: { fontSize: 16, fontWeight: "bold" },
  textoAlternadorAtivo: { color: "white" },
  textoAlternadorInativo: { color: "#888888" },
  textoBemVindo: { color: "white", fontSize: 28, fontWeight: "bold" },
  textoFixoRodape: { color: Colors.text },
  textoOu: { marginHorizontal: 15 },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    flex: 1,
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    elevation: 8,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: "80%",
  },
  modalTitulo: {
    color: Colors.secondary,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalTexto: {
    color: Colors.text,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  modalBotao: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalBotaoTexto: { color: "white", fontWeight: "bold" },
  textoErro: { color: "#CC4444", fontSize: 13, marginTop: 4, marginBottom: 10 },
});
