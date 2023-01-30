import { Text, View, StatusBar, BackHandler, Alert, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import { AuthInputBoxSec } from '../Components'
import { Colors, Font, Configurations, mobileW, LanguageConfiguration, API, MessageFunctions, MessageTexts } from '../Helpers/Utils';
import { Icons } from '../Assets/Icons/IReferences';

export default OTP = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    email: route.params.email,
    mobile: '',
    password: '',
    device_lang: 'AR',
    otp: '',
    isSecurePassword: true,
  })

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  useEffect(() => {
    navigation.addListener('focus', payload =>
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    );
    navigation.addListener('blur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
    );
  }, [])

  const changePwdType = () => {
    setState({
      isSecurePassword: !classStateData?.isSecurePassword,
    })
  };

  const handleBackPress = () => {
    Alert.alert(
      'Exit App',
      'Do you want to goback', [{
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'Yes',
      }, {
        text: 'Yes',
        onPress: () => navigation.navigate('Login')
      }], {
      cancelable: false
    }
    ); // works best when the goBack is async 
    return true;
  };

  const sendagain = async () => {
    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (classStateData.email.length <= 0 || classStateData.email.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyEmail[Configurations.language])
      return false;
    }

    if (regemail.test(classStateData.email) !== true) {
      MessageFunctions.showError(MessageTexts.validEmail[Configurations.language])
      return false
    }
    let email_new = classStateData.email
    let url = Configurations.baseURL + "api-forgot-password-email";


    var data = new FormData();
    data.append('emailId', classStateData.email)


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
      setState({ loading: false });
    });

  }

  const otpVerify = async () => {


    if (classStateData.password.length <= 0 || classStateData.password.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyPasswordblank[Configurations.language])
      return false
    }
    if (classStateData.password.length < 8) {
      MessageFunctions.showError(MessageTexts.emptyPasswordValid[Configurations.language])
      return false
    }

    let url = Configurations.baseURL + "api-forgot-change-password";

    var data = new FormData();

    data.append('emailId', classStateData.email)

    data.append('code', classStateData.otp)
    data.append('password', classStateData.password)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {


        setTimeout(() => {
          MessageFunctions.showSuccess(obj.message)
          navigation.navigate('Login')
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
      setState({ loading: false });
    });
  }

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
              <TouchableOpacity onPress={() => { navigation.navigate('Login') }}
                style={{ width: '100%' }}>
                <Image
                  style={{ width: mobileW * 10 / 100, height: mobileW * 10 / 100, resizeMode: 'contain' }}
                  source={Configurations.textalign == 'right' ? Icons.BackRTL : Icons.LeftArrow}>


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
                textAlign: Configurations.textRotate
              }}>
              {LanguageConfiguration.opt[Configurations.language]}
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
                  textAlign: Configurations.textRotate
                }}>
                {LanguageConfiguration.opttext_forget[Configurations.language]}
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
              ref={e => (otpInput = e)}
              numberOfInputs={4}
              cellTextLength={1}
              handleTextChange={text => setState({ otp: text })}


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
              // borderColor: classStateData.passwordfocus == true ? Colors.placholderactive : Colors.placeholder_border,
              // borderWidth: (mobileW * 0.3) / 100,
              // borderRadius: (mobileW * 1) / 100,
            }}>
            <AuthInputBoxSec
              mainContainer={{
                width: '100%',
              }}
              // icon={layer9_icon}
              lableText={LanguageConfiguration.create_new_pass[Configurations.language]}
              inputRef={(ref) => {
                passwordInput = ref;
              }}
              onChangeText={(text) =>
                setState({ password: text })
              }
              maxLength={50}
              value={classStateData.password}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyLabel="done"
              returnKeyType="done"
              secureTextEntry={classStateData.isSecurePassword}
              disableImg={true}
              iconName={classStateData.isSecurePassword ? 'eye-off' : 'eye'}
              iconPressAction={changePwdType}
              onSubmitEditing={() => {
                loginbtn();
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
                textAlign: Configurations.textRotate,
                fontSize: Font.textsize,
                fontFamily: Font.headingfontfamily,
                color: Colors.textgray,
              }}>
              {LanguageConfiguration.Signuptext3[Configurations.language]}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              otpVerify();
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
                textAlign: Configurations.textalign,
                alignSelf: 'center',
              }}>
              {LanguageConfiguration.submitbtntext[Configurations.language]}
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

                textAlign: Configurations.textalign,
                fontSize: mobileW * 4 / 100,
                fontFamily: Font.headingfontfamily,
                color: Colors.textgray,
              }}>
              {LanguageConfiguration.notrectext[Configurations.language]}
            </Text>
            <Text onPress={() => { sendagain() }}
              style={{

                textAlign: Configurations.textalign,
                fontSize: mobileW * 4 / 100,
                fontFamily: Font.SemiBold,
                color: Colors.theme_color,

              }}>
              {LanguageConfiguration.sendagaintext[Configurations.language]}
            </Text>
          </View>


        </View>
      </View>
    </ScrollView>
  );

}
