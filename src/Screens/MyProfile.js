import { Text, View, StatusBar, SafeAreaView, ScrollView, styles, TouchableOpacity, Image, TextInput, Modal, FlatList, keyboardType, Keyboard, Platform, Dimensions } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { Colors, Font, mobileH, config, mobileW, LanguageConfiguration, localStorage, API, MessageFunctions, MessageTexts, MessageHeadings, Cameragallery, Media } from '../Provider/utilslib/Utils';
import Styles from '../Styles';
import DateTimePicker from "react-native-modal-datetime-picker";
import DatePicker from 'react-native-date-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthInputBoxSec, DropDownboxSec, DashBoardBox } from '../Components'
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';

const bloodModal_arr = [
  {
    id: 1,
    blood: 'A+',
    line: 0,

  },
  {
    id: 2,
    blood: 'O+',
    line: 0,

  },
  {
    id: 3,
    blood: 'B+',
    line: 0,

  },
  {
    id: 4,
    blood: 'AB+',
    line: 0,

  },
  {
    id: 5,
    blood: 'A-',
    line: 0,

  },
  {
    id: 5,
    blood: 'B-',
    line: 0,

  },
  {
    id: 6,
    blood: 'O-',
    line: 0,

  },
  {
    id: 7,
    blood: 'AB-',
    line: 1,

  },

]

const occupation_arr = [
  {
    id: 1,
    name: 'Technician',
    line: 0,

  },
  {
    id: 2,
    name: 'Teacher',
    line: 0,
  },
  {
    id: 3,
    name: 'Machinist',
    line: 0,

  },
  {
    id: 4,
    name: 'Technologist',
    line: 0,

  },
  {
    id: 5,
    name: 'Electrician',
    line: 0,

  },
  {
    id: 6,
    name: 'Engineering technician',
    line: 0,

  },
  {
    id: 7,
    name: 'Actuary',
    line: 0,

  },
  {
    id: 8,
    name: 'Electrician',
    line: 0,

  },
  {
    id: 9,
    name: 'Tradesman',
    line: 0,

  },
  {
    id: 10,
    name: 'Mediacl laboratory scientist',
    line: 0,

  },
  {
    id: 11,
    name: 'Quantity surveyor',
    line: 0,

  },
  {
    id: 12,
    name: 'Prosthetist',
    line: 0,

  },
  {
    id: 13,
    name: 'Paramedic',
    line: 0,

  },
  {
    id: 14,
    name: 'Bricklayer',
    line: 0,

  },
  {
    id: 15,
    name: 'Special Education Teacher',
    line: 0,

  },
  {
    id: 16,
    name: 'Lawyer',
    line: 0,

  },
  {
    id: 17,
    name: 'Physician',
    line: 0,

  },
  {
    id: 18,
    name: 'other',
    line: 1,
  },


]

const activity_arr = [
  {
    id: 1,
    name: 'Extremely inactive',
    line: 0,

  },
  {
    id: 2,
    name: 'Sedentary',
    line: 0,
  },
  {
    id: 3,
    name: 'Moderately active',
    line: 0,

  },
  {
    id: 4,
    name: 'Vigorously active',
    line: 0,

  },
  {
    id: 5,
    name: 'Extremely active',
    line: 1,

  },

]


const food_arr = [
  {
    id: 1,
    name: 'Standard',
    line: 0

  },
  {
    id: 2,
    name: 'Pescetarian',
    line: 0
  },
  {
    id: 3,
    name: 'Vegetarian',
    line: 0

  },
  {
    id: 3,
    name: 'Lacto-vegetarian',
    line: 0

  },
  {
    id: 3,
    name: 'Vegan',
    line: 1

  },


]

