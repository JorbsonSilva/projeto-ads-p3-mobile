import { Colors } from '@/constants/colors';
import { BotaoCustomizado } from '@/src/components/BotaoCustomizado';
import { InputCustomizado } from '@/src/components/InputCustomizado';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Cadastro() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [data, setData] = useState('');
  const [nome, setNome] = useState('');
  return (
    <View style={style.container1}>
     
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
        <InputCustomizado placeholder='Confirmar Senha' valor={} aoMudarTexto={} seguro={true}/>
        <BotaoCustomizado text='Proximo' aoClicar={() => router.push('/cadastro1')}/>
      </View>
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
  textInput:{
      color: Colors.text,
      fontWeight: '600',
      marginBottom: 5
  },
})