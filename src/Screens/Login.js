import { Modal, Text, Dimensions, View, PermissionsAndroid, Platform, BackHandler, Alert, ScrollView, StatusBar, SafeAreaView, Image, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Colors, Font, mobileH, Configurations, mobileW, LanguageConfiguration, API, MessageTexts,  MessageFunctions, localStorage } from '../Helpers/Utils';
import GestureRecognizer from 'react-native-swipe-gestures';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications';
import { Icons } from '../Assets/Icons/IReferences'
import { ScreenReferences } from '../Stacks/ScreenReferences';

global.current_lat_long = 'NA';
global.myLatitude = 'NA';
global.myLongitude = 'NA';

export default Login = ({ navigation, route }) => {

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

  const get_language = async () => {
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

  const getlatlong = async () => {

    let permission = await localStorage.getItemString('permission')
    if (permission != 'denied') {
      if (Platform.OS === 'ios') {
        callLocation();
      } else {
        async function requestLocationPermission() {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
              'title': 'Location Access Required',
              'message': 'This App needs to Access your location'
            })
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              callLocation();
            } else {
              let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.latitude } }
              getalldata(position)
              localStorage.setItemString('permission', 'denied')

            }
          } catch (err) { console.warn(err) }
        }
        requestLocationPermission();
      }
    } else {
      let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.longitude } }
      getalldata(position)
    }
  }

  const callLocation = async () => {
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
            let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.longitude } }

            getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        watchID = Geolocation.watchPosition((position) => {

          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position)
            getalldata(position)
          }

        });

      }
      else {
        var pointcheck = 0
        Geolocation.getCurrentPosition(
          (position) => {
            localStorage.setItemObject('position', position)
            getalldata(position)
            pointcheck = 1
          },
          (
            error) => {
            let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.longitude } }

            getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        watchID = Geolocation.watchPosition((position) => {

          if (pointcheck != 1) {

            localStorage.setItemObject('position', position)
            getalldata(position)
          }

        });
      }
    })
  }

  const handleBackPress = () => {
    Alert.alert(
      LanguageConfiguration.titleexitapp[Configurations.language],
      LanguageConfiguration.exitappmessage[Configurations.language], [{
        text: LanguageConfiguration.no_txt[Configurations.language],
        onPress: () => console.log('Cancel Pressed'),
        style: LanguageConfiguration.no_txt[Configurations.language],
      }, {
        text: LanguageConfiguration.yes_txt[Configurations.language],
        onPress: () => BackHandler.exitApp()
      }], {
      cancelable: false
    }
    ); // works best when the goBack is async 
    return true;
  };

  const get_rem_data = async () => {
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

  const remember_me_fun = async () => {

    if (state?.remember_me == false) {
      let data = { 'email': state?.email, 'password': state?.password }
      localStorage.setItemObject('remeberdata', data)
    }
    else {
      localStorage.setItemObject('remeberdata', null)
    }
    setState(prev => ({
      ...prev,
      remember_me: true
    }))
  }

  const remove_remember_me_fun = async () => {
    await localStorage.removeItem('remeberdata');
    setState(prev => ({
      ...prev,
      remember_me: false
    }))
  }

  const loginbtn = async () => {

    Keyboard.dismiss()
    var email = state?.email.trim()
    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (state?.selectuserType == -1) {
      MessageFunctions.showError(MessageTexts.emptyUsertype[Configurations.language])
      return false;
    }

    if (email.length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyEmail[Configurations.language])
      return false;
    }

    if (regemail.test(email) !== true) {
      MessageFunctions.showError(MessageTexts.validEmail[Configurations.language])
      return false
    }

    if (state?.password.length <= 0 || state?.password.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyPassword[Configurations.language])
      return false
    }
    var device_lang
    if (Configurations.language == 0) {
      device_lang = 'ENG'
    }
    else {
      device_lang = 'AR'
    }

    let url = Configurations.baseURL + "api-service-provider-login";
    var data = new FormData();
    data.append('email', state?.email)
    data.append('password', state?.password)
    data.append('device_type', Configurations.device_type)
    data.append('device_lang', device_lang)
    data.append('fcm_token', await FBPushNotifications.getFcmToken())
    data.append('user_type', state?.userType[state?.selectuserType].value)

    console.log('loginData', data)

    API.post(url, data).then((obj) => {
      
      console.log("obj", obj.status)
      if (obj.status == true) {

        var user_details = obj.result;

        setState(prev => ({
          ...prev,
          emailfocus: false,
          passwordfocus: false
        }))

        console.log('user_details', user_details);
        const uservalue = {
          email_phone: state?.email, email: state?.email,
          password: state?.password
        };
        localStorage.setItemObject('user_login', uservalue);
        localStorage.setItemObject('user_arr', user_details);
        setTimeout(() => {
          navigation.navigate('Home');
        }, 700);



      } else {
        setTimeout(() => {
          MessageFunctions.showError(obj.message)
        }, 700);
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setState(prev => ({
        ...prev,
        loading: false
      }))
    });

  }

  const showUsertypeModal = (status) => {
    setState(prev => ({
      ...prev,
      showUsertype: status
    }))
  }

  const onSwipeLeft = (gestureState) => {
    navigation.navigate(ScreenReferences.Signup)
  }

  const changePwdType = () => {
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
      Configurations={config4}
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
                  
                <Text
                  style={{
                    fontSize: mobileW * 4.5 / 100,
                    fontFamily: Font.blackheadingfontfamily,
                    textAlign: Configurations.textRotate,
                    color: Colors.textblack,
                  }}>
                  {LanguageConfiguration.Login[Configurations.language]}
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
                    textAlign: Configurations.textRotate,
                  }}>
                  {LanguageConfiguration.Logintext[Configurations.language]}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 4) / 100,
                }}>
                <DropDownboxSec
                  lableText={(state?.selectuserType == -1) ? LanguageConfiguration.UserTypeText[Configurations.language] : state?.userType[state?.selectuserType].title}
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
                          }}>{LanguageConfiguration.UserTypeText[Configurations.language]}</Text>
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
                  lableText={LanguageConfiguration.Mobileno[Configurations.language]}
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
                }}>
                <AuthInputBoxSec
                  mainContainer={{
                    width: '100%',
                  }}
                  // icon={layer9_icon}
                  lableText={LanguageConfiguration.password[Configurations.language]}
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
                  iconName={state?.isSecurePassword ? 'eye-off' : 'eye'}
                  iconPressAction={changePwdType}
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
                        fontSize: Font.Remember,
                      }}>
                      {LanguageConfiguration.Remember[Configurations.language]}
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
                          fontSize: Font.Remember,
                        }}>
                        {LanguageConfiguration.Remember[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                }




                <View style={{ width: '55%', alignSelf: 'center', }}>
                  <Text
                    onPress={() => {
                      navigation.navigate(ScreenReferences.ForgotPassword);
                    }}
                    style={{
                      color: Colors.textblue,
                      fontFamily: Font.Regular,
                      fontSize: Font.Forgot,
                      alignSelf: 'flex-end',
                      textAlign: Configurations.textalign,
                    }}>
                    {LanguageConfiguration.Forgotpassword[Configurations.language]}
                  </Text>
                </View>
              </View>

              <Button
                text={LanguageConfiguration.Contiunebtn[Configurations.language]}
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
                    textAlign: Configurations.textalign,
                    fontFamily: Font.Regular,
                    fontSize: Font.Forgot,
                    alignSelf: 'center',
                    color: Colors.regulartextcolor,
                  }}>
                  {LanguageConfiguration.donot[Configurations.language]}
                </Text>
              </View>

              <Button
                text={LanguageConfiguration.createnewaccountbtn[Configurations.language]}
                onPress={() => navigation.navigate(ScreenReferences.Signup)}
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
                    textAlign: Configurations.textalign,
                    fontFamily: Font.Regular,
                    fontSize: Font.Forgot,
                    alignSelf: 'center',
                    color: Colors.regulartextcolor,
                  }}>
                  {LanguageConfiguration.swipe_text[Configurations.language]}
                </Text>
              </View>
            </View>
          </View>

        </KeyboardAwareScrollView>
      </ScrollView>
    </GestureRecognizer>
  );

}
