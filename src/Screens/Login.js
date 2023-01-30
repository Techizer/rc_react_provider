import { Modal, Text, Dimensions, View, PermissionsAndroid, Platform, BackHandler, Alert, ScrollView, StatusBar, SafeAreaView, Image, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Colors, Font, mobileH, Configurations, mobileW, LanguageConfiguration, API, MessageTexts, MessageFunctions, localStorage } from '../Helpers/Utils';
import GestureRecognizer from 'react-native-swipe-gestures';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications';
import { Icons } from '../Assets/Icons/IReferences'
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { setRememberedEmail, setRememberedPassword, setShouldAutoLogin, setUserFCMToken, setUserLoginData, setUserLoginType } from '../Redux/Actions/UserActions';

global.current_lat_long = 'NA';
global.myLatitude = 'NA';
global.myLongitude = 'NA';

export default Login = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    isSecurePassword: true,
    email: '',
    password: '',
    device_lang: 'AR',
    langaugeme: 0,
    isRememberChecked: false,
    fcm_token: 123456,
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

  const setState = (payload) => {
    setClassStateData(prev => ({
      ...prev,
      ...payload
    }))
  }

  const dispatch = useDispatch()

  const {
    userType,
    shouldAutoLogin,
    userEmail,
    userPassword
  } = useSelector(state => state.Auth)

  useEffect(() => {
    console.log({
      email: userEmail,
      password: userPassword,
      isRememberChecked: shouldAutoLogin,
      selectuserType: classStateData.userType.findIndex(u => u.title === userType.title)
    });
    if (shouldAutoLogin) {
      if (userEmail && userPassword) {
        setState({
          email: userEmail,
          password: userPassword,
          isRememberChecked: shouldAutoLogin,
          selectuserType: classStateData.userType.findIndex(u => u.title === userType.title)
        })
      }
    }
  }, [])

  useEffect(() => {
    navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', handleBackPress),
    );
    getLanguage()
  }, [])

  useEffect(() => {
    navigation.addListener('focus', () => {
      getLanguage()
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

  useEffect(() => {
    const setFCM = async () => {
      const fcm = await FBPushNotifications.getFcmToken()
      if (fcm) {
        setState({
          fcm_token: fcm
        })
      }
    }
    setFCM()

  }, [])

  const getLanguage = async () => {
    let textalign = await localStorage.getItemObject('language');
    if (textalign != null) {

      setState({
        langaugeme: textalign
      })

    }
    let address_arr = await localStorage.getItemObject('address_arr')
    if (address_arr == '' || address_arr == 'NA' || address_arr == null) {
      getLatitudeLongitude();
    }

  }

  const getData = (position) => {

    let longitude = position.coords.longitude
    let latitude = position.coords.latitude
    setState({
      latitude: latitude,
      longitude: longitude,
      loading: false
    })

    global.current_lat_long = position;
    global.myLatitude = latitude;
    global.myLongitude = longitude;

    let event = { latitude: latitude, longitude: longitude, latitudeDelta: classStateData?.latdelta, longitudeDelta: classStateData?.longdelta }
    getAddressFromLatLong(event)
  }

  const getAddressFromLatLong = (event) => {

    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.latitude + ',' + event.longitude + '&key=' + Configurations.mapkey + '&language=' + Configurations.maplanguage)

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
        setState({
          latdelta: event.latitudeDelta,
          longdelta: event.longitudeDelta,
          latitude: event.latitude,
          longitude: event.longitude,
          addressselected: details.formatted_address,
          add_my_location: data2
        })

        localStorage.setItemObject('address_arr', add_location.address);
      })



  }

  const getLatitudeLongitude = async () => {

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
              getData(position)
              localStorage.setItemString('permission', 'denied')

            }
          } catch (err) { console.warn(err) }
        }
        requestLocationPermission();
      }
    } else {
      let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.longitude } }
      getData(position)
    }
  }

  const callLocation = async () => {
    setState({
      loading: true
    })
    localStorage.getItemObject('position').then((position) => {
      // console.log('position', position)
      if (position != null) {
        var pointcheck1 = 0
        getData(position)
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {

            localStorage.setItemObject('position', position)
            getData(position);
            pointcheck1 = 1
          },
          (error) => {
            let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.longitude } }

            getData(position)
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        watchID = Geolocation.watchPosition((position) => {

          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position)
            getData(position)
          }

        });

      }
      else {
        var pointcheck = 0
        Geolocation.getCurrentPosition(
          (position) => {
            localStorage.setItemObject('position', position)
            getData(position)
            pointcheck = 1
          },
          (
            error) => {
            let position = { 'coords': { 'latitude': Configurations.latitude, 'longitude': Configurations.longitude } }

            getData(position)
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        watchID = Geolocation.watchPosition((position) => {

          if (pointcheck != 1) {

            localStorage.setItemObject('position', position)
            getData(position)
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

  const onLogin = async () => {

    Keyboard.dismiss()
    var email = classStateData?.email.trim()
    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (classStateData?.selectuserType == -1) {
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

    if (classStateData?.password.length <= 0 || classStateData?.password.trim().length <= 0) {
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
    data.append('email', classStateData?.email)
    data.append('password', classStateData?.password)
    data.append('device_type', Configurations.device_type)
    data.append('device_lang', device_lang)
    data.append('fcm_token', classStateData.fcm_token)
    data.append('user_type', classStateData?.userType[classStateData?.selectuserType].value)

    console.log('loginData', data)

    API.post(url, data).then((obj) => {

      console.log("obj", obj.status)
      if (obj.status == true) {

        var user_details = obj.result;

        setState(classStateData)

        console.log('user_details', user_details);
        const uservalue = {
          email_phone: classStateData?.email, email: classStateData?.email,
          password: classStateData?.password
        };
        localStorage.setItemObject('user_login', uservalue);
        localStorage.setItemObject('user_arr', user_details);

        dispatch(setUserLoginData(obj?.result))
        dispatch(setUserFCMToken(classStateData?.fcm_token))
        dispatch(setUserLoginType(classStateData?.userType[classStateData?.selectuserType].value))
        dispatch(setShouldAutoLogin(classStateData?.isRememberChecked))
        
        if (classStateData?.isRememberChecked == true) {
          dispatch(setRememberedEmail(classStateData?.email))
          dispatch(setRememberedPassword(classStateData?.password))
        }

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
      setState({
        loading: false
      })
    });

  }

  const showUsertypeModal = (status) => {
    setState({
      showUsertype: status
    })
  }

  const onSwipeLeft = (gestureState) => {
    navigation.navigate(ScreenReferences.Signup)
  }

  const GestureConfigurations = {
    velocityThreshold: 1,
    directionalOffsetThreshold: mobileW,
  };


  return (

    <GestureRecognizer
      onSwipeLeft={(classStateData) => onSwipeLeft(classStateData)}
      Configurations={GestureConfigurations}
      style={{
        flex: 1,
        backgroundColor: classStateData?.backgroundColor
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
                  lableText={(classStateData?.selectuserType == -1) ? LanguageConfiguration.UserTypeText[Configurations.language] : classStateData?.userType[classStateData?.selectuserType].title}
                  boxPressAction={() => { showUsertypeModal(true) }}
                />


                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={classStateData?.showUsertype}
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
                          classStateData?.userType.map((data, index) => {
                            return (
                              <TouchableOpacity style={{
                                width: '100%',
                              }} onPress={() => {
                                setState({
                                  selectuserType: index
                                })
                                showUsertypeModal(false)
                              }}>
                                <View style={{
                                  width: (Platform.OS == "ios") ? '95%' : '94.5%',
                                  marginLeft: 15,
                                  borderBottomColor: Colors.gray6,
                                  borderBottomWidth: (index == (classStateData?.userType.length - 1)) ? 0 : 1,
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
                    setState({
                      email: text
                    })
                  }
                  value={classStateData?.email}
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
                    setState({
                      password: text
                    })
                  }
                  value={classStateData?.password}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyLabel="done"
                  returnKeyType="done"
                  secureTextEntry={classStateData?.isSecurePassword}
                  disableImg={true}
                  iconName={classStateData?.isSecurePassword ? 'eye-off' : 'eye'}
                  iconPressAction={() => {
                    setState({
                      isSecurePassword: !classStateData?.isSecurePassword,
                    })
                  }}
                />

              </View>
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 4) / 100,
                  flexDirection: 'row',
                }}>

                <TouchableOpacity activeOpacity={0.9} style={{ width: '45%', flexDirection: 'row', paddingLeft: mobileW * 1 / 100 }} onPress={() => { 
                  setState({
                    isRememberChecked:!classStateData.isRememberChecked
                  })
                 }}>
                  <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '20%' }}>
                      <Image style={{ height: 23, width: 23, resizeMode: 'contain',  }}
                        source={classStateData?.isRememberChecked == false ? Icons.BlackBox : Icons.CheckedBox}></Image>
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
                onPress={() => onLogin()}
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
