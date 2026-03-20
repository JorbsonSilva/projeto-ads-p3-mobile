import { BotaoCustomizado } from '@/src/components/BotaoCustomizado';
import { InputCustomizado } from '@/src/components/InputCustomizado';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

export default function Login() {
  const router = useRouter(); // Quem controla as rotas "motorista"
  const [email, setEmail] = useState (''); // Armazenar o que o usuário digitar no campo email.
  const [senha, setSenha] = useState (''); // Armazenar o que o usuário digitar no campo senha.
  const fazerLogin = () => {console.log("Enviando para o Back-end -> Email:", email, "Senha:", senha);}; // Função apra quando apertar o botão Entrar
  return (
    <View 
      style={{
        flex: 1, // Serve para fazer com que um item cresça e ocupe todo o espaço disponível.
        backgroundColor: Colors.background, // Defini a cor de fundo.
        justifyContent: "center", // Para controlar o posicionamento horizontal (por padrão) ou vertical de itens. 
        alignItems: "center" // Serve para alinhar os itens do eixo perpendicular ao eixo principal.
      }}>
         <Text style={{
          fontSize: 28, // Definir o tamanho da fonte.
          fontWeight: 'bold', // Serve para definir a espessura de uma fonte, permitindo tornar o texto mais fino, normal ou negrito (bold).
          color: Colors.secondary, // Definir a cor do texto.
          textAlignVertical: 'top', // Definir o alinhamento vertical do texto dentro de um componente.
          alignSelf: "flex-start", // Ele substitui o alinhamento definido pelo alignItems do pai apenas para esse componente.
          marginBottom: 15, // Definir um espaço externo na parte inferior de um componente, separando-o do elemento seguinte.
          marginLeft: '5%' // Definir um espaço externo na borda esquerda de um componente, separando-o do elemento seguinte.
          }}>Login</Text>
          
          <View style={{
            width: '90%', // Definir o tamanho horizontal(largura) de um componente, pode ser fixa ou proporcional. 
            backgroundColor: Colors.card,
            borderRadius: 30, // Serve para definir o raio dos cantos de um elemento tornando-os arredondados.
            overflow:'hidden', // Controla como o conteúdo que ultrapassa as dimensões (largura ou altura) de um componente contêiner (como uma View) é exibido.
            elevation: 5 // sombras e definir a elevação (profundidade) de componentes no Android.
          }}>
              <View style={{
                backgroundColor: Colors.primary,
                width:'100%',
                paddingTop: 30, // Definir um espaçamento interno na borda superior de um componente, afastando o seu conteúdo do topo.
                paddingHorizontal: 30, // Definir um espaçamento interno simultâneo nas laterais esquerda (left) e direita (right) de um componente
                paddingBottom: 50, // Adicionar espaço interno na parte inferior de um componente, separando o conteúdo interno da sua borda inferior.
                padding: 30, // Criar espaço interno dentro de um componente, separando o conteúdo da sua própria borda.
              }}>
                 <Text style={{
                  fontSize: 28,
                  fontWeight:'bold',
                  color: 'white',
                  }}>Bem-vindo!</Text>
                 <Text style={{
                  fontSize: 14,
                  color:'white'
                  }}>Acesse sua conta</Text>
              </View>
              <View style={{
                padding: 30,
                borderTopLeftRadius: 30, // Arredondar especificamente o canto superior esquerdo de um componente.
                borderTopRightRadius: 30, // Arredondar especificamente o canto superior direito de um componente.
                marginTop: -20, // Definir um espaço externo na parte superior de um componente, separando-o do elemento seguinte.
                backgroundColor: 'white'

              }}>
                 <Text style={styles.textInput}>Email</Text>
                 <InputCustomizado placeholder='Digite seu email' valor={email} aoMudarTexto={setEmail}/>
                 <Text style={styles.textInput}>Senha</Text>
                 <InputCustomizado placeholder='Digite sua senha' valor={senha} aoMudarTexto={setSenha} seguro={true} />
                 <BotaoCustomizado text='Entrar' aoClicar={fazerLogin}/>
                 
              </View>
          </View>
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-evenly'
            }}>
               <View style={{
                  flexDirection: 'row', // Definir o eixo principal do contêiner, determinando se os elementos filhos (componentes) serão organizados horizontalmente (linha) ou verticalmente (coluna).
                  alignItems: 'center',
                  width: '80%'
                }}>
                   <View style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: '#CCCCCC'
                    }}></View>
                   <View style={{
                      marginHorizontal: 15 // Definir a mesma margem externa nas laterais esquerda e direita de um componente simultaneamente
                    }}><Text>ou</Text></View>
                   <View style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: '#CCCCCC'
                    }}></View>
               </View>
      
            <View style={{
              flexDirection: 'row',
              gap: 20, // Criar espaçamentos uniformes entre itens dentro de um contêiner.
              }}> 
                 <TouchableOpacity style={styles.icone}>
                    <FontAwesome name="google" size={24} color="#DB4437" />
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.icone}>
                    <FontAwesome name="facebook" size={24} color="#4267B2" />
                 </TouchableOpacity>

            </View>
            <View style={{
              flexDirection:'row',
              alignItems: 'center'
            }}>
                <Text style={{
                    color: Colors.text
                  }}>Não tem conta? </Text>
                <Text onPress={() => router.push('/cadastro')} style={{
                    color: Colors.secondary
                  }}>Cadastre-se.</Text>
            </View>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({

    textInput:{
      color: Colors.text,
      fontWeight: '600',
      marginBottom: 5
    },

    icone:{
      backgroundColor: 'white',
      height: 50,
      width: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems:'center',
      elevation: 2
    }
});
