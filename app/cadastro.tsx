import { Colors } from '@/constants/colors';
import { BotaoCustomizado } from '@/src/components/BotaoCustomizado';
import { InputCustomizado } from '@/src/components/InputCustomizado';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

export default function Cadastro() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [data, setData] = useState('');
  const [nome, setNome] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tipoPerfil, setTipoPerfil] = useState('');
  const abrirTela = (tipoSelecionado: string) => {
    setTipoPerfil(tipoSelecionado);
    setModalVisivel(true);
  };

  return (
    <View style={style.container1}>
      <Text style={style.textTitulo}>Cadastro</Text>
     
      <View style={style.container2}>
        <Text style={style.textInput}>E-mail</Text>
        <InputCustomizado placeholder='E-mail' valor={email} aoMudarTexto={setEmail}/>
        <Text style={style.textInput}>Nome Completo</Text>
        <InputCustomizado placeholder='Nome Completo' valor={nome} aoMudarTexto={setNome}/>
        <Text style={style.textInput}>Data de Nascimento</Text>
        <InputCustomizado placeholder='Data de Nascimento' valor={data} aoMudarTexto={setData}/>
        <Text style={style.textInput}>Senha</Text>
        <InputCustomizado placeholder='Senha' valor={senha} aoMudarTexto={setSenha} seguro={true}/>
        <Text style={style.textInput}>Confirmar Senha</Text>
        <InputCustomizado placeholder='Confirmar Senha' valor={senha} aoMudarTexto={setSenha} seguro={true}/>

        <View style={style.container3}>
          <View style={{flex: 1}}>
            <BotaoCustomizado text='Aluno' aoClicar={() => abrirTela('Aluno')}/>
          </View>
          <View style={{flex: 1}}>
            <BotaoCustomizado text='Professor' aoClicar={() => abrirTela('Professor')}/>
          </View>
        </View>
    
        <View style={{
          paddingTop: 15,
          flexDirection:'row',
          alignItems: 'center'
          }}>
            <Text style={{
              color: Colors.text
              }}>Já é Cadastrado? </Text>
            <Text onPress={() => router.push('/login')} style={{
              color: Colors.secondary
              }}>Login.</Text>
            </View>
        
      </View>
      <Modal animationType='slide' transparent={true} visible={modalVisivel}>
        <View style={style.container1}>
          <View style={style.container2}>
            <Text>{tipoPerfil}</Text>
            <BotaoCustomizado text='Voltar' aoClicar={() => setModalVisivel(false)}/>
            <BotaoCustomizado text='Cadastrar' aoClicar={() => router.push('/perfil')}/>
          </View>
        </View>

      </Modal>
    </View>
  );
}

const style = StyleSheet.create({
  container1: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  container2: {
    width: '90%',
    backgroundColor: Colors.card,
    borderRadius: 30,
    elevation: 5,
    padding: 30
  },
  container3: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20

  },
  textInput: {
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 5
  },
  textTitulo: {
    fontSize: 28, 
    fontWeight: 'bold', 
    color: Colors.secondary, 
    textAlignVertical: 'top', 
    alignSelf: "flex-start", 
    marginBottom: 15, 
    marginLeft: '5%'  
  }
})