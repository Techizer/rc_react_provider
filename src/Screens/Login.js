import { TouchableWithoutFeedback, Pressable, Modal, Text, Dimensions, View, PermissionsAndroid, Platform, BackHandler, Alert, ScrollView, StatusBar, SafeAreaView, Image, TouchableOpacity, keyboardType, Keyboard } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { Shareratepro } from '../Provider/Sharerateapp';
import Geolocation from '@react-native-community/geolocation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  Colors, Font, mobileH, config, mobileW,
  Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider,
  localStorage, FlushMsg
} from '../Provider/utilslib/Utils';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import AntDesign from "react-native-vector-icons/AntDesign";
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import { firebapushnotification } from '../firbase_pushnotification';
import { Icons } from '../Assets/Icons/IReferences'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
global.current_lat_long = 'NA';
global.myLatitude = 'NA';
global.myLongitude = 'NA';

export default Login = ({ navigation, route }) => {
  const screens = 'Login';

  const [state, setState] = useState({
    isSecurePassword: true,
    cheackbox: false,
    emailfocus: false,
    email: '',
    passwordfocus: false,
    password: '',
    engbtn: false,
    device_lang: 'AR',
    langaugeme: 0,
    remember_me: '',
    fcm_token: 123456,
    languagechange: false,
    showlanguage: false,
    engbtn_ar: false,
    address_new: '',
    showUsertype: false,
    userType: [{
      title: "Nurse",
      value: "nurse"
    },
    {
      title: "Nurse Assistant",
      value: "caregiver"
    },
    {
      title: "Babysitter",
      value: "babysitter"
    },
    {
      title: "Physiotherapy",
      value: "physiotherapy"
    },
    {
      title: "Doctor",
      value: "doctor"
    },
    // {
    //   title: "Hospital",
    //   value: "hospital"
    // }
    {
      title: "Lab",
      value: "lab"
    }
    ],
    selectuserType: -1
  })

  useEffect(() => {
    navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', handleBackPress),
    );
    get_language()
  }, [])

  useEffect(() => {
    navigation.addListener('focus', () => {
      get_rem_data()
      get_language()

      //  checkPermission();
      //   messageListener();
    });
    _willBlurSubscription = navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackPress,
        ),
    );
  }, [])



  get_language = async () => {
    let textalign = await localStorage.getItemObject('language');
    if (textalign != null) {
      setState(prev => ({
        ...prev,
        langaugeme: textalign
      }))

    }
    let address_arr = await localStorage.getItemObject('address_arr')
    setState(prev => ({
      ...prev,
      address_new: address_arr
    }))
    if (address_arr == '' || address_arr == 'NA' || address_arr == null) {
      getlatlong();
    }

  }


  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getFcmToken();

    } else {

      requestPermission();
    }
  }

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  }
  shareApp = () => {
    let url = 'NA'

    url = fcmtoken

    Shareratepro.sharefunction(url);
  }

  getlatlong = async () => {

    let permission = await localStorage.getItemString('permission')
    if (permission != 'denied') {
      var that = this;
      //Checking for the permission just after component loaded
      if (Platform.OS === 'ios') {
        callLocation(that);
      } else {
        // callLocation(that);
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
              'title': 'Location Access Required',
              'message': 'This App needs to Access your location'
            }
            )
            // console.log('granted', PermissionsAndroid.RESULTS.GRANTED)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              that.callLocation(that);
            } else {
              let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.latitude } }
              that.getalldata(position)
              localStorage.setItemString('permission', 'denied')

            }
          } catch (err) { console.warn(err) }
        }
        requestLocationPermission();
      }
    } else {
      let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }
      getalldata(position)
    }
  }

  callLocation = async (that) => {
    setState(prev => ({
      ...prev,
      loading: true
    }))
    localStorage.getItemObject('position').then((position) => {
      // console.log('position', position)
      if (position != null) {
        var pointcheck1 = 0
        getalldata(position)
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {

            localStorage.setItemObject('position', position)
            getalldata(position);
            pointcheck1 = 1
          },
          (error) => {
            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

            getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
          //Will give you the location on location change
          // console.log('data', position);

          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position)
            getalldata(position)
          }

        });

      }
      else {
        // console.log('helo gkjodi')
        var pointcheck = 0
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {

            localStorage.setItemObject('position', position)

            getalldata(position)
            pointcheck = 1
          },
          (
            error) => {
            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

            getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
          //Will give you the location on location change
          // console.log('data', position);

          if (pointcheck != 1) {

            localStorage.setItemObject('position', position)
            getalldata(position)
          }

        });
      }
    })
  }

  getalldata = (position) => {

    let longitude = position.coords.longitude
    let latitude = position.coords.latitude
    setState(prev => ({
      ...prev,
      latitude: latitude,
      longitude: longitude,
      loading: false
    }))
    myLatitude = latitude,
      myLongitude = longitude
    current_lat_long = position

    let event = { latitude: latitude, longitude: longitude, latitudeDelta: state?.latdelta, longitudeDelta: state?.longdelta }
    getadddressfromlatlong(event)
  }

  getadddressfromlatlong = (event) => {
    // alert('hi')

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + config.mapkey + '&language=' + config.maplanguage)

      .then((response) => response.json())
      .then((resp) => {
        let responseJson = resp.results[0]
        let city = '';
        let administrative_area_level_1 = '';
        for (let i = 0; i < responseJson.address_components.length; i++) {
          if (responseJson.address_components[i].types[0] == "locality") {
            city = responseJson.address_components[i].long_name
            break;
          }
          else if (responseJson.address_components[i].types[0] == "administrative_area_level_2") {
            city = responseJson.address_components[i].long_name
          }

        }
        for (let j = 0; j < responseJson.address_components.length; j++) {
          if (responseJson.address_components[j].types[0] == "administrative_area_level_1") {
            administrative_area_level_1 = responseJson.address_components[j].long_name
          }

        }
        let details = responseJson
        let data2 = { 'latitude': details.geometry.location.lat, 'longitude': details.geometry.location.lng, 'address': details.formatted_address, 'city': city, 'administrative_area_level_1': administrative_area_level_1 }
        add_location = data2

        GooglePlacesRef && GooglePlacesRef.setAddressText(details.formatted_address)
        setState(prev => ({
          ...prev,
          latdelta: event.latitudeDelta,
          longdelta: event.longitudeDelta,
          latitude: event.latitude,
          longitude: event.longitude,
          addressselected: details.formatted_address,
          add_my_location: data2
        }))

        localStorage.setItemObject('address_arr', add_location.address);
      })



  }


  handleBackPress = () => {
    Alert.alert(
      Lang_chg.titleexitapp[config.language],
      Lang_chg.exitappmessage[config.language], [{
        text: Lang_chg.no_txt[config.language],
        onPress: () => console.log('Cancel Pressed'),
        style: Lang_chg.no_txt[config.language],
      }, {
        text: Lang_chg.yes_txt[config.language],
        onPress: () => BackHandler.exitApp()
      }], {
      cancelable: false
    }
    ); // works best when the goBack is async 
    return true;
  };
  launguage_setbtn = (language) => {
    Lang_chg.language_set(language)
    setState(prev => ({
      ...prev,
      engbtn: !state?.engbtn,
      engbtn_ar: !state?.engbtn_ar
    }))
  }


  get_rem_data = async () => {
    let remeberdata_arr = await localStorage.getItemObject('remeberdata');

    if (remeberdata_arr != null) {
      setState(prev => ({
        ...prev,
        email: remeberdata_arr.email,
        password: remeberdata_arr.password,
        remember_me: true
      }))
    }

  }

  remember_me_fun = async () => {

    if (state?.remember_me == false) {
      let data = { 'email': state?.email, 'password': state?.password }
      localStorage.setItemObject('remeberdata', data)
    }
    else {
      localStorage.setItemObject('remeberdata', null)
    }
    setState(prev => ({
      ...prev,
      //remember_me: !state?.remember_me,
      remember_me: true
    }))
  }

  remove_remember_me_fun = async () => {
    await localStorage.removeItem('remeberdata');
    setState(prev => ({
      ...prev,
      remember_me: false
    }))
  }
  loginbtn = async () => {

    Keyboard.dismiss()
    var email = state?.email.trim()
    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (state?.selectuserType == -1) {
      msgProvider.showError(msgText.emptyUsertype[config.language])
      // msgProvider.toast(msgText.emptyUsertype[config.language], 'bottom')
      return false;
    }

    if (email.length <= 0) {
      msgProvider.showError(msgText.emptyEmail[config.language])
      return false;
    }

    if (regemail.test(email) !== true) {
      msgProvider.showError(msgText.validEmail[config.language])
      return false
    }

    if (state?.password.length <= 0 || state?.password.trim().length <= 0) {
      msgProvider.showError(msgText.emptyPassword[config.language])
      return false
    }
    // if (state?.password.length < 8) {
    //     msgProvider.toast(msgText.emptyPasswordValid[config.language], 'center')
    //     return false
    // }
    var device_lang
    if (config.language == 0) {
      device_lang = 'ENG'
    }
    else {
      device_lang = 'AR'
    }

    let url = config.baseURL + "api-service-provider-login";
    var data = new FormData();
    data.append('email', state?.email)
    data.append('password', state?.password)
    data.append('device_type', config.device_type)
    data.append('device_lang', device_lang)
    data.append('fcm_token', await firebapushnotification.getFcmToken())
    data.append('user_type', state?.userType[state?.selectuserType].value)

    console.log('loginData', data)

    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      consolepro.consolelog("obj", obj.status)
      if (obj.status == true) {

        var user_details = obj.result;

        setState(prev => ({
          ...prev,
          emailfocus: false,
          passwordfocus: false
        }))

        consolepro.consolelog('user_details', user_details);
        const uservalue = {
          email_phone: state?.email, email: state?.email,
          password: state?.password
        };
        localStorage.setItemObject('user_login', uservalue);
        localStorage.setItemObject('user_arr', user_details);
        // msgProvider.toast(msgText.sucess_message_login[config.language], 'center')
        setTimeout(() => {
          navigation.navigate('Home');
        }, 700);



      } else {
        setTimeout(() => {
          msgProvider.showError(obj.message)
        }, 700);
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      setState(prev => ({
        ...prev,
        loading: false
      }))
    });

  }

  showUsertypeModal = (status) => {
    setState(prev => ({
      ...prev,
      showUsertype: status
    }))
  }

  const onSwipeLeft = (gestureState) => {
    navigation.navigate('Signup')
  }

  changePwdType = () => {
    setState(prev => ({
      ...prev,
      isSecurePassword: !state?.isSecurePassword,
    }))
  };

  const config4 = {
    velocityThreshold: 1,
    directionalOffsetThreshold: mobileW,
    // gestureIsClickThreshold:1
  };


  return (

    <GestureRecognizer
      onSwipeLeft={(state) => onSwipeLeft(state)}
      config={config4}
      style={{
        flex: 1,
        backgroundColor: state?.backgroundColor
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          // paddingBottom: mobileW * 2 / 500,
          height: mobileH + 30
        }}
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
      >
        <KeyboardAwareScrollView>

          <View style={{ flex: 1 }}>
            <SafeAreaView
              style={{ backgroundColor: Colors.statusbarcolor, flex: 0 }}
            />

            <StatusBar
              barStyle="dark-content"
              backgroundColor={Colors.statusbarcolor}
              hidden={false}
              translucent={false}
              networkActivityIndicatorVisible={true}
            />

            <View
              style={{
                paddingBottom: (mobileW * 6) / 100,
                backgroundColor: '#fff',

              }}>
              <View
                style={[Dimensions.get('window').height >= 700 ? {
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 5) / 100,
                } : {
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 2) / 100,
                }]}>
                <Image
                  style={{
                    width: (mobileW * 40) / 100,
                    height: (mobileW * 40) / 100,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                  }}
                  source={Icons.LogoWithText}></Image>
              </View>
              <View
                style={[Dimensions.get('window').height >= 700 ? {
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 10) / 100,
                } : {
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 3) / 100,
                }
                ]}>
                {/* <Text
                style={[{
                  fontSize:mobileW*4.5/100,
                 fontFamily: Font.blackheadingfontfamily,
                 
                  color: Colors.textblack,
                },Platform.OS=='ios'?{textAlign:config.textalign}:{textAlign:config.textalign}]}>
                {Lang_chg.Login[config.language]}
              </Text> */}
                <Text
                  style={{
                    fontSize: mobileW * 4.5 / 100,
                    fontFamily: Font.blackheadingfontfamily,
                    textAlign: config.textRotate,
                    color: Colors.textblack,
                  }}>
                  {Lang_chg.Login[config.language]}
                </Text>
              </View>

              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 1) / 100,
                }}>
                <Text
                  style={{

                    fontSize: Font.headinggray,
                    fontFamily: Font.headingfontfamily,
                    color: '#515C6F',
                    textAlign: config.textRotate,
                  }}>
                  {Lang_chg.Logintext[config.language]}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 4) / 100,
                }}>
                <DropDownboxSec
                  lableText={(state?.selectuserType == -1) ? Lang_chg.UserTypeText[config.language] : state?.userType[state?.selectuserType].title}
                  boxPressAction={() => { showUsertypeModal(true) }}
                />


                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={state?.showUsertype}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
                >
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { showUsertypeModal(false) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%' }}>
                    <View style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      //marginTop: 22
                    }}>
                      <View style={{
                        //margin: 20,
                        width: mobileW / 1.3,
                        backgroundColor: "white",
                        borderRadius: 5,
                        //padding: 35,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                      }}>
                        <View style={{
                          backgroundColor: Colors.textblue,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          paddingTop: 14,
                          paddingBottom: 14,
                          width: '100%'
                        }}>
                          <Text style={{
                            paddingLeft: 15,
                            color: Colors.white_color,
                            fontSize: 15,
                            fontFamily: Font.headingfontfamily,
                          }}>{Lang_chg.UserTypeText[config.language]}</Text>
                        </View>

                        {
                          state?.userType.map((data, index) => {
                            return (
                              <TouchableOpacity style={{
                                width: '100%',
                              }} onPress={() => {
                                setState(prev => ({
                                  ...prev,
                                  selectuserType: index
                                }))
                                showUsertypeModal(false)
                              }}>
                                <View style={{
                                  width: (Platform.OS == "ios") ? '95%' : '94.5%',
                                  marginLeft: 15,
                                  borderBottomColor: Colors.gray6,
                                  borderBottomWidth: (index == (state?.userType.length - 1)) ? 0 : 1,
                                }}>
                                  <Text style={{
                                    color: '#041A27',
                                    fontSize: 15,
                                    fontFamily: Font.headingfontfamily,
                                    // marginLeft: 15,
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                    width: '94.5%',
                                  }}>{data.title}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                          })
                        }
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>

              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 2) / 100,
                }}>
                <AuthInputBoxSec
                  mainContainer={{
                    width: '100%',
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.Mobileno[config.language]}
                  inputRef={(ref) => {
                    emailInput = ref;
                  }}
                  onChangeText={(text) =>
                    setState(prev => ({
                      ...prev,
                      email: text
                    }))
                  }
                  value={state?.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    passwordInput.focus();
                  }}
                />

              </View>

              <View

                style=
                {{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 2) / 100,
                  flexDirection: 'row',
                  // borderColor: state?.passwordfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                  // borderWidth: mobileW * 0.3 / 100,
                  // borderRadius: (mobileW * 1) / 100,
                }}>
                <AuthInputBoxSec
                  mainContainer={{
                    width: '100%',
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.password[config.language]}
                  inputRef={(ref) => {
                    passwordInput = ref;
                  }}
                  onChangeText={(text) =>
                    setState(prev => ({
                      ...prev,
                      password: text
                    }))
                  }
                  value={state?.password}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyLabel="done"
                  returnKeyType="done"
                  secureTextEntry={state?.isSecurePassword}
                  disableImg={true}
                  iconName={state?.isSecurePassword ? 'eye' : 'eye-off'}
                  iconPressAction={changePwdType}
                // onSubmitEditing={() => {
                //   loginbtn();
                // }}
                />

              </View>
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 4) / 100,
                  flexDirection: 'row',
                }}>
                {state?.remember_me == false && <TouchableOpacity activeOpacity={0.9} style={{ width: '45%', flexDirection: 'row', paddingLeft: mobileW * 1 / 100 }} onPress={() => { remember_me_fun() }}>
                  <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '20%' }}>
                      <Image style={{ height: 23, width: 23, resizeMode: 'contain', tintColor: '#696464' }}
                        source={Icons.BlackBox}></Image>
                    </View>

                    <Text
                      style={{
                        color: Colors.regulartextcolor,
                        fontFamily: Font.Regular,
                        // paddingLeft:mobileW*2/100,
                        // textAlign: config.textalign,
                        fontSize: Font.Remember,
                      }}>
                      {Lang_chg.Remember[config.language]}
                    </Text>
                  </View>
                </TouchableOpacity>}
                {state?.remember_me == true &&
                  <TouchableOpacity activeOpacity={0.9} style={{ width: '45%', paddingLeft: mobileW * 1 / 100 }} onPress={() => { remove_remember_me_fun() }} >

                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: '20%' }}>
                        <Image style={{ height: 23, width: 23, resizeMode: 'contain' }} source={Icons.CheckedBox}></Image>
                      </View>
                      <Text
                        style={{
                          color: Colors.regulartextcolor,
                          fontFamily: Font.Regular,
                          // paddingLeft:mobileW*2/100,
                          // textAlign: config.textalign,
                          fontSize: Font.Remember,
                        }}>
                        {Lang_chg.Remember[config.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                }




                <View style={{ width: '55%', alignSelf: 'center', }}>
                  <Text
                    onPress={() => {
                      navigation.navigate('Forgotpage');
                    }}
                    style={{
                      color: Colors.textblue,
                      fontFamily: Font.Regular,
                      fontSize: Font.Forgot,
                      alignSelf: 'flex-end',
                      textAlign: config.textalign,
                    }}>
                    {Lang_chg.Forgotpassword[config.language]}
                  </Text>
                </View>
              </View>

              <Button
                text={Lang_chg.Contiunebtn[config.language]}
                customStyles={
                  {

                  }
                }
                onPress={() => loginbtn()}
              />

            </View>

            <View style={{ width: '100%', backgroundColor: '#eef0f2', paddingVertical: mobileW * 3 / 100 }}>

            </View>

            <View
              style={{
                backgroundColor: Colors.backgroundcolorlight,
                paddingBottom: (mobileW * 15) / 100,
              }}>
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 5) / 100,
                }}>
                <Text
                  style={{
                    textAlign: config.textalign,
                    fontFamily: Font.Regular,
                    fontSize: Font.Forgot,
                    alignSelf: 'center',
                    color: Colors.regulartextcolor,
                  }}>
                  {Lang_chg.donot[config.language]}
                  {/* {Lang_chg.donot[config.language]} */}
                </Text>
              </View>

              <Button
                text={Lang_chg.createnewaccountbtn[config.language]}
                // onLoading={state?.loading}
                customStyles={
                  {
                    // mainContainer: styles.butonContainer
                  }
                }
                onPress={() => navigation.navigate('Signup')}
                isBlank={true}
              />

              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 1.1) / 100,
                  paddingBottom: mobileW * 5 / 100,
                }}>
                <Text
                  style={{
                    textAlign: config.textalign,
                    fontFamily: Font.Regular,
                    fontSize: Font.Forgot,
                    alignSelf: 'center',
                    color: Colors.regulartextcolor,
                  }}>
                  {Lang_chg.swipe_text[config.language]}
                </Text>
              </View>
            </View>
          </View>

        </KeyboardAwareScrollView>
      </ScrollView>
    </GestureRecognizer>
  );

}
