import { Text, View, Image, StatusBar, Modal, TouchableOpacity, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Font, Configurations, mobileW, localStorage, LanguageConfiguration, API } from '../Helpers/Utils';
global.add_location = 'NA';
global.amount_total = 0;
global.username = 'NA'
import HTMLView from 'react-native-htmlview';
import DeviceInfo from 'react-native-device-info';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
const appVersion = DeviceInfo.getVersion();

export default Splash = ({navigation, route}) => {

  const [state, setState] = useState({
    email: '',
    password: '',
    engbtn: true,
    device_lang: 'AR',
    fcm_token: 123456,
    loanguage: 1,
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
    modalVisible3: ''
  })

  const add_location = 'NA'

  useEffect(() => {
    language_fun()
    authenticateSession()
  }, [])

  const language_fun = async () => {
    let textalign = await localStorage.getItemObject('language');
    console.log('textaligntextalign:: ', textalign);
    if (textalign != null) {
      console.log('textaligntextalign::if ', textalign);
      if (textalign == 1) {

        Configurations.textalign = 'right';
        // Configurations.textalign = 'left';
        Configurations.language = 1
        setState(prev => ({
          ...prev,
          loanguage: 1
        }))
      } else {
        localStorage.setItemObject('languagesetenglish', 3);
        localStorage.setItemObject('languagecathc', 0)
        Configurations.textalign = 'left';
        Configurations.language = 0
        setState(prev => ({
          ...prev,
          loanguage: 0
        }))
      }
    }
    else {
      console.log('textaligntextalign::else ', textalign);
      // Configurations.textalign = 'right';
      // Configurations.language = 1
      // localStorage.setItemObject('language', 1)
      // setState({ loanguage: 1 })
      Configurations.textalign = 'left';
      Configurations.language = 0
      localStorage.setItemObject('languagesetenglish', 3);
      localStorage.setItemObject('languagecathc', 0)

      setState(prev => ({
        ...prev,
        loanguage: 0
      }))
    }

  }

  const authenticateSession = async () => {
    apiIosPatientUpdate()
  }

  const apiIosPatientUpdate = async () => {
    let lang = (state?.loanguage == 1) ? "ENG" : "ENG"
    let url = Configurations.baseURL + "api-ios-provider-update" + "?divice_lang=" + lang;
    console.log("url", url, Configurations.language)
    API.get(url, 1).then((obj) => {
      
      if (obj.status == true) {
        if (parseFloat(obj.result.appVer) > parseFloat(appVersion)) {
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
          checkAuth()
        }

        console.log('get area', obj.result)

      } else {
        checkAuth()
        return false;
      }
    }).catch((error) => {
      checkAuth()
      console.log("-------- error ------- " + error);
    })

  }

  const checkAuth = () => {
    setTimeout(() => {
      new_authenticatesessinon()
    }, 2000);
  }

  const checkAuthUserLogin = async (result, logindetail) => {
    let result1 = await localStorage.getItemObject('user_signup');

    let email = logindetail.email_phone
    let password = logindetail.password
    let user_type = result.user_type
    var device_lang
    if (Configurations.language == 0) {
      device_lang = 'ENG'
    }
    else {
      device_lang = 'AR'
    }
    let url = Configurations.baseURL + "api-service-provider-login";
    var data = new FormData();

    data.append('email', email)
    data.append('password', password)
    data.append('device_type', Configurations.device_type)
    data.append('device_lang', device_lang)
    data.append('fcm_token', fcmtoken)
    data.append('user_type', user_type)

    console.log('data', data)
    API.post(url, data).then((obj) => {
      console.log('obj', obj)
      if (obj.status == true) {
        var user_details = obj.result;
        localStorage.setItemObject('user_arr', user_details);

        navigation.navigate('Home')

      }
      else {
        navigation.navigate('Login')
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);

    });
  }

  const checkLogout = async (result, logindetail) => {

    let user_id = result.user_id;
    let url = Configurations.baseURL + "api-check-login";
    var data = new FormData();
    data.append("user_id", user_id);
    data.append("fcm_token", fcmtoken);

    console.log("url", url);
    console.log("data", data);
    API
      .post(url, data, 1)
      .then((obj) => {
        console.log("obj checkLogout: ", obj);
        if (obj.result == true) {
          checkAuthUserLogin(result, logindetail);

        } else {
          logout()
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  }

  const logout = async () => {
    await localStorage.removeItem("user_arr");
    await localStorage.removeItem("user_login");
    navigation.reset({
      index: 0,
      routes: [{ name: ScreenReferences.Login }],
    });
  };

  const new_authenticatesessinon = async () => {

    let result = await localStorage.getItemObject('user_arr');
    let logindetail = await localStorage.getItemObject('user_login');
    console.log('splasedata', logindetail)
    if (result != null) {

      console.log("result ", result)
      checkLogout(result, logindetail)
      //  if(result.otp_verify == 1)
      //  {
      //&& result.profile_complete==0


    }
    else {
      navigation.navigate('Login')
    }

  }

  const openAppstoreUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    console.log('supported:: ', supported, url);
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
      backgroundColor: Colors.white_color
    }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.statusbarcolor}
        hidden={false}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />

      <Image style={{ height: mobileW * 80 / 100, width: mobileW * 95 / 100, resizeMode: 'contain', alignSelf: 'center', marginTop: mobileW * 15 / 100 }}
        source={Icons.SplashLogo}>

      </Image>

      <View style={{ width: '50%', alignSelf: 'center', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, marginTop: mobileW * 6 / 100 }}>


      </View>

      <View style={{ width: '50%', alignSelf: 'center', marginTop: mobileW * 3 / 100 }}>
        <Text style={{ marginTop: mobileW * 0.5 / 100, fontSize: mobileW * 4 / 100, color: Colors.splashtextcolor, fontFamily: Font.Regular, alignSelf: 'center', textAlign: 'center' }}>{LanguageConfiguration.Splashtext1[state?.loanguage]} </Text>
      </View>

      <View style={{ width: '50%', alignSelf: 'center', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, marginTop: mobileW * 6 / 100 }}>


      </View>

      <View style={{ width: '63%', alignSelf: 'center', marginTop: mobileW * 4 / 100 }}>
        <Text style={{ marginTop: mobileW * 0.5 / 100, fontSize: mobileW * 4 / 100, color: Colors.splashtextcolor, fontFamily: Font.Regular, alignSelf: 'center', textAlign: 'center' }}>{LanguageConfiguration.Splashtext2[state?.loanguage]} </Text>

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
          <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
            networkActivityIndicatorVisible={true} />
          <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

            <View style={{ backgroundColor: '#fff', borderRadius: 2, width: "100%", }}>

              <View style={{
                alignSelf: 'flex-start',
                width: mobileW * 80 / 100,
                height: mobileW * 14 / 100,
                paddingVertical: mobileW * 3 / 100,
                marginTop: mobileW * 2 / 100,
                paddingLeft: mobileW * 4 / 100, flexDirection: 'row',
              }}>
                <HTMLView
                  value={state?.updTitle}
                  stylesheet={{
                    h3: {
                      fontFamily: Font.Regular,
                      color: Colors.textblack, //'#000',
                      fontSize: mobileW * 4.8 / 100,
                      opacity: 0.9
                    },

                    paddingLeft: mobileW * 4 / 100
                  }}
                />
              </View>
              <View style={{
                alignSelf: 'flex-start',
                paddingVertical: mobileW * 1 / 100,
                paddingLeft: mobileW * 4 / 100,
                paddingRight: mobileW * 4 / 100,
                flexDirection: 'row', alignItems: 'center',
                // backgroundColor: 'red'
              }}>

                <HTMLView
                  value={state?.updText}
                  stylesheet={{
                    p: {
                      fontFamily: Font.Regular,
                      color: Colors.textblack,
                      fontSize: mobileW * 4 / 100,
                      textAlign: 'left',
                      opacity: 0.9
                    },
                  }}
                />
              </View>



              <View style={{
                flexDirection: 'row',
                justifyContent: (state?.skipFlag) ? 'space-between' : 'flex-end',
                width: '70%', paddingBottom: mobileW * 5 / 100, marginTop: mobileW * 9 / 100,
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
                    new_authenticatesessinon()
                  }}
                    style={{
                      width: mobileW * 35 / 100,
                      flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-end',

                    }}>
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: mobileW * 3.8 / 100,
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
                    width: mobileW * 22 / 100,
                    height: mobileW * 8 / 100,
                    justifyContent: 'center',
                    backgroundColor: '#549E36',
                    alignSelf: 'flex-end',
                  }}>
                  <Text style={{
                    fontFamily: Font.Regular,
                    fontSize: mobileW * 3.8 / 100,
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
                    height: mobileW * 15 / 100,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: mobileW * 4 / 100,
                    marginRight: mobileW * 4 / 100,

                  }}
                >
                  <Text style={{
                    fontFamily: Font.SemiBold,
                    fontSize: mobileW * 3.5 / 100,
                    color: Colors.placeholder_border,
                  }}>
                    {LanguageConfiguration.Help[Configurations.language]}
                  </Text>
                  <Text style={{
                    fontFamily: Font.SemiBold,
                    fontSize: mobileW * 3.5 / 100,
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