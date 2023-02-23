import { Modal, Text, Dimensions, View, Platform, BackHandler, Alert, ScrollView, StatusBar, SafeAreaView, Image, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Colors, Font, mobileH, Configurations, mobileW, LanguageConfiguration, API, MessageTexts, MessageFunctions, windowHeight } from '../Helpers/Utils';
import GestureRecognizer from 'react-native-swipe-gestures';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications';
import { Icons } from '../Assets/Icons/IReferences'
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { setRememberedEmail, setRememberedPassword, setShouldAutoLogin, setUserFCMToken, setUserLoginData, setUserLoginType } from '../Redux/Actions/UserActions';
import { useIsFocused } from '@react-navigation/native';
import { useRef } from 'react';
import { UserTypes } from '../Helpers/Constants';
import RBSheet from 'react-native-raw-bottom-sheet';
import { vs } from 'react-native-size-matters';
import { Cross, _Cross } from '../Assets/Icons/SvgIcons/Index';
import { SvgXml } from 'react-native-svg';
import { BottomSheetProps, BottomSheetStyles, BottomSheetViewStyles } from '../Styles/Sheet';

global.current_lat_long = 'NA';
global.myLatitude = 'NA';
global.myLongitude = 'NA';

export default Login = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    isSecurePassword: true,
    email: '',
    password: '',
    device_lang: 'AR',
    isRememberChecked: false,
    selectuserType: -1,
    isLoadingInButton: false,
  })

  const userTypeSheetRef = useRef()

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
    userPassword,
    loginUserData
  } = useSelector(state => state.Auth)

  const isFocused = useIsFocused()

  useEffect(() => {
    const mUserTypeIndex = UserTypes.findIndex(u => u.value === userType)
    console.log({
      email: userEmail,
      password: userPassword,
      isRememberChecked: shouldAutoLogin,
      selectuserType: mUserTypeIndex
    });
    if (shouldAutoLogin) {
      if (userEmail && userPassword) {
        setState({
          email: userEmail,
          password: userPassword,
          isRememberChecked: shouldAutoLogin,
          selectuserType: mUserTypeIndex
        })
      }
    }
  }, [])


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
    navigation.addListener('focus', payload =>
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    );
    navigation.addListener('blur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
    );
  }, [])

  const checkIsValid = () => {
    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (classStateData?.selectuserType == -1) {
      MessageFunctions.showError(MessageTexts.emptyUsertype[Configurations.language])
      return false;
    }

    if (classStateData?.email.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyEmail[Configurations.language])
      return false;
    }

    if (regemail.test(classStateData?.email.trim()) !== true) {
      MessageFunctions.showError(MessageTexts.validEmail[Configurations.language])
      return false
    }

    if (classStateData?.password.length <= 0 || classStateData?.password.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyPassword[Configurations.language])
      return false
    }

    return true
  }

  const onLogin = async () => {

    Keyboard.dismiss()
    const isValid = checkIsValid()

    if (!isValid) return isValid
    else {
      setState({
        isLoadingInButton: true
      })

      let url = Configurations.baseURL + "api-service-provider-login";
      var data = new FormData();

      const fcm = await FBPushNotifications.getFcmToken()

      data.append('email', classStateData?.email)
      data.append('password', classStateData?.password)
      data.append('device_type', Configurations.device_type)
      data.append('device_lang', 'ENG')
      data.append('fcm_token', fcm)
      data.append('user_type', UserTypes[classStateData?.selectuserType].value)

      API.post(url, data, 1).then((obj) => {

        console.log({ Login: obj?.result })
        if (obj.status == true) {

          dispatch(setUserLoginData(obj?.result))
          dispatch(setUserFCMToken(fcm))
          dispatch(setUserLoginType(UserTypes[classStateData?.selectuserType].value))
          dispatch(setShouldAutoLogin(classStateData?.isRememberChecked))

          if (classStateData?.isRememberChecked == true) {
            dispatch(setRememberedEmail(classStateData?.email))
            dispatch(setRememberedPassword(classStateData?.password))
          }

          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: ScreenReferences.Home }],
            });
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
      }).finally(() => {
        setState({
          isLoadingInButton: false
        })
      })

    }
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
                  lableText={(classStateData?.selectuserType == -1) ? LanguageConfiguration.UserTypeText[Configurations.language] : UserTypes[classStateData?.selectuserType].title}
                  boxPressAction={() => { userTypeSheetRef.current.open() }}
                />

                <RBSheet
                  ref={userTypeSheetRef}
                  {...BottomSheetProps}
                  customStyles={BottomSheetStyles} >
                  <View style={BottomSheetViewStyles.MainView}>
                    <View style={BottomSheetViewStyles.ButtonContainer}>
                      <TouchableOpacity style={BottomSheetViewStyles.Button} onPress={() => {
                        userTypeSheetRef.current.close()
                      }}>
                        <SvgXml xml={_Cross}
                          width={windowHeight / 26}
                          height={windowHeight / 26}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={BottomSheetViewStyles.Body}>

                      <View style={BottomSheetViewStyles.TitleBar}>
                        <Text style={BottomSheetViewStyles.Title}>Select User Type</Text>
                      </View>

                      <KeyboardAwareScrollView contentContainerStyle={BottomSheetViewStyles.ScrollContainer}>
                        {
                          UserTypes.map((data, index) => {
                            return (
                              <TouchableOpacity style={{
                                width: '100%',
                              }} onPress={() => {
                                setState({
                                  selectuserType: index
                                })
                                userTypeSheetRef.current.close()
                              }} key={'utol' + index}>
                                <View style={{
                                  width: (Platform.OS == "ios") ? '95%' : '94.5%',
                                  marginLeft: 15,
                                  borderBottomColor: Colors.gray6,
                                  borderBottomWidth: (index == (UserTypes.length - 1)) ? 0 : 1,
                                }}>
                                  <Text style={{
                                    color: '#041A27',
                                    fontSize: 15,
                                    fontFamily: Font.headingfontfamily,
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                    width: '94.5%',
                                  }}>{data.title}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                          })
                        }
                      </KeyboardAwareScrollView>
                    </View>
                  </View>

                </RBSheet>

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
                    isRememberChecked: !classStateData.isRememberChecked
                  })
                }}>
                  <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '20%' }}>
                      <Image style={{ height: 23, width: 23, resizeMode: 'contain', }}
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
                onLoading={classStateData.isLoadingInButton}
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
                customStyles={{
                  mainContainer: { borderWidth: 0, },
                  buttonText: { fontSize: Font.medium }

                }}
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