import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config/api"; // Ajuste o caminho se necessário

// Definição dos dados que o contexto vai disponibilizar para o app
interface AuthContextData {
  perfilAtivo: string;
  usuarioId: string | null;
  nomeUsuario: string;
  carregandoAuth: boolean;
  alternarPerfilGlobal: (novoPerfil: string) => Promise<void>;
  loginGlobal: (id: string, perfil: string) => Promise<void>;
  logoutGlobal: () => Promise<void>;
  atualizarNomeGlobal: (novoNome: string) => void;
  deslogarGlobal: () => Promise<void>;
  atualizarSessao: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [perfilAtivo, setPerfilAtivo] = useState<string>("Aluno");
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const [carregandoAuth, setCarregandoAuth] = useState(true);

  const carregarSessaoDoBanco = async () => {
    try {
      const idSalvo = await AsyncStorage.getItem("@orienta_usuario_id");
      const perfilSalvo = await AsyncStorage.getItem("@orienta_perfil");

      if (idSalvo) setUsuarioId(idSalvo);
      if (perfilSalvo) setPerfilAtivo(perfilSalvo);

      if (idSalvo) {
        const resposta = await fetch(`${API_URL}/api/usuarios/${idSalvo}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          const primeiroNome = dados.nome
            ? dados.nome.split(" ")[0]
            : "Usuário";
          setNomeUsuario(primeiroNome);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar sessão global:", error);
    } finally {
      setCarregandoAuth(false);
    }
  };

  useEffect(() => {
    carregarSessaoDoBanco();
  }, []);

  const alternarPerfilGlobal = async (novoPerfil: string) => {
    setPerfilAtivo(novoPerfil);
    await AsyncStorage.setItem("@orienta_perfil", novoPerfil);
  };

  // 🟢 1. Função que o Login vai chamar
  const loginGlobal = async (id: string, perfil: string) => {
    setUsuarioId(id); // Atualiza a memória na hora!
    setPerfilAtivo(perfil);
    // Busca o nome do usuário no backend ao realizar login
    try {
      const resposta = await fetch(`${API_URL}/api/usuarios/${id}`);
      if (resposta.ok) {
        const dados = await resposta.json();
        const primeiroNome = dados.nome ? dados.nome.split(" ")[0] : "Usuário";
        setNomeUsuario(primeiroNome);
      } else {
        setNomeUsuario("");
      }
    } catch (error) {
      console.error("Erro ao obter nome no loginGlobal:", error);
      setNomeUsuario("");
    }
    await AsyncStorage.setItem("@orienta_usuario_id", id);
    await AsyncStorage.setItem("@orienta_perfil", perfil);
  };

  // 🟢 2. Função que o Logout vai chamar
  const logoutGlobal = async () => {
    setUsuarioId(null); // Limpa a memória na hora!
    setPerfilAtivo("Aluno");
    setNomeUsuario("");
    await AsyncStorage.multiRemove(["@orienta_usuario_id", "@orienta_perfil"]);
  };

  const atualizarNomeGlobal = (novoNome: string) => {
    const primeiroNome = novoNome.split(" ")[0];
    setNomeUsuario(primeiroNome);
  };

  const deslogarGlobal = async () => {
    setUsuarioId(null);
    setNomeUsuario("");
    setPerfilAtivo("Aluno");
    await AsyncStorage.multiRemove(["@orienta_perfil", "@orienta_usuario_id"]);
  };

  return (
    <AuthContext.Provider
      value={{
        perfilAtivo,
        usuarioId,
        nomeUsuario,
        carregandoAuth,
        alternarPerfilGlobal,
        loginGlobal,
        logoutGlobal,
        atualizarNomeGlobal,
        deslogarGlobal,
        atualizarSessao: carregarSessaoDoBanco,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🟢 NOSSO CUSTOM HOOK: Qualquer arquivo usará apenas isso para pegar os dados
export function useAuth() {
  return useContext(AuthContext);
}
