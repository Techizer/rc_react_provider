import { Text, View, ScrollView, Platform, SafeAreaView, StatusBar, Image, TouchableHighlight, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Font, mobileH, config, mobileW, LanguageConfiguration, localStorage, MessageFunctions, MessageTexts, API, MessageHeadings } from '../Helpers/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { AuthInputBoxSec, Button } from '../Components'
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { s, vs } from 'react-native-size-matters';

export default ForgetPassword = ({ navigation, route }) => {
  const [classStateData, setClassStateData] = useState({
    emailfocus: false,
    email: ''
  })

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  useEffect(() => {

  }, [])

  const onSubmit = async () => {

    Keyboard.dismiss()
    var email = classStateData.email.trim()
    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email.length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyEmail[config.language])
      return false;
    }

    if (regemail.test(email) !== true) {
      MessageFunctions.showError(MessageTexts.validEmail[config.language])
      return false
    }
    let email_new = classStateData.email
    let url = config.baseURL + "api-forgot-password-email";
    console.log("url", url)

    var data = new FormData();
    data.append('emailId', classStateData.email)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {

        setTimeout(() => {
          MessageFunctions.toast(obj.message, 'center')
          navigation.navigate(ScreenReferences.OTP, { email: email_new })
        }, 300)
      } else {
        console.log('muksna')

        setTimeout(() => {
          MessageFunctions.showError(obj.message, 'center')
        }, 300)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setState({ loading: false });
    });

  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}>
      <KeyboardAwareScrollView>

        <View style={{ flex: 1, backgroundColor: 'white' }}>
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
              width: "100%",
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: vs(40),
            }}>
            <View style={{ justifyContent: 'center' }}>
              <Image
                style={{
                  width: (mobileW * 40) / 100,
                  height: (mobileW * 40) / 100,
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
                resizeMode='contain'
                source={Icons.LogoWithText} />
            </View>

            <TouchableHighlight
              underlayColor={Colors.Highlight}
              onPress={() => {
                navigation.pop();
              }}
              style={{ position: 'absolute', left: 0, height: vs(40), width: s(40), justifyContent: 'center', alignItems: 'center' }}
            >
              <Image
                style={{ width: mobileW * 10 / 100, height: mobileW * 10 / 100, resizeMode: 'contain' }}
                source={config.textalign == 'right' ? Icons.BackRTL : Icons.LeftArrow}>
              </Image>

            </TouchableHighlight>
          </View>

          <View style={{ paddingBottom: mobileW * 8 / 100 }}>

            <View style={{ width: '90%', alignSelf: 'center', marginTop: mobileW * 10 / 100 }}>
              <Text style={{
                color: Colors.textblack,
                textAlign: config.textRotate,
                fontSize: Font.headingblack,
                fontFamily: Font.blackheadingfontfamily,
              }}>{LanguageConfiguration.Forgot[config.language]} </Text>
            </View>


            <View style={{ width: '90%', alignSelf: 'center', marginTop: mobileW * 1 / 100 }}>
              <Text style={{
                textAlign: config.textRotate,
                fontSize: Font.headinggray,
                fontFamily: Font.headingfontfamily,
                color: Colors.placeholder_text,
              }}>{LanguageConfiguration.Forgottext[config.language]}</Text>
            </View>


            <AuthInputBoxSec
                mainContainer={{
                  width: '94%',
                  alignSelf: 'center',
                  marginTop: mobileW * 6 / 100,
                }}
                // icon={layer9_icon}
                lableText={LanguageConfiguration.textinputregistered[config.language]}
                inputRef={(ref) => {
                  emailInput = ref;
                }}
                onChangeText={(text) =>
                  setState({ email: text })
                }
                value={classStateData.email}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyLabel="done"
                returnKeyType="done"
                onSubmitEditing={() => {
                  onSubmit()
                }}
              />

            <Button
              text={LanguageConfiguration.Contiunebtn[config.language]}
              // onLoading={classStateData.loading}
              customStyles={
                {
                  // mainContainer: styles.butonContainer
                }
              }
              onPress={() => onSubmit()}
            // isBlank={false}
            />

          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  )

}