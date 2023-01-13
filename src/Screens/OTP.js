import { Text, View, StatusBar, BackHandler, Alert, SafeAreaView, KeyboardAwareScrollView, ScrollView, styles, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { Component } from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import { Colors,  Font, mobileH, config, mobileW, LanguageConfiguration, API, localStorage, MessageFunctions, MessageTexts, MessageHeadings } from '../Helpers/Utils';
import { Icons } from '../Assets/Icons/IReferences';
export default class OTP extends Component {

  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: this.props.route.params.email,
      mobile: '',
      password: '',
      device_lang: 'AR',
      mobile: '',
      fcm_token: 123456,
      otp: ''
    }
    this._didFocusSubscription = props.navigation.addListener('focus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
    );
  }
  componentDidMount() {

    this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    );
  }
  handleBackPress = () => {
    Alert.alert(
      'Exit App',
      'Do you want to goback', [{
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'Yes',
      }, {
        text: 'Yes',
        onPress: () => this.props.navigation.navigate('Login')
      }], {
      cancelable: false
    }
    ); // works best when the goBack is async 
    return true;
  };

  sendagain = async () => {



    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (this.state.email.length <= 0 || this.state.email.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyEmail[config.language])
      return false;
    }

    if (regemail.test(this.state.email) !== true) {
      MessageFunctions.showError(MessageTexts.validEmail[config.language])
      return false
    }
    let email_new = this.state.email
    let url = config.baseURL + "api-forgot-password-email";


    var data = new FormData();
    data.append('emailId', this.state.email)
    

    API.post(url, data).then((obj) => {
      
      if (obj.status == true) {

        setTimeout(() => {
          MessageFunctions.showSuccess(obj.message)
          
        }, 300)
      } else {


        setTimeout(() => {
          MessageFunctions.showError(obj.message)
        }, 300)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      this.setState({ loading: false });
    });

  }

  otpVerify = async () => {


    if (this.state.password.length <= 0 || this.state.password.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyPasswordblank[config.language])
      return false
    }
    if (this.state.password.length < 8) {
      MessageFunctions.showError(MessageTexts.emptyPasswordValid[config.language])
      return false
    }

    let url = config.baseURL + "api-forgot-change-password";

    var data = new FormData();

    data.append('emailId', this.state.email)

    data.append('code', this.state.otp)
    data.append('password', this.state.password)

    
    API.post(url, data).then((obj) => {
      
      if (obj.status == true) {


        setTimeout(() => {
          MessageFunctions.showSuccess(obj.message)
          this.props.navigation.navigate('Login')
        }, 500);

      }
      else {

        setTimeout(() => {
          MessageFunctions.showError(obj.message)
        }, 500);
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      this.setState({ loading: false });
    });
  }
  render() {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <View>
          <SafeAreaView
            style={{ backgroundColor: Colors.statusbar_color, flex: 0 }}
          />

          <StatusBar
            barStyle="dark-content"
            backgroundColor={Colors.statusbarcolor}
            hidden={false}
            translucent={false}
            networkActivityIndicatorVisible={true}
          />

          <View style={{ paddingBottom: (mobileW * 8) / 100 }}>
            <View style={{ width: '95%', alignSelf: 'center', marginTop: mobileW * 5 / 100, flexDirection: 'row' }}>
              <View style={{ width: '10%', alignSelf: 'center', marginTop: mobileW * 25 / 100 }}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login') }}
                  style={{ width: '100%' }}>
                  <Image
                    style={{ width: mobileW * 10 / 100, height: mobileW * 10 / 100, resizeMode: 'contain' }}
                    source={config.textalign == 'right' ? Icons.BackRTL : Icons.LeftArrow}>


                  </Image>
                </TouchableOpacity>

              </View>
              <View style={{ width: '80%', alignSelf: 'center' }}>
                <Image
                  style={{ width: mobileW * 50 / 100, height: mobileW * 40 / 100, alignSelf: 'center', resizeMode: 'contain' }}
                  source={Icons.LogoWithText}>


                </Image>
              </View>
            </View>
            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 10) / 100,
              }}>
              <Text
                style={{
                  fontSize: Font.headingblack,
                  fontFamily: Font.SemiBold,
                  textAlign: config.textRotate
                }}>
                {LanguageConfiguration.opt[config.language]}
              </Text>
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 1) / 100,
              }}>
              <View style={{ width: '90%' }}>
                <Text
                  style={{

                    fontSize: Font.headinggray,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.placeholder_text,
                    textAlign: config.textRotate
                  }}>
                  {LanguageConfiguration.opttext_forget[config.language]}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '90%',
                // backgroundColor: 'red',
                //  paddingHorizontal:mobileW*1/100,
                paddingVertical: mobileW * 1 / 100,
                marginTop: (mobileW * 10) / 100,
                marginLeft: (mobileW * 5) / 100,
              }}>
              <OTPTextInput
                style={{
                  height: (mobileW * 14) / 100,
                  width: (mobileW * 20) / 100,
                  color: '#000',
                  alignSelf: 'center',
                  fontFamily: Font.Regular,
                  fontSize: (mobileW * 5) / 100,
                  borderWidth: 2,
                  borderColor: '#DFDFDF',
                  borderRadius: (mobileW * 2) / 100,
                  textAlign: 'center',
                }}
                ref={e => (this.otpInput = e)}
                numberOfInputs={4}
                cellTextLength={1}
                handleTextChange={text => this.setState({ otp: text })}


                keyboardType={'number-pad'}
              />
            </View>
            <View

              style=
              {{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 4) / 100,
                flexDirection: 'row',
                // borderColor: this.state.passwordfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                // borderWidth: (mobileW * 0.3) / 100,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={LanguageConfiguration.create_new_pass[config.language]}
                inputRef={(ref) => {
                  this.passwordInput = ref;
                }}
                onChangeText={(text) =>
                  this.setState({ password: text })
                }
                maxLength={50}
                value={this.state.password}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyLabel="done"
                returnKeyType="done"
                secureTextEntry={this.state.isSecurePassword}
                disableImg={true}
                iconName={this.state.isSecurePassword ? 'eye' : 'eye-off'}
                iconPressAction={this.changePwdType}
                onSubmitEditing={() => {
                  this.loginbtn();
                }}
              />

            </View>
            <View
              style={{
                width: '89%',
                alignSelf: 'center',
                marginTop: (mobileW * 0.5) / 100,
              }}>
              <Text
                style={{
                  textAlign: config.textRotate,
                  fontSize: Font.textsize,
                  fontFamily: Font.headingfontfamily,
                  color: Colors.textgray,
                }}>
                {LanguageConfiguration.Signuptext3[config.language]}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.otpVerify();
              }}
              style={{
                width: '90%',
                alignSelf: 'center',
                borderRadius: (mobileW * 2) / 100,
                backgroundColor: Colors.buttoncolorblue,
                paddingVertical: (mobileW * 4) / 100,
                marginTop: (mobileW * 6) / 100,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 3,
              }}>
              <Text
                style={{
                  color: Colors.textwhite,
                  fontFamily: Font.Medium,
                  fontSize: Font.buttontextsize,
                  alignSelf: 'flex-end',
                  textAlign: config.textalign,
                  alignSelf: 'center',
                }}>
                {LanguageConfiguration.submitbtntext[config.language]}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: '89%',
                alignSelf: 'center',
                marginTop: (mobileW * 5) / 100,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
              <Text
                style={{

                  textAlign: config.textalign,
                  fontSize: mobileW * 4 / 100,
                  fontFamily: Font.headingfontfamily,
                  color: Colors.textgray,
                }}>
                {LanguageConfiguration.notrectext[config.language]}
              </Text>
              <Text onPress={() => { this.sendagain() }}
                style={{

                  textAlign: config.textalign,
                  fontSize: mobileW * 4 / 100,
                  fontFamily: Font.SemiBold,
                  color: Colors.theme_color,

                }}>
                {LanguageConfiguration.sendagaintext[config.language]}
              </Text>
            </View>


          </View>
        </View>
      </ScrollView>
    );
  }
}
