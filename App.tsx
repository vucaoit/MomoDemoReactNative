/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React from "react";
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { Platform, NativeModules, NativeEventEmitter } from 'react-native';
import RNMomosdk from 'react-native-momosdk';
const RNMomosdkModule = NativeModules.RNMomosdk;
const EventEmitter = new NativeEventEmitter(RNMomosdkModule);

const merchantname = "CGV Cinemas";
const merchantcode = "CGV01";
const merchantNameLabel = "Nhà cung cấp";
const billdescription = "Fast and Furious 8";
const amount = 50000;
const enviroment = "0"; //"0": SANBOX , "1": PRODUCTION


function componentDidMount() {
  EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenReceived', (response) => {
    try {
      console.log("<MoMoPay>Listen.Event::" + JSON.stringify(response));
      if (response && response.status === 0) {
        //SUCCESS: continue to submit momoToken,phonenumber to server
        let fromapp = response.fromapp; //ALWAYS:: fromapp==momotransfer
        let momoToken = response.data;
        let phonenumber = response.phonenumber;
        let message = response.message;
        let orderId = response.refOrderId;
        console.log("componentDidMount")
        console.log(fromapp)
        console.log(momoToken)
        console.log(phonenumber)
        console.log(message)
        console.log(orderId)
      } else {
        //let message = response.message;
        //Has Error: show message here
      }
    } catch (ex) { }
  });
  //OPTIONAL
  EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenState', (response) => {
    console.log("<MoMoPay>Listen.RequestTokenState:: " + response.status);
    // status = 1: Parameters valid & ready to open MoMo app.
    // status = 2: canOpenURL failed for URL MoMo app 
    // status = 3: Parameters invalid
  })
}

// TODO: Action to Request Payment MoMo App
const onPress = async (jsonData: any) => {
  // let jsonData = {
  //   enviroment: enviroment, //SANBOX OR PRODUCTION
  //   action: "gettoken", //DO NOT EDIT
  //   merchantname: merchantname, //edit your merchantname here
  //   merchantcode: merchantcode, //edit your merchantcode here
  //   merchantnamelabel: merchantNameLabel,
  //   description: billdescription,
  //   amount: 5000,//order total amount
  //   orderId: "ID20181123192300",
  //   orderLabel: "Ma don hang",
  //   appScheme: "momocgv20170101",// iOS App Only , match with Schemes Indentify from your  Info.plist > key URL types > URL Schemes
  // };

  console.log("data_request_payment " + JSON.stringify(jsonData));
  if (Platform.OS === 'android') {
    let dataPayment = await RNMomosdk.requestPayment(jsonData);
    momoHandleResponse(dataPayment);
  } else {
    RNMomosdk.requestPayment(jsonData);
  }
}

const momoHandleResponse = async (response: any): Promise<any> => {
  try {
    if (response && response.status === 0) {
      //SUCCESS continue to submit momoToken,phonenumber to server
      let fromapp = response.fromapp; //ALWAYS:: fromapp == momotransfer
      let momoToken = response.data;
      let phonenumber = response.phonenumber;
      let message = response.message;
      console.log("momohandle");
      console.log(fromapp);
      console.log(momoToken);
      console.log(phonenumber);
      console.log(message);
      Alert.alert("Thông báo", `Thanh toán thành công : ${phonenumber}`);

    } else {
      let message = response.message;
      console.log(message)
      Alert.alert("Thông báo", "Thanh toán không thành công, bị từ chối.")
      //Has Error: show message here
    }
  } catch (ex) {
    console.log(ex)
  }
}
const App = () => {
  const jsonData = {
    enviroment: enviroment, //SANBOX OR PRODUCTION
    action: "gettoken", //DO NOT EDIT
    merchantname: "CGV Cenima", //edit your merchantname here
    merchantcode: "CGV01", //edit your merchantcode here
    merchantnamelabel: "Tên nhà cung cấp",
    description: "Vé xem phim couple : The Red Shoes.",
    amount: 2000000,//order total amount
    orderId: "ID20181123192300",
    orderLabel: "Ma don hang",
    appScheme: "momocgv20170101",// iOS App Only , match with Schemes Indentify from your  Info.plist > key URL types > URL Schemes
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text>enviroment</Text>
        <TextInput
          value={jsonData.enviroment}
          editable={false}
        />
        <Text>action</Text>
        <TextInput
          value={jsonData.action}
          editable={false}
        />
        <Text>merchantname</Text>
        <TextInput
          value={jsonData.merchantname}
        />
        <Text>merchantcode</Text>
        <TextInput
          value={jsonData.merchantname}
        />
        <Text>merchantnamelabel</Text>
        <TextInput
          value={jsonData.merchantnamelabel}
        />
        <Text>description</Text>
        <TextInput
          value={jsonData.description}
        />
        <Text>amount</Text>
        <TextInput
          value={jsonData.amount + ''}
        />
        <Text>orderId</Text>
        <TextInput
          value={jsonData.orderId}
        />
        <Text>orderLabel</Text>
        <TextInput
          value={jsonData.orderLabel}
        />
        <Text>appScheme</Text>
        <TextInput
          value={jsonData.appScheme}
        />
      </View>
      <Pressable onPress={() => onPress(jsonData)} style={{ height: 50, backgroundColor: 'orange' }}>
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 30 }}>Payment</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default App;
