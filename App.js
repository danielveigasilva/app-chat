import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, FlatList, SafeAreaView, Keyboard, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import PubNub from 'pubnub'

export default function App() {

  const [menssage, setMenssage] = useState('');
  const [listMsg, setlistMsg] = useState([]);
  const [myUsername, setMyUsername] = useState('user' +  Math.floor(Math.random() * (8123 - 45 + 1)) + 45);
  const [inputHeight, setInputHeight] = useState(30);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [channel, setChannel] = useState('chat_2');
  const flatListRef = useRef(null);

  const pubnub = new PubNub({
    publishKey: "pub-c-0ac996e3-d9d5-46d7-93e6-a15ac13e2fb5",
    subscribeKey: "sub-c-3b34aa41-83f6-4523-ba18-20ddebb9c378",
    userId: myUsername,
  });

  useEffect(() => {
    pubnub.addListener({
      message: (msg) => {
        setlistMsg([...listMsg, {'text': msg.message, 'time': new Date(msg.timetoken/10000).toLocaleString(), 'username': msg.publisher}]);
      },
    });

    pubnub.subscribe({
      channels: [channel],
    });

    if (!initialFetchDone){
      pubnub.fetchMessages(
        {
            channels: [channel],
            end: '15343325004275466'
        },
        (status, response) => {
          if(response != null){
            let listOld = response.channels[channel].map((msg) => {
              return {'text': msg.message, 'time': new Date(msg.timetoken/10000).toLocaleString(), 'username': msg.uuid}
            })
            setlistMsg(listOld);
            setInitialFetchDone(true);
          }
        }
      );
    }

    return () => {
      pubnub.unsubscribeAll();
    };
  }, [listMsg, initialFetchDone]);

  const handleSendMenssage = () => {
    if (menssage.trim() != ''){
      setMenssage('');
      pubnub.publish(
        {
          channel: channel,
          message: menssage
        },
        function(status, response) {
          if (status.erro){
            console.log(status);
          }
        }
      );
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
    >
      <SafeAreaView style={styles.inner} onPress={dismissKeyboard}>
        <View style={styles.topBar}>
          <Text>{myUsername}</Text>
          <Text style={{fontSize: 18,fontWeight: 'bold'}}>{"Bate Papo"}</Text>
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
          <TouchableOpacity style={{alignSelf:"flex-end", alignItems:"center", width: "17%"}} onPress={handleSendMenssage} disabled={menssage.trim() == ''}>
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
    justifyContent: "flex-end"
  },
  inputContainer: {
    backgroundColor: '#c0c4cd',
    flexDirection: 'row',
    alignItems:"center",
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
    alignSelf: "center",
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
