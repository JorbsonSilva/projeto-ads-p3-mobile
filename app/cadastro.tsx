import { Colors } from '@/constants/colors';
import { BotaoCustomizado } from '@/src/components/BotaoCustomizado';
import { InputCustomizado } from '@/src/components/InputCustomizado';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // View inteligente

export default function Cadastro() { 

  const roteador = useRouter();
  
  // Espaços de memória para os inputs
  const [email, definirEmail] = useState('');
  const [senha, definirSenha] = useState('');
  const [confirmaSenha, definirConfirmaSenha] = useState('');
  const [data, definirData] = useState('');
  const [nome, definirNome] = useState('');

  const validarEEnviar = async () => {
    
    // Cláusulas de Guarda: Barrando erros antes de chamar o servidor
    if(!nome || !data || !email || !senha || !confirmaSenha){
      Alert.alert("Atenção!!!!", "Por favor, preencha todos os campos.");
      return; // Expulsa o código da função
    }
    if (senha !== confirmaSenha){
      Alert.alert("Erro", "As senhas não coincidem. Tente novamente.");
      return;
    }
    if (senha.length < 6){ 
      Alert.alert("Senha Fraca", "A senha deve ter pelo menos 6 caracteres.");
      return; 
    }

    // Pacote JSON
    const pacoteJSON = {
      nome: nome,
      email: email,
      senha: senha
    };

    try {
      //  IMPORTANTE: Troque o SEU_IP_AQUI pelo seu IP da rede Wi-Fi (ex: 192.168.1.10)
      const resposta = await fetch("http://SEU_IP_AQUI:8080/api/usuarios/cadastro", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // 🟢 Corrigido o erro de digitação
        },
        body: JSON.stringify(pacoteJSON)
      });

      if (resposta.ok) {
        Alert.alert("Sucesso", "Conta criada com sucesso!");
        roteador.push('/login'); // Manda o usuário pro login automaticamente após criar a conta
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta. Verifique os dados.");
      }
    } catch (error) {
        Alert.alert("Erro de conexão", "Não conseguimos alcançar o servidor.");
        console.error("Erro no fetch: ", error);
    }
  };

  return (
    
    <SafeAreaView style={estilos.recipientePrincipal}>
      
      <Text style={estilos.textoTitulo}>Cadastro</Text>
      
      <View style={estilos.cartao}>
        
        <Text style={estilos.rotuloEntrada}>Nome Completo</Text>
        <InputCustomizado placeholder='Ex: João Ferreira' valor={nome} aoMudarTexto={definirNome}/>
        
        <Text style={estilos.rotuloEntrada}>E-mail</Text>
        <InputCustomizado placeholder='exemplo@email.com' valor={email} aoMudarTexto={definirEmail}/>
        
        <Text style={estilos.rotuloEntrada}>Data de Nascimento</Text>
        <InputCustomizado placeholder='DD/MM/AAAA' valor={data} aoMudarTexto={definirData}/>
        
        <Text style={estilos.rotuloEntrada}>Senha</Text>
        <InputCustomizado placeholder='Mínimo 6 caracteres' valor={senha} aoMudarTexto={definirSenha} seguro={true}/>
        
        <Text style={estilos.rotuloEntrada}>Confirmar Senha</Text>
        <InputCustomizado placeholder='Repita a senha' valor={confirmaSenha} aoMudarTexto={definirConfirmaSenha} seguro={true}/>
        
        <View style={estilos.recipienteBotao}>
          <View style={{flex: 1}}>
            <BotaoCustomizado text='Criar Conta' aoClicar={validarEEnviar}/>
          </View>
        </View>

        <View style={estilos.recipienteLinkLogin}>
          <Text style={estilos.textoFixo}>Já é Cadastrado? </Text>
          <Text onPress={() => roteador.push('/login')} style={estilos.linkLogin}>
            Faça Login.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: Colors.card,
    borderRadius: 30,
    elevation: 5,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '90%',
  },
  linkLogin: {
    color: Colors.secondary,
    fontWeight: 'bold',
  },
  recipienteBotao: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    marginTop: 10,
  },
  recipienteLinkLogin: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  recipientePrincipal: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    flex: 1, 
    justifyContent: 'center', 
  },
  rotuloEntrada: {
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 5,
  },
  textoFixo: {
    color: Colors.text,
  },
  textoTitulo: {
    alignSelf: "flex-start", 
    color: Colors.secondary, 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    marginLeft: '5%',
    textAlignVertical: 'top', 
  },
});