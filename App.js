import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  Alert,
  AppState,
  BackHandler, 
  Keyboard,
  Button,
  ToastAndroid,
} from 'react-native';

import NetInfo from "@react-native-community/netinfo"
import Clipboard from '@react-native-clipboard/clipboard'
import AsyncStorage from '@react-native-community/async-storage'
import fs from 'react-native-fs'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RNCamera } from 'react-native-camera'
import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors'

function App() {
  const refCamera = useRef()
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  
  useEffect(() => {
    const appStateAction = (nextState) => {
      console.log(nextState);
    }
    
    AppState.addEventListener('change', appStateAction);
    
    return () => {
      appStateAction.remove()
    }
  }, [])
  
  useEffect(() => {  
    async function salvaChave(chave, valor) {
      await AsyncStorage.setItem(chave, valor)
    }
    async function lerChave(chave) {
      texto = await AsyncStorage.getItem(chave)
      return texto
    }
    
    salvaChave('name', 'Luiz')
  }, [])
  
  useEffect(() => {  
    NetInfo.fetch().then(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    })
  }, [])
    
  useEffect(() => {     
    async function colaTexto() {
      const texto = await Clipboard.getString()
      console.log(texto)
    }
    
    //colaTexto()
    Clipboard.setString('Teste API React Native')
  }, [])

  useEffect(() => {     
    // salva um arquivo na pasta
    const path = fs.DocumentDirectoryPath +'/teste.txt'
    fs.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });

    // ler o arquivo
    fs.readFile(path, 'utf8')
      .then(response => console.log(response))
      .catch(err => console.error(err))

    // Exclui o arquivo
    fs.unlink(path)
      .then((success) => {
        console.log('FILE DELETED');
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [])

  useEffect(() => {        
      const backAction = () => {
        Alert.alert("ATENÇÃO", "Tem certeza de que deseja fechar o App?", 
          [
            {
              text: "Cancela",
              onPress: () => null,
              style: "cancel"
            },
            { text: "Confirma", onPress: () => BackHandler.exitApp() }
          ]
        );
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => {
        backAction.remove()
      }
  }, [])

  useEffect(() => {
    const _keyboardDidShow = () => console.log("Abriu o teclado");
    const _keyboardDidHide = () => console.log("Fechou o teclado");
    
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
      
    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    }
  }, [])

  function showToast(tipo, mensagem) {
    console.log(mensagem)
    switch (tipo) {
      case 0: 
        ToastAndroid.show(mensagem, ToastAndroid.SHORT)
        break;
      case 2:
        ToastAndroid.showWithGravity(
          mensagem,
          ToastAndroid.LONG, 
          ToastAndroid.CENTER
          );
        break;
      default:
        ToastAndroid.show(mensagem, ToastAndroid.LONG);
    }
  }
  
  function shot() {    
    async function tiraFoto() {
      if (this.camera) {
        const options = {
          quality: 0.5,
          base64: true        
        }
        const data = await this.camera.takePictureAsync(options)
        console.log(data)
      }    
    }    
    console.log('shot')
    tiraFoto()
  }

  function locale() {
    console.log('Geolocation', navigator)
    const {geolocation} = navigator
    geolocation.getCurrentPosition((response) => {
      console.log(response)  
    })
    // const watch Id = geolocation.watchPosition(...)
    // geolocation.clearWatch()
  }

  function acelerom() {
    console.log('Acelerômetro')
    setUpdateIntervalForType(SensorTypes.accelerometer, 2000)
    accelerometer.subscribe(({x, y, z}) => {
      console.log(`x=${x}, y=${y}, z=${z}`)
    })
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text>Olá mundo</Text>
     
      <TextInput />
     
      <Button
        onPress={() => showToast(0, 'mensagem')}
        title="Toast rápido"
        color="#841584"        
      />
      <Button
        onPress={() => showToast(1, 'mensagem')}
        title="Toast lento"
        color="blue"
      />
      <Button
        onPress={() => showToast(2, 'mensagem')}
        title="Toast no centro"
        color="green"                
      />
      <Button
        onPress={locale}
        title="Localização"
        color="teal"
      />
      <Button
        onPress={shot}
        title="Tirar Foto"
        color="red"
      />
      <Button
        onPress={acelerom}
        title="Acelerômetro"
        color="lightblue"
      />


      <RNCamera
        ref={ref => {this.camera = ref;}}
        style={{height: 200, width: 200}}
        type={RNCamera.Constants.Type.front}  //back
        flashMode={RNCamera.Constants.FlashMode.on}        
      />


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
