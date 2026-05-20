import { API_URL } from "@/config/api";
import { Colors } from "@/constants/colors";
import { BotaoCustomizado } from "@/src/components/BotaoCustomizado";
import { InputCustomizado } from "@/src/components/InputCustomizado";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // View inteligente

export default function Cadastro() {
  const roteador = useRouter();

  // Espaços de memória para os inputs
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [confirmaSenha, definirConfirmaSenha] = useState("");
  const [data, definirData] = useState("");
  const [nome, definirNome] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = useState(false);
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValido = emailRegex.test(email);
  const senhaTemMaiuscula = /[A-Z]/.test(senha);
  const senhaTemMinuscula = /[a-z]/.test(senha);
  const senhaTemEspecial = /[^A-Za-z0-9]/.test(senha);
  const senhaTemTamanhoMinimo = senha.length >= 6;
  const senhaForte =
    senhaTemMaiuscula &&
    senhaTemMinuscula &&
    senhaTemEspecial &&
    senhaTemTamanhoMinimo;
  const senhasCoincidem = senha === confirmaSenha;
  const formatarDataNascimento = (texto: string) => {
    const numeros = texto.replace(/\D/g, "").slice(0, 8);
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
  };
  const [modalErroVisivel, setModalErroVisivel] = useState(false);
  const [modalErroTexto, setModalErroTexto] = useState("");
  const [mensagemErroEmail, setMensagemErroEmail] = useState("");
  

  const validarEEnviar = async () => {
    // Cláusulas de Guarda: Barrando erros antes de chamar o servidor
      setMensagemErroEmail(""); 
    if (!nome || !data || !email || !senha || !confirmaSenha) {
      Alert.alert("Atenção!!!!", "Por favor, preencha todos os campos.");
      return; // Expulsa o código da função
    }
    if (senha !== confirmaSenha) {
      Alert.alert("Erro", "As senhas não coincidem. Tente novamente.");
      return;
    }
    if (!senhaForte) {
      Alert.alert("Senha Fraca", "A senha deve ter pelo menos 6 caracteres, 1 letra maiuscula, 1 letra minuscula e um caractere especial.");
      return;
    }

    // Pacote JSON
    const pacoteJSON = {
      nome: nome,
      email: email,
      senha: senha,
    };

    try {
      //  IMPORTANTE: Troque o SEU_IP_AQUI pelo seu IP da rede Wi-Fi (ex: 192.168.1.10)
      const resposta = await fetch(
        `${API_URL}/api/usuarios/cadastro`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // 🟢 Corrigido o erro de digitação
          },
          body: JSON.stringify(pacoteJSON),
        },
      );

      if (resposta.ok) {
        roteador.push({ pathname: "/verificar-email", params: { email } });
      } else {
        let bodyError = "";
        try {
          const json = await resposta.json();
          if (json?.message) {
            bodyError = json.message;
          } else if (typeof json === "string") {
            bodyError = json;
          }
        } catch {
          bodyError = await resposta.text();
        }

        const errorText = bodyError ||
          "Não foi possível criar a conta. Verifique seu e-mail e outros dados.";

        const lower = errorText.toLowerCase();
        if (
          lower.includes("email já cadastrado") ||
          lower.includes("email ja cadastrado") ||
          lower.includes("email already") ||
          lower.includes("already registered") ||
          lower.includes("email existe")
        ) {
          setMensagemErroEmail("E-mail já cadastrado.");
          setModalErroTexto("E-mail já cadastrado.");
          setModalErroVisivel(true);
        } else {
          setModalErroTexto(errorText);
          setModalErroVisivel(true);
        } 
      }
    } catch (error) {
      setModalErroTexto("Não conseguimos alcançar o servidor. Verifique sua conexão e tente novamente.");
      setModalErroVisivel(true);
    }
  };

  return (
    <SafeAreaView style={estilos.recipientePrincipal}>
      <Text style={estilos.textoTitulo}>Cadastro</Text>

      <View style={estilos.cartao}>
        <Text style={estilos.rotuloEntrada}>Nome Completo</Text>
        <InputCustomizado
          placeholder="Ex: João Ferreira"
          valor={nome}
          aoMudarTexto={definirNome}
        />

        <Text style={estilos.rotuloEntrada}>E-mail</Text>
        <InputCustomizado
          placeholder="exemplo@email.com"
          valor={email}
          aoMudarTexto={definirEmail}
        />
        {email.length > 0 ? (
          <Text
            style={[
              estilos.validacaoTexto,
              emailValido ? estilos.validacaoOk : estilos.validacaoErro,
            ]}
          >
            {emailValido ? "E-mail válido." : "E-mail inválido."}
          </Text>
        ) : null}

        <Text style={estilos.rotuloEntrada}>Data de Nascimento</Text>
        <InputCustomizado
          placeholder="DD/MM/AAAA"
          valor={data}
          aoMudarTexto={(texto) => definirData(formatarDataNascimento(texto))}
        />

        <Text style={estilos.rotuloEntrada}>Senha</Text>
        <InputCustomizado
          placeholder="Defina uma senha forte"
          valor={senha}
          aoMudarTexto={definirSenha}
          seguro={true}
          mostrarSenha={mostrarSenha}
          aoAlternarSenha={() => setMostrarSenha((anterior) => !anterior)}
        />

        {senha.length > 0 ? (
          <>
            <Text
              style={[
                estilos.validacaoTexto,
                senhaTemTamanhoMinimo ? estilos.validacaoOk : estilos.validacaoErro,
              ]}
            >
              Pelo menos 6 caracteres.
            </Text>
            <Text
              style={[
                estilos.validacaoTexto,
                senhaTemMaiuscula ? estilos.validacaoOk : estilos.validacaoErro,
              ]}
            >
              Uma letra maiúscula.
            </Text>
            <Text
              style={[
                estilos.validacaoTexto,
                senhaTemMinuscula ? estilos.validacaoOk : estilos.validacaoErro,
              ]}
            >
              Uma letra minúscula.
            </Text>
            <Text
              style={[
                estilos.validacaoTexto,
                senhaTemEspecial ? estilos.validacaoOk : estilos.validacaoErro,
              ]}
            >
              Um caractere especial.
            </Text>
          </>
        ) : null}

        <Text style={estilos.rotuloEntrada}>Confirmar Senha</Text>
        <InputCustomizado
          placeholder="Repita a senha"
          valor={confirmaSenha}
          aoMudarTexto={definirConfirmaSenha}
          seguro={true}
          mostrarSenha={mostrarConfirmaSenha}
          aoAlternarSenha={() => setMostrarConfirmaSenha((anterior) => !anterior)}
        />

        {senha.length > 0 ? (
          <Text
            style={[
              estilos.validacaoTexto,
              confirmaSenha.length === 0 || senhasCoincidem
                ? estilos.validacaoOk
                : estilos.validacaoErro,
            ]}
          >
            {confirmaSenha.length === 0
              ? "Repita a senha para confirmar."
              : senhasCoincidem
              ? "Senhas iguais."
              : "As senhas não coincidem."}
          </Text>
        ) : null}

        <View style={estilos.recipienteBotao}>
          <View style={{ flex: 1 }}>
            <BotaoCustomizado text="Criar Conta" aoClicar={validarEEnviar} />
          </View>
        </View>

        <View style={estilos.recipienteLinkLogin}>
          <Text style={estilos.textoFixo}>Já é Cadastrado? </Text>
          <Text
            onPress={() => roteador.push("/login")}
            style={estilos.linkLogin}
          >
            Faça Login.
          </Text>
        </View>
      </View>
      <Modal transparent visible={sucessoVisivel} animationType="fade">
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalCard}>
            <Text style={estilos.modalTitulo}>Sucesso!</Text>
            <Text style={estilos.modalTexto}>
              E-mail criado com sucesso. Redirecionando para o login...
            </Text>
          </View>
        </View>
      </Modal>
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

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: Colors.card,
    borderRadius: 30,
    elevation: 5,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "90%",
  },
  linkLogin: {
    color: Colors.secondary,
    fontWeight: "bold",
  },
  recipienteBotao: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    marginTop: 10,
  },
  recipienteLinkLogin: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
  },
  recipientePrincipal: {
    alignItems: "center",
    backgroundColor: Colors.background,
    flex: 1,
    justifyContent: "center",
  },
  rotuloEntrada: {
    color: Colors.text,
    fontWeight: "600",
    marginBottom: 5,
  },
  textoFixo: {
    color: Colors.text,
  },
  textoTitulo: {
    alignSelf: "flex-start",
    color: Colors.secondary,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: "5%",
    textAlignVertical: "top",
  },
  validacaoTexto: {
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  validacaoOk: {
    color: "#2d8a3a",
  },
  validacaoErro: {
    color: "#d43d3d",
  },
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
  },
  modalBotao: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalBotaoTexto: {
    color: "white",
    fontWeight: "bold",
  },
});
