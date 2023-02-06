import { Text, View, Image, StatusBar, TouchableOpacity, Modal, FlatList, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Font, MessageFunctions, Configurations, mobileW, LanguageConfiguration, API, MessageHeadings } from '../Helpers/Utils';
import { AuthInputBoxSec, Button } from '../Components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useSelector } from 'react-redux';


export default AddBankInformation = ({ navigation, route }) => {
  const [classStateData, setClassStateData] = useState({
    Select_arr: 'NA',
    selectmodal: false,
    message: '',
    select: '',
    isCheck: false,
    successmodal: false,
    bank_name: "",
    your_bank_name: "",
    account_no: "",
    cnfaccount_no: "",
    iban_no: "",
    swift_no: "",
  })

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getData()
    });
  }, [])


  const {
    loginUserData
  } = useSelector(state => state.Auth)


  const getData = async () => {
    let user_id = loginUserData['user_id']

    let url = Configurations.baseURL + "api-patient-need-help-topic";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('result', obj.result)
        let result = obj.result
        setState({ Select_arr: obj.result })
      }
      else {
        MessageFunctions.alert(MessageHeadings.information[Configurations.language], obj.message[Configurations.language], false);

        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setState({ loading: false });
    });
  }
  const onUpdate = async () => {

    if (classStateData.bank_name.length <= 0) {
      MessageFunctions.showError("Please enter bank name!")
      return false;
    }
    if (classStateData.your_bank_name.length <= 0) {
      MessageFunctions.showError("Please enter your name on bank account!")
      return false;
    }
    if (classStateData.account_no.length <= 0) {
      MessageFunctions.showError("Please enter your account number!")
      return false;
    }
    if (classStateData.cnfaccount_no.length <= 0) {
      MessageFunctions.showError("Please confirm your account number!")
      return false;
    }
    if (classStateData.account_no != classStateData.cnfaccount_no) {
      MessageFunctions.showError("Account number mismatched!")
      return false;
    }
    if (classStateData.iban_no.length <= 0) {
      MessageFunctions.showError("Please enter your IBN Number!")
      return false;
    }
    if (!classStateData.isCheck) {
      MessageFunctions.showError("Please tick the check box to continue!")
      return false;
    }

    let user_id = loginUserData['user_id']
    let user_type = loginUserData['user_type']

    let url = Configurations.baseURL + "api-update-bank-details";
    var data = new FormData();
    data.append('user_id', user_id)
    data.append('id', classStateData.id)
    data.append('bank_name', classStateData.bank_name)
    data.append('your_bank_name', classStateData.your_bank_name)
    data.append('account_no', classStateData.account_no)
    data.append('iban_no', classStateData.iban_no)
    data.append('swift_no', classStateData.swift_no)
    data.append('message', classStateData.message)

    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('result', obj.result)
        let result = obj.result
        MessageFunctions.showSuccess(obj.message)
        route.params.reloadList()
        setTimeout(() => {
          navigation.navigate(ScreenReferences.TransactionTabStack);
        }, 700);

      }
      else {
        MessageFunctions.showError(obj.message)

        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setState({ loading: false });
    });
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



      <Modal
        animationType="fade"
        transparent={true}
        visible={classStateData.selectmodal}
        onRequestClose={() => { }}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => { setState({ selectmodal: false }) }}
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
                    textAlign: Configurations.textalign,
                    fontFamily: Font.Regular,
                    fontSize: (mobileW * 4) / 100,
                    alignSelf: 'center',
                    color: Colors.textwhite,
                  }}>
                  {LanguageConfiguration.select_topic_text[Configurations.language]}
                </Text>
              </View>
            </View>
            <View style={{ width: '100%' }}>
              <FlatList

                data={classStateData.Select_arr}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          setState({
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
                                textAlign: Configurations.textRotate,
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
        visible={classStateData.successmodal}
        onRequestClose={() => { }}>

        <TouchableOpacity activeOpacity={0.9} onPress={() => { setState({ successmodel: false }) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%', }}>
          <View style={{ width: '100%', backgroundColor: 'white', borderRadius: mobileW * 4 / 100, position: 'absolute', bottom: 0, alignItems: 'center', justifyContent: 'center', paddingBottom: mobileW * 5 / 100, alignSelf: 'center' }}>
            {Configurations.language == 0 ?
              <Image style={{ width: mobileW * 17 / 100, height: mobileW * 17 / 100, alignSelf: 'center', marginTop: mobileW * -7 / 100, resizeMode: 'contain' }}
                source={Icons.GreenTick}></Image>
              :
              <Image style={{ width: mobileW * 17 / 100, height: mobileW * 17 / 100, alignSelf: 'center', marginTop: mobileW * -7 / 100, resizeMode: 'contain' }}
                source={require('../Assets/Icons/ryt_opp.png')}></Image>
            }
            <Text style={{ fontSize: mobileW * 8 / 100, marginTop: mobileW * 5 / 100, fontFamily: Font.Medium, textAlign: Configurations.textalign, }}>{LanguageConfiguration.thank[Configurations.language]}


            </Text>
            <Text style={{ fontSize: mobileW * 3.5 / 100, marginTop: mobileW * 5 / 100, fontFamily: Font.Medium, textAlign: Configurations.textalign }}>{LanguageConfiguration.success[Configurations.language]}


            </Text>

            <Text style={{ fontSize: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, fontFamily: Font.Medium, textAlign: Configurations.textalign, color: Colors.textgray }}>{LanguageConfiguration.text_of_modal[Configurations.language]}


            </Text>

            <TouchableOpacity onPress={() => {
              setState({ successmodal: false }), navigation.goBack();
            }}

              style={{ width: '15%', alignSelf: 'center', borderColor: Colors.bordercolorblue, borderWidth: 1, paddingVertical: mobileW * 2 / 100, marginTop: mobileW * 5 / 100, borderRadius: mobileW * 3 / 100 }}>
              <Text style={{ fontSize: mobileW * 3 / 100, alignSelf: 'center', fontFamily: Font.Medium, textAlign: Configurations.textalign, alignSelf: 'center', color: Colors.terms_text_color_blue, }}>{LanguageConfiguration.close_txt[Configurations.language]}</Text>


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
              navigation.goBack();
            }}
              style={{ width: '100%', }}>
              <Image style={{ width: mobileW * 8 / 100, height: mobileW * 8 / 100, alignSelf: 'center' }}
                source={Configurations.textalign == 'right' ? Icons.BackRTL : Icons.LeftArrow}></Image>
            </TouchableOpacity>
          </View>
          <View style={{ width: '95%', alignSelf: 'center', }}>
            <Text style={{ textAlign: Configurations.textalign, fontSize: mobileW * 4.5 / 100, color: Colors.textblack, fontFamily: Font.buttonfontfamily, alignSelf: 'center' }}>{LanguageConfiguration.supporttext[Configurations.language]} </Text>
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
              // borderColor: classStateData.namefocus == true ? '#0057A5' : Colors.placeholder_border,
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
                bank_nameInput = ref;
              }}
              onChangeText={(text) =>
                setState({ bank_name: text })
              }
              value={classStateData.bank_name}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                your_bank_nameInput.focus();
              }}
            />
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 2) / 100,
              // borderColor: classStateData.namefocus == true ? '#0057A5' : Colors.placeholder_border,
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
                your_bank_nameInput = ref;
              }}
              onChangeText={(text) =>
                setState({ your_bank_name: text })
              }
              value={classStateData.your_bank_name}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                account_noInput.focus();
              }}
            />
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 2) / 100,
              // borderColor: classStateData.namefocus == true ? '#0057A5' : Colors.placeholder_border,
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
                account_noInput = ref;
              }}
              secureTextEntry={true}
              onChangeText={(text) =>
                setState({ account_no: text })
              }
              value={classStateData.account_no}
              keyboardType={'number-pad'}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                cnfaccount_noInput.focus();
              }}
            />
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 2) / 100,
              // borderColor: classStateData.namefocus == true ? '#0057A5' : Colors.placeholder_border,
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
                cnfaccount_noInput = ref;
              }}
              onChangeText={(text) =>
                setState({ cnfaccount_no: text })
              }
              value={classStateData.cnfaccount_no}
              keyboardType={'number-pad'}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                iban_noInput.focus();
              }}
            />
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 2) / 100,
              // borderColor: classStateData.namefocus == true ? '#0057A5' : Colors.placeholder_border,
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
                iban_noInput = ref;
              }}
              onChangeText={(text) =>
                setState({ iban_no: text })
              }
              value={classStateData.iban_no}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                swift_noInput.focus();
              }}
            />
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 2) / 100,
              // borderColor: classStateData.namefocus == true ? '#0057A5' : Colors.placeholder_border,
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
                swift_noInput = ref;
              }}
              onChangeText={(text) =>
                setState({ swift_no: text })
              }
              value={classStateData.swift_no}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                messageInput.focus();
              }}
            />
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 2) / 100,
              // borderColor: classStateData.namefocus == true ? '#0057A5' : Colors.placeholder_border,
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
                messageInput = ref;
              }}
              onChangeText={(text) =>
                setState({ message: text })
              }
              value={classStateData.message}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                // emailInput.focus();
              }}
            />
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 5) / 100,
              // borderColor: classStateData.namefocus == true ? '#0057A5' : Colors.placeholder_border,
              // borderWidth: 1,
              // borderRadius: (mobileW * 1) / 100,
            }}>
            <TouchableOpacity activeOpacity={0.9}
              style={{
                width: '95%', flexDirection: 'row',
                paddingLeft: mobileW * 1 / 100
              }} onPress={() => {
                setState({
                  isCheck: !classStateData.isCheck
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
                    (classStateData.isCheck) ?
                      { height: 23, width: 23, resizeMode: 'contain', }
                      : { height: 23, width: 23, resizeMode: 'contain', tintColor: '#696464' }
                  }
                    source={(classStateData.isCheck) ? Icons.CheckedBox : Icons.BlackBox}></Image>
                </View>

                <Text
                  style={{
                    color: Colors.regulartextcolor,
                    fontFamily: Font.Regular,
                    // paddingLeft:mobileW*2/100,
                    // textAlign: Configurations.textalign,
                    fontSize: Font.Remember,
                  }}>
                  By adding an account, you agree on all the information provided are correct & genuine.
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Button
            text={LanguageConfiguration.submitbtntext[Configurations.language]}
            // onLoading={classStateData.loading}
            customStyles={
              {
                // mainContainer: styles.butonContainer
              }
            }
            onPress={() => onUpdate()}
          // isBlank={false}
          />

        </KeyboardAwareScrollView>
      </ScrollView>

    </View>
  )

}






