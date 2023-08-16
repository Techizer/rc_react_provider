import { TouchableHighlight, Keyboard, FlatList, Modal, Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Colors, Font, mobileH, Configurations, mobileW, LanguageConfiguration, API, MessageFunctions, MessageTexts, Media, windowHeight, windowWidth } from '../Helpers/Utils';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Icons } from '../Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { vs, s } from 'react-native-size-matters';
import { SvgXml } from 'react-native-svg';
import { _Cross, leftArrow, rightArrow } from '../Icons/SvgIcons/Index';
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications';
import RBSheet from "react-native-raw-bottom-sheet";
import { UserTypes } from '../Helpers/Constants';
import { BottomSheetProps, BottomSheetStyles, BottomSheetStylesForSmall, BottomSheetViewStyles } from '../Styles/Sheet';
import { useDispatch } from 'react-redux';
import { setAppState } from '../Redux/Actions/UserActions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignupForm from '../Components/SignupForm';

export default Signup = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    isSecurePassword: true,
    isSecurePassword1: true,
    name: '',
    email: '',
    number: '',
    id: '',
    id_number: '',
    speciality: '',
    qualification: '',
    experience: '',
    scfhs_number: '',
    country_name: '',
    password: '',
    confirm: '',
    mobile: '',
    country_code: '',
    country_short_code: '',
    showUsertype: false,
    showSpeciality: false,
    isLoadingInButton: false,
    imageType: '',
    selectuserType: -1,
    isDatePickerVisibletwo: false,
    dob_date: '',
    gender: '',
    mabtn: false,
    febtn: false,
    specialityArr: [],
    hosp_moh_lic_no: '',
    hosp_reg_no: '',
    id_image: {
      path: '',
      mime: '',
      filename: '',
    },
    certificate: {
      path: '',
      mime: '',
      filename: '',
    },
    scfhs_image: {
      path: '',
      mime: '',
      filename: '',
    },
  })

  const userTypeSheetRef = useRef()
  const countrySheetRef = useRef()
  const specialitySheetRef = useRef()
  const attachmentOptionSheetRef = useRef()
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    getServiceCountries()
  }, [])

  const setState = (payload, resolver) => {
    setClassStateData(prev => ({ ...prev, ...payload }))
    if (resolver) {
      resolver()
    }
  }

  const checkIsValid = () => {

    var digits = classStateData.id.toString().split('');
    var realDigits = digits.map(Number)

    if (classStateData.selectuserType == -1) {
      MessageFunctions.showError(MessageTexts.emptyUsertype[Configurations.language])
      return false;
    }
    if (classStateData.name.length <= 0 || classStateData.name.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyName[Configurations.language])
      return false;
    }
    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (classStateData.email.trim() <= 0) {
      MessageFunctions.showError(MessageTexts.emptyEmail[Configurations.language])
      return false;
    }
    if (regemail.test(classStateData.email.trim()) !== true) {
      MessageFunctions.showError(MessageTexts.validEmail[Configurations.language])
      return false
    }
    if (classStateData.country_code.length <= 0 || classStateData.country_code.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyCountrycode[Configurations.language])
      return false;
    }
    if (classStateData.mobile.length <= 0 || classStateData.mobile.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptymobileNumber[Configurations.language])
      return false;
    }
    if (classStateData.country_short_code == 'UAE') {
      if (realDigits[0] == 0 || realDigits[0] == 1 || realDigits[0] == 2 || realDigits[0] == 3 || realDigits[0] == 4 || realDigits[0] == 5 || realDigits[0] == 6 || realDigits[0] == 8 || realDigits[0] == 9) {
        MessageFunctions.showError(MessageTexts.validIDnumberUAE[Configurations.language])
        return false
      }
    } else {
      if (realDigits[0] == 0 || realDigits[0] == 3 || realDigits[0] == 4 || realDigits[0] == 5 || realDigits[0] == 6 || realDigits[0] == 7 || realDigits[0] == 8 || realDigits[0] == 9) {
        MessageFunctions.showError(MessageTexts.validIDnumber[Configurations.language])
        return false
      }
    }
    if (UserTypes[classStateData.selectuserType].value != "lab") {
      if (classStateData.dob_date.length <= 0 || classStateData.dob_date.trim().length <= 0) {
        MessageFunctions.showError("Please choose your date of birth")
        return false;
      }
      if (classStateData.gender.length <= 0 || classStateData.gender.trim().length <= 0) {
        MessageFunctions.showError("Please choose your gender")
        return false;
      }
    }
    if (classStateData.password.length <= 0) {
      MessageFunctions.showError(MessageTexts.validataionnewpass[Configurations.language])
      return false;
    }
    if (classStateData.password.length <= 7) {
      MessageFunctions.showError(MessageTexts.emptyPasswordValid[Configurations.language])
      return false;
    }
    if (classStateData.confirm.length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyconfirmPassword[Configurations.language])
      return false;
    }
    if (classStateData.confirm.length <= 7) {
      MessageFunctions.showError(MessageTexts.emptyPasswordValid[Configurations.language])
      return false;
    }
    if (classStateData.confirm != classStateData.password) {
      MessageFunctions.showError(MessageTexts.Password_notmatch[Configurations.language])
      return false;
    }
    if (UserTypes[classStateData.selectuserType].value != "lab") {
      if ((classStateData.id_number.length < 10 || classStateData.id_number.trim().length < 10)) {
        MessageFunctions.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }

      if ((classStateData.id_number.length > 15 || classStateData.id_number.trim().length > 15)) {
        MessageFunctions.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }
    } else {
      if (classStateData.hosp_moh_lic_no.length <= 0 || classStateData.hosp_moh_lic_no.trim().length <= 0) {
        MessageFunctions.showError("Please enter health registration ID")
        return false;
      }
      if ((classStateData.hosp_moh_lic_no.length < 10 || classStateData.hosp_moh_lic_no.trim().length < 10)) {
        MessageFunctions.showError("Please enter health registration ID between 10 to 15 characters or digits")
        return false;
      }

      if ((classStateData.hosp_moh_lic_no.length > 15 || classStateData.hosp_moh_lic_no.trim().length > 15)) {
        MessageFunctions.showError("Please enter health registration ID between 10 to 15 characters or digits")
        return false;
      }
    }
    if (classStateData.id_image.path == '') {
      MessageFunctions.showError("Please upload ID image")
      return false;
    }
    if (UserTypes[classStateData.selectuserType].value != "lab") {
      if (classStateData.selectuserType == 0 || classStateData.selectuserType == 3 || classStateData.selectuserType == 4) {
        if (classStateData.speciality.length <= 0 || classStateData.speciality.trim().length <= 0) {
          MessageFunctions.showError("Please select speciality")
          return false;
        }
      }


      if (classStateData.qualification.length <= 0 || classStateData.qualification.trim().length <= 0) {
        MessageFunctions.showError("Please enter your qualification")
        return false;
      }
    } else {
      if (classStateData.hosp_reg_no.length <= 0 || classStateData.hosp_reg_no.trim().length <= 0) {
        MessageFunctions.showError("Please enter company registration certificate number")
        return false;
      }
      if ((classStateData.hosp_reg_no.length < 8 || classStateData.hosp_reg_no.trim().length < 8)) {
        MessageFunctions.showError("Please enter minimum 8 or 11 digits company registration certificate number")
        return false;
      }

      if (classStateData.hosp_reg_no.length > 11 || classStateData.hosp_reg_no.trim().length > 11) {
        MessageFunctions.showError("Please enter minimum 8 or 11 digits company registration certificate number")
        return false;
      }
    }
    if (classStateData.certificate.path == '') {
      MessageFunctions.showError("Please upload cerificate image")
      return false;
    }
    if (UserTypes[classStateData.selectuserType].value != "lab") {
      if (classStateData.experience.length <= 0 || classStateData.experience.trim().length <= 0) {
        MessageFunctions.showError("Please enter your years of experience")
        return false;
      }

      if (classStateData.selectuserType == 0 || classStateData.selectuserType == 3 || classStateData.selectuserType == 4) {
        if ((classStateData.scfhs_number.length < 8 || classStateData.scfhs_number.trim().length < 8)) {
          MessageFunctions.showError("Please enter minimum 8 or 11 digits Health License ID")
          return false;
        }

        if (classStateData.scfhs_number.length > 11 || classStateData.scfhs_number.trim().length > 11) {
          MessageFunctions.showError("Please enter minimum 8 or 11 digits Health License ID")
          return false;
        }
        if (classStateData.scfhs_image.path == '') {
          MessageFunctions.showError("Please upload Health License File")
          return false;
        }
      }
    }

    return true
  }

  const onSignup = async () => {
    Keyboard.dismiss()
    const isValid = checkIsValid()

    if (isValid) {

      setState({
        isLoadingInButton: true
      })

      const localFCM = await FBPushNotifications.getFcmToken()

      let url = Configurations.baseURL + "api-service-provider-registration";
      console.log("url", url)
      var phone_number_send = classStateData.country_code + classStateData.mobile
      var data = new FormData();

      data.append('service_type', UserTypes[classStateData.selectuserType].value)
      data.append('name', classStateData.name)
      data.append('email', classStateData.email.trim())
      data.append('mobile_number', phone_number_send)
      data.append('work_area', classStateData.country_name)
      data.append('dob', classStateData.dob_date)
      data.append('gender', classStateData.gender)
      data.append('password', classStateData.password)
      data.append('confirm_password', classStateData.confirm)
      data.append('device_type', Configurations.device_type)
      data.append('device_lang', 'ENG')
      data.append('fcm_token', localFCM)

      data.append('id_number', classStateData.id_number)
      data.append('speciality', classStateData.speciality)
      data.append('qualification', classStateData.qualification)
      data.append('experience', classStateData.experience)
      data.append('scfhs_number', classStateData.scfhs_number)
      data.append('hosp_moh_lic_no', classStateData.hosp_moh_lic_no)
      data.append('hosp_reg_no', classStateData.hosp_reg_no)

      if (classStateData.id_image.path != '') {

        data.append('id_image', {
          uri: classStateData.id_image.path,
          type: classStateData.id_image.mime, //'image/jpg',
          name: (Platform.OS == 'ios') ? classStateData.id_image.filename : 'image',
        })
      }
      if (classStateData.certificate.path != '') {

        data.append('certificate', {
          uri: classStateData.certificate.path,
          type: classStateData.certificate.mime, //'image/jpg',
          name: (Platform.OS == 'ios') ? classStateData.certificate.filename : 'image',
        })
      }
      if (classStateData.selectuserType == 0 || classStateData.selectuserType == 3 || classStateData.selectuserType == 4) {
        if (classStateData.scfhs_image.path != '') {

          data.append('scfhs_image', {
            uri: classStateData.scfhs_image.path,
            type: classStateData.scfhs_image.mime, //'image/jpg',
            name: (Platform.OS == 'ios') ? classStateData.scfhs_image.filename : 'image',
          })
        }
      }
      else {
        data.append('scfhs_image', "")
      }

      API.post(url, data, 1).then((obj) => {

        console.log('obj mess', obj.message)
        if (obj.status == true) {

          setTimeout(() => {
            navigation.goBack()
            MessageFunctions.showSuccess(obj.message)
          }, 500);

        } else {
          setTimeout(() => {
            MessageFunctions.showError(obj.message)
          }, 200)
          // }
          return false;
        }
      }).catch((error) => {
        console.log("-------- error ------- ", error)
      }).finally(() => {
        setState({
          isLoadingInButton: false
        })
      })

    } else return isValid
  }

  const Galleryopen = () => {

    dispatch(setAppState('active'))
    Media.launchGellery(true).then((obj) => {
      const pths = obj.path.split('/')
      const source = {
        filename: pths[pths.length - 1],
        mime: obj.mime,
        path: obj.path,
      };

      console.log({ source });

      if (classStateData.imageType === 'id_image') {
        setState({
          id_image: source
        });
      } else if (classStateData.imageType === 'certificate') {
        setState({
          certificate: source
        });
      } else if (classStateData.imageType === 'scfhs_image') {
        setState({
          scfhs_image: source
        });
      }
    }).finally(() => {
      attachmentOptionSheetRef.current.close()
    })
  }

  const DocumentGalleryopen = async () => {

    dispatch(setAppState('active'))

    Media.launchDocumentGellery(true).then((res) => {

      const source = {
        filename: res.name,
        mime: res.type,
        path: res.uri,
      };

      console.log({ source });

      if (classStateData.imageType === 'id_image') {
        setState({
          id_image: source
        });
      } else if (classStateData.imageType === 'certificate') {
        setState({
          certificate: source
        });
      } else if (classStateData.imageType === 'scfhs_image') {
        setState({
          scfhs_image: source
        });
      }


    }).finally(() => {
      attachmentOptionSheetRef.current.close()
    })
  }

  const getSpecialities = async (i) => {

    let url = Configurations.baseURL + "api-provider-get-speciality";
    var data = new FormData();
    data.append('service_type', UserTypes[i].value)


    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {
        setState({
          specialityArr: obj.result,
        })
      } else {
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);
    })

  }

  const getServiceCountries = async () => {
    let url = Configurations.baseURL + "api-medical-service-area";

    API.get(url, 1).then((obj) => {

      if (obj.status == true) {
        setState({ Countryarr: obj.result, country_name: obj.result[0].name, country_code: obj.result[0].country_code, country_short_code: obj.result[0].country_short_code })
      } else {
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);
    })
  }

  const setDate = (res) => {
    let check_month
    let check_date
    let date = res.getDate()
    let month = res.getMonth() + 1
    let year = res.getFullYear()
    console.log('month:: ', month);
    if (parseInt(month) < 10) {
      check_month = '0' + month
    }
    else {
      check_month = month
    }
    if (parseInt(date) < 10) {
      check_date = '0' + date
    }
    else {
      check_date = date
    }
    let date1 = year + '-' + check_month + '-' + check_date
    setState({ date_new: new Date(date1), dob_date: date1, isDatePickerVisibletwo: false, })
  }

  const renderIDNumber = () => {
    return (
      <>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 8) / 100,
          }}>
          <Text
            style={{
              textAlign: Configurations.textRotate,
              fontSize: Font.buttontextsize,
              fontFamily: Font.Bold,
              color: Colors.textblack,
            }}>
            Identity Number
          </Text>
        </View>
        <View
          style={{
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
            lableText={'Provide ID Number'}
            inputRef={(ref) => {
              id_numberInput = ref;
            }}
            maxLength={15}
            onChangeText={(text) =>
              setState({ id_number: text })
            }
            value={classStateData.id_number}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            onSubmitEditing={() => {
              qualificationInput.focus()
            }}
          />

        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
          }}>
          <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              setState({
                imageType: 'id_image'
              });

              attachmentOptionSheetRef.current.open()
            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  fontSize: Font.Remember,
                }}>
                Upload Photocopy of ID
              </Text>
            </View>
          </TouchableOpacity>




          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
              }}>
              {(classStateData.id_image != undefined) ? classStateData.id_image.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  const renderSpeExpCer = () => {
    return (
      <>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 8) / 100,
          }}>
          <Text
            style={{
              textAlign: Configurations.textRotate,
              fontSize: Font.buttontextsize,
              fontFamily: Font.Bold,
              color: Colors.textblack,
            }}>
            Speciality, Experience & Certificates
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
          }}>
          <DropDownboxSec
            lableText={(classStateData.speciality == '') ? 'Speciality' : classStateData.speciality}
            boxPressAction={() => {
              specialitySheetRef.current.open()
            }}
          />

          <RBSheet
            ref={specialitySheetRef}
            {...BottomSheetProps}
            customStyles={BottomSheetStyles} >
            <View style={BottomSheetViewStyles.MainView}>
              <View style={BottomSheetViewStyles.ButtonContainer}>
                <TouchableOpacity style={BottomSheetViewStyles.Button} onPress={() => {
                  specialitySheetRef.current.close()
                }}>
                  <SvgXml xml={_Cross}
                    width={windowHeight / 26}
                    height={windowHeight / 26}
                  />
                </TouchableOpacity>
              </View>

              <View style={BottomSheetViewStyles.Body}>

                <View style={BottomSheetViewStyles.TitleBar}>
                  <Text style={BottomSheetViewStyles.Title}>Speciality</Text>
                </View>

                <KeyboardAwareScrollView contentContainerStyle={BottomSheetViewStyles.ScrollContainer}>
                  {
                    classStateData.specialityArr.map((data, index) => {
                      return (
                        <TouchableOpacity style={{
                          width: '100%',
                        }} onPress={() => {
                          setState({
                            speciality: data.name
                          })
                          specialitySheetRef.current.close()
                        }}>
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
                              // marginLeft: 15,
                              paddingTop: 15,
                              paddingBottom: 15,
                              width: '94.5%',

                              // backgroundColor: 'red'
                            }}>{data.name}</Text>
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
            flexDirection: 'row',
          }}>
          <AuthInputBoxSec
            mainContainer={{
              width: '100%',
            }}
            // icon={layer9_icon}
            lableText={'Highest Qualification'}
            inputRef={(ref) => {
              qualificationInput = ref;
            }}
            onChangeText={(text) =>
              setState({ qualification: text })
            }
            value={classStateData.qualification}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            onSubmitEditing={() => {
              experienceInput.focus()
            }}
          />

        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
          }}>
          <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              setState({
                imageType: 'certificate'
              });

              attachmentOptionSheetRef.current.open()
            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  fontSize: Font.Remember,
                }}>
                Upload Certificate
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
              }} numberOfLines={1}>
              {(classStateData.certificate != undefined) ? classStateData.certificate.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  const renderExpRegid = () => {
    return (
      <>
        <View
          style={{
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
            lableText={'Years of Experience'}
            inputRef={(ref) => {
              experienceInput = ref;
            }}
            onChangeText={(text) =>
              setState({ experience: text })
            }
            value={classStateData.experience}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            onSubmitEditing={() => {
              scfhs_numberInput.focus()
            }}
          />

        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
          }}>
          <AuthInputBoxSec
            mainContainer={{
              width: '100%',
            }}
            lableText={'Health License ID'}
            inputRef={(ref) => {
              scfhs_numberInput = ref;
            }}
            onChangeText={(text) =>
              setState({ scfhs_number: text })
            }
            maxLength={11}
            value={classStateData.scfhs_number}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            onSubmitEditing={() => {
            }}
          />

        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
          }}>
          <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '55%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              setState({
                imageType: 'scfhs_image'
              });

              attachmentOptionSheetRef.current.open()
            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  fontSize: Font.Remember,
                }}>
                Upload Photocopy of Health License
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{ width: '45%', alignSelf: 'center', }}>
            <Text
              onPress={() => {

              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
              }} numberOfLines={1}>
              {(classStateData.scfhs_image != undefined) ? classStateData.scfhs_image.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  const renderExpCer = () => {
    return (
      <>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 8) / 100,
          }}>
          <Text
            style={{
              textAlign: Configurations.textRotate,
              fontSize: Font.buttontextsize,
              fontFamily: Font.Bold,
              color: Colors.textblack,
            }}>
            Experience & Certificates
          </Text>
        </View>

        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
          }}>
          <AuthInputBoxSec
            mainContainer={{
              width: '100%',
            }}
            lableText={'Highest Qualification'}
            inputRef={(ref) => {
              qualificationInput = ref;
            }}
            onChangeText={(text) =>
              setState({ qualification: text })
            }
            value={classStateData.qualification}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            onSubmitEditing={() => {
              experienceInput.focus()
            }}
          />

        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
          }}>
          <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              setState({
                imageType: 'certificate',
              });

              attachmentOptionSheetRef.current.open()
            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  fontSize: Font.Remember,
                }}>
                Upload Certificate
              </Text>
            </View>
          </TouchableOpacity>




          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              onPress={() => {

              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
              }} numberOfLines={1}>
              {(classStateData.certificate != undefined) ? classStateData.certificate.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  const renderExp = () => {
    return (
      <>
        <View
          style={{
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
            lableText={'Years of Experience'}
            inputRef={(ref) => {
              experienceInput = ref;
            }}
            onChangeText={(text) =>
              setState({ experience: text })
            }
            value={classStateData.experience}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            onSubmitEditing={() => {
              scfhs_numberInput.focus()
            }}
          />

        </View>

      </>
    )
  }

  const renderHealthIDNumber = () => {
    return (
      <>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 8) / 100,
          }}>
          <Text
            style={{
              textAlign: Configurations.textRotate,
              fontSize: Font.buttontextsize,
              fontFamily: Font.Bold,
              color: Colors.textblack,
            }}>
            Health Registration ID
          </Text>
        </View>
        <View
          style={{
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
            lableText={'Health Registration ID'}
            inputRef={(ref) => {
              hosp_moh_lic_noInput = ref;
            }}
            maxLength={15}
            onChangeText={(text) =>
              setState({ hosp_moh_lic_no: text })
            }
            value={classStateData.hosp_moh_lic_no}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            onSubmitEditing={() => {
            }}
          />

        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
          }}>
          <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              setState({
                imageType: 'id_image',
              });

              attachmentOptionSheetRef.current.open()
            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  // paddingLeft:mobileW*2/100,
                  // textAlign: Configurations.textalign,
                  fontSize: Font.Remember,
                }}>
                Upload Photocopy of ID
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              onPress={() => {

              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
              }}>
              {(classStateData.id_image != undefined) ? classStateData.id_image.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  const renderCRC = () => {
    return (
      <>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 8) / 100,
          }}>
          <Text
            style={{
              textAlign: Configurations.textRotate,
              fontSize: Font.buttontextsize,
              fontFamily: Font.Bold,
              color: Colors.textblack,
            }}>
            Company Registration Certificate
          </Text>
        </View>
        <View
          style={{
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
            lableText={'Registration Number'}
            inputRef={(ref) => {
              hosp_reg_noInput = ref;
            }}
            maxLength={15}
            onChangeText={(text) =>
              setState({ hosp_reg_no: text })
            }
            value={classStateData.hosp_reg_no}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            onSubmitEditing={() => {
              // qualificationInput.focus()
            }}
          />

        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
          }}>
          <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              setState({
                imageType: 'certificate'
              });
              attachmentOptionSheetRef.current.open()
            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  // paddingLeft:mobileW*2/100,
                  // textAlign: Configurations.textalign,
                  fontSize: Font.Remember,
                }}>
                Upload Certificate
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              onPress={() => {

              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
              }}>
              {(classStateData.certificate != undefined) ? classStateData.certificate.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  return (
    <View
      pointerEvents={classStateData.isLoadingInButton ? 'none' : 'auto'}
      style={{ flex: 1, backgroundColor: Colors.white_color, paddingTop: insets.top, paddingBottom: (insets.bottom) }}>

      <SignupForm
        navigation={navigation}
      />

    </View>
  );
}