export default MyProfile = ({navigation, route}) => {

  const[classStateData, setClassStateData] = useState({
    pbtn: true,
    country_code: '',
    febtn: false,
    mabtn: false,
    allergies: 'No',
    work_area: '',
    yesNoModal: false,
    smoking_btn: true,
    smoking: '',
    alcohol: '',

    nationalityModal: false,
    nationality_arr: "",


    bloodModal: false,

    occupation_arr: occupation_arr,
    food_arr: food_arr,
    activity_level: '',
    food: '',
    occupation: '',
    occ_food_activity: 'activity',
    occ_food_activitymodal: false,

    name: '',
    email: '',
    number: '',
    dob: '',
    nationality: '',
    address: '',
    id_number: '',


    injuries: '',
    chronic: '',
    blood_group: '',

    mobile: '',
    profile_img: 'NA',
    mediamodal: false,
    isDatePickerVisibletwo: false,
    dob_date: '',
    current_medication: 'No',
    chronic_diseases: 'No',
    surgeries: 'No',
    injuries: 'No',
    past_medication: 'No',
    past_medication_data: '',
    injuries_data: '',
    surgeries_data: '',
    current_medication_data: '',
    chronic_diseases_data: '',
    nationality: '',
    profile_image: '',
    notification_count: '',
    date_new: new Date(),
    mediamodal: false,
    id_image: '',
    certificate: '',
    scfhs_image: '',
  }, [])

  useEffect(() => {
    navigation.addListener('focus', () => {
      getProfile()

      get_all_nationlity()
      get_all_notification()

    });
  }, [])

const setState = payload => {
  setClassStateData(prev => ({ ...prev, ...payload }))
}

get_all_notification = async () => {
  let user_details = await localStorage.getItemObject('user_arr')
  console.log('user_details user_details', user_details)
  let user_id = user_details['user_id']

  let url = config.baseURL + "api-notification-count";
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
get_all_nationlity = async () => {
  let user_details = await localStorage.getItemObject('user_arr')
  console.log('user_details user_details', user_details)
  let user_id = user_details['user_id']

  let url = config.baseURL + "api-getnationality";
  console.log("url", url)
  var data = new FormData();
  data.append('login_user_id', user_id)


  API.post(url, data, 1).then((obj) => {

    if (obj.status == true) {
      console.log('obj nationaltity', obj)
      setState({ nationality_arr: obj.result })


    } else {


      return false;
    }
  }).catch((error) => {
    console.log("-------- error ------- " + error);
  })

}

setalergy = (item) => {
  console.log('item', item);
  setState({ allergies: item })
}
setcurrentmadiciens = (item) => {
  console.log('item', item);
  setState({ current_medication: item })
}
setpastmedician = (item) => {
  console.log('item', item);
  setState({ past_medication: item })
}
setinjuries = (item) => {
  console.log('item', item);
  setState({ injuries: item })
}
setsurgeries = (item) => {
  console.log('item', item);
  setState({ surgeries: item })
}
setchronic_diseases = (item) => {
  console.log('item', item);
  setState({ chronic_diseases: item })
}
setdatetwo = (res) => {
  let check_month
  let check_date
  let date = res.getDate()
  let month = res.getMonth() + 1
  let year = res.getFullYear()
  if (month < 9) {
    check_month = '0' + month
  }
  else {
    check_month = month
  }
  if (date < 9) {
    check_date = '0' + date
  }
  else {
    check_date = date
  }
  let date1 = year + '-' + check_month + '-' + check_date
  setState({ date_new: new Date(date1) })
  setState({ dob_date: date1, isDatePickerVisibletwo: false, })
}

getProfile = async () => {
  let user_details = await localStorage.getItemObject('user_arr')
  console.log('user_details user_details', user_details)
  let user_id = user_details['user_id']
  let user_type = user_details['user_type']

  let url = config.baseURL + "api-get-provider-profile";
  console.log("url", url)
  var data = new FormData();
  data.append('id', user_id)
  data.append('service_type', user_type)



  API.post(url, data).then((obj) => {

    if (obj.status == true) {
      console.log('result123456', obj.result)

      let result = obj.result
      console.log('result.nationality',)
      setState({
        name: result['first_name'],
        email: result['email'],
        phone_number: result['phone_number'],
        emailfocusget: true,
        user_id: result['user_id'],
        user_type: result['user_type'],
        country_code: result['country_code'],
        work_area: result['work_area'],
        address: result['address'],
        description: result['description'],
        id_number: result['id_number'],
        speciality: result['speciality'],
        qualification: result['qualification'],
        experience: result['experience'],
        lab_test_count: result['lab_test_count'],
        scfhs_number: result['scfhs_number'],
        hosp_moh_lic_no: result['hosp_moh_lic_no'],
        hosp_reg_no: result['hosp_reg_no'],
        avg_rating: result['avg_rating'],
        booking_count: result['booking_count'],
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
        setState({ mobile: result['phone_number'] })
      }
      if (result['address'] != null && result['address'] != '') {

      }

      if (result['dob'] != null && result['dob'] != '') {
        setState({ dob_date: result['dob'] })
      }

      if (result.nationality != null && result.nationality != '') {

        setState({ nationality: result['nationality'] })
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
      if (result['occupation'] != null) {
        setState({ occupation: result['occupation'] })
      }
      if (result['activity_level'] != null) {
        setState({ activity_level: result['activity_level'] })
      }
      if (result['allergies_data'] != null && result['allergies_data'] != '') {
        setState({ allergies_data: result['allergies_data'] })
      }
      if (result['allergies'] != null && result['allergies'] != '') {
        setState({ allergies: result['allergies'] })
      }
      if (result['chronic_diseases'] != null && result['chronic_diseases'] != '') {
        setState({ chronic_diseases: result['chronic_diseases'] })
      }
      if (result['chronic_diseases_data'] != null && result['chronic_diseases_data'] != '') {
        setState({ chronic_diseases_data: result['chronic_diseases_data'] })
      }
      if (result['current_medication'] != null && result['current_medication'] != '') {
        setState({ current_medication: result['current_medication'] })
      }
      if (result['current_medication_data'] != null && result['current_medication_data'] != '') {
        setState({ current_medication_data: result['current_medication_data'] })
      }
      if (result['injuries'] != null && result['injuries'] != '') {
        setState({ injuries: result['injuries'] })
      }
      if (result['injuries_data'] != null && result['injuries_data'] != '') {
        setState({ injuries_data: result['injuries_data'] })
      }
      if (result['past_medication_data'] != null && result['past_medication_data'] != '') {
        setState({ past_medication_data: result['past_medication_data'] })
      }
      if (result['past_medication'] != null && result['past_medication'] != '') {
        setState({ past_medication: result['past_medication'] })
      }
      if (result['surgeries'] != null && result['surgeries'] != '') {
        setState({ surgeries: result['surgeries'] })
      }
      if (result['surgeries_data'] != null && result['surgeries_data'] != '') {
        setState({ surgeries_data: result['surgeries_data'] })
      }





      if (result.image != null) {
        setState({
          profile_img: config.img_url3 + result['image'],
        })
      }

    }
    else {
      MessageFunctions.alert(MessageHeadings.information[config.language], obj.message[config.language], false);

      return false;
    }
  }).catch((error) => {
    console.log("-------- error ------- ", error)
    setState({ loading: false });
  });
}

medical_click = async () => {
  let user_details = await localStorage.getItemObject('user_arr');
  let user_id = user_details['user_id']
  let url = config.baseURL + "api-edit-patient-profile-medical";
  console.log("url", url)

  var data = new FormData();
  data.append('user_id', user_id)
  data.append('allergies', classStateData.allergies)
  data.append('allergies_data', classStateData.allergies_data)
  data.append('current_medication', classStateData.current_medication)
  data.append('current_medication_data', classStateData.current_medication_data)
  data.append('past_medication', classStateData.past_medication)
  data.append('past_medication_data', classStateData.past_medication_data)
  data.append('injuries', classStateData.injuries)
  data.append('injuries_data', classStateData.injuries_data)
  data.append('surgeries', classStateData.surgeries)
  data.append('surgeries_data', classStateData.surgeries_data)
  data.append('chronic_diseases', classStateData.chronic_diseases)
  data.append('chronic_diseases_data', classStateData.chronic_diseases_data)

  API.post(url, data).then((obj) => {


    if (obj.status == true) {

      let user_details = obj.result;
      localStorage.setItemObject('user_arr', user_details);

    } else {
      MessageFunctions.toast(obj.message, 'center')
      return false;
    }
  }).catch((error) => {
    console.log("-------- error ------- ", error)

  });

}

Camerapopen = async () => {
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
Galleryopen = () => {
  Media.launchGellery(true).then((obj) => {
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

submit_click = async () => {
  let user_details = await localStorage.getItemObject('user_arr');
  let user_id = user_details['user_id']

  Keyboard.dismiss()


  if (classStateData.name.length <= 0 || classStateData.name.trim().length <= 0) {
    MessageFunctions.toast(MessageTexts.emptyName[config.language], 'center')
    return false;
  }

  let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (classStateData.email.length <= 0 || classStateData.email.trim().length <= 0) {
    MessageFunctions.toast(MessageTexts.emptyEmail[config.language], 'center')
    return false;
  }

  if (regemail.test(classStateData.email) !== true) {
    MessageFunctions.toast(MessageTexts.validEmail[config.language], 'center')
    return false
  }

  if (classStateData.id_number.length <= 0 || classStateData.id_number.trim().length <= 0) {
    MessageFunctions.toast(MessageTexts.emptyid[config.language], 'center')
    return false;
  }

  let url = config.baseURL + "api-sp-edit-profile";
  console.log("url", url)
  var phone_number_send = classStateData.country_code + classStateData.mobile
  var data = new FormData();

  data.append('user_id', user_id)
  data.append("service _type", "nurse")
  data.append('first_name', classStateData.name)
  data.append('email', classStateData.email)
  data.append('phone_number', phone_number_send)
  data.append('gender', classStateData.gender)
  data.append('id_number', classStateData.identity)
  data.append('dob', classStateData.dob_date)
  data.append('speciality', classStateData.speciality)
  data.append('description', classStateData.description)
  data.append('experience', classStateData.experience)
  data.append('qualification', classStateData.qualification)
  data.append('id_image', classStateData.id_image.filename)
  data.append('certificate', classStateData.certificate.filename)
  data.append('scfhs_image', classStateData.scfhs_image.filename)
  console.log('classStateData.profile_img1234', classStateData.profile_image)
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

      let user_details = obj.result;
      localStorage.setItemObject('user_arr', user_details);

    } else {

      MessageFunctions.alert(obj.message, false);
    }
    return false;

  }).catch((error) => {
    console.log("-------- error ------- ", error)
    setState({ loading: false });
  });

}
lifestyle_click = async () => {
  let user_details = await localStorage.getItemObject('user_arr');
  let user_id = user_details['user_id']



  if (classStateData.smoking.length <= 0) {
    MessageFunctions.toast(MessageTexts.smoking_msg[config.language], 'center')
    return false;
  }
  if (classStateData.alcohol.length <= 0) {
    MessageFunctions.toast(MessageTexts.alcohal_msg[config.language], 'center')
    return false;
  }
  if (classStateData.blood_group.length <= 0) {
    MessageFunctions.toast(MessageTexts.bloodgrp_msg[config.language], 'center')
    return false;
  }
  if (classStateData.activity_level.length <= 0) {
    MessageFunctions.toast(MessageTexts.activity_level[config.language], 'center')
    return false;
  }
  if (classStateData.food.length <= 0) {
    MessageFunctions.toast(MessageTexts.food_preferance[config.language], 'center')
    return false;
  }
  if (classStateData.occupation.length <= 0) {
    MessageFunctions.toast(MessageTexts.occuation[config.language], 'center')
    return false;
  }




  let url = config.baseURL + "api-edit-patient-profile-style";
  console.log("url", url)

  var data = new FormData();
  data.append('user_id', user_id)
  data.append('smoking', classStateData.smoking)
  data.append('alcohol', classStateData.alcohol)
  data.append('blood_group', classStateData.blood_group)
  data.append('activity_level', classStateData.activity_level)
  data.append('food_preference', classStateData.food)

  data.append('occupation', classStateData.occupation)

  API.post(url, data).then((obj) => {


    if (obj.status == true) {

      let user_details = obj.result;
      localStorage.setItemObject('user_arr', user_details);
    } else {
      MessageFunctions.toast(obj.message, 'center')
      return false;
    }
  }).catch((error) => {
    console.log("-------- error ------- ", error)

  });

}


  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60
  return (
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

      <DateTimePicker
        isVisible={classStateData.isDatePickerVisibletwo}
        mode="date"
        value={classStateData.date_new}
        maximumDate={new Date()}
        onConfirm={(date) => { setdatetwo(date), setState({ isDatePickerVisibletwo: false }) }}
        onCancel={() => { setState({ isDatePickerVisibletwo: false }) }}
      />
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
                    textAlign: config.textRotate,
                    fontFamily: Font.Regular,
                    fontSize: (mobileW * 4) / 100,
                    alignSelf: 'center',
                    color: Colors.textwhite,
                  }}>
                  {classStateData.smoking_btn == true
                    ? LanguageConfiguration.smoking[config.language]
                    : LanguageConfiguration.Alcohol[config.language]}
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
                      textAlign: config.textRotate
                    }}>
                    {LanguageConfiguration.yes_txt_new[config.language]}
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
                        textAlign: config.textRotate
                      }}>
                      {LanguageConfiguration.no_txt_new[config.language]}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={classStateData.nationalityModal}
        onRequestClose={() => { }}>
        <SafeAreaView style={{ flex: 1, }}>
          {/* <View style={{ height: mobileH * 100 / 100, backgroundColor: '#fff' }}> */}

          <TouchableOpacity activeOpacity={0.9} onPress={() => { setState({ nationalityModal: false }) }}
            style={{
              flex: 1,
              backgroundColor: '#00000090',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 0,
            }}>

            <View
              style={{
                width: '70%',
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: mobileW * 16 / 100,
                marginBottom: mobileW * 10 / 100
              }}>
              <View
                style={{
                  width: '100%',

                  backgroundColor: Colors.backgroundcolorblue,
                }}>
                <View
                  style={{ width: '35%', paddingVertical: (mobileW * 3) / 100 }}>
                  <Text
                    style={{
                      textAlign: config.textRotate,
                      fontFamily: Font.Regular,
                      fontSize: (mobileW * 4) / 100,
                      alignSelf: 'center',
                      color: Colors.textwhite,
                    }}>
                    {LanguageConfiguration.nationality[config.language]}
                  </Text>
                </View>
              </View>
              <View style={{ width: '100%' }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: mobileW * 10 / 100 }}
                  data={classStateData.nationality_arr}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setState({
                            nationalityModal: false,
                            nationality: item.name,
                          });
                        }}
                      >
                        <View style={{ width: '100%', backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'flex-end' }}>
                          <View style={{ width: '95%', borderBottomColor: '#0000001F', borderBottomWidth: 1, paddingVertical: mobileW * 2 / 100, marginLeft: mobileW * 5 / 100 }}>
                            <Text
                              style={{
                                color: Colors.textblack,
                                fontSize: (mobileW * 4) / 100,
                                textAlign: config.textRotate
                              }}>
                              {item.name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}></FlatList>
              </View>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>





      <Modal
        animationType="slide"
        transparent={true}
        visible={classStateData.occ_food_activitymodal}
        onRequestClose={() => { }}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => { setState({ occ_food_activitymodal: false }) }}
          style={{
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: '#00000080',
            width: '100%',

            paddingBottom: (mobileW * 8) / 100,
          }}>
          <View
            style={{
              width: '70%',
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              marginTop: (mobileW * 20) / 100,
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: Colors.backgroundcolorblue,
              }}>
              <View
                style={{ marginLeft: mobileW * 5 / 100, width: '65%', paddingVertical: (mobileW * 3) / 100 }}>
                <Text
                  style={{
                    textAlign: config.textRotate,
                    fontFamily: Font.Regular,
                    fontSize: (mobileW * 4) / 100,

                    color: Colors.textwhite,
                  }}>
                  {classStateData.occ_food_activity == 'activity' ? LanguageConfiguration.ActivityLevel[config.language] : classStateData.occ_food_activity == 'food' ? LanguageConfiguration.FoodPreference[config.language] : LanguageConfiguration.Occupation[config.language]}
                </Text>
              </View>
            </View>
            <View style={{ width: '100%', alignSelf: 'center' }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: mobileW * 4 / 100 }}
                data={activity_arr}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          if (classStateData.occ_food_activity == 'activity') {
                            setState({ occ_food_activitymodal: false, activity_level: item.name });
                          }
                          else if (classStateData.occ_food_activity == 'food') {
                            setState({ occ_food_activitymodal: false, food: item.name });
                          }
                          else {
                            setState({ occ_food_activitymodal: false, occupation: item.name });
                          }

                        }}
                      >
                        <View style={{ width: '100%', backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'flex-end' }}>

                          <View style={[{ width: '95%', borderBottomWidth: 1, paddingVertical: mobileW * 2.5 / 100, marginLeft: mobileW * 5 / 100 }, item.line == 0 ? { borderBottomColor: '#0000001F' } : { borderBottomColor: '#fff' }]}>
                            <Text style={{ color: Colors.textblack, fontSize: mobileW * 4 / 100, textAlign: config.textRotate }}>{item.name}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}

              ></FlatList>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ===================================country get===================== */}
      {/*  */}

      {/* --------------------------------------------------------------------------------------bloodmodal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={classStateData.bloodModal}
        onRequestClose={() => { }}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => { setState({ bloodModal: false }) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%' }}>
          <View style={{ width: '70%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
            <View style={{ width: '100%', backgroundColor: Colors.backgroundcolorblue, paddingVertical: mobileW * 2 / 100 }}>

              <Text style={{ paddingLeft: mobileW * 4.5 / 100, paddingRight: mobileW * 4.5 / 100, textAlign: config.textRotate, fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.textwhite }}>{LanguageConfiguration.blood[config.language]}</Text>

            </View>

            <View style={{ width: '100%', alignSelf: 'center' }}>
              <FlatList
                contentContainerStyle={{ paddingBottom: mobileW * 2 / 100 }}
                data={bloodModal_arr}
                renderItem={({ item, index }) => {
                  return (

                    <TouchableOpacity
                      onPress={() => { setState({ bloodModal: false, blood_group: item.blood }); }}
                    >
                      <View style={{ width: '100%', backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'flex-end' }}>
                        <View style={[{ width: '95%', borderBottomWidth: 1, paddingVertical: mobileW * 2 / 100, marginLeft: mobileW * 5 / 100 }, item.line == 0 ? { borderBottomColor: '#0000001F' } : { borderBottomColor: '#fff' }]}>
                          <Text style={{ color: Colors.textblack, fontSize: mobileW * 4 / 100, paddingLeft: mobileW * 2 / 100, textAlign: config.textRotate }}>{item.blood}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>)
                }}
                keyExtractor={(item, index) => index.toString()}>


              </FlatList>
            </View>
          </View>



        </TouchableOpacity>

      </Modal>



      {/* ------------------------------------------------------------------------------------------------------------ */}

      <View style={{ flex: 1, }}>
        <ScreenHeader
          onBackPress={() => {
            navigation.goBack();
          }}
          leftIcon
          rightIcon={true}
          navigation={navigation}
          notiCount={classStateData.notification_count > 0 ? classStateData.notification_count : false}
          title={'My Profile'}
          style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

        <ScrollView
          style={{
            // backgroundColor: 'white', 
            marginTop: 10
          }}
          contentContainerStyle={{ paddingBottom: mobileW * 15 / 100 }}
          showsVerticalScrollIndicator={false}>
          <KeyboardAwareScrollView>

            {/* -------------------------------personal-------------------------- */}
            {classStateData.pbtn == true && (
              <View style={{
                backgroundColor: 'white',
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
                      <Image
                        style={{
                          width: (mobileW * 20) / 100,
                          height: (mobileW * 20) / 100,
                          borderRadius: mobileW * 10 / 100,

                          alignSelf: 'center',

                        }}
                        source={classStateData.profile_img == 'NA' ||
                          classStateData.profile_img == null ||
                          classStateData.profile_img == '' ? Icons.ProfileImage :
                          { uri: classStateData.profile_img }}
                      ></Image>
                    </View>
                  </View>

                  <View style={{ width: '70%', alignSelf: 'center', }}>
                    <View style={{
                      width: '100%', alignSelf: 'center',
                      flexDirection: 'row',
                      // backgroundColor: 'red',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        color: Colors.placeholder_text_color,
                        fontFamily: Font.Medium, fontSize: 18,
                        textAlign: config.textRotate,
                      }}>{classStateData.name}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(ScreenReferences.EditProfile);
                        }}
                        style={{
                          flexDirection: 'row',
                          borderColor: '#E2E7EE',
                          borderWidth: 1,
                          borderRadius: 8,
                          width: (mobileW * 18) / 100,
                          height: (mobileW * 6.5) / 100,
                          // alignItems: 'flex-end'
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                        <Image
                          style={{
                            width: (mobileW * 3.2) / 100,
                            height: (mobileW * 3.2) / 100,
                            marginRight: (mobileW * 1.5) / 100,
                            // borderRadius: mobileW * 10 / 100,
                            // alignSelf: 'center',
                          }}
                          source={Icons.EditIcon}
                        ></Image>
                        <Text style={{
                          color: Colors.textblue,
                          fontFamily: Font.Regular, fontSize: 12,
                        }}>Edit</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ width: '100%', alignSelf: 'center', marginTop: mobileW * 1 / 100 }}>
                      <Text
                        style={{
                          color: Colors.textblue,
                          fontFamily: Font.Regular,
                          fontSize: 14, //(mobileW * 3) / 100,
                          textAlign: config.textRotate,
                        }}>{classStateData.speciality}</Text>
                    </View>

                    <View style={{
                      width: '100%',
                      marginTop: mobileW * 2 / 100,
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}>
                        <MaterialCommunityIcons
                          style={{
                          }}
                          name={"email-outline"}
                          size={(mobileW * 4.5) / 100}
                          color={Colors.placeholder_textcolorlight} />


                        <Text
                          style={{
                            color: Colors.placeholder_textcolorlight,
                            fontFamily: Font.Regular,
                            fontSize: 12, //(mobileW * 3) / 100,
                            textAlign: config.textRotate,
                            paddingHorizontal: 8

                          }}>{classStateData.email}</Text>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 8
                      }}>
                        <Feather
                          style={{
                          }}
                          name={"phone"}
                          size={(mobileW * 4.5) / 100}
                          color={Colors.placeholder_textcolorlight} />
                        <Text
                          style={{
                            color: Colors.placeholder_textcolorlight,
                            fontFamily: Font.Regular,
                            fontSize: 12, //(mobileW * 3) / 100,
                            textAlign: config.textRotate,
                            paddingHorizontal: 8
                          }}>{classStateData.phone_number}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{
                  height: 45,
                  marginTop: (mobileW * 10) / 100,
                  paddingLeft: 20,
                  paddingRight: 20
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // backgroundColor: 'red',
                    width: '100%',
                    borderBottomWidth: 1,
                    borderBottomColor: '#DFDFDF',
                    paddingBottom: 17
                  }}>
                    <View style={{
                      width: '32%',
                      justifyContent: 'center',
                      // backgroundColor: 'blue',
                      borderRightWidth: 1,
                      borderRightColor: '#DFDFDF',
                    }}>
                      <Text
                        style={{
                          color: Colors.placeholder_textcolorlight,
                          fontFamily: Font.Regular,
                          fontSize: 12, //(mobileW * 3) / 100,
                          textAlign: config.textRotate,
                        }}>{(classStateData.user_type == "lab") ? 'Established' : 'Experience'}
                      </Text>
                      <Text
                        style={{
                          marginTop: (mobileW * 2) / 100,
                          color: Colors.lightgraytext,
                          fontFamily: Font.Medium,
                          fontSize: 16, //(mobileW * 3) / 100,
                          textAlign: config.textRotate,
                        }}>{classStateData.experience} {(classStateData.user_type == "lab") ? '' : 'YR'}
                      </Text>
                    </View>
                    <View style={{
                      width: '32%',
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderRightColor: '#DFDFDF',
                      paddingLeft: 15
                      // backgroundColor: 'blue'
                    }}>
                      <Text
                        style={{
                          color: Colors.placeholder_textcolorlight,
                          fontFamily: Font.Regular,
                          fontSize: 12, //(mobileW * 3) / 100,
                          textAlign: config.textRotate,
                        }}>{(classStateData.user_type == "lab") ? 'Lab Test' : 'Bookings'}
                      </Text>
                      <Text
                        style={{
                          marginTop: (mobileW * 2) / 100,
                          color: Colors.lightgraytext,
                          fontFamily: Font.Medium,
                          fontSize: 16, //(mobileW * 3) / 100,
                          textAlign: config.textRotate,
                        }}>{(classStateData.user_type == "lab") ? classStateData.lab_test_count : classStateData.booking_count}
                      </Text>
                    </View>
                    <View style={{
                      width: '32%',
                      justifyContent: 'center',
                      paddingLeft: 15
                      // backgroundColor: 'blue'
                    }}>
                      <Text
                        style={{
                          color: Colors.placeholder_textcolorlight,
                          fontFamily: Font.Regular,
                          fontSize: 12, //(mobileW * 3) / 100,
                          textAlign: config.textRotate,
                        }}>Rating
                      </Text>
                      <View style={{
                        marginTop: (mobileW * 2) / 100,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        <AntDesign
                          style={{
                            alignSelf: 'center',
                            marginRight: (mobileW * 1) / 100,
                          }}
                          name={"star"}
                          size={(mobileW * 4) / 100}
                          color={"#FFA800"} />
                        <Text
                          style={{
                            color: Colors.lightgraytext,
                            fontFamily: Font.Medium,
                            fontSize: 16, //(mobileW * 3) / 100,
                            textAlign: config.textRotate,
                          }}>{classStateData.avg_rating}.0
                        </Text>
                      </View>

                    </View>
                  </View>
                </View>

                <View style={{
                  marginTop: (mobileW * 5) / 100,
                  marginBottom: (mobileW * 5) / 100,
                  paddingLeft: 20,
                  paddingRight: 20
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // backgroundColor: 'red',
                    width: '100%',
                  }}>
                    <Text style={[Styles.textcontent, {
                      fontSize: mobileW * 3 / 100,
                      color: Colors.lightgraytext
                    }]}>{classStateData.description}</Text>
                  </View>
                </View>


              </View>
            )}

            <View style={{
              backgroundColor: 'white',
              marginTop: 10,
              padding: 20,
            }}>
              <Text style={Styles.textheading}>Important Details</Text>
              {
                (classStateData.user_type == "lab") ?
                  <>
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                        // backgroundColor: 'red'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Health Registration ID</Text>
                      </View>
                      <View style={{
                        // backgroundColor: 'blue'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{classStateData.hosp_moh_lic_no}</Text>
                      </View>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                        // backgroundColor: 'red'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Registration Number</Text>
                      </View>
                      <View style={{
                        // backgroundColor: 'blue'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{classStateData.hosp_reg_no}</Text>
                      </View>
                    </View>
                  </> :
                  <>
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                        // backgroundColor: 'red'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Speciality</Text>
                      </View>
                      <View style={{
                        // backgroundColor: 'blue'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{classStateData.speciality}</Text>
                      </View>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                        // backgroundColor: 'red'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Identity Number</Text>
                      </View>
                      <View style={{
                        // backgroundColor: 'blue'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{classStateData.id_number}</Text>
                      </View>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                        // backgroundColor: 'red'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>Qualification</Text>
                      </View>
                      <View style={{
                        // backgroundColor: 'blue'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{classStateData.qualification}</Text>
                      </View>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'space-between'
                    }}>
                      <View style={{
                        // backgroundColor: 'red'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.tabtextcolor
                        }}>SCFHS Registration ID</Text>
                      </View>
                      <View style={{
                        // backgroundColor: 'blue'
                      }}>
                        <Text style={{
                          fontFamily: Font.Regular,
                          fontSize: 14,
                          color: Colors.textblue
                        }}>{classStateData.scfhs_number}</Text>
                      </View>
                    </View>
                  </>
              }
            </View>

            <View style={{
              backgroundColor: 'white',
              height: 200,
              marginTop: 10,
              padding: 20,
            }}>
              <Text style={Styles.textheading}>Document</Text>
              <View style={{
                flexDirection: 'row',
                marginTop: 20,
                // justifyContent: 'space-between'
              }}>
                {
                  (classStateData.user_type == "lab") ?
                    <>
                      <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 8,
                        borderColor: '#DFDFDF',
                        borderWidth: 1,
                        borderRadius: 10,
                        marginLeft: 10
                      }}>
                        <Image
                          style={{
                            width: (mobileW * 20) / 100,
                            height: (mobileW * 20) / 100,
                            // borderRadius: mobileW * 10 / 100,
                            marginBottom: 10,
                            alignSelf: 'center',

                          }}
                          source={classStateData.moh_lic_image == 'NA' ||
                            classStateData.moh_lic_image == null ||
                            classStateData.moh_lic_image == '' ? Icons.Prescription :
                            { uri: config.img_url3 + classStateData.moh_lic_image.filename }}
                        ></Image>
                        <Text>{classStateData.hosp_moh_lic_no}</Text>
                      </View>

                      <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 8,
                        borderColor: '#DFDFDF',
                        borderWidth: 1,
                        borderRadius: 10,
                        marginLeft: 10
                      }}>
                        <Image
                          style={{
                            width: (mobileW * 20) / 100,
                            height: (mobileW * 20) / 100,
                            // borderRadius: mobileW * 10 / 100,
                            marginBottom: 10,
                            alignSelf: 'center',

                          }}
                          source={classStateData.hosp_reg_image == 'NA' ||
                            classStateData.hosp_reg_image == null ||
                            classStateData.hosp_reg_image == '' ? Icons.Prescription :
                            { uri: config.img_url3 + classStateData.hosp_reg_image.filename }}
                        ></Image>
                        <Text>{classStateData.hosp_reg_no}</Text>
                      </View>
                    </> :
                    <>
                      <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 8,
                        borderColor: '#DFDFDF',
                        borderWidth: 1,
                        borderRadius: 10
                      }}>
                        <Image
                          style={{
                            width: (mobileW * 20) / 100,
                            height: (mobileW * 20) / 100,
                            // borderRadius: mobileW * 10 / 100,
                            marginBottom: 10,
                            alignSelf: 'center',

                          }}
                          source={classStateData.id_image == 'NA' ||
                            classStateData.id_image == null ||
                            classStateData.id_image == '' ? Icons.Prescription :
                            { uri: config.img_url3 + classStateData.id_image.filename }}
                        ></Image>
                        <Text>{classStateData.id_number}</Text>
                      </View>

                      <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 8,
                        borderColor: '#DFDFDF',
                        borderWidth: 1,
                        borderRadius: 10,
                        marginLeft: 10
                      }}>
                        <Image
                          style={{
                            width: (mobileW * 20) / 100,
                            height: (mobileW * 20) / 100,
                            // borderRadius: mobileW * 10 / 100,
                            marginBottom: 10,
                            alignSelf: 'center',

                          }}
                          source={classStateData.certificate == 'NA' ||
                            classStateData.certificate == null ||
                            classStateData.certificate == '' ? Icons.Prescription :
                            { uri: config.img_url3 + classStateData.certificate.filename }}
                        ></Image>
                        <Text>{classStateData.qualification}</Text>
                      </View>

                      <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 8,
                        borderColor: '#DFDFDF',
                        borderWidth: 1,
                        borderRadius: 10,
                        marginLeft: 10
                      }}>
                        <Image
                          style={{
                            width: (mobileW * 20) / 100,
                            height: (mobileW * 20) / 100,
                            // borderRadius: mobileW * 10 / 100,
                            marginBottom: 10,
                            alignSelf: 'center',

                          }}
                          source={classStateData.scfhs_image == 'NA' ||
                            classStateData.scfhs_image == null ||
                            classStateData.scfhs_image == '' ? Icons.Prescription :
                            { uri: config.img_url3 + classStateData.scfhs_image.filename }}
                        ></Image>
                        <Text>{classStateData.scfhs_number}</Text>
                      </View>
                    </>
                }


              </View>
            </View>

            <DashBoardBox
              textTitle={'Schedule Availability'}
              // textInfo={item?.details}
              infoIcon={''}
              rightText={"Edit"}
              isBorder={false}
              isMargin={true}
              onPress={() => {
                navigation.navigate(ScreenReferences.AvailabilityScheduleTabStack);
              }}
            />
            <DashBoardBox
              textTitle={(classStateData.user_type == "lab") ? 'Tests & Packages' : 'Price List'}
              // textInfo={item?.details}
              infoIcon={''}
              rightText={"Edit"}
              isBorder={true}
              isMargin={false}
              onPress={() => {
                navigation.navigate(ScreenReferences.PriceListTabStack);
              }}
            />

          </KeyboardAwareScrollView>
        </ScrollView>
      </View>

    </View>
  );
}