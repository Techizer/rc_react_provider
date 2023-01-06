import { Text, View, Image, StatusBar, Modal, TouchableOpacity, Linking } from 'react-native'
import React, { Component } from 'react'
import { Colors,  Font, mobileH, Mapprovider, msgProvider, msgText, config, mobileW, localStorage, handleback, Lang_chg, apifuntion, msgTitle, consolepro } from './Provider/utilslib/Utils';
global.add_location = 'NA';
global.amount_total = 0;
global.username = 'NA'
import HTMLView from 'react-native-htmlview';
import DeviceInfo from 'react-native-device-info';
import { Icons } from './icons/IReferences';
const appVersion = DeviceInfo.getVersion();
export default class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      engbtn: true,
      device_lang: 'AR',
      fcm_token: 123456,
      loanguage: 1,
      modalVisible3: false
    };

    this.language_fun()
    add_location = 'NA'
  }
  componentDidMount() {
    this.authenticateSession()

  }
  language_fun = async () => {
    let textalign = await localStorage.getItemObject('language');
    console.log('textaligntextalign:: ', textalign);
    if (textalign != null) {
      console.log('textaligntextalign::if ', textalign);
      if (textalign == 1) {

        config.textalign = 'right';
        // config.textalign = 'left';
        config.language = 1
        this.setState({ loanguage: 1 })
      } else {
        localStorage.setItemObject('languagesetenglish', 3);
        localStorage.setItemObject('languagecathc', 0)
        config.textalign = 'left';
        config.language = 0
        this.setState({ loanguage: 0 })
      }
    }
    else {
      console.log('textaligntextalign::else ', textalign);
      // config.textalign = 'right';
      // config.language = 1
      // localStorage.setItemObject('language', 1)
      // this.setState({ loanguage: 1 })
      config.textalign = 'left';
      config.language = 0
      localStorage.setItemObject('languagesetenglish', 3);
      localStorage.setItemObject('languagecathc', 0)

      this.setState({ loanguage: 0 })
    }

  }
  authenticateSession = async () => {
    this.apiIosPatientUpdate()

    // setTimeout(() => {
    //   this.new_authenticatesessinon()
    // }, 2000);
  }

  apiIosPatientUpdate = async () => {
    let lang = (this.state.loanguage == 1) ? "ENG" : "ENG"
    let url = config.baseURL + "api-ios-provider-update" + "?divice_lang=" + lang;
    console.log("url", url, config.language)
    // var data = new FormData();
    // data.append('divice_lang',"AR")

    // consolepro.consolelog('data', data)
    apifuntion.getApi(url, 1).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        if (parseFloat(obj.result.appVer) > parseFloat(appVersion)) {
          this.setState({
            "appVer": obj.result.appVer,
            "updTitle": '<h3>' + obj.result.updTitle + '</h3>',
            "updText": '<p>' + obj.result.updText + '</p>',
            "skipFlag": obj.result.skipFlag,
            "skipText": obj.result.skipText,
            "rdrTo": obj.result.rdrTo,
            "rdrUrl": obj.result.rdrUrl,
            "showHelp": obj.result.showHelp,
            "helpTitle": obj.result.helpTitle,
            "helpUrl": obj.result.helpUrl,
            modalVisible3: true
          })
        } else {
          this.checkAuth()
        }

        console.log('get area', obj.result)

      } else {
        this.checkAuth()
        return false;
      }
    }).catch((error) => {
      this.checkAuth()
      console.log("-------- error ------- " + error);
    })

  }

  checkAuth = () => {
    setTimeout(() => {
      this.new_authenticatesessinon()
    }, 2000);
  }

  checkAuthUserLogin = async (result, logindetail) => {
    let result1 = await localStorage.getItemObject('user_signup');

    let email = logindetail.email_phone
    let password = logindetail.password
    let user_type = result.user_type
    var device_lang
    if (config.language == 0) {
      device_lang = 'ENG'
    }
    else {
      device_lang = 'AR'
    }
    let url = config.baseURL + "api-service-provider-login";
    var data = new FormData();

    data.append('email', email)
    data.append('password', password)
    data.append('device_type', config.device_type)
    data.append('device_lang', device_lang)
    data.append('fcm_token', fcmtoken)
    data.append('user_type', user_type)

    console.log('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      console.log('obj', obj)
      if (obj.status == true) {
        var user_details = obj.result;
        localStorage.setItemObject('user_arr', user_details);

        this.props.navigation.navigate('Home')

      }
      else {
        this.props.navigation.navigate('Login')
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);

    });
  }

  checkLogout = async (result, logindetail) => {

    let user_id = result.user_id;
    let url = config.baseURL + "api-check-login";
    var data = new FormData();
    data.append("user_id", user_id);
    data.append("fcm_token", fcmtoken);

    console.log("url", url);
    console.log("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        console.log("obj checkLogout: ", obj);
        if (obj.result == true) {
          this.checkAuthUserLogin(result, logindetail);

        } else {
          this.logout()
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  }

  logout = async () => {
    await localStorage.removeItem("user_arr");
    await localStorage.removeItem("user_login");
    // await localStorage.removeItem('password');
    // await localStorage.clear();
    // this.setState({ show: false });
    this.props.navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  new_authenticatesessinon = async () => {

    let result = await localStorage.getItemObject('user_arr');
    let logindetail = await localStorage.getItemObject('user_login');
    console.log('splasedata', logindetail)
    if (result != null) {

      console.log("result ", result)
      this.checkLogout(result, logindetail)
      //  if(result.otp_verify == 1)
      //  {
      //&& result.profile_complete==0


    }
    else {
      this.props.navigation.navigate('Login')
    }

  }

  openAppstoreUrl = async (url) => {
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

  render() {
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
          <Text style={{ marginTop: mobileW * 0.5 / 100, fontSize: mobileW * 4 / 100, color: Colors.splashtextcolor, fontFamily: Font.Regular, alignSelf: 'center', textAlign: 'center' }}>{Lang_chg.Splashtext1[this.state.loanguage]} </Text>
        </View>

        <View style={{ width: '50%', alignSelf: 'center', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, marginTop: mobileW * 6 / 100 }}>


        </View>

        <View style={{ width: '63%', alignSelf: 'center', marginTop: mobileW * 4 / 100 }}>
          <Text style={{ marginTop: mobileW * 0.5 / 100, fontSize: mobileW * 4 / 100, color: Colors.splashtextcolor, fontFamily: Font.Regular, alignSelf: 'center', textAlign: 'center' }}>{Lang_chg.Splashtext2[this.state.loanguage]} </Text>

        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible3}

          onRequestClose={() => { this.setState({ modalVisible3: false }) }}>
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
                    value={this.state.updTitle}
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
                    value={this.state.updText}
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
                  justifyContent: (this.state.skipFlag) ? 'space-between' : 'flex-end',
                  width: '70%', paddingBottom: mobileW * 5 / 100, marginTop: mobileW * 9 / 100,
                  alignSelf: 'flex-end', right: 16,
                  // backgroundColor: 'red'
                }}>
                  {
                    (this.state.skipFlag) &&
                    <TouchableOpacity onPress={() => {
                      this.setState({
                        modalVisible3: false
                      }, () => {
                        this.new_authenticatesessinon()
                      })
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
                        }}>{this.state.skipText}</Text>
                    </TouchableOpacity>
                  }


                  <TouchableOpacity onPress={() => {
                    this.openAppstoreUrl(this.state.rdrUrl)
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
                    }}>{Lang_chg.Update[config.language]}</Text>
                  </TouchableOpacity>
                </View>
                {
                  (this.state.showHelp) &&
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
                      {Lang_chg.Help[config.language]}
                    </Text>
                    <Text style={{
                      fontFamily: Font.SemiBold,
                      fontSize: mobileW * 3.5 / 100,
                      color: Colors.terms_text_color_blue,
                      marginLeft: 6,
                    }} onPress={() => {
                      this.openAppstoreUrl(this.state.helpUrl)
                    }}>{this.state.helpUrl}</Text>
                  </View>
                }
              </View>

            </View>
          </TouchableOpacity>
        </Modal>

      </View>
    )
  }
}