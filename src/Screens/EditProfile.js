import { Text, View, StatusBar, SafeAreaView, TouchableOpacity, Image, Modal, Keyboard, Platform, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors, Font, mobileH, Configurations, mobileW, LanguageConfiguration, API, MessageFunctions, MessageTexts, MessageHeadings, CameraGallery, Media } from '../Helpers/Utils';
import DateTimePicker from "react-native-modal-datetime-picker";
import MonthPicker from 'react-native-month-year-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoginData } from '../Redux/Actions/UserActions';
import { vs } from 'react-native-size-matters';

export default EditProfile = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    speciality: '',
    mabtn: false,
    country_code: '',
    febtn: false,
    allergies: 'No',
    work_area: '',
    yesNoModal: false,
    smoking_btn: true,
    smoking: '',
    alcohol: '',

    nationality_arr: "",
    activity_level: '',
    food: '',
    // occupation: '',
    name: '',
    emailfocus: false,
    email: '',
    numberfocus: false,
    number: '',
    dobfocus: false,
    dob: '',
    address: '',
    id_number: '',
    blood_group: '',

    mobile: '',
    hosp_moh_lic_no: '',
    hosp_reg_no: '',
    profile_img: 'NA',
    id_number: '',
    mediamodal: false,
    isDatePickerVisibletwo: false,
    dob_date: '',
    profile_image: '',
    notification_count: '',
    date_new: new Date()

  })
  const dispatch = useDispatch()
  const screens = ScreenReferences.EditProfile;

  const {
    loginUserData
  } = useSelector(state => state.Auth)

  useEffect(() => {
    navigation.addListener('focus', () => {
      getProfile()

      get_all_nationlity()
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
        console.log('obj nationaltity', obj)



      } else {


        return false;
      }
    }).catch((error) => {

      console.log("-------- error ------- " + error);
    })

  }

  const get_all_nationlity = async () => {
    let user_id = loginUserData['user_id']

    let url = Configurations.baseURL + "api-getnationality";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)


    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {
        setState({ nationality_arr: obj.result })
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

  const getProfile = async () => {
    let user_id = loginUserData['user_id']
    let user_type = loginUserData['user_type']

    let url = Configurations.baseURL + "api-get-provider-profile";
    console.log("url", url)
    var data = new FormData();
    // data.append('user_id', user_id)
    data.append('id', user_id)
    data.append('service_type', user_type)



    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('result123456', obj.result)

        let result = obj.result
        setState({
          name: result['first_name'],
          email: result['email'],
          display_user_type: result['display_user_type'],
          user_type: result['user_type'],
          emailfocusget: true,
          user_id: result['user_id'],
          country_code: result['country_code'],
          work_area: result['work_area'],
          address: result['address'],
          description: result['description'],
          id_number: result['id_number'],
          speciality: result['speciality'],
          qualification: result['qualification'],
          experience: result['experience'],
          dob_date: (result['user_type'] == "lab") ? result['experience'] : "",
          scfhs_number: result['scfhs_number'],
          hosp_moh_lic_no: result['hosp_moh_lic_no'],
          hosp_reg_no: result['hosp_reg_no'],
          id_image: { filename: result['id_image'] },
          certificate: { filename: result['qualification_certificate'] },
          scfhs_image: { filename: result['scfhs_image'] },
          hosp_reg_image: { filename: result['hosp_reg_image'] },
          moh_lic_image: { filename: result['moh_lic_image'] },

        }, () => {
          console.log("id_image:: ", classStateData.id_image);
          console.log("certificate:: ", classStateData.certificate);
          console.log("scfhs_image:: ", classStateData.scfhs_image);
        })

        if (result['phone_number'] != null && result['phone_number'] != '') {
          setState({ mobile: result['phone_number'], numberfocus: true })
        }

        if (result['dob'] != null && result['dob'] != '') {
          setState({ dob_date: result['dob'], dobfocus: true })
        }
        if (result['gender'] != null && result['gender'] != '') {
          setState({
            gender: result['gender'],
            febtn: (result['gender'] == 'Female') ? true : false,
            mabtn: (result['gender'] == 'Male') ? true : false,
          })
        }
        if (result['smoking'] != null && result['smoking'] != '') {
          setState({ smoking: result['smoking'] })
        }
        if (result['blood_group'] != null) {
          setState({ blood_group: result['blood_group'] })
        }
        if (result['food_preference'] != null) {
          setState({ food: result['food_preference'] })
        }
        if (result['alcohol'] != null) {
          setState({ alcohol: result['alcohol'] })
        }
        // if (result['occupation'] != null) {
        //   setState({ occupation: result['occupation'] })
        // }
        if (result['activity_level'] != null) {
          setState({ activity_level: result['activity_level'] })
        }
        if (result['allergies_data'] != null && result['allergies_data'] != '') {
          setState({ allergies_data: result['allergies_data'] })
        }
        if (result['allergies'] != null && result['allergies'] != '') {
          setState({ allergies: result['allergies'] })
        }
        if (result.image != null) {
          setState({
            profile_img: Configurations.img_url3 + result['image'],
          })
        }

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

  const Camerapopen = async () => {
    Media.launchCamera(true).then((obj) => {
      console.log(obj);
      console.log(obj.path);
      if (classStateData.img_type == 0) {
        setState({ cover_img: obj.path, mediamodal: false })
      }
      else {
        setState({ profile_img: obj.path, mediamodal: false, profile_image: obj.path })
      }
    }).catch((error) => {
      setState({ mediamodal: false })

    })
  }
  const Galleryopen = () => {
    Media.launchGellery(true).then((obj) => {
      console.log(obj);
      console.log(obj.path);
      // editImage(obj.path);
      if (classStateData.img_type == 0) {
        setState({ cover_img: obj.path, mediamodal: false })
      }
      else {
        setState({ profile_img: obj.path, mediamodal: false, profile_image: obj.path })
      }
    }).catch((error) => {
      setState({ mediamodal: false })
    })
  }

  const submit_click = async () => {
    let user_id = loginUserData['user_id']

    Keyboard.dismiss()


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

    if (classStateData.user_type == "lab") {
      if (classStateData.dob_date.length <= 0) {
        MessageFunctions.showError("Please choose year of establishment")
        return false;
      }
      if (classStateData.address.length <= 0 || classStateData.address.trim().length <= 0) {
        MessageFunctions.showError("Please enter your address")
        return false;
      }
    } else {
      if (classStateData.dob_date.length <= 0 || classStateData.dob_date.trim().length <= 0) {
        MessageFunctions.showError("Please choose your date of birth")
        return false;
      }
    }
    if (classStateData.user_type != "lab") {
      if (classStateData.gender.length <= 0 || classStateData.gender.trim().length <= 0) {
        MessageFunctions.showError("Please choose your gender")
        return false;
      }
    }
    // if (classStateData.mobile.length <= 0 || classStateData.mobile.trim().length <= 0) {
    //   MessageFunctions.toast(MessageTexts.emptymobileNumber[Configurations.language], 'center')
    //   return false;
    // }



    if (classStateData.user_type != "lab") {
      if ((classStateData.id_number.length < 10 || classStateData.id_number.trim().length < 10)) {
        MessageFunctions.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }

      if ((classStateData.id_number.length > 15 || classStateData.id_number.trim().length > 15)) {
        MessageFunctions.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }
    }
    if (classStateData.user_type == "nurse" || classStateData.user_type == "physiotherapy"
      || classStateData.user_type == "doctor") {
      if (classStateData.speciality.length <= 0 || classStateData.speciality.trim().length <= 0) {
        MessageFunctions.showError("Please select speciality")
        return false;
      }
    }

    if (classStateData.user_type != "lab") {
      if (classStateData.qualification.length <= 0 || classStateData.qualification.trim().length <= 0) {
        MessageFunctions.showError("Please enter your qualification")
        return false;
      }

      if (classStateData.experience.length <= 0 || classStateData.experience.trim().length <= 0) {
        MessageFunctions.showError("Please enter your years of experience")
        return false;
      }
    }

    if (classStateData.user_type == "nurse" || classStateData.user_type == "physiotherapy"
      || classStateData.user_type == "doctor") {
      if ((classStateData.scfhs_number.length < 8 || classStateData.scfhs_number.trim().length < 8)) {
        MessageFunctions.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
        return false;
      }

      if (classStateData.scfhs_number.length > 11 || classStateData.scfhs_number.trim().length > 11) {
        MessageFunctions.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
        return false;
      }
    }

    if (classStateData.user_type == "lab") {
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

    data.append('user_id', user_id)
    data.append("service_type", classStateData.user_type)
    data.append('first_name', classStateData.name)
    data.append('email', classStateData.email)
    data.append('phone_number', phone_number_send)
    data.append('work_area', classStateData.work_area)
    if (classStateData.user_type != "lab") {

      data.append('gender', classStateData.gender)
      data.append('id_number', classStateData.id_number)
      data.append('scfhs_number', classStateData.scfhs_number)
      data.append('dob', classStateData.dob_date)
    }
    if (classStateData.user_type == "lab") {
      data.append('address', classStateData.address)
      data.append('hosp_moh_lic_no', classStateData.hosp_moh_lic_no)
      data.append('hosp_reg_no', classStateData.hosp_reg_no)
    }
    if (classStateData.user_type != "lab") {
      data.append('speciality', classStateData.speciality)

    }
    data.append('description', classStateData.description)
    data.append('experience', (classStateData.user_type == "lab") ? classStateData.dob_date : classStateData.experience)
    if (classStateData.user_type != "lab") {
      data.append('qualification', classStateData.qualification)
    }
    data.append('id_image', (classStateData.user_type == "lab") ? classStateData.moh_lic_image.filename : classStateData.id_image.filename)
    data.append('certificate', (classStateData.user_type == "lab") ? classStateData.hosp_reg_image.filename : classStateData.certificate.filename)
    if (classStateData.user_type != "lab") {
      data.append('scfhs_image', classStateData.scfhs_image.filename)
    }
    if (classStateData.profile_image != '') {
      console.log('classStateData.profile_img123409', classStateData.profile_img)
      data.append('image', {
        uri: classStateData.profile_img,
        type: 'image/jpg',
        name: classStateData.profile_img
      })
    }


    setState({ loading: true })
    API.post(url, data).then((obj) => {

      setState({ loading: false });
      if (obj.status == true) {
        dispatch(setUserLoginData(obj.result))
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        // MessageFunctions.alert(obj.message, false);
      }
      return false;

    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setState({ loading: false });
    });

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
            flexDirection: 'row'
          }}>
          <AuthInputBoxSec
            mainContainer={{
              width: '100%',
            }}
            lableText={'Provide ID Number'}
            inputRef={(ref) => {
              id_numberInput = ref;
            }}
            maxLength={15}
            onChangeText={(text) =>
              setState({ id_number: text })
            }
            editable={false}
            value={classStateData.id_number}
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

          <View style={{ width: '45%', alignSelf: 'center', }}>
          </View>

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

          <AuthInputBoxSec
            mainContainer={{
              width: '90%',
              alignSelf: 'center'
            }}
            // icon={layer9_icon}
            lableText={'Speciality'}
            // inputRef={(ref) => {
            //   qualificationInput = ref;
            // }}
            onChangeText={(text) =>
              setState({ speciality: text })
            }
            value={classStateData.speciality}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            editable={false}
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
            // icon={layer9_icon}
            lableText={'SCFHS Registration ID'}
            inputRef={(ref) => {
              scfhs_numberInput = ref;
            }}
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
          {/* <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '55%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              // setState({
              //   imageType: 'scfhs_image',
              //   mediamodal: true
              // }, () => {
              //   // Galleryopen()
              // });
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
                Upload Photocopy of Reg. ID
              </Text>
            </View>
          </TouchableOpacity> */}


          <View style={{ width: '45%', alignSelf: 'center', }}>

          </View>

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
            // borderColor: classStateData.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
            // borderWidth: 1,
            // borderRadius: (mobileW * 1) / 100,
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
          {/* <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              // setState({
              //   imageType: 'certificate',
              //   mediamodal: true
              // }, () => {
              //   //Galleryopen()
              // });
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
          </TouchableOpacity> */}

          <View style={{ width: '45%', alignSelf: 'center', }}>

          </View>

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
            // borderColor: classStateData.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
            // borderWidth: 1,
            // borderRadius: (mobileW * 1) / 100,
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
            // borderColor: classStateData.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
            // borderWidth: 1,
            // borderRadius: (mobileW * 1) / 100,
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
            editable={(classStateData.hosp_moh_lic_no != null) ? false : true}
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
          {/* <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              // setState({
              //   imageType: 'id_image',
              //   mediamodal: true
              // }, () => {
              //   // Galleryopen()
              //   // uploadVoiceFile()
              // });

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
          </TouchableOpacity> */}

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
                fontSize: Font.Forgot,
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
            // borderColor: classStateData.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
            // borderWidth: 1,
            // borderRadius: (mobileW * 1) / 100,
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
            editable={(classStateData.hosp_reg_no != null) ? false : true}
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
          {/* <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              // setState({
              //   imageType: 'certificate',
              //   mediamodal: true
              // }, () => {
              //   // Galleryopen()
              //   // uploadVoiceFile()
              // });

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

          </TouchableOpacity> */}

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
                fontSize: Font.Forgot,
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

  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60
  return (
    //
    <View style={{ flex: 1, }}>
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

      {
        (classStateData.isDatePickerVisibletwo && classStateData.user_type == "lab") ?
          <MonthPicker
            onChange={(event, date) => {
              console.log('event:: ', event);
              console.log('datedate:: ', date);
              console.log('getFullYear:: ', new Date(date).getFullYear());
              // setdatetwo(date),
              setState({
                dob_date: new Date(date).getFullYear(),
                isDatePickerVisibletwo: false
              })
            }}
            value={classStateData.date_new}
            // minimumDate={new Date()}
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


      <Modal
        animationType="slide"
        transparent={true}
        visible={classStateData.yesNoModal}
        onRequestClose={() => { }}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => { setState({ yesNoModal: false }) }}
          style={{
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: '#00000080',
            width: '100%',
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
                style={{ width: '55%', paddingVertical: (mobileW * 3) / 100 }}>
                <Text
                  style={{
                    textAlign: Configurations.textRotate,
                    fontFamily: Font.Regular,
                    fontSize: (mobileW * 4) / 100,
                    alignSelf: 'center',
                    color: Colors.textwhite,
                  }}>
                  {classStateData.smoking_btn == true
                    ? LanguageConfiguration.smoking[Configurations.language]
                    : LanguageConfiguration.Alcohol[Configurations.language]}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  if (classStateData.smoking_btn == true) {
                    setState({ yesNoModal: false, smoking: 'Yes' });
                  } else {
                    setState({ yesNoModal: false, alcohol: 'Yes' });
                  }
                }}
                style={{
                  width: '100%',
                  alignSelf: 'center',

                  flexDirection: 'row',
                  borderBottomColor: '#0000001F',
                  borderBottomWidth: 1,
                  paddingVertical: (mobileW * 3) / 100,
                }}>
                <View style={{ width: '87%', alignSelf: 'center' }}>
                  <Text
                    style={{
                      color: Colors.textblack,
                      fontSize: (mobileW * 4) / 100,
                      textAlign: Configurations.textRotate
                    }}>
                    {LanguageConfiguration.yes_txt_new[Configurations.language]}
                  </Text>

                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (classStateData.smoking_btn == true) {
                    setState({ yesNoModal: false, smoking: 'No' });
                  } else {
                    setState({ yesNoModal: false, alcohol: 'No' });
                  }
                }}
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 3) / 100,
                  flexDirection: 'row',
                  borderBottomColor: '#0000001F',
                  borderBottomWidth: 1,
                  paddingVertical: (mobileW * 3) / 100,
                }}>
                <View style={{ width: '100%', alignSelf: 'center' }}>
                  <View style={{ width: '87%', alignSelf: 'center' }}>
                    <Text
                      style={{
                        color: Colors.textblack,
                        fontSize: (mobileW * 4) / 100,
                        textAlign: Configurations.textRotate
                      }}>
                      {LanguageConfiguration.no_txt_new[Configurations.language]}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>


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
          style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

        <KeyboardAwareScrollView style={{
          backgroundColor: Colors.White,
          paddingBottom: vs(8)
        }}>

          <CameraGallery mediamodal={classStateData.mediamodal}
            isCamera={true}
            isGallery={true}
            isDocument={false}
            Camerapopen={() => { Camerapopen() }}
            Galleryopen={() => { Galleryopen() }}
            Canclemedia={() => { setState({ mediamodal: false }) }}
          />

          <View>
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
                  <Image
                    style={{
                      width: (mobileW * 20) / 100,
                      height: (mobileW * 20) / 100,
                      borderRadius: mobileW * 10 / 100,

                      alignSelf: 'center',

                    }}
                    source={classStateData.profile_img == 'NA' || classStateData.profile_img == null || classStateData.profile_img == '' ? Icons.ProfileImage : { uri: classStateData.profile_img }}
                  ></Image>
                </View>
              </View>

              <View style={{ width: '70%', alignSelf: 'center', }}>
                <View style={{ width: '100%', alignSelf: 'center' }}>
                  <Text style={{
                    color: Colors.placeholder_text_color,
                    // fontFamily: Font.blackheadingfontfamily, 
                    // fontSize: Font.tabtextsize, 
                    fontFamily: Font.Medium, fontSize: 18,
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
                <TouchableOpacity onPress={() => { setState({ mediamodal: true }) }}>
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
                lableText={LanguageConfiguration.textinputname[Configurations.language]}
                inputRef={(ref) => {
                  nameInput = ref;
                }}
                onChangeText={(text) =>
                  setState({ name: text })
                }
                value={classStateData.name}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyLabel='done'
                returnKeyType='done'
                onSubmitEditing={() => {
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
                  fontSize: Font.headinggray,
                  fontFamily: Font.headingfontfamily,
                  color: Colors.placeholder_text,
                }}>
                {LanguageConfiguration.selectcountrytitle[Configurations.language]}
              </Text>
            </View>

            <DropDownboxSec
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
                  inputRef={(ref) => {
                    country_codeInput = ref;
                  }}
                  onChangeText={(text) =>
                    setState({ country_code: text })
                  }
                  maxLength={3}
                  editable={false}
                  value={classStateData.country_code}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    //passwordInput.focus();
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
                  inputRef={(ref) => {
                    mobileInput = ref;
                  }}
                  maxLength={9}
                  onChangeText={(text) =>
                    setState({ mobile: text })
                  }
                  value={classStateData.mobile}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  returnKeyLabel='done'
                  returnKeyType='done'
                  onSubmitEditing={() => {
                  }}
                />
                <View
                  style={{
                    width: '89%',
                    marginTop: (mobileW * 0.5) / 100,
                  }}>
                  <Text
                    style={{
                      textAlign: Configurations.textRotate,
                      fontSize: Font.textsize,
                      fontFamily: Font.headingfontfamily,
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
                inputRef={(ref) => {
                  emailInput = ref;
                }}
                onChangeText={(text) =>
                  setState({ email: text })
                }
                value={classStateData.email}
                editable={false}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
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
                  fontSize: Font.headinggray,
                  fontFamily: Font.headingfontfamily,
                  color: Colors.placeholder_text,
                }}>
                {(classStateData?.user_type == "lab") ? "Year of Establishment" : LanguageConfiguration.dob[Configurations.language]}
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
                    fontSize: Font.placeholdersize,
                  }}>{classStateData.dob_date.length <= 0 ? (classStateData.user_type == "lab") ? "Year of Establishment" : LanguageConfiguration.dob[Configurations.language] : classStateData.dob_date}</Text>
                  <View style={{ width: '15%', alignSelf: 'center', alignItems: 'flex-end' }}>

                    <Image source={Icons.DatePicker}
                      style={{ height: 25, width: 25 }}>
                    </Image>
                  </View>
                </View>


              </TouchableOpacity>

              {classStateData.dobfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.1 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                <Text style={{
                  color: classStateData.dob_date.length <= 0 ? '#0057A5' : Colors.gray4,
                  fontSize: Font.sregulartext_size,
                  fontFamily: Font.placeholderfontfamily,
                  textAlign: Configurations.textalign
                }}>{(classStateData.user_type == "lab") ? "Year of Establishment" : LanguageConfiguration.dob[Configurations.language]}</Text>
              </View>}

            </View>

            {
              (classStateData.user_type == "lab") ?
                <View style={{
                  width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
                }}>
                  <AuthInputBoxSec
                    mainContainer={{
                      width: '100%',
                    }}
                    lableText={LanguageConfiguration.textinputaddress[Configurations.language]}
                    inputRef={(ref) => {
                      addressInput = ref;
                    }}
                    maxLength={50}
                    onChangeText={(text) =>
                      setState({ address: text })
                    }
                    value={classStateData.address}
                    keyboardType="default"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => {
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
                        fontSize: Font.placeholdersize, //</View></View>(mobileW * 4.1) / 100,
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
                                fontSize: Font.placeholdersize,
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
                              fontSize: Font.placeholdersize,
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
              (classStateData.user_type == "nurse" || classStateData.user_type == "physiotherapy"
                || classStateData.user_type == "doctor") &&
              <>
                {renderIDNumber()}
                {renderSpeExpCer()}
                {renderExpRegid()}
              </>
            }

            {
              (classStateData.user_type == "caregiver" || classStateData.user_type == "babysitter") &&
              <>
                {renderIDNumber()}
                {renderExpCer()}
                {renderExp()}
              </>
            }

            {
              (classStateData.user_type == "lab") &&
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
                  fontSize: Font.placeholdersize,
                  textAlign: Configurations.textalign,
                  fontFamily: Font.placeholderfontfamily,
                  textAlignVertical: 'top',
                  alignSelf: 'flex-start'

                }}
                lableText={'About'}
                inputRef={(ref) => {
                  messageInput = ref;
                }}
                onChangeText={(text) =>
                  setState({ description: text })
                }
                value={classStateData.description}
                maxLength={250}
                multiline={true}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            <Button
              text={LanguageConfiguration.submitbtntext[Configurations.language]}
              onPress={() => submit_click()}
            />

          </View>

        </KeyboardAwareScrollView>
      </View>

    </View>
  );
}
