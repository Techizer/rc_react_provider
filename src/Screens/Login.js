import { Text, Dimensions, View, Platform, BackHandler, Alert, ScrollView, TextInput, SafeAreaView, Image, TouchableOpacity, Keyboard, StyleSheet, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Ellipse from 'react-native-vector-icons/Ionicons';

import { Colors, Font, mobileH, Configurations, mobileW, LanguageConfiguration, API, MessageTexts, MessageFunctions, windowHeight, windowWidth } from '../Helpers/Utils';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications';
import { Icons } from '../Icons/IReferences'
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { onUserLogout, setRememberedEmail, setRememberedPassword, setShouldAutoLogin, setUserFCMToken, setUserLoginData, setUserLoginType } from '../Redux/Actions/UserActions';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import { UserTypes, countries } from '../Helpers/Constants';
import RBSheet from 'react-native-raw-bottom-sheet';
import { s, vs } from 'react-native-size-matters';
import { Cross, _Cross, rightArrow } from '../Icons/SvgIcons/Index';
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OTP from '../Components/OTP';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

global.current_lat_long = 'NA';
global.myLatitude = 'NA';
global.myLongitude = 'NA';

export default Login = ({ navigation, route }) => {

  const { navigate } = useNavigation()
  const insets = useSafeAreaInsets()

  const { shouldAutoLogin, userEmail, userPassword } = useSelector(state => state.StorageReducer)

  const [classStateData, setClassStateData] = useState({
    code: '966',
    number: '',
    device_lang: 'AR',
    isRememberChecked: shouldAutoLogin,
    isLoading: false,
    showCountries: false
  })
  const [showOTPModal, setShowOTPModal] = useState(false);

  const numberRef = useRef()


  const styles = StyleSheet.create({

    inputMainContainer: {
      width: "90%",
      height: windowWidth / 6,
      alignItems: 'flex-end',
      alignSelf: 'center',
      flexDirection: 'row',
      // alignItems:'center',
      marginTop: windowWidth / 10,
      zIndex: 999
    },
    inputContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: windowWidth / 7.5,
      borderColor: Colors.field_border_color,
      borderRadius: 8,
      borderBottomLeftRadius: classStateData.showCountries ? 0 : 8,
      borderWidth: 1,
      backgroundColor: Colors.white_color
    },

    codeContainer: {
      width: '32%',
      height: '100%',
    },

    numberContainer: {
      width: '65%',
      height: '100%',
      justifyContent: 'center',
      paddingHorizontal: '2%'
    },
    separator: {
      width: 1,
      height: '65%',
      backgroundColor: Colors.field_border_color
    },

    titleContainer: {
      position: 'absolute',
      paddingHorizontal: 5,
      // paddingVertical: 1,
      backgroundColor: Colors.white_color,
      top: 5,
      left: '3%',
      zIndex: 9999
    },
    title: {
      fontSize: Font.small,
      fontFamily: Font.Regular,
      includeFontPadding: false,
      color: Colors.buttoncolorblue
    },
    flag: {
      height: windowWidth / 14,
      width: windowWidth / 14,
    },
    inputText: {
      fontSize: Font.medium,
      fontFamily: Font.Regular,
      includeFontPadding: false,
      color: Colors.Black
    },
    countryContainer: {
      paddingVertical: 10,
      // height: 100,
      width: '100%',
      position: 'absolute',
      top: '99%',
      left: -1,
      backgroundColor: Colors.white_color,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      borderLeftColor: Colors.field_border_color,
      borderRightColor: Colors.field_border_color,
      borderBottomColor: Colors.field_border_color,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1

    }
  });



  const setState = (payload) => {
    setClassStateData(prev => ({
      ...prev,
      ...payload
    }))
  }

  const dispatch = useDispatch()
  const isFocused = useIsFocused()


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
    );
    return true;
  };


  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      // Add the hardware back press event listener when the screen is focused
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    });

    const blurListener = navigation.addListener('blur', () => {
      // Remove the hardware back press event listener when the screen is blurred
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    });

    // Clean up listeners when the component is unmounted
    return () => {
      focusListener();
      blurListener();
    };
  }, [navigation]);

  // const checkIsValid = () => {
  //   let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  //   if (classStateData?.email.trim().length <= 0) {
  //     MessageFunctions.showError(MessageTexts.emptyEmail[Configurations.language])
  //     return false;
  //   }

  //   if (regemail.test(classStateData?.email.trim()) !== true) {
  //     MessageFunctions.showError(MessageTexts.validEmail[Configurations.language])
  //     return false
  //   }

  //   if (classStateData?.password.length <= 0 || classStateData?.password.trim().length <= 0) {
  //     MessageFunctions.showError(MessageTexts.emptyPassword[Configurations.language])
  //     return false
  //   }

  //   return true
  // }


  const SendOTP = async () => {

    let conditionsFailed = false;
    Keyboard.dismiss();
    numberRef.current && numberRef.current.blur();

    let number = `${classStateData.code}${classStateData.number}`
    if (classStateData.number.length <= 0 || classStateData.number.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptymobileNumber[Configurations.language])
      conditionsFailed = true;
      return
    }
    if (classStateData.number.length < 9 || classStateData.number.trim().length < 9) {
      MessageFunctions.showError('Invalid Number')
      conditionsFailed = true;
      return
    }

    if (classStateData.number.length > 9 || classStateData.number.trim().length > 9) {
      MessageFunctions.showError('Invalid Number')
      conditionsFailed = true;
      return
    }

    if (conditionsFailed) {
      return false
    } else {

      setState({ isLoading: true })
      let url = Configurations.baseURL + "api-login-send-otp";
      var data = new FormData();
      data.append('countrycode', classStateData.code)
      data.append('phone_number', `${classStateData.code}${classStateData.number}`)
      data.append('type', `provider`)

      console.log(data._parts);
      API.post(url, data, 1).then((obj) => {

        console.log('Send OTP Response', obj)
        if (obj.status == true) {
          MessageFunctions.showSuccess('OTP sent to your number')
          setState({ isLoading: false })
          setTimeout(() => {
            setShowOTPModal(true)
          }, 500);


        } else {
          setState({ isLoading: false })
          MessageFunctions.showError(obj?.message)
        }
      }).catch((error) => {
        setState({ isLoading: false })
        MessageFunctions.showError(error.message)
        console.log("Send OTP-error ------- ", error)
      })
    }

  }

  return (

    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white_color
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          height: mobileH + 30
        }}
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
      >
        <KeyboardAwareScrollView>

          <View style={{ flex: 1 }}>

            <View
              style={{
                // paddingBottom: (mobileW * 6) / 100,
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
                  allowFontScaling={false}
                  style={{
                    fontSize: Font.xxlarge,
                    fontFamily: Font.Bold,
                    textAlign: Configurations.textRotate,
                    color: Colors.Black,
                    alignSelf: 'center'
                  }}>
                  {LanguageConfiguration.Login[Configurations.language]}
                </Text>
              </View>

              <View
                style={{
                  width: '60%',
                  alignSelf: 'center',
                  marginTop: windowWidth / 40,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: Font.medium,
                    fontFamily: Font.Light,
                    color: '#515C6F',
                    textAlign: 'center'
                  }}>
                  {LanguageConfiguration.Logintext[Configurations.language]}
                </Text>
              </View>


              <View style={[styles.inputMainContainer,]}>
                <View style={styles.titleContainer}>
                  <Text allowFontScaling={false} style={styles.title}>{'Phone Number'}</Text>
                </View>

                <View style={[styles.inputContainer]}>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setState({ showCountries: !classStateData.showCountries })}
                    style={[styles.codeContainer]}>

                    <View style={{
                      height: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: '10%',
                      justifyContent: 'space-between',
                    }}>
                      <Image source={classStateData.code === '966' ? Icons.Saudia : Icons.UAE} style={styles.flag} />
                      <Text
                        allowFontScaling={false}
                        style={styles.inputText}>
                        {`+${classStateData.code}`}

                      </Text>
                      <SvgXml xml={rightArrow} height={s(13)} width={s(13)} style={{ transform: [{ rotate: classStateData.showCountries ? "270deg" : "90deg" }] }} />
                    </View>

                    {
                      classStateData.showCountries &&
                      <View style={styles.countryContainer}>
                        {
                          countries.map((item, index) => {
                            return (
                              <Pressable
                                key={item.code}
                                onPress={() => {
                                  setState({ showCountries: false, code: item.code })
                                }}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingHorizontal: '10%',
                                  marginTop: index == 0 ? 0 : 5
                                }}>
                                <Image source={item.icon} style={styles.flag} />
                                <Text
                                  allowFontScaling={false}
                                  style={styles.inputText}>
                                  {`+${item.code}`}

                                </Text>
                              </Pressable>
                            )
                          })
                        }
                      </View>
                    }

                  </TouchableOpacity>

                  <View style={{ justifyContent: 'center' }}>
                    <View style={[styles.separator]} />
                  </View>

                  <View style={[styles.numberContainer]}>

                    <TextInput
                      maxLength={9}
                      ref={numberRef}
                      style={{}}
                      onChangeText={(val) => setState({ number: val })}
                      placeholder={'Phone Number'}
                      editable={true}
                      blurOnSubmit={false}
                      autoCapitalize="none"
                      value={classStateData.number}
                      allowFontScaling={false}
                      keyboardType='decimal-pad'
                      returnKeyType='done'
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </View>

                </View>
              </View>


              <View style={{ width: '90%', alignSelf: 'center', marginTop: windowWidth / 20 }}>

                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.medium,
                    color: Colors.regulartextcolor,
                    // fontWeight:'600'
                  }}>
                  {'YOUR PHONE NUMBER MUST CONTAIN'}

                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 13 }}>
                  <Ellipse style={{ alignSelf: 'center' }}
                    name={'ellipse'}
                    size={12}
                    color={Colors.field_border_color}
                  />

                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.medium,
                      color: Colors.regulartextcolor,
                      marginHorizontal: 5
                    }}>
                    {'An area code'}

                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 13 }}>
                  <Ellipse style={{ alignSelf: 'center' }}
                    name={'ellipse'}
                    size={12}
                    color={Colors.field_border_color}
                  />

                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.medium,
                      color: Colors.regulartextcolor,
                      marginHorizontal: 5
                    }}>
                    {'Exactly 9 numbers'}

                  </Text>
                </View>

              </View>

            </View>

          </View>

        </KeyboardAwareScrollView>

        <View style={{ width: '100%', position: 'absolute', bottom: insets.bottom + (windowWidth * 10) / 100, zIndex: 9999 }}>
          <Button
            text={'REQUEST  OTP'}
            onLoading={classStateData.isLoading}
            onPress={() => SendOTP()}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', height: 30, zIndex: -1 }}>

            <Text
              style={{
                fontFamily: Font.Regular,
                fontSize: Font.medium,
                color: Colors.regulartextcolor,
              }}>
              {LanguageConfiguration.donot[Configurations.language]}

            </Text>

            <TouchableOpacity style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
              onPress={() => navigate(ScreenReferences.Signup)}
            >

              <Text
                style={{
                  fontFamily: Font.Bold,
                  fontSize: Font.medium,
                  color: Colors.buttoncolorblue,
                }}>
                {' Signup'}
              </Text>

            </TouchableOpacity>


          </View>
        </View>

        <OTP
          visible={showOTPModal}
          onRequestClose={() => setShowOTPModal(false)}
          contact={`${classStateData?.code}${classStateData?.number}`}
          countryCode={`${classStateData?.code}`}
          type={'Login'}
        />

      </ScrollView>



    </View >
  );

}