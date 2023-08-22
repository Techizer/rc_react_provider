import { Text, View, Image, StatusBar, TouchableOpacity, Modal, FlatList, TextInput, ScrollView, Dimensions, Platform, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors, Font, MessageFunctions, Configurations, mobileW, LanguageConfiguration, API, MessageHeadings } from '../Helpers/Utils';
import { AuthInputBoxSec, Button } from '../Components'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icons } from '../Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useSelector } from 'react-redux';
import ScreenHeader from '../Components/ScreenHeader';
import { vs } from 'react-native-size-matters';


export default AddBankInformation = ({ navigation, route }) => {
  const [classStateData, setClassStateData] = useState({
    message: '',
    isCheck: false,
    bank_name: "",
    your_bank_name: "",
    account_no: "",
    cnfaccount_no: "",
    iban_no: "",
    swift_no: "",
  })

  const [isOnButtonLoading, setIsOnButtonLoading] = useState(false)

  const bankNameRef = useRef()
  const accountNameRef = useRef()
  const accountNumberRef = useRef()
  const confirmAccountNumberRef = useRef()
  const ibanRef = useRef()
  const swiftCodeRef = useRef()
  const bankAddress = useRef()

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  const {
    loginUserData
  } = useSelector(state => state.StorageReducer)

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

    setIsOnButtonLoading(true)

    let url = Configurations.baseURL + "api-update-bank-details";
    var data = new FormData();
    data.append('user_id', loginUserData?.user_id)
    data.append('id', classStateData.id)
    data.append('bank_name', classStateData.bank_name)
    data.append('your_bank_name', classStateData.your_bank_name)
    data.append('account_no', classStateData.account_no)
    data.append('iban_no', classStateData.iban_no)
    data.append('swift_no', classStateData.swift_no)
    data.append('message', classStateData.message)

    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        MessageFunctions.showSuccess(obj.message)
        setIsOnButtonLoading(false)
        setTimeout(() => {
          navigation.replace(ScreenReferences.TransactionTabStack);
        }, 800);

      }
      else {
        MessageFunctions.showError(obj.message)
        setIsOnButtonLoading(false)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setIsOnButtonLoading(false)
    });
  }




  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60

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

      <ScreenHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        leftIcon
        rightIcon={false}
        navigation={navigation}
        title={'Add Bank Information'}
      />


      <KeyboardAwareScrollView contentContainerStyle={{
        paddingBottom: vs(28)
      }}>

        <View style={{
          width: '90%', alignSelf: 'center', marginTop: mobileW * 5 / 100,
          marginBottom: mobileW * 3 / 100
        }}>

          <Text style={Styles.textheading}>Add Bank Details</Text>
          <Text style={[Styles.textcontent, {
            marginTop: 6
          }]}>This bank account will be used to withdraw your available funds. Please ensure that you add valid bank account details that match your name, in order to verify that you are the rightful owner of the account and that the funds are being received by you and not by a third party.</Text>
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
            lableText={'Bank Name'}
            inputRef={bankNameRef}
            onChangeText={(text) =>
              setState({ bank_name: text })
            }
            value={classStateData.bank_name}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              accountNameRef.current.focus();
            }}
          />
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
            lableText={'Account Name'}
            inputRef={accountNameRef}
            onChangeText={(text) =>
              setState({ your_bank_name: text })
            }
            value={classStateData.your_bank_name}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              accountNumberRef.current.focus();
            }}
          />
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
            lableText={'Account Number'}
            inputRef={accountNumberRef}
            // secureTextEntry={true}
            onChangeText={(text) =>
              setState({ account_no: text })
            }
            value={classStateData.account_no}
            keyboardType={'number-pad'}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              confirmAccountNumberRef.current.focus();
            }}
          />
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
            lableText={'Confirm Account Number'}
            inputRef={confirmAccountNumberRef}
            onChangeText={(text) =>
              setState({ cnfaccount_no: text })
            }
            value={classStateData.cnfaccount_no}
            keyboardType={'number-pad'}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              ibanRef.current.focus();
            }}
          />
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
            lableText={'IBN Code'}
            inputRef={ibanRef}
            onChangeText={(text) =>
              setState({ iban_no: text })
            }
            value={classStateData.iban_no}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              swiftCodeRef.current.focus();
            }}
          />
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
            lableText={'Swift Number (Optional)'}
            inputRef={swiftCodeRef}
            onChangeText={(text) =>
              setState({ swift_no: text })
            }
            value={classStateData.swift_no}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              bankAddress.current.focus();
            }}
          />
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

            lableText={'Bank Account Address'}
            inputRef={bankAddress}
            onChangeText={(text) =>
              setState({ message: text })
            }
            value={classStateData.message}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              Keyboard.dismiss()
            }}
          />
        </View>

        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 5) / 100,
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
                width: '8%',
                marginRight: '2%'
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
                  width: '90%',
                  fontSize: Font.Remember,
                }}>
                By adding an account, you confirm that all the information provided is accurate and genuine.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Button
          text={LanguageConfiguration.submitbtntext[Configurations.language]}
          onPress={onUpdate}
          onLoading={isOnButtonLoading}
          isDisabled={!classStateData.isCheck}
          customStyles={{
            mainContainer: {
              marginBottom: vs(16),
              width: '90%'
            }
          }}
        />

      </KeyboardAwareScrollView>

    </View>
  )

}






