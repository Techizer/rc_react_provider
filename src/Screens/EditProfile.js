import { Text, View, StatusBar, SafeAreaView, TouchableOpacity, Image, Modal, Keyboard, Platform, Dimensions, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors, Font, Configurations, mobileW, LanguageConfiguration, API, MessageFunctions, MessageTexts, MessageHeadings, Media, windowWidth, windowHeight } from '../Helpers/Utils';
import DateTimePicker from "react-native-modal-datetime-picker";
import MonthPicker from 'react-native-month-year-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { setAppState, setProfileData, setUserLoginData } from '../Redux/Actions/UserActions';
import { vs } from 'react-native-size-matters';
import RBSheet from 'react-native-raw-bottom-sheet';
import { BottomSheetProps, BottomSheetStylesForSmall, BottomSheetViewStyles } from '../Styles/Sheet';
import { SvgXml } from 'react-native-svg';
import { dummyUser, _Cross } from '../Icons/SvgIcons/Index';
import StickyButton from '../Components/StickyButton';

export default EditProfile = ({ navigation, route }) => {

  const {
    loginUserData,
    profileData
  } = useSelector(state => state.StorageReducer)

  const [classStateData, setClassStateData] = useState({

    name: profileData['first_name'],
    email: profileData['email'],
    display_user_type: profileData['display_user_type'],
    user_type: profileData['user_type'],
    user_id: profileData['user_id'],
    country_code: profileData['country_code'],
    work_area: profileData['work_area'],
    address: profileData['address'],
    description: profileData['description'],
    id_number: profileData['id_number'],
    speciality: profileData['speciality'],
    qualification: profileData['qualification'],
    experience: profileData['experience'],
    dob_date: (profileData['user_type'] == "lab") ? profileData['experience'] : "",
    scfhs_number: profileData['scfhs_number'],
    hosp_moh_lic_no: profileData['hosp_moh_lic_no'],
    hosp_reg_no: profileData['hosp_reg_no'],
    id_image: { filename: profileData['id_image'] },
    certificate: { filename: profileData['qualification_certificate'] },
    scfhs_image: { filename: profileData['scfhs_image'] },
    hosp_reg_image: { filename: profileData['hosp_reg_image'] },
    moh_lic_image: { filename: profileData['moh_lic_image'] },
    mobile: profileData['phone_number'],
    dob_date: (profileData['dob']) ? profileData['dob'] : '',
    dobfocus: true,
    gender: profileData['gender'],
    febtn: (profileData['gender'] == 'Female') ? true : false,
    mabtn: (profileData['gender'] == 'Male') ? true : false,
    profile_img: Configurations.img_url3 + profileData['image'],
    isDatePickerVisibletwo: false,
    profile_image: '',
    notification_count: '',
    date_new: new Date()

  })

  const [isOnLoadingButton, setIsOnLoadingButton] = useState(false)

  const dispatch = useDispatch()

  const attachmentOptionSheetRef = useRef()
  const nameRef = useRef()
  const numberRef = useRef()
  const qualRef = useRef()
  const expRef = useRef()
  const aboutRef = useRef()


  const user_type = loginUserData?.user_type || ''

  useEffect(() => {
    navigation.addListener('focus', () => {
      getNotificationsCount()
    });
  }, [])

  const setState = (payload, resolver = () => { }) => {
    setClassStateData(prev => ({ ...prev, ...payload }))
    if (resolver) {
      resolver()
    }
  }

  const getNotificationsCount = async () => {
    let user_id = loginUserData['user_id']

    let url = Configurations.baseURL + "api-notification-count";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)


    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        setState({ notification_count: obj.result })
      } else {
        return false;
      }
    }).catch((error) => {

      console.log("-------- error ------- " + error);
    })

  }

  const setdatetwo = (res) => {
    let check_month
    let check_date
    let date = res.getDate()
    let month = res.getMonth() + 1
    let year = res.getFullYear()
    if (parseInt(month) < 10) {
      check_month = '0' + month
    }
    else {
      check_month = month
    }
    if (date < 10) {
      check_date = '0' + date
    }
    else {
      check_date = date
    }
    let date1 = year + '-' + check_month + '-' + check_date
    setState({ date_new: new Date(date1) })
    setState({ dob_date: date1, isDatePickerVisibletwo: false, })
  }

  const Camerapopen = async () => {
    Media.launchCamera(true).then((obj) => {
      // console.log(obj);
      if (classStateData.img_type == 0) {
        setState({ cover_img: obj.path })
      }
      else {
        setState({ profile_img: obj.path, profile_image: obj.path })
      }
    }).finally(() => {
      attachmentOptionSheetRef.current.close()
    })
  }

  const Galleryopen = () => {
    Media.launchGellery(true).then((obj) => {
      if (classStateData.img_type == 0) {
        setState({ cover_img: obj.path })
      }
      else {
        setState({ profile_img: obj.path, profile_image: obj.path })
      }
    }).finally(() => {
      attachmentOptionSheetRef.current.close()
    })
  }

  const onEditProfileClick = async () => {
    let user_id = loginUserData['user_id']

    if (classStateData.name.length <= 0 || classStateData.name.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyName[Configurations.language])
      return false;
    }

    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (classStateData.email.length <= 0 || classStateData.email.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyEmail[Configurations.language])
      return false;
    }

    if (regemail.test(classStateData.email) !== true) {
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

    if (user_type == "lab") {
      if (classStateData?.dob_date?.length <= 0 && classStateData?.experience?.length <= 0) {
        MessageFunctions.showError("Please choose year of establishment")
        return false;
      }
      if (classStateData.address.length <= 0 || classStateData.address.trim().length <= 0) {
        MessageFunctions.showError("Please enter your address")
        return false;
      }
    } else {
      if (classStateData?.dob_date?.length <= 0 || classStateData?.dob_date?.trim().length <= 0) {
        MessageFunctions.showError("Please choose your date of birth")
        return false;
      }
    }
    if (user_type != "lab") {
      if (classStateData.gender.length <= 0 || classStateData.gender.trim().length <= 0) {
        MessageFunctions.showError("Please choose your gender")
        return false;
      }
    }


    if (user_type != "lab") {
      if ((classStateData.id_number.length < 10 || classStateData.id_number.trim().length < 10)) {
        MessageFunctions.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }

      if ((classStateData.id_number.length > 15 || classStateData.id_number.trim().length > 15)) {
        MessageFunctions.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }
    }
    if (user_type == "nurse" || user_type == "physiotherapy"
      || user_type == "doctor") {
      if (classStateData.speciality.length <= 0 || classStateData.speciality.trim().length <= 0) {
        MessageFunctions.showError("Please select speciality")
        return false;
      }
    }

    if (user_type != "lab") {
      if (classStateData.qualification.length <= 0 || classStateData.qualification.trim().length <= 0) {
        MessageFunctions.showError("Please enter your qualification")
        return false;
      }

      if (classStateData.experience.length <= 0 || classStateData.experience.trim().length <= 0) {
        MessageFunctions.showError("Please enter your years of experience")
        return false;
      }
    }

    if (user_type == "nurse" || user_type == "physiotherapy"
      || user_type == "doctor") {
      if ((classStateData.scfhs_number.length < 8 || classStateData.scfhs_number.trim().length < 8)) {
        MessageFunctions.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
        return false;
      }

      if (classStateData.scfhs_number.length > 11 || classStateData.scfhs_number.trim().length > 11) {
        MessageFunctions.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
        return false;
      }
    }

    if (user_type == "lab") {
      if (classStateData.hosp_moh_lic_no == null || classStateData.hosp_moh_lic_no.length <= 0 || classStateData.hosp_moh_lic_no.trim().length <= 0) {
        MessageFunctions.showError("Please enter health registration ID")
        return false;
      }

      if (classStateData.hosp_reg_no == null || classStateData.hosp_reg_no.length <= 0 || classStateData.hosp_reg_no.trim().length <= 0) {
        MessageFunctions.showError("Please enter company registration certificate number")
        return false;
      }
    }

    let url = Configurations.baseURL + "api-sp-edit-profile";
    console.log("url", url)
    var phone_number_send = classStateData.country_code + classStateData.mobile
    var data = new FormData();

    setIsOnLoadingButton(true)

    data.append('user_id', user_id)
    data.append("service_type", user_type)
    data.append('first_name', classStateData.name)
    data.append('email', classStateData.email)
    data.append('phone_number', phone_number_send)
    data.append('work_area', classStateData.work_area)
    if (user_type != "lab") {

      data.append('gender', classStateData.gender)
      data.append('id_number', classStateData.id_number)
      data.append('scfhs_number', classStateData.scfhs_number)
      data.append('dob', (classStateData?.dob_date?.length <= 0) ? classStateData.experience : classStateData.dob_date)
    }
    if (user_type == "lab") {
      data.append('address', classStateData.address)
      data.append('hosp_moh_lic_no', classStateData.hosp_moh_lic_no)
      data.append('hosp_reg_no', classStateData.hosp_reg_no)
    }
    if (user_type != "lab") {
      data.append('speciality', classStateData.speciality)

    }
    data.append('description', classStateData.description)
    data.append('experience', (user_type == "lab") ? classStateData?.experience : classStateData.experience)
    if (user_type != "lab") {
      data.append('qualification', classStateData.qualification)
    }
    data.append('id_image', (user_type == "lab") ? classStateData.moh_lic_image.filename : classStateData.id_image.filename)
    data.append('certificate', (user_type == "lab") ? classStateData.hosp_reg_image.filename : classStateData.certificate.filename)
    if (user_type != "lab") {
      data.append('scfhs_image', classStateData.scfhs_image.filename)
    }
    if (classStateData.profile_image != '') {
      data.append('image', {
        uri: classStateData.profile_img,
        type: 'image/jpg',
        name: classStateData.profile_img
      })
    }

    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {
        console.log({ editresult: obj?.result });
        dispatch(setProfileData(obj.result))
        dispatch(setUserLoginData({
          ...loginUserData,
          ...obj.result
        }))
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        // MessageFunctions.alert(obj.message, false);
      }
      return false;

    }).catch((error) => {
      console.log("-------- error ------- ", error)
    }).finally(() => {
      setIsOnLoadingButton(false)
    })

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
              fontSize: Font.large,
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
            flexDirection: 'row'
          }}>
          <AuthInputBoxSec
            mainContainer={{
              width: '100%',
            }}
            lableText={'Provide ID Number'}
            maxLength={15}
            onChangeText={(text) =>
              setState({ id_number: text })
            }
            editable={false}
            value={classStateData.id_number}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss()
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

          <View style={{ width: '45%', alignSelf: 'center', }}>
          </View>

          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.medium,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
              }}>
              {(classStateData.id_image != undefined) ? classStateData?.id_image?.filename?.trim() : 'No Attachment'}
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
              fontSize: Font.large,
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

          <AuthInputBoxSec
            mainContainer={{
              width: '90%',
              alignSelf: 'center'
            }}
            lableText={'Speciality'}
            onChangeText={(text) =>
              setState({ speciality: text })
            }
            value={classStateData.speciality}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            editable={false}
            onSubmitEditing={() => {
              Keyboard.dismiss()
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
            lableText={'Highest Qualification'}
            onChangeText={(text) =>
              setState({ qualification: text })
            }
            value={classStateData.qualification}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss()
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

          <View style={{ width: '45%', alignSelf: 'center', }}>

          </View>

          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.medium,
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
            lableText={'Years of Experience'}
            onChangeText={(text) =>
              setState({ experience: text })
            }
            value={classStateData.experience}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss()
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
            lableText={'SCFHS Registration ID'}
            onChangeText={(text) =>
              setState({ scfhs_number: text })
            }
            editable={false}
            maxLength={11}
            value={classStateData.scfhs_number}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss()
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

          <View style={{ width: '45%', alignSelf: 'center', }}>

          </View>

          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              onPress={() => {

              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.medium,
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
              fontSize: Font.large,
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
            flexDirection: 'row'
          }}>
          <AuthInputBoxSec
            mainContainer={{
              width: '100%',
            }}
            lableText={'Highest Qualification'}
            onChangeText={(text) =>
              setState({ qualification: text })
            }
            value={classStateData.qualification}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss()
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

          <View style={{ width: '45%', alignSelf: 'center', }}>

          </View>

          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              onPress={() => {

              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.medium,
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
            lableText={'Years of Experience'}
            onChangeText={(text) =>
              setState({ experience: text })
            }
            value={classStateData.experience}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss()
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
              fontSize: Font.large,
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
            lableText={'Health Registration ID'}
            maxLength={15}
            onChangeText={(text) =>
              setState({ hosp_moh_lic_no: text })
            }
            value={classStateData.hosp_moh_lic_no}
            editable={(classStateData.hosp_moh_lic_no != null) ? false : true}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss()
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

          <View style={{ width: '45%', alignSelf: 'center', }}>

          </View>

          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              onPress={() => {

              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.medium,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
              }}>
              {(classStateData.moh_lic_image != undefined) ? classStateData.moh_lic_image.filename.trim() : 'No Attachment'}
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
              fontSize: Font.large,
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
            lableText={'Registration Number'}
            maxLength={15}
            onChangeText={(text) =>
              setState({ hosp_reg_no: text })
            }
            value={classStateData.hosp_reg_no}
            editable={(classStateData.hosp_reg_no != null) ? false : true}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss()
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

          <View style={{ width: '45%', alignSelf: 'center', }}>

          </View>

          <View style={{ width: '55%', alignSelf: 'center', }}>
            <Text
              onPress={() => {

              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.medium,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
              }}>
              {(classStateData.hosp_reg_image != undefined) ? classStateData.hosp_reg_image.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  return (
    //
    <View style={{ flex: 1 }}>



      {
        (classStateData.isDatePickerVisibletwo && user_type == "lab") ?
          <MonthPicker
            onChange={(event, date) => {
              if (date && event != 'dismissedAction') {
                setState({
                  dob_date: new Date(date).getFullYear(),
                  experience: new Date(date).getFullYear(),
                })
              }
              setState({ isDatePickerVisibletwo: false })
            }}
            value={classStateData.date_new}
            maximumDate={new Date()}
          /> :
          <DateTimePicker
            isVisible={classStateData.isDatePickerVisibletwo}
            mode="date"
            value={classStateData.date_new}
            maximumDate={new Date()}
            onConfirm={(date) => { setdatetwo(date), setState({ isDatePickerVisibletwo: false }) }}
            onCancel={() => { setState({ isDatePickerVisibletwo: false }) }}
          />
      }


      <View style={{ flex: 1, }}>
        <ScreenHeader
          onBackPress={() => {
            navigation.goBack();
          }}
          leftIcon
          rightIcon={true}
          navigation={navigation}
          notiCount={classStateData.notification_count > 0 ? classStateData.notification_count : false}
          title={LanguageConfiguration.EditProfile[Configurations.language]}
        />
        <RBSheet
          ref={attachmentOptionSheetRef}
          {...BottomSheetProps}
          customStyles={BottomSheetStylesForSmall} >
          <View style={BottomSheetViewStyles.MainView}>
            <View style={BottomSheetViewStyles.ButtonContainerSmall}>
              <TouchableOpacity style={BottomSheetViewStyles.Button} onPress={() => {
                attachmentOptionSheetRef.current.close()
              }}>
                <SvgXml xml={_Cross}
                  width={windowHeight / 26}
                  height={windowHeight / 26}
                />
              </TouchableOpacity>
            </View>

            <View style={BottomSheetViewStyles.Body}>

              <View style={BottomSheetViewStyles.TitleBar}>
                <Text style={BottomSheetViewStyles.Title}>Choose your option!</Text>
              </View>

              <KeyboardAwareScrollView contentContainerStyle={BottomSheetViewStyles.ScrollContainer}>
                <View style={{
                  paddingVertical: vs(16),
                  width: '100%',
                  flexDirection: 'row'
                }}>
                  <TouchableOpacity onPress={() => {
                    Camerapopen()
                  }} style={styles.roundButtonAttachmentContainer}>
                    <Image source={Icons.Camera} style={{
                      marginVertical: vs(4),
                      width: vs(16),
                      height: vs(16),
                      tintColor: Colors.textblue
                    }} resizeMode='contain' resizeMethod='scale' />
                    <Text style={{
                    }}>Camera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    Galleryopen()
                  }} style={styles.roundButtonAttachmentContainer}>
                    <Image source={Icons.Gallery} style={{
                      marginVertical: vs(4),
                      width: vs(16),
                      height: vs(16),
                      tintColor: Colors.textblue
                    }} resizeMode='contain' resizeMethod='scale' />
                    <Text>Gallery</Text>
                  </TouchableOpacity>


                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>

        </RBSheet>

        <KeyboardAwareScrollView contentContainerStyle={{
          backgroundColor: Colors.White,
          paddingBottom: windowWidth / 5,
          // height: windowHeight
        }}>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 7) / 100,
              flexDirection: 'row',


            }}>

            <View style={{ width: '28%', alignSelf: 'center' }}>
              <View
                style={{
                  width: (mobileW * 21) / 100,
                  height: (mobileW * 21) / 100,
                  borderRadius: (mobileW * 10.5) / 100,
                  borderWidth: 2.5,
                  borderColor: Colors.bordercolor_light_blue,

                  alignItems: 'center'
                }}>
                {
                  (classStateData.profile_img == 'NA' || classStateData.profile_img == null || classStateData.profile_img == '') ?
                    <SvgXml xml={dummyUser} style={{
                      alignSelf: "center",
                    }}
                      width={(mobileW * 20) / 100}
                      height={(mobileW * 20) / 100}
                    />
                    :
                    <Image
                      style={{
                        width: (mobileW * 20) / 100,
                        height: (mobileW * 20) / 100,
                        borderRadius: mobileW * 10 / 100,

                        alignSelf: 'center',

                      }}
                      source={{ uri: classStateData.profile_img }}
                    />

                }


              </View>
            </View>

            <View style={{ width: '70%', alignSelf: 'center', }}>
              <View style={{ width: '100%', alignSelf: 'center' }}>
                <Text style={{
                  color: Colors.placeholder_text_color,
                  // fontFamily: Font.Regular, 
                  // fontSize: Font.large, 
                  fontFamily: Font.Regular, fontSize: 18,
                  textAlign: Configurations.textRotate,
                }}>{classStateData.name}</Text>
              </View>

              <View style={{ width: '100%', alignSelf: 'center', marginTop: mobileW * 1 / 100 }}>
                <Text
                  style={{
                    color: Colors.placeholder_textcolorlight,
                    fontFamily: Font.Regular,
                    fontSize: 14, //(mobileW * 3) / 100,
                    textAlign: Configurations.textRotate,
                  }}>{classStateData.email}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              width: '60%',
              alignSelf: 'center',
              marginTop: (mobileW * -8) / 100,
              marginRight: mobileW * 4 / 100
            }}>
            <View
              style={{
                width: (mobileW * 8) / 100,
                height: (mobileW * 8) / 100,
                borderRadius: (mobileW * 4) / 100,
                borderWidth: 2,
                borderColor: Colors.bordercolor_light_blue,
                backgroundColor: 'white'
              }}>
              <TouchableOpacity onPress={() => { attachmentOptionSheetRef.current.open() }}>
                <Image
                  style={{
                    height: (mobileW * 3.5) / 100,
                    width: (mobileW * 3.5) / 100,
                    alignSelf: 'center',
                    marginTop: (mobileW * 1.8) / 100,

                  }}
                  source={Icons.Camera}></Image>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 10) / 100,
              borderColor: Colors.placeholder_border,
              borderWidth: 1,
              borderRadius: mobileW * 1 / 100,
            }}>
            <View style={{ width: '95%', alignSelf: 'center', }}>

              <View style={{
                width: '100%',
                height: 48,
                flexDirection: 'row',
                // alignSelf: 'center',
                // justifyContent: 'center',
                alignItems: 'center'
              }}>
                <View style={{
                  width: '20%',
                  // backgroundColor: 'red',
                  height: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRightWidth: 1,
                  borderRightColor: Colors.placeholder_border
                }}>
                  <Text style={{
                    fontFamily: Font.Regular,
                    fontSize: 12,
                    color: Colors.placeholder_textcolorlight,
                  }}>User Type</Text>
                </View>

                <View style={{
                  width: '60%',
                  // backgroundColor: 'yellow',
                  height: 48,
                  // alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 10
                }}>
                  <Text style={{
                    fontFamily: Font.Regular,
                    fontSize: 15,
                    color: '#041A27'
                  }}>{classStateData.display_user_type}</Text>
                </View>
                <View style={{
                  width: '20%',
                  // backgroundColor: 'blue',
                  height: 48,
                  alignItems: 'flex-end',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    fontFamily: Font.Regular,
                    fontSize: 10,
                    color: Colors.placeholder_textcolorlight
                  }}>Non Editable</Text>
                </View>
              </View>

            </View>
          </View>


          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 2) / 100
            }}>
            <AuthInputBoxSec
              mainContainer={{
                width: '100%',
              }}
              inputRef={nameRef}
              lableText={LanguageConfiguration.textinputname[Configurations.language]}
              onChangeText={(text) =>
                setState({ name: text })
              }
              value={classStateData.name}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyLabel='done'
              returnKeyType='done'
              onSubmitEditing={() => {
                Keyboard.dismiss()
              }}
            />

          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 4) / 100,
            }}>
            <Text
              style={{
                textAlign: Configurations.textRotate,
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.placeholder_text,
              }}>
              {LanguageConfiguration.CC_code[Configurations.language]}
            </Text>
          </View>

          <DropDownboxSec
            mainContainer={{ width: '90%' }}
            lableText={classStateData.work_area.length <= 0 ? LanguageConfiguration.select[Configurations.language] : classStateData.work_area}
            boxPressAction={() => {
            }}
            isDisabled={true}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', width: mobileW * 90 / 100, justifyContent: 'space-between', alignSelf: 'center', }}>
            <View
              style={{
                width: '20%',
                alignSelf: 'center',
                marginTop: (mobileW * 3) / 100
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                inputFieldStyle={{
                  textAlign: 'center',
                  marginBottom: (mobileW * 4) / 100,
                }}
                lableText={LanguageConfiguration.CC_code[Configurations.language]}
                onChangeText={(text) =>
                  setState({ country_code: text })
                }
                maxLength={3}
                editable={false}
                value={classStateData.country_code}
                keyboardType="number-pad"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                }}
              />

            </View>
            <View
              style={{
                width: '75%',
                alignSelf: 'center',
                marginTop: (mobileW * 3) / 100,
              }}>

              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                lableText={LanguageConfiguration.textinputnumber[Configurations.language]}
                maxLength={9}
                onChangeText={(text) =>
                  setState({ mobile: text })
                }
                inputRef={numberRef}
                value={classStateData.mobile}
                keyboardType="number-pad"
                autoCapitalize="none"
                returnKeyLabel='done'
                returnKeyType='done'
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                }}
                editable={false}
              />
              <View
                style={{
                  width: '89%',
                  marginTop: (mobileW * 0.5) / 100,
                }}>
                <Text
                  style={{
                    textAlign: Configurations.textRotate,
                    fontSize: Font.small,
                    fontFamily: Font.Regular,
                    color: Colors.textgray,
                  }}>
                  {LanguageConfiguration.mobletexttitle[Configurations.language]}
                </Text>
              </View>

            </View>
          </View>


          <View style={{
            width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100
          }}>
            <AuthInputBoxSec
              mainContainer={{
                width: '100%',
              }}
              lableText={LanguageConfiguration.Mobileno[Configurations.language]}
              onChangeText={(text) =>
                setState({ email: text })
              }
              value={classStateData.email}
              editable={false}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss()
              }}
            />

          </View>

          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: (mobileW * 4) / 100,
            }}>
            <Text
              style={{
                textAlign: Configurations.textRotate,
                fontSize: Font.medium,
                fontFamily: Font.Regular,
                color: Colors.placeholder_text,
              }}>
              {(user_type == "lab") ? "Year of Establishment" : LanguageConfiguration.dob[Configurations.language]}
            </Text>
          </View>

          <View style={{
            width: '90%', height: 48, alignSelf: 'center', marginTop: mobileW * 2 / 100, flexDirection: 'row',
            borderColor: Colors.field_border_color, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
          }}>
            <TouchableOpacity
              onPress={() => { setState({ isDatePickerVisibletwo: true }) }}
              style={{ width: '100%', flexDirection: 'row' }}>
              <View style={{ width: '1%' }}>
              </View>
              <View style={{
                width: '100%',
                height: Font.placeholder_height,
                marginLeft: mobileW * 2 / 100, alignItems: 'center', flexDirection: 'row'
              }}>
                <Text style={{
                  width: '78%', textAlign: Configurations.textRotate,
                  color: Colors.placeholder_text,
                  fontFamily: Font.Regular,
                  fontSize: Font.medium,
                }}>{classStateData?.dob_date?.length <= 0 ? (user_type == "lab") ? (classStateData?.experience != '') ? classStateData?.experience : "Year of Establishment" : LanguageConfiguration.dob[Configurations.language] : classStateData?.dob_date}</Text>
                <View style={{ width: '15%', alignSelf: 'center', alignItems: 'flex-end' }}>

                  <Image source={Icons.DatePicker}
                    style={{ height: 25, width: 25 }}>
                  </Image>
                </View>
              </View>


            </TouchableOpacity>

            {classStateData?.dobfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.1 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
              <Text style={{
                color: classStateData?.dob_date.length <= 0 ? '#0057A5' : Colors.gray4,
                fontSize: Font.small,
                fontFamily: Font.Regular,
                textAlign: Configurations.textalign
              }}>{(user_type == "lab") ? "Year of Establishment" : LanguageConfiguration.dob[Configurations.language]}</Text>
            </View>}

          </View>

          {
            (user_type == "lab") ?
              <View style={{
                width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
              }}>
                <AuthInputBoxSec
                  mainContainer={{
                    width: '100%',
                  }}
                  lableText={LanguageConfiguration.textinputaddress[Configurations.language]}
                  maxLength={50}
                  onChangeText={(text) =>
                    setState({ address: text })
                  }
                  value={classStateData.address}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    Keyboard.dismiss()
                  }}
                />
              </View> :
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 3) / 100,
                  marginBottom: (mobileW * 2 / 100),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{ width: '23%' }}>
                  <Text
                    style={{
                      color: Colors.placeholder_text,
                      fontFamily: Font.Regular,
                      fontSize: Font.medium, //</View></View>(mobileW * 4.1) / 100,
                      textAlign: Configurations.textRotate,
                    }}>
                    {LanguageConfiguration.Gender[Configurations.language]}
                  </Text>
                </View>


                <View
                  style={{
                    width: '70%',
                    alignSelf: 'center',


                    flexDirection: 'row',

                  }}>
                  <View style={{ width: '30%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity onPress={() => { setState({ mabtn: true, febtn: false, gender: 'Male' }); }}
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }} >
                        <Icon style={{ alignSelf: 'center' }}
                          name={(classStateData.mabtn == false) ? "circle-thin" : "dot-circle-o"}
                          size={22}
                          color={(classStateData.mabtn == false) ? '#8F98A7' : '#0168B3'}></Icon>

                        <View style={{ width: '70%', alignSelf: 'center' }}>
                          <Text
                            style={{
                              marginLeft: mobileW * 1.5 / 100,
                              textAlign: Configurations.textRotate,
                              color: Colors.placeholder_text,
                              fontFamily: Font.Regular,
                              fontSize: Font.medium,
                            }}>
                            {LanguageConfiguration.male[Configurations.language]}
                          </Text>
                        </View>
                      </TouchableOpacity>



                    </View>


                  </View>

                  <View
                    style={{
                      width: '33%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{ width: '100%', alignSelf: 'center', marginLeft: mobileW * 2 / 100 }}>
                      <TouchableOpacity onPress={() => { setState({ febtn: true, mabtn: false, gender: 'Female' }) }}
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}>
                        <Icon style={{ alignSelf: 'center' }}
                          name={(classStateData.febtn == false) ? "circle-thin" : "dot-circle-o"}
                          size={22}
                          color={(classStateData.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>

                        <Text
                          style={{
                            textAlign: Configurations.textRotate,
                            marginLeft: mobileW * 1.5 / 100,
                            color: Colors.placeholder_text,
                            fontFamily: Font.Regular,
                            fontSize: Font.medium,
                            // alignSelf: 'center',
                          }}>
                          {LanguageConfiguration.female[Configurations.language]}
                        </Text>

                      </TouchableOpacity>



                    </View>



                  </View>
                </View>
              </View>
          }

          {
            (user_type == "nurse" || user_type == "physiotherapy"
              || user_type == "doctor") &&
            <>
              {renderIDNumber()}
              {renderSpeExpCer()}
              {renderExpRegid()}
            </>
          }

          {
            (user_type == "caregiver" || user_type == "babysitter") &&
            <>
              {renderIDNumber()}
              {renderExpCer()}
              {renderExp()}
            </>
          }

          {
            (user_type == "lab") &&
            <>
              {renderHealthIDNumber()}
              {renderCRC()}
            </>
          }

          <View style={{
            width: '90%', alignSelf: 'center',
            marginTop: mobileW * 3 / 100,
            justifyContent: 'flex-start'
          }}>
            <AuthInputBoxSec
              mainContainer={{
                width: '100%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
              inputFieldStyle={{
                width: '100%',
                height: mobileW * 30 / 100,
                color: Colors.textblack,
                fontSize: Font.medium,
                textAlign: Configurations.textalign,
                fontFamily: Font.Regular,
                textAlignVertical: 'top',
                alignSelf: 'flex-start'

              }}
              lableText={'About'}
              onChangeText={(text) =>
                setState({ description: text })
              }
              value={classStateData.description}
              maxLength={250}
              multiline={true}
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss()
              }}
            />
          </View>



          {/* {
            Platform.OS == 'android' &&

            <StickyButton
              text={LanguageConfiguration.submitbtntext[Configurations.language]}
              onPress={() => onEditProfileClick()}
              onLoading={isOnLoadingButton}
              customStyles={{
                mainContainer: {
                  marginBottom: vs(28),
                  width: '90%'
                }
              }}
            />
          } */}

        </KeyboardAwareScrollView>

        {

          <StickyButton
            text={'SAVE'}
            onPress={() => onEditProfileClick()}
            onLoading={isOnLoadingButton}
            customStyles={{
              mainContainer: {
                marginBottom: vs(28),
                width: '90%'
              }
            }}
          />
        }

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  roundButtonAttachmentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: vs(8),
    margin: vs(8),
    borderRadius: vs(8),
    backgroundColor: Colors.White,
    elevation: 4,
    shadowColor: Colors.lightGrey,
    shadowOpacity: 0.5,
    shadowOffset: { height: 1 },
    width: vs(80)
  }
})