/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React from "react";
import { Pressable, SafeAreaView, Text } from "react-native";
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
const onPress = async () => {
  let jsonData = {
    enviroment: enviroment, //SANBOX OR PRODUCTION
    action: "gettoken", //DO NOT EDIT
    merchantname: merchantname, //edit your merchantname here
    merchantcode: merchantcode, //edit your merchantcode here
    merchantnamelabel: merchantNameLabel,
    description: billdescription,
    amount: 5000,//order total amount
    orderId: "ID20181123192300",
    orderLabel: "Ma don hang",
    appScheme: "momocgv20170101",// iOS App Only , match with Schemes Indentify from your  Info.plist > key URL types > URL Schemes
  };

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


    } else {
      let message = response.message;
      console.log(message)
      //Has Error: show message here
    }
  } catch (ex) {
    console.log(ex)
  }
}
const App = () => {

  return (
    <SafeAreaView>
      <Pressable onPress={onPress}>
        <Text>Payment</Text>
        <Text>Payment</Text>

        <Text>Payment</Text><Text>Payment</Text>
        <Text>Payment</Text>

        <Text>Payment</Text>
        <Text>Payment</Text>
        <Text>Payment</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default App;
