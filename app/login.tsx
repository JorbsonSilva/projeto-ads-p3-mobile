import { BotaoCustomizado } from '@/src/components/BotaoCustomizado';
import { InputCustomizado } from '@/src/components/InputCustomizado';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'; // Importação da caixa inteligente
import { Colors } from "../constants/colors";

export default function Login() {
  const roteador = useRouter(); // Quem controla as rotas do aplicativo, o nosso "motorista".
  
  // Hooks de Estado (A memória da nossa tela)
  const [email, definirEmail] = useState(''); // Armazena o que o usuário digitar no campo email.
  const [senha, definirSenha] = useState(''); // Armazena o que o usuário digitar no campo senha.
  
  // Estado para controlar a chave "Aluno" ou "Professor"
  // Já nasce com 'Aluno' selecionado por padrão.
  const [perfil, definirPerfil] = useState('Aluno'); 

  // Função que será chamada quando apertar o botão Entrar (Mock do Back-end)
  const executarLogin = () => {
    roteador.replace('/(tabs)');
  }; 

  return (
    // SafeAreaView: Caixa inteligente que respeita as "Áreas Seguras" do celular.
    // Evita que o nosso app fique escondido debaixo dos botões virtuais ou da bateria do aparelho.
    <SafeAreaView style={estilos.recipientePrincipal}>
      
      {/* A arquitetura "Sanduíche": 
        Esta área central é o recheio. Ela usa 'flex: 1' para empurrar o rodapé para baixo 
        e garantir que o cartão branco fique sempre perfeitamente no meio da tela.
      */}
      <View style={estilos.areaCentral}>
        
        {/* O nosso Cartão de Login flutuante */}
        <View style={estilos.cartao}>
          
          {/* Parte Superior (Header Azul Escuro) */}
          <View style={estilos.cabecalhoCartao}>
            <Text style={estilos.textoBemVindo}>Bem-vindo!</Text>
            <Text style={estilos.subtitulo}>Acesse sua conta</Text>
          </View>
          
          {/* Parte Inferior (Formulário Branco) */}
          <View style={estilos.formulario}>
            
            <Text style={estilos.rotuloEntrada}>Como você deseja entrar?</Text>
            
            {/* Caixa que guarda os botões de seleção lado a lado */}
            <View style={estilos.recipienteAlternador}>
              
              {/* Lógica Condicional de Estilos: 
                Se a variável 'perfil' for igual a 'Aluno', usa o estilo ativo (Laranja). 
                Se não for, usa o estilo inativo (Cinza). 
              */}
              <TouchableOpacity 
                style={[estilos.botaoAlternador, perfil === 'Aluno' ? estilos.botaoAlternadorAtivo : estilos.botaoAlternadorInativo]}
                onPress={() => definirPerfil('Aluno')}
              >
                <Text style={[estilos.textoAlternador, perfil === 'Aluno' ? estilos.textoAlternadorAtivo : estilos.textoAlternadorInativo]}>
                  Aluno
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[estilos.botaoAlternador, perfil === 'Professor' ? estilos.botaoAlternadorAtivo : estilos.botaoAlternadorInativo]}
                onPress={() => definirPerfil('Professor')}
              >
                <Text style={[estilos.textoAlternador, perfil === 'Professor' ? estilos.textoAlternadorAtivo : estilos.textoAlternadorInativo]}>
                  Professor
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={estilos.rotuloEntrada}>Email</Text>
            <InputCustomizado placeholder='Digite seu email' valor={email} aoMudarTexto={definirEmail}/>
            
            <Text style={estilos.rotuloEntrada}>Senha</Text>
            <InputCustomizado placeholder='Digite sua senha' valor={senha} aoMudarTexto={definirSenha} seguro={true} />
            
            <BotaoCustomizado text='Entrar' aoClicar={executarLogin}/>
          </View>
        </View>
      </View>

      {/* O Rodapé do app. 
        Não tem flexbox aqui para não esticar a tela. Fica preso no fundo apenas ocupando seu espaço.
      */}
      <View style={estilos.rodape}>
        
        {/* Divisor "--- ou ---" */}
        <View style={estilos.recipienteDivisor}>
          <View style={estilos.linhaDivisora} />
          <View style={estilos.textoOu}><Text>ou</Text></View>
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
          <Text onPress={() => roteador.push('/cadastro')} style={estilos.linkCadastro}>
            Cadastre-se.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Dicionário de Estilos (Organizado em Ordem Alfabética para manutenção)
const estilos = StyleSheet.create({
  areaCentral: {
    alignItems: 'center', // Alinha os itens no eixo cruzado (neste caso, centraliza na horizontal).
    flex: 1, // Serve para fazer com que a área cresça e ocupe todo o espaço livre da tela.
    justifyContent: 'center', // Controla o posicionamento no eixo principal (centraliza na vertical).
    width: '100%',
  },
  botaoAlternador: {
    alignItems: 'center',
    borderRadius: 15,
    flex: 1, // Faz com que ambos os botões dividam o espaço igualmente (50/50).
    justifyContent: 'center',
    paddingVertical: 10,
  },
  botaoAlternadorAtivo: {
    backgroundColor: Colors.secondary, // Pinta de laranja quando selecionado.
    elevation: 3, // Dá uma leve profundidade para destacar o botão ativo.
  },
  botaoAlternadorInativo: {
    backgroundColor: '#F0F0F0', // Fica cinza claro quando não está selecionado.
  },
  cabecalhoCartao: {
    backgroundColor: Colors.primary,
    paddingBottom: 50, // Adiciona espaço interno inferior (empurra o conteúdo branco pra baixo).
    paddingHorizontal: 30, // Espaçamento interno simultâneo nas laterais esquerda e direita.
    paddingTop: 30,
    width: '100%',
  },
  cartao: {
    backgroundColor: Colors.card,
    borderRadius: 30, // Serve para definir o raio dos cantos, tornando-os arredondados.
    elevation: 5, // Cria sombra e define a elevação (profundidade) de componentes no Android.
    overflow: 'hidden', // Corta qualquer conteúdo que tente ultrapassar as bordas arredondadas da View.
    shadowColor: '#000', // Código de sombra para funcionar no iOS (iPhone).
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '90%', // Tamanho horizontal (largura) proporcional à tela do dispositivo.
  },
  formulario: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30, // Arredonda especificamente o canto superior esquerdo.
    borderTopRightRadius: 30, // Arredonda especificamente o canto superior direito.
    marginTop: -20, // Margem negativa: puxa o formulário branco para cima do header azul.
    padding: 30,
  },
  iconeSocial: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  linhaDivisora: {
    backgroundColor: '#CCCCCC',
    flex: 1, // As duas linhas esticam igualmente até apertar a palavra 'ou' no meio.
    height: 1,
  },
  linkCadastro: {
    color: Colors.secondary,
    fontWeight: 'bold', // Deixa a fonte mais espessa (negrito).
  },
  recipienteAlternador: {
    flexDirection: 'row', // Altera o eixo, colocando os botões horizontalmente (lado a lado).
    gap: 10, // Cria um espaçamento exato de 10px entre os dois botões.
    marginBottom: 20,
    marginTop: 10
  },
  recipienteDivisor: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
  },
  recipienteLinkCadastro: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  recipientePrincipal: {
    backgroundColor: Colors.background,
    flex: 1, // A caixa mãe precisa ocupar a tela inteira.
  },
  recipienteSocial: {
    flexDirection: 'row',
    gap: 20,
  },
  rodape: {
    alignItems: 'center',
    gap: 20, // Separa os itens internos sem precisar esticar a tela.
    marginTop: -20, 
    paddingBottom: 40, // Espaçamento na base para não colar na borda inferior do celular.
    width: '100%',
  },
  rotuloEntrada: {
    color: Colors.text,
    fontWeight: '600', // Um pouco menos espesso que o 'bold'.
    marginBottom: 5,
  },
  subtitulo: {
    color: 'white',
    fontSize: 14,
  },
  textoAlternador: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoAlternadorAtivo: {
    color: 'white', // Texto fica branco no botão laranja.
  },
  textoAlternadorInativo: {
    color: '#888888', // Texto fica cinza no botão cinza.
  },
  textoBemVindo: {
    color: 'white',
    fontSize: 28, // Define o tamanho da fonte.
    fontWeight: 'bold',
  },
  textoFixoRodape: {
    color: Colors.text,
  },
  textoOu: {
    marginHorizontal: 15, // Aplica a mesma margem nas laterais (esquerda e direita) do texto.
  },
});