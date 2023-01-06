import { Text, View, Image, StatusBar, TouchableOpacity, Modal, FlatList, TextInput, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { Colors,  Font, mobileH, Mapprovider, msgProvider, msgText, config, mobileW, localStorage, handleback, Lang_chg, apifuntion, msgTitle, consolepro } from './Provider/utilslib/Utils';
import { AppHeader, Appheading, Searchbarandicon } from './Allcomponents';
// import { Nodata_foundimage } from './Provider/Nodata_foundimage';
import { AuthInputBoxSec, DropDownboxSec, Button } from './Components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icons } from './icons/IReferences';
const Select_arr = [
  {
    id: 1,
    select: 'Account Issue',

  },
  {
    id: 2,
    select: 'Transaction Issue',

  },
  {
    id: 3,
    select: 'Withdrawal',

  },
  {
    id: 4,
    select: 'Booking Issuse',

  },
  {
    id: 5,
    select: 'Account Issuse',

  },
  {
    id: 6,
    select: 'Login Issuse',

  },
  {
    id: 7,
    select: 'Signup Issuse',

  },
  {
    id: 8,
    select: 'Mobile OTP Issuse',

  },
  {
    id: 9,
    select: 'Other',

  },

]

export default class AddBank extends Component {
  constructor(props) {
    super(props)
    this.state = {

      Select_arr: 'NA',
      selectmodal: false,


      message: '',
      selectissuefocus: false,
      select: '',
      selectissue: '',
      isCheck: false,
      successmodal: false,
      "bank_name": "",
      "your_bank_name": "",
      "account_no": "",
      cnfaccount_no: "",
      "iban_no": "",
      "swift_no": "",
      "message": ""
    }
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.get_all_topic()
    });
  }


  get_all_topic = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']

    let url = config.baseURL + "api-patient-need-help-topic";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)

    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        console.log('result', obj.result)
        let result = obj.result
        this.setState({ Select_arr: obj.result })
      }
      else {
        msgProvider.alert(msgTitle.information[config.language], obj.message[config.language], false);

        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });
  }
  submit_click = async () => {

    if (this.state.bank_name.length <= 0) {
      msgProvider.showError("Please enter bank name!")
      return false;
    }
    if (this.state.your_bank_name.length <= 0) {
      msgProvider.showError("Please enter your name on bank account!")
      return false;
    }
    if (this.state.account_no.length <= 0) {
      msgProvider.showError("Please enter your account number!")
      return false;
    }
    if (this.state.cnfaccount_no.length <= 0) {
      msgProvider.showError("Please confirm your account number!")
      return false;
    }
    if (this.state.account_no != this.state.cnfaccount_no) {
      msgProvider.showError("Account number mismatched!")
      return false;
    }
    if (this.state.iban_no.length <= 0) {
      msgProvider.showError("Please enter your IBN Number!")
      return false;
    }
    if (!this.state.isCheck) {
      msgProvider.showError("Please tick the check box to continue!")
      return false;
    }

    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    
    let url = config.baseURL + "api-update-bank-details";
    console.log("url", url)
    var data = new FormData();
    // {"id":"23", "user_id":"39", "bank_name":"State Bank of India",
    // "your_bank_name":"MJ","account_no":"0000000","iban_no":"11111",
    // "swift_no":"22222","message":Kolkata }
    data.append('user_id', user_id)
    data.append('id', this.state.id)
    data.append('bank_name', this.state.bank_name)
    data.append('your_bank_name', this.state.your_bank_name)
    data.append('account_no', this.state.account_no)
    data.append('iban_no', this.state.iban_no)
    data.append('swift_no', this.state.swift_no)
    data.append('message', this.state.message)
    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        console.log('result', obj.result)
        let result = obj.result
        msgProvider.showSuccess(obj.message)
        console.log(this.props);
        this.props.route.params.reloadList()
        setTimeout(() => {
          this.props.navigation.navigate('Transactiontab');
        }, 700);

      }
      else {
        msgProvider.showError(obj.message)

        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });
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



        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.selectmodal}
          onRequestClose={() => { }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ selectmodal: false }) }}
            style={{
              flex: 1,
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: '#00000080',
              width: '100%',
              marginTop: (mobileW * 3) / 100,
              paddingBottom: (mobileW * 8) / 100,
            }}>
            <View
              style={{
                width: '70%',
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  backgroundColor: Colors.backgroundcolorblue,
                }}>
                <View
                  style={{ width: '45%', paddingVertical: (mobileW * 3) / 100 }}>
                  <Text
                    style={{
                      textAlign: config.textalign,
                      fontFamily: Font.Regular,
                      fontSize: (mobileW * 4) / 100,
                      alignSelf: 'center',
                      color: Colors.textwhite,
                    }}>
                    {Lang_chg.select_topic_text[config.language]}
                  </Text>
                </View>
              </View>
              <View style={{ width: '100%' }}>
                <FlatList

                  data={this.state.Select_arr}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              selectmodal: false,
                              select: item.name,

                            });
                          }}
                        >
                          <View style={{ width: '100%', backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'flex-end' }}>
                            <View style={{ width: '95%', borderBottomColor: '#0000001F', borderBottomWidth: 1, paddingVertical: mobileW * 2.5 / 100, marginLeft: mobileW * 5 / 100 }}>
                              <Text
                                style={{
                                  color: Colors.textblack,
                                  textAlign: config.textRotate,
                                  fontSize: (mobileW * 4) / 100,
                                  paddingLeft: mobileW * 2 / 100,

                                }}>
                                {item.name}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  }}></FlatList>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.successmodal}
          onRequestClose={() => { }}>

          <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ successmodel: false }) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%', }}>
            <View style={{ width: '100%', backgroundColor: 'white', borderRadius: mobileW * 4 / 100, position: 'absolute', bottom: 0, alignItems: 'center', justifyContent: 'center', paddingBottom: mobileW * 5 / 100, alignSelf: 'center' }}>
              {config.language == 0 ?
                <Image style={{ width: mobileW * 17 / 100, height: mobileW * 17 / 100, alignSelf: 'center', marginTop: mobileW * -7 / 100, resizeMode: 'contain' }}
                  source={require('./icons/greentick.png')}></Image>
                :
                <Image style={{ width: mobileW * 17 / 100, height: mobileW * 17 / 100, alignSelf: 'center', marginTop: mobileW * -7 / 100, resizeMode: 'contain' }}
                  source={require('./icons/ryt_opp.png')}></Image>
              }
              <Text style={{ fontSize: mobileW * 8 / 100, marginTop: mobileW * 5 / 100, fontFamily: Font.Medium, textAlign: config.textalign, }}>{Lang_chg.thank[config.language]}


              </Text>
              <Text style={{ fontSize: mobileW * 3.5 / 100, marginTop: mobileW * 5 / 100, fontFamily: Font.Medium, textAlign: config.textalign }}>{Lang_chg.success[config.language]}


              </Text>

              <Text style={{ fontSize: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, fontFamily: Font.Medium, textAlign: config.textalign, color: Colors.textgray }}>{Lang_chg.text_of_modal[config.language]}


              </Text>

              <TouchableOpacity onPress={() => {
                this.setState({ successmodal: false }), this.props.navigation.goBack();
              }}

                style={{ width: '15%', alignSelf: 'center', borderColor: Colors.bordercolorblue, borderWidth: 1, paddingVertical: mobileW * 2 / 100, marginTop: mobileW * 5 / 100, borderRadius: mobileW * 3 / 100 }}>
                <Text style={{ fontSize: mobileW * 3 / 100, alignSelf: 'center', fontFamily: Font.Medium, textAlign: config.textalign, alignSelf: 'center', color: Colors.terms_text_color_blue, }}>{Lang_chg.close_txt[config.language]}</Text>


              </TouchableOpacity>





            </View>
          </TouchableOpacity>


        </Modal>




        <View style={{
          width: '100%', alignSelf: 'center', paddingVertical: mobileW * 3 / 100,
          shadowOpacity: 0.3,
          marginBottom: 0.9,
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 1 },
          elevation: 5,
          backgroundColor: 'white'
        }}>
          <View style={{ alignItems: 'center', width: '90%', alignSelf: 'center', flexDirection: 'row' }}>
            <View style={{ width: '5%' }}>
              <TouchableOpacity onPress={() => {
                this.props.navigation.goBack();
              }}
                style={{ width: '100%', }}>
                <Image style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, alignSelf: 'center' }}
                  source={config.textalign == 'right' ? Icons.arabic_back : Icons.backarrow}></Image>
              </TouchableOpacity>
            </View>
            <View style={{ width: '95%', alignSelf: 'center', }}>
              <Text style={{ textAlign: config.textalign, fontSize: mobileW * 4.5 / 100, color: Colors.textblack, fontFamily: Font.buttonfontfamily, alignSelf: 'center' }}>{Lang_chg.supporttext[config.language]} </Text>
            </View>
          </View>
        </View>

        <ScrollView style={{
          width: '100%', alignSelf: 'center', flex: 1,
          backgroundColor: Colors.white_color
        }}>
          <KeyboardAwareScrollView>
            <View style={{ width: '100%', backgroundColor: Colors.tab_background_color, paddingVertical: mobileW * 2 / 100 }}>
            </View>


            <View style={{
              width: '90%', alignSelf: 'center', marginTop: mobileW * 5 / 100,
              marginBottom: mobileW * 3 / 100
            }}>

              <Text style={Styles.textheading}>Add Bank Details</Text>
              <Text style={[Styles.textcontent, {
                marginTop: 6
              }]}>This bank account will be used to withdrawa your available
                funds. You must add a valid bank account details with the same name which
                verifies its you the owner who receiving the money and not third person.</Text>
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 2) / 100,
                // borderColor: this.state.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={'Bank Name'}
                inputRef={(ref) => {
                  this.bank_nameInput = ref;
                }}
                onChangeText={(text) =>
                  this.setState({ bank_name: text })
                }
                value={this.state.bank_name}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.your_bank_nameInput.focus();
                }}
              />
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 2) / 100,
                // borderColor: this.state.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={'Account Name'}
                inputRef={(ref) => {
                  this.your_bank_nameInput = ref;
                }}
                onChangeText={(text) =>
                  this.setState({ your_bank_name: text })
                }
                value={this.state.your_bank_name}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.account_noInput.focus();
                }}
              />
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 2) / 100,
                // borderColor: this.state.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={'Account Number'}
                inputRef={(ref) => {
                  this.account_noInput = ref;
                }}
                secureTextEntry={true}
                onChangeText={(text) =>
                  this.setState({ account_no: text })
                }
                value={this.state.account_no}
                keyboardType={'number-pad'}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.cnfaccount_noInput.focus();
                }}
              />
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 2) / 100,
                // borderColor: this.state.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={'Confirm Account Number'}
                inputRef={(ref) => {
                  this.cnfaccount_noInput = ref;
                }}
                onChangeText={(text) =>
                  this.setState({ cnfaccount_no: text })
                }
                value={this.state.cnfaccount_no}
                keyboardType={'number-pad'}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.iban_noInput.focus();
                }}
              />
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 2) / 100,
                // borderColor: this.state.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={'IBN Code'}
                inputRef={(ref) => {
                  this.iban_noInput = ref;
                }}
                onChangeText={(text) =>
                  this.setState({ iban_no: text })
                }
                value={this.state.iban_no}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.swift_noInput.focus();
                }}
              />
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 2) / 100,
                // borderColor: this.state.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={'Swift Number(Optional)'}
                inputRef={(ref) => {
                  this.swift_noInput = ref;
                }}
                onChangeText={(text) =>
                  this.setState({ swift_no: text })
                }
                value={this.state.swift_no}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  this.messageInput.focus();
                }}
              />
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 2) / 100,
                // borderColor: this.state.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={'Bank Account Address'}
                inputRef={(ref) => {
                  this.messageInput = ref;
                }}
                onChangeText={(text) =>
                  this.setState({ message: text })
                }
                value={this.state.message}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  // this.emailInput.focus();
                }}
              />
            </View>

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 5) / 100,
                // borderColor: this.state.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <TouchableOpacity activeOpacity={0.9}
                style={{
                  width: '95%', flexDirection: 'row',
                  paddingLeft: mobileW * 1 / 100
                }} onPress={() => {
                  this.setState({
                    isCheck: !this.state.isCheck
                  })
                }}>
                <View style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <View style={{
                    // width: '20%'
                    marginRight: 15
                  }}>
                    <Image style={
                      (this.state.isCheck) ?
                        { height: 23, width: 23, resizeMode: 'contain', }
                        : { height: 23, width: 23, resizeMode: 'contain', tintColor: '#696464' }
                    }
                      source={(this.state.isCheck) ? Icons.CheckedBox : require('./icons/blank-check-box.png')}></Image>
                  </View>

                  <Text
                    style={{
                      color: Colors.regulartextcolor,
                      fontFamily: Font.Regular,
                      // paddingLeft:mobileW*2/100,
                      // textAlign: config.textalign,
                      fontSize: Font.Remember,
                    }}>
                    By adding an account, you agree on all the information provided are correct & genuine.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Button
              text={Lang_chg.submitbtntext[config.language]}
              // onLoading={this.state.loading}
              customStyles={
                {
                  // mainContainer: styles.butonContainer
                }
              }
              onPress={() => this.submit_click()}
            // isBlank={false}
            />

          </KeyboardAwareScrollView>
        </ScrollView>

      </View>
    )
  }
}






