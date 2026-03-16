import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
    const router = useRouter();
    useEffect(()=>{
        const timer = setTimeout(()=>{
            router.replace('/login');
        }, 3000 );

        return () => clearTimeout(timer);

    },[]);

  return (
    <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
        }}>
      <Text style={{ 
        fontSize: 24, 
        fontWeight: 'bold' 
        }}>Carregando o sistema...</Text>
    </View>
  );
}