import { Text, View, ScrollView, Platform, SafeAreaView, StatusBar, Image, TouchableOpacity, Keyboard } from 'react-native'
import React, { Component } from 'react'
import { Colors, localimag, Font, mobileH, config, mobileW, consolepro, Lang_chg, localStorage, msgProvider, msgText, apifuntion, msgTitle } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  TextInput,
  HelperText,
  useTheme,
  MD2Colors,
  MD3Colors,
  List,
} from 'react-native-paper';
import { AuthInputBoxSec, DropDownboxSec, Button } from './components'
export default class Forgotpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailfocus: false,
      email: ''

    };
  }
  submit_click = async () => {

    Keyboard.dismiss()
    var email = this.state.email.trim()
    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email.length <= 0) {
      msgProvider.showError(msgText.emptyEmail[config.language])
      return false;
    }

    if (regemail.test(email) !== true) {
      msgProvider.showError(msgText.validEmail[config.language])
      return false
    }
    let email_new = this.state.email
    let url = config.baseURL + "api-forgot-password-email";
    console.log("url", url)

    var data = new FormData();
    data.append('emailId', this.state.email)
    consolepro.consolelog('data', data)

    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {

        setTimeout(() => {
          msgProvider.toast(obj.message, 'center')
          this.props.navigation.navigate('Otp_forget', { email: email_new })
        }, 300)
      } else {
        console.log('muksna')

        setTimeout(() => {
          msgProvider.showError(obj.message, 'center')
        }, 300)
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });

  }




  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView>

          <View style={{ flex: 1, backgroundColor: 'white' }}>
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
            <View style={{ paddingBottom: mobileW * 8 / 100 }}>
              <View style={{ width: '95%', alignSelf: 'center', marginTop: mobileW * 5 / 100, flexDirection: 'row' }}>
                <View style={{ width: '10%', alignSelf: 'center', marginTop: mobileW * 11 / 100 }}>
                  <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}
                    style={{ width: '100%' }}>
                    <Image
                      style={{ width: mobileW * 10 / 100, height: mobileW * 10 / 100, resizeMode: 'contain' }}
                      source={config.textalign == 'right' ? localimag.arabic_back : localimag.backarrow}>


                    </Image>
                  </TouchableOpacity>

                </View>
                <View style={{ width: '80%', alignSelf: 'center' }}>
                  <Image
                    style={{
                      width: (mobileW * 40) / 100,
                      height: (mobileW * 40) / 100,
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                    source={localimag.Forgotlogo}>


                  </Image>
                </View>
              </View>



              <View style={{ width: '90%', alignSelf: 'center', marginTop: mobileW * 10 / 100 }}>
                <Text style={{ fontSize: 20, fontFamily: Font.fontbold, color: Colors.textblack, textAlign: config.textRotate }}>{Lang_chg.Forgot[config.language]} </Text>
              </View>


              <View style={{ width: '90%', alignSelf: 'center', marginTop: mobileW * 1 / 100 }}>
                <Text style={{ fontSize: 14, fontFamily: Font.fontregular, color: Colors.regulartextcolor, textAlign: config.textRotate, }}>{Lang_chg.Forgottext[config.language]}</Text>
              </View>



              <View style={{
                width: '90%', alignSelf: 'center', marginTop: mobileW * 6 / 100,
                //borderColor: this.state.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: mobileW * 0.3 / 100, borderRadius: mobileW * 1 / 100
              }}>
                <AuthInputBoxSec
                  mainContainer={{
                    width: '100%',
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.textinputregistered[config.language]}
                  inputRef={(ref) => {
                    this.emailInput = ref;
                  }}
                  onChangeText={(text) =>
                    this.setState({ email: text })
                  }
                  value={this.state.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyLabel="done"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    this.submit_click()
                  }}
                />
                {/* <View style={{ width: '100%', alignSelf: 'center', }}>
                  
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
                    label={Lang_chg.textinputregistered[config.language]}
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
                </View>
                {this.state.emailfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                  <Text style={{ color: '#0168B3', textAlign: config.textalign }}>{Lang_chg.textinputregistered[config.language]}</Text>
                </View>}*/}

              </View> 
              <Button
                text={Lang_chg.Contiunebtn[config.language]}
                // onLoading={this.state.loading}
                customStyles={
                  {
                    // mainContainer: styles.butonContainer
                  }
                }
                onPress={() => this.submit_click()}
              // isBlank={false}
              />

            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    )
  }
}