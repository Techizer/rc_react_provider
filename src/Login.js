import { TouchableWithoutFeedback, Pressable, Modal, Text, Dimensions, View, PermissionsAndroid, Platform, BackHandler, Alert, ScrollView, StatusBar, SafeAreaView, Image, TouchableOpacity, keyboardType, Keyboard } from 'react-native';
import React, { Component } from 'react';
import { Shareratepro } from './Provider/Sharerateapp';
import Geolocation from '@react-native-community/geolocation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  Colors, localimag, Font, mobileH, config, mobileW,
  Lang_chg, apifuntion, msgText, msgTitle, consolepro, msgProvider,
  localStorage, FlushMsg
} from './Provider/utilslib/Utils';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import AntDesign from "react-native-vector-icons/AntDesign";
import { AuthInputBoxSec, DropDownboxSec, Button } from './Components'
import { firebapushnotification } from './firbase_pushnotification';
import { Icons } from './icons/IReferences'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
global.current_lat_long = 'NA';
global.myLatitude = 'NA';
global.myLongitude = 'NA';

export default class Login extends Component {
  constructor(props) {
    super(props);
    // global.props.showLoader();
    this.state = {
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
    };

    screens = 'Login';
    this._didFocusSubscription = props.navigation.addListener(
      'focus',
      payload =>
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress),
    );
    this.get_language()
  }
  get_language = async () => {
    let textalign = await localStorage.getItemObject('language');
    if (textalign != null) {
      this.setState({ langaugeme: textalign })
    }
    let address_arr = await localStorage.getItemObject('address_arr')
    // console.log('jdkfgvy', address_arr)
    this.setState({ address_new: address_arr })
    if (address_arr == '' || address_arr == 'NA' || address_arr == null) {
      this.getlatlong();
    }

  }
  componentDidMount() {

    this.props.navigation.addListener('focus', () => {
      this.get_rem_data()
      this.get_language()

      //  this.checkPermission();
      //   this.messageListener();
    });
    this._willBlurSubscription = this.props.navigation.addListener(
      'blur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        ),
    );
  }


  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();

    } else {

      this.requestPermission();
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
    // console.log('url', url)

    Shareratepro.sharefunction(url);
  }

  getlatlong = async () => {

    let permission = await localStorage.getItemString('permission')
    if (permission != 'denied') {
      var that = this;
      //Checking for the permission just after component loaded
      if (Platform.OS === 'ios') {
        this.callLocation(that);
      } else {
        // this.callLocation(that);
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
      this.getalldata(position)
    }
  }

  callLocation = async (that) => {
    this.setState({ loading: true })
    localStorage.getItemObject('position').then((position) => {
      // console.log('position', position)
      if (position != null) {
        var pointcheck1 = 0
        this.getalldata(position)
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {

            localStorage.setItemObject('position', position)
            this.getalldata(position);
            pointcheck1 = 1
          },
          (error) => {
            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

            this.getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
          //Will give you the location on location change
          // console.log('data', position);

          if (pointcheck1 != 1) {
            localStorage.setItemObject('position', position)
            this.getalldata(position)
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

            this.getalldata(position)
            pointcheck = 1
          },
          (
            error) => {
            let position = { 'coords': { 'latitude': config.latitude, 'longitude': config.longitude } }

            this.getalldata(position)
          },
          { enableHighAccuracy: true, timeout: 150000000, maximumAge: 1000 }
        );
        that.watchID = Geolocation.watchPosition((position) => {
          //Will give you the location on location change
          // console.log('data', position);

          if (pointcheck != 1) {

            localStorage.setItemObject('position', position)
            this.getalldata(position)
          }

        });
      }
    })
  }

  getalldata = (position) => {

    let longitude = position.coords.longitude
    let latitude = position.coords.latitude
    // console.log('positionlatitude', position.coords)
    // console.log('positionlongitude', longitude)
    this.setState({ latitude: latitude, longitude: longitude, loading: false })
    myLatitude = latitude,
      myLongitude = longitude
    current_lat_long = position

    let event = { latitude: latitude, longitude: longitude, latitudeDelta: this.state.latdelta, longitudeDelta: this.state.longdelta }
    this.getadddressfromlatlong(event)
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
        // consolepro.consolelog('responseJson1234', add_location)
        this.GooglePlacesRef && this.GooglePlacesRef.setAddressText(details.formatted_address)
        this.setState({ latdelta: event.latitudeDelta, longdelta: event.longitudeDelta, latitude: event.latitude, longitude: event.longitude, addressselected: details.formatted_address })
        this.setState({ add_my_location: data2 })

        localStorage.setItemObject('address_arr', add_location.address);

        // console.log('dfhhdfgb', data2)
        //   return  this.props.locationget(data2);

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
    // console.log('Welcome')
    Lang_chg.language_set(language)
    this.setState({
      engbtn: !this.state.engbtn,
      engbtn_ar: !this.state.engbtn_ar
    })

  }


  get_rem_data = async () => {
    let remeberdata_arr = await localStorage.getItemObject('remeberdata');

    // console.log('config.language', remeberdata_arr)




    if (remeberdata_arr != null) {
      this.setState({ email: remeberdata_arr.email })
      this.setState({ password: remeberdata_arr.password })
      this.setState({ remember_me: true })

    }

  }

  remember_me_fun = async () => {
    // if (this.state.email.length <= 0 ||  this.state.email.trim().length <= 0) {
    //   msgProvider.toast(msgText.emptyEmailmobile[config.language], 'center')
    //   return false
    // }

    if (this.state.remember_me == false) {
      let data = { 'email': this.state.email, 'password': this.state.password }
      localStorage.setItemObject('remeberdata', data)
    }
    else {
      localStorage.setItemObject('remeberdata', null)
    }
    this.setState({ remember_me: !this.state.remember_me })
    this.setState({ remember_me: true })
  }

  remove_remember_me_fun = async () => {
    await localStorage.removeItem('remeberdata');
    this.setState({ remember_me: false })
  }
  loginbtn = async () => {

    Keyboard.dismiss()
    var email = this.state.email.trim()
    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (this.state.selectuserType == -1) {
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

    if (this.state.password.length <= 0 || this.state.password.trim().length <= 0) {
      msgProvider.showError(msgText.emptyPassword[config.language])
      return false
    }
    // if (this.state.password.length < 8) {
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
    data.append('email', this.state.email)
    data.append('password', this.state.password)
    data.append('device_type', config.device_type)
    data.append('device_lang', device_lang)
    data.append('fcm_token', await firebapushnotification.getFcmToken())
    data.append('user_type', this.state.userType[this.state.selectuserType].value)

    console.log('loginData', data)

    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      consolepro.consolelog("obj", obj.status)
      if (obj.status == true) {

        // this.emailInput.clear();
        // this.passwordInput.clear();
        var user_details = obj.result;

        this.setState({ emailfocus: false, passwordfocus: false })
        consolepro.consolelog('user_details', user_details);
        const uservalue = {
          email_phone: this.state.email, email: this.state.email,
          password: this.state.password
        };
        localStorage.setItemObject('user_login', uservalue);
        localStorage.setItemObject('user_arr', user_details);
        // msgProvider.toast(msgText.sucess_message_login[config.language], 'center')
        setTimeout(() => {
          this.props.navigation.navigate('Home');
        }, 700);



      } else {
        // if (obj.active_status == msgTitle.deactivate[config.language] || obj.msg[config.language] == msgTitle.usererr[config.language]) {
        //   usernotfound.loginFirst(this.props, obj.msg[config.language])
        // } else {
        setTimeout(() => {
          // msgProvider.alert('', obj.message, false);
          msgProvider.showError(obj.message)
        }, 700);
        // }
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });

  }

  showUsertypeModal = (status) => {
    this.setState({
      showUsertype: status
    })
  }

  onSwipeRight(gestureState) {
    // console.log("gestureState:: ", gestureState);
    //this.setState({myText: 'You swiped right!'});
  }

  onSwipeLeft(gestureState) {
    // console.log("gestureState:: ", gestureState);
    this.props.navigation.navigate('Signup')
    // this.setState({myText: 'You swiped left!'});
  }

  changePwdType = () => {
    this.setState({
      isSecurePassword: !this.state.isSecurePassword,
    });
  };

  render() {
    const config4 = {
      velocityThreshold: 1,
      directionalOffsetThreshold: mobileW,
      // gestureIsClickThreshold:1
    };


    return (

      <GestureRecognizer

        //onSwipeLeft={(state) => { this.props.navigation.navigate('Signup') }}
        // onSwipeRight={(state) => this.onSwipeRight(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        config={config4}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
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
                    source={Icons.Forgotlogo}></Image>
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
                {/* ----------------------------------------user type------------------------------------ */}
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 4) / 100,
                    // borderColor: this.state.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                    // borderWidth: mobileW * 0.3 / 100,
                    // borderRadius: (mobileW * 1) / 100
                  }}>
                  <DropDownboxSec
                    lableText={(this.state.selectuserType == -1) ? Lang_chg.UserTypeText[config.language] : this.state.userType[this.state.selectuserType].title}
                    boxPressAction={() => { this.showUsertypeModal(true) }}
                  />


                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showUsertype}
                    onRequestClose={() => {
                      Alert.alert("Modal has been closed.");
                      //setModalVisible(!modalVisible);
                    }}
                  >
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.showUsertypeModal(false) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%' }}>
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
                            this.state.userType.map((data, index) => {
                              return (
                                <TouchableOpacity style={{
                                  width: '100%',
                                }} onPress={() => {
                                  this.setState({
                                    selectuserType: index
                                  }, () => {
                                    this.showUsertypeModal(false)
                                  })
                                }}>
                                  <View style={{
                                    width: (Platform.OS == "ios") ? '95%' : '94.5%',
                                    marginLeft: 15,
                                    borderBottomColor: Colors.gray6,
                                    borderBottomWidth: (index == (this.state.userType.length - 1)) ? 0 : 1,
                                  }}>
                                    <Text style={{
                                      color: '#041A27',
                                      fontSize: 15,
                                      fontFamily: Font.headingfontfamily,
                                      // marginLeft: 15,
                                      paddingTop: 15,
                                      paddingBottom: 15,
                                      width: '94.5%',

                                      // backgroundColor: 'red'
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

                {/* ----------------------------------------email------------------------------------ */}
                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                    // borderColor: this.state.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                    // borderWidth: mobileW * 0.3 / 100,
                    // borderRadius: (mobileW * 1) / 100
                  }}>
                  <AuthInputBoxSec
                    mainContainer={{
                      width: '100%',
                    }}
                    // icon={layer9_icon}
                    lableText={Lang_chg.Mobileno[config.language]}
                    inputRef={(ref) => {
                      this.emailInput = ref;
                    }}
                    onChangeText={(text) =>
                      this.setState({ email: text })
                    }
                    value={this.state.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.passwordInput.focus();
                    }}
                  />

                  {/* <View style={{ width: '100%', alignSelf: 'center' }}>
                    <TextInput
                      style={{
                        width: '100%',
                        height: 48,
                        color: Colors.textblack,
                        fontSize: Font.placeholdersize,
                        textAlign: config.textalign,
                        //height: (mobileW * 12) / 100,
                        fontFamily: Font.placeholderfontfamily,
                        borderRadius: (mobileW * 1) / 100,
                        backgroundColor: 'white'
                        // borderColor: 'red', //Colors.placeholder_border
                      }}
                      label={Lang_chg.Mobileno[config.language]}
                      mode='outlined'
                      outlineColor={Colors.field_border_color}
                      activeOutlineColor={Colors.placholderactive}
                      maxLength={50}
                      // placeholder={
                      //   this.state.emailfocus != true
                      //     ? Lang_chg.Mobileno[config.language]
                      //     : null
                      // }
                      placeholderTextColor={Colors.placeholder_text}
                      onChangeText={txt => {
                        this.setState({ email: txt });
                      }}
                      value={this.state.email}
                      // onFocus={() => {
                      //   this.setState({ emailfocus: true });
                      // }}
                      // onBlur={() => {
                      //   this.setState({
                      //     emailfocus: this.state.email.length > 0 ? true : false,
                      //   });
                      // }}
                      ref={(input) => { this.textinput = input; }}
                      keyboardType="email-address"
                      returnKeyLabel="done"
                      returnKeyType="done"
                    />
                    
                  </View> */}
                  {/* {this.state.emailfocus == true && (
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                        left: (mobileW * 4) / 100,
                        top: (-mobileW * 2) / 100,
                        paddingHorizontal: (mobileW * 1) / 100,
                      }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>
                        {Lang_chg.Mobileno[config.language]}
                      </Text>
                    </View>
                  )} */}

                </View>

                {/* ----------------------------------------------------pssword--- */}

                <View

                  style=
                  {{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                    flexDirection: 'row',
                    // borderColor: this.state.passwordfocus == true ? Colors.placholderactive : Colors.placeholder_border,
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
                      this.passwordInput = ref;
                    }}
                    onChangeText={(text) =>
                      this.setState({ password: text })
                    }
                    value={this.state.password}
                    keyboardType="default"
                    autoCapitalize="none"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    secureTextEntry={this.state.isSecurePassword}
                    disableImg={true}
                    iconName={this.state.isSecurePassword ? 'eye' : 'eye-off'}
                    iconPressAction={this.changePwdType}
                    // onSubmitEditing={() => {
                    //   this.loginbtn();
                    // }}
                  />
                  {/* <View style={{ width: '100%', alignSelf: 'center' }}>

                    <TextInput
                      style={{
                        width: '100%',
                        height: 48,
                        color: Colors.textblack,
                        fontSize: Font.placeholdersize,
                        textAlign: config.textalign,
                        //height: (mobileW * 12) / 100,
                        fontFamily: Font.placeholderfontfamily,
                        borderRadius: (mobileW * 1) / 100,
                        borderColor: Colors.placeholder_border,
                        backgroundColor: 'white'
                      }}
                      mode='outlined'
                      label={Lang_chg.password[config.language]}
                      outlineColor={Colors.field_border_color}
                      activeOutlineColor={Colors.placholderactive}
                      maxLength={50}

                      // placeholder={
                      //   this.state.passwordfocus != true
                      //     ? Lang_chg.password[config.language]
                      //     : null
                      // }
                      placeholderTextColor={Colors.placeholder_text}
                      onChangeText={txt => {
                        this.setState({ password: txt });
                      }}
                      value={this.state.password}
                      // onFocus={() => {
                      //   this.setState({ passwordfocus: true });
                      // }}
                      // onBlur={() => {
                      //   this.setState({
                      //     passwordfocus: this.state.email.length > 0 ? true : false,
                      //   });
                      // }}
                      ref={(input) => { this.textinput_mobile = input; }}
                      returnKeyLabel="done"
                      returnKeyType="done"
                      secureTextEntry={this.state.isSecurePassword}
                      right={
                        <TextInput.Icon
                          name={this.state.isSecurePassword ? 'eye' : 'eye-off'}
                          onPress={() => {
                            this.setState({
                              isSecurePassword: !this.state.isSecurePassword,
                            });
                          }}
                          forceTextInputFocus={false}
                          color={Colors.regulartextcolor}
                          style={{
                            marginTop: 12
                          }}
                        />
                      }
                    />
                  </View> */}
                  {/* {this.state.passwordfocus == true && (
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                        left: (mobileW * 4) / 100,
                        top: (-mobileW * 2) / 100,
                        paddingHorizontal: (mobileW * 1) / 100,
                      }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>
                        {Lang_chg.password[config.language]}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={{ width: '10%', alignSelf: 'center' }}
                    onPress={() => {
                      this.setState({
                        isSecurePassword: !this.state.isSecurePassword,
                      });
                    }}>
                    {this.state.isSecurePassword == false ? (
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          justifyContent: 'flex-end',
                        }}>
                        <Image
                          style={{
                            height: (mobileW * 6) / 100,
                            width: (mobileW * 6) / 100,
                          }}
                          source={require('./icons/eye-icon.png')}></Image>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          justifyContent: 'flex-end',
                        }}>
                        <Image
                          style={{
                            height: (mobileW * 6) / 100,
                            width: (mobileW * 6) / 100,
                          }}
                          source={require('./icons/eye-icon02.png')}></Image>
                      </View>
                    )}
                  </TouchableOpacity> */}
                </View>

                {/* ----------------------------------------------------------------------------cheakbox */}

                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 4) / 100,
                    flexDirection: 'row',
                  }}>
                  {this.state.remember_me == false && <TouchableOpacity activeOpacity={0.9} style={{ width: '45%', flexDirection: 'row', paddingLeft: mobileW * 1 / 100 }} onPress={() => { this.remember_me_fun() }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: '20%' }}>
                        <Image style={{ height: 23, width: 23, resizeMode: 'contain', tintColor: '#696464' }}
                          source={require('./icons/blank-check-box.png')}></Image>
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
                  {this.state.remember_me == true &&
                    <TouchableOpacity activeOpacity={0.9} style={{ width: '45%', paddingLeft: mobileW * 1 / 100 }} onPress={() => { this.remove_remember_me_fun() }} >

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
                        this.props.navigation.navigate('Forgotpage');
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

                {/* <TouchableOpacity
                  onPress={() => {
                    this.loginbtn();
                  }}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: (mobileW * 2) / 100,
                    backgroundColor: Colors.buttoncolorblue,
                    paddingVertical: (mobileW * 4) / 100,
                    marginTop: (mobileW * 8) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.textwhite,
                      fontFamily: Font.Medium,
                      fontSize: Font.buttontextsize,
                      textAlign: config.textalign,
                      alignSelf: 'center',
                    }}>
                    {Lang_chg.Contiunebtn[config.language]}
                  </Text>
                </TouchableOpacity> */}

                <Button
                  text={Lang_chg.Contiunebtn[config.language]}
                  // onLoading={this.state.loading}
                  customStyles={
                    {
                      // mainContainer: styles.butonContainer
                    }
                  }
                  onPress={() => this.loginbtn()}
                // isBlank={false}
                />

              </View>

              {/* //--------------------------------------------------------------------------------gray */}
              <View style={{ width: '100%', backgroundColor: '#eef0f2', paddingVertical: mobileW * 3 / 100 }}>
                {/* <View style={{ justifyContent: 'space-between', alignItems: 'center', width: '89%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>

                  <Text style={[{ fontSize: mobileW * 3.8 / 100, color: Colors.textblack, fontFamily: Font.ques_fontfamily }, Platform.OS == 'ios' ? { textAlign: config.textalign } : null]}>{Lang_chg.languagetxt[config.language]} </Text>

                  <View style={{ width: '40%', alignSelf: 'flex-end', flexDirection: 'row', }}>

                    <View
                      style={{
                        width: '50%', alignSelf: 'center', backgroundColor: this.state.langaugeme == 0 ? Colors.buttonbackgoungcolorlightblue : '#fff', borderColor: 'black', borderBottomWidth: 1, borderTopWidth: 1, borderLeftWidth: 1, paddingVertical: mobileW * 1.5 / 100
                        , borderBottomLeftRadius: mobileW * 1 / 100, borderTopLeftRadius: mobileW * 1 / 100
                      }}>
                      <TouchableOpacity onPress={() => {
                        if (this.state.langaugeme == 1) {
                          this.launguage_setbtn(0), this.setState({ device_lang: 'ENG' })
                        }
                        else {
                          null
                        }
                      }}
                        style={{ width: '100%' }}>
                        <Text style={{ textAlign: config.textalign, fontSize: mobileW * 3.5 / 100, color: Colors.textblack, fontFamily: Font.ques_fontfamily, alignSelf: 'center' }}>{Lang_chg.ENG[config.language]}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: '50%', alignSelf: 'center', backgroundColor: this.state.langaugeme == 1 ? Colors.buttonbackgoungcolorlightblue : '#fff', borderColor: '#fff', borderColor: 'black', borderWidth: 1, paddingVertical: mobileW * 1.5 / 100, borderTopRightRadius: mobileW * 1 / 100, borderBottomRightRadius: mobileW * 1 / 100 }}>
                      <TouchableOpacity onPress={() => {
                        if (this.state.langaugeme == 0) {
                          this.launguage_setbtn(1), this.setState({ device_lang: 'AR' })
                        }
                        else {
                          null
                        }
                      }}
                        style={{ width: '100%' }}>
                        <Text style={{ textAlign: config.textalign, fontSize: mobileW * 3.5 / 100, color: Colors.textblack, fontFamily: Font.ques_fontfamily, alignSelf: 'center' }}>{Lang_chg.AR[config.language]}</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View> */}
              </View>
              <View
                style={{
                  backgroundColor: Colors.backgroundcolorlight,
                  paddingBottom: (mobileW * 15) / 100,
                }}>
                {/* backgroundColor:Colors.backgroundcolorlight, */}
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
                  // onLoading={this.state.loading}
                  customStyles={
                    {
                      // mainContainer: styles.butonContainer
                    }
                  }
                  onPress={() => this.props.navigation.navigate('Signup')}
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
}
