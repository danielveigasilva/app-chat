import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'

export default function App() {

  const [menssage, setMenssage] = useState('')
  const [listMsg, setlistMsg] = useState([{'text': 'tesra teudaodasas', 'time': new Date().toLocaleString(), 'username': 'user' +  Math.floor(Math.random() * (8123 - 45 + 1)) + 45},{'text': 'tesfsdasd asdas da asd ada s asd as asd asdasdasda asdasdasd afrec gerds', 'time': new Date().toLocaleString(), 'username': 'user' +  Math.floor(Math.random() * (8123 - 45 + 1)) + 45}])
  const [myUsername, setMyUsername] = useState('user' +  'user' +  Math.floor(Math.random() * (8123 - 45 + 1)) + 45)
  const [inputHeight, setInputHeight] = useState(30);

  const flatListRef = useRef(null);

  const handleSendMenssage = () => {
    if (menssage.trim() != ''){
      setlistMsg([...listMsg, {'text': menssage, 'time': new Date().toLocaleString(), 'username': myUsername}]);
      setMenssage('');
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(Math.min(Math.max(30, height), 90));
  };

  const messageBalloon = ({ item }) => {
    if (item.username == myUsername){
      return (
        <View style={styles.balloonMe}>
          <Text>{item.text}</Text>
          <Text style={{fontSize: 10, alignSelf:"flex-end", marginTop:10}}>{item.time}</Text>
        </View>
      );
    }
    else{
      return (
        <View style={styles.balloonOther}>
          <Text style={{fontSize: 12, marginBottom: 5, fontWeight:"bold"}}>{item.username}</Text>
          <Text>{item.text}</Text>
          <Text style={{fontSize: 10, alignSelf:"flex-end", marginTop:10}}>{item.time}</Text>
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.inner} onPress={dismissKeyboard}>
        <View style={styles.topBar}>
          <Text style={{fontSize: 18,fontWeight: 'bold'}}>CHAT ANÔNIMO</Text>
        </View>
        <FlatList
          ref={flatListRef}
          style={styles.list}
          data={listMsg}
          renderItem={messageBalloon}
          keyExtractor={(item, index) => index.toString()}
          onContentSizeChange={scrollToBottom}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={menssage}
            onChangeText={setMenssage}
            style={[styles.input, { height: inputHeight }]}
            onSubmitEditing={handleSendMenssage}
            multiline={true}
            onContentSizeChange={handleContentSizeChange}/>
          <TouchableOpacity style={{alignSelf:"flex-end", alignItems:"flex-end"}} onPress={handleSendMenssage} disabled={menssage.trim() == ''}>
            <MaterialIcons 
              name="send" 
              size={40} 
              color={menssage.trim() != '' ? "#00897b" : "#70788b"} 
              style={styles.icon}/>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c0c4cd',
  },
  inner: {
    flex: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    backgroundColor: '#c0c4cd',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    width: "83%",
    borderRadius: 15,
    alignSelf: "center",
    borderWidth: 0,
    paddingLeft: 15,
    marginLeft: 15,
  },
  icon: {
    alignSelf: "flex-end",
    marginLeft: 10,
    marginRight: 15,
  },
  balloonOther: {
    backgroundColor: '#e5e5e5',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
    minWidth: "40%",
    alignSelf: 'flex-start',
    marginTop:10,
  },
  balloonMe: {
    backgroundColor: '#e2ffc8',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
    minWidth: "40%",
    alignSelf:"flex-end",
    marginTop:10,
  },
  list: {
    backgroundColor: '#ffffff',
    paddingLeft: 20,
    paddingRight: 20,
  },
  topBar: {
    backgroundColor: '#c0c4cd',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
});
