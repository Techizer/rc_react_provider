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
import RegistrationSteps from '../Components/RegistrationSteps';

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

  

  return (
    

      <SignupForm
        navigation={navigation}
      />


  );
}

