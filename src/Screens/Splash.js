import { Text, View, Image, StatusBar, Modal, TouchableOpacity, Linking, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Font, Configurations, windowWidth, LanguageConfiguration, API } from '../Helpers/Utils';
global.add_location = 'NA';
global.amount_total = 0;
global.username = 'NA'
import HTMLView from 'react-native-htmlview';
import DeviceInfo from 'react-native-device-info';
import { Icons } from '../Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { onUserLogout, setUserFCMToken, setUserLoginData, setVideoCall, setVideoCallStatus } from '../Redux/Actions/UserActions';
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications'
import { SvgXml } from 'react-native-svg';
import { PatternLogo, SplashLogo, Splash_Logo } from '../Icons/SvgIcons/Index';
import { vs } from 'react-native-size-matters';
const appVersion = DeviceInfo.getVersion();

export default Splash = ({ navigation, route }) => {

  const [state, setState] = useState({
    email: '',
    password: '',
    device_lang: 'ENG',
    loanguage: 0,
    modalVisible3: false,
    appVer: '',
    updTitle: '',
    updText: '',
    skipFlag: '',
    skipText: '',
    rdrTo: '',
    rdrUrl: '',
    showHelp: '',
    helpTitle: '',
    helpUrl: '',
  })

  const {
    userType,
    shouldAutoLogin,
    userEmail,
    userPassword,
    loginUserData
  } = useSelector(state => state.StorageReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    checkAppVersion()
  }, [])

  const checkAppVersion = async () => {
    dispatch(setVideoCallStatus(0))
    dispatch(setVideoCall(false))

    let lang = (state?.loanguage == 1) ? "ENG" : "ENG"
    let url = Configurations.baseURL + ((Platform.OS === 'ios') ? ("api-ios-provider-update?divice_lang=" + lang) : ("api-android-provider-update?divice_lang=" + lang))
    // console.log("url", url, Configurations.language)
    API.get(url, 1).then((obj) => {

      if (obj.status == true) {
        const newCode = obj?.result?.appVer?.split('.').map((i, _i) => (`${i}`.length > 0 && _i !== 0) ? `${i}`.charAt(0) : `${i}`).join('')
        const myCode = appVersion.split('.').map((i, _i) => (`${i}`.length > 0 && _i !== 0) ? `${i}`.charAt(0) : `${i}`).join('')
        console.log({ newCode, myCode });

        if (parseInt(newCode) > parseInt(myCode)) {
          setState(prev => ({
            ...prev,
            appVer: obj.result.appVer,
            updTitle: '<h3>' + obj.result.updTitle + '</h3>',
            updText: '<p>' + obj.result.updText + '</p>',
            skipFlag: obj.result.skipFlag,
            skipText: obj.result.skipText,
            rdrTo: obj.result.rdrTo,
            rdrUrl: obj.result.rdrUrl,
            showHelp: obj.result.showHelp,
            helpTitle: obj.result.helpTitle,
            helpUrl: obj.result.helpUrl,
            modalVisible3: true
          }))
        } else {
          setTimeout(() => {
            createNewLoginSession()
          }, 1000);
        }
      } else {
        setTimeout(() => {
          createNewLoginSession()
        }, 1000);
        return false;
      }

    }).catch((error) => {
      createNewLoginSession()
      console.log("-------- error version check ------- " + error);
    })

  }

  const logout = async () => {
    const fcm_token = await FBPushNotifications.getFcmToken()
    let url = Configurations.baseURL + "api-logout";
    var data = new FormData();
    data.append('user_id', loginUserData?.user_id)
    data.append('fcm_token', fcm_token)

    API.post(url, data, 1).finally(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: ScreenReferences.Login }],
      });
    })

  };

  const createNewLoginSession = async () => {

    const fcmToken = await FBPushNotifications.getFcmToken()

    dispatch(setUserFCMToken(fcmToken))

    if (loginUserData !== null) {
      let url = Configurations.baseURL + "api-check-login";
      var data = new FormData();
      data.append("user_id", loginUserData?.user_id);
      data.append("fcm_token", fcmToken);

      API
        .post(url, data, 1)
        .then((obj) => {
          if (obj.result == true) {
            var device_lang
            if (Configurations.language == 0) {
              device_lang = 'ENG'
            }
            else {
              device_lang = 'AR'
            }

            if (userEmail && userEmail != '') {

              let url = Configurations.baseURL + "api-service-provider-splash";
              var data = new FormData();

              data.append('phone_number', userEmail)
              data.append('device_type', Configurations.device_type)
              data.append('fcm_token', fcmToken)

              // console.log(data._parts);
              API.post(url, data, 1).then((obj) => {
                // console.log({ obj });
                if (obj.status == true) {
                  dispatch(setUserLoginData(obj.result))
                  dispatch(setUserFCMToken(fcmToken))
                  navigation.reset({
                    index: 0,
                    routes: [{ name: ScreenReferences.Home }],
                  });
                }
                else {
                  logout()
                }
              }).catch((error) => {
                console.log("-------- error relogin ------- " + error);
              });

            } else {
              logout()
            }

          } else {
            logout()
          }
        })
        .catch((error) => {
          console.log("-------- error check login ------- " + error);
        });
    }
    else {
      navigation.reset({
        index: 0,
        routes: [{ name: ScreenReferences.Login }],
      });
    }

  }

  const openAppstoreUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    // console.log('supported:: ', supported, url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }


  return (

    <View style={{
      width: '100%', alignSelf: 'center', flex: 1,
      backgroundColor: Colors.white_color,
      // justifyContent: 'center'
    }}>

      {/* <Image style={{ height: windowWidth * 80 / 100, width: windowWidth * 95 / 100, resizeMode: 'contain', alignSelf: 'center', marginTop: windowWidth * 15 / 100 }}
        source={Icons.SplashLogo} /> */}

      <View style={{ position: 'absolute', top: 0 }}>
        <SvgXml xml={PatternLogo} />
      </View>

      <View style={{ marginTop: vs(110) }}>
        <SvgXml xml={SplashLogo} style={{ alignSelf: 'center' }} />
      </View>

      {/* <View style={{ width: '50%', alignSelf: 'center', borderColor: Colors.bordercolor, borderBottomWidth: windowWidth * 0.3 / 100, marginTop: windowWidth * 6 / 100 }}></View> */}


      <View style={{ width: '65%', alignSelf: 'center', marginTop: vs(25) }}>
        <Text style={{ marginTop: windowWidth / 10, fontSize: 24, color: Colors.Black, fontFamily: Font.Bold, alignSelf: 'center', textAlign: 'center', lineHeight:36 }}>{LanguageConfiguration.Splashtext1[state?.loanguage]} </Text>
      </View>

      {/* <View style={{ width: '50%', alignSelf: 'center', borderColor: Colors.bordercolor, borderBottomWidth: windowWidth * 0.3 / 100, marginTop: windowWidth * 6 / 100 }}></View> */}

      <View style={{ width: '52%', alignSelf: 'center', marginTop: vs(20) }}>
        <Text style={{ marginTop: windowWidth / 10, fontSize: Font.xlarge, color: Colors.Black, fontFamily: Font.Regular, alignSelf: 'center', textAlign: 'center', lineHeight:22 }}>{LanguageConfiguration.Splashtext2[state?.loanguage]} </Text>
      </View>


      <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', position: 'absolute', bottom: vs(40),  }}>
        <Image style={{ height: windowWidth * 20 / 100, width: windowWidth * 20 / 100, resizeMode: 'contain', alignSelf: 'center' }}
          source={Icons.SplashStamp} />

        <View style={{ marginLeft: windowWidth / 20 }}>
          <Text style={{ fontSize: Font.medium, color: Colors.Black, fontFamily: Font.Regular, lineHeight:20}}>{'Accredited by'} </Text>
          <Text style={{ marginTop: 3, fontSize: Font.medium, color: Colors.Black, fontFamily: Font.Regular,lineHeight:20 }}>{'Chap Organization'} </Text>
        </View>
      </View>


      <Modal
        animationType="fade"
        transparent={true}
        visible={state?.modalVisible3}

        onRequestClose={() => { setState(prev => ({ ...prev, modalVisible3: false })) }}>
        <TouchableOpacity activeOpacity={0.9}
          disabled={true}
          onPress={() => {

          }}
          style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>

          <View style={{ borderRadius: 20, width: windowWidth * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

            <View style={{ backgroundColor: '#fff', borderRadius: 2, width: "100%", }}>

              <View style={{
                alignSelf: 'flex-start',
                width: windowWidth * 80 / 100,
                height: windowWidth * 14 / 100,
                paddingVertical: windowWidth * 3 / 100,
                marginTop: windowWidth * 2 / 100,
                paddingLeft: windowWidth * 4 / 100, flexDirection: 'row',
              }}>
                <HTMLView
                  value={state?.updTitle}
                  stylesheet={{
                    h3: {
                      fontFamily: Font.Regular,
                      color: Colors.textblack, //'#000',
                      fontSize: windowWidth * 4.8 / 100,
                      opacity: 0.9
                    },

                    paddingLeft: windowWidth * 4 / 100
                  }}
                />
              </View>
              <View style={{
                alignSelf: 'flex-start',
                paddingVertical: windowWidth * 1 / 100,
                paddingLeft: windowWidth * 4 / 100,
                paddingRight: windowWidth * 4 / 100,
                flexDirection: 'row', alignItems: 'center',
                // backgroundColor: 'red'
              }}>

                <HTMLView
                  value={state?.updText}
                  stylesheet={{
                    p: {
                      fontFamily: Font.Regular,
                      color: Colors.textblack,
                      fontSize: windowWidth * 4 / 100,
                      textAlign: 'left',
                      opacity: 0.9
                    },
                  }}
                />
              </View>



              <View style={{
                flexDirection: 'row',
                justifyContent: (state?.skipFlag) ? 'space-between' : 'flex-end',
                width: '70%', paddingBottom: windowWidth * 5 / 100, marginTop: windowWidth * 9 / 100,
                alignSelf: 'flex-end', right: 16,
                // backgroundColor: 'red'
              }}>
                {
                  (state?.skipFlag) &&
                  <TouchableOpacity onPress={() => {
                    setState(prev => ({
                      ...prev,
                      modalVisible3: false
                    }))
                    createNewLoginSession()
                  }}
                    style={{
                      width: windowWidth * 35 / 100,
                      flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-end',

                    }}>
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: windowWidth * 3.8 / 100,
                        color: Colors.terms_text_color_blue, //Colors.bordercolorblue,
                        alignSelf: 'center'
                      }}>{state?.skipText}</Text>
                  </TouchableOpacity>
                }


                <TouchableOpacity onPress={() => {
                  openAppstoreUrl(state?.rdrUrl)
                }}
                  activeOpacity={0.8}
                  style={{
                    width: windowWidth * 22 / 100,
                    height: windowWidth * 8 / 100,
                    justifyContent: 'center',
                    backgroundColor: '#549E36',
                    alignSelf: 'flex-end',
                  }}>
                  <Text style={{
                    fontFamily: Font.Regular,
                    fontSize: windowWidth * 3.8 / 100,
                    color: Colors.white_color, alignSelf: 'center'
                  }}>{LanguageConfiguration.Update[Configurations.language]}</Text>
                </TouchableOpacity>
              </View>
              {
                (state?.showHelp) &&
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: Colors.gray5,
                    height: windowWidth * 15 / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: windowWidth * 4 / 100,
                    marginRight: windowWidth * 4 / 100,

                  }}
                >
                  <Text style={{
                    fontFamily: Font.Regular,
                    fontSize: windowWidth * 3.5 / 100,
                    color: Colors.placeholder_border,
                  }}>
                    {LanguageConfiguration.Help[Configurations.language]}
                  </Text>
                  <Text style={{
                    fontFamily: Font.Regular,
                    fontSize: windowWidth * 3.5 / 100,
                    color: Colors.terms_text_color_blue,
                    marginLeft: 6,
                  }} onPress={() => {
                    openAppstoreUrl(state?.helpUrl)
                  }}>{state?.helpUrl}</Text>
                </View>
              }
            </View>

          </View>
        </TouchableOpacity>
      </Modal>

    </View >
  )

}