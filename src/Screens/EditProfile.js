import { Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, Modal, FlatList, Keyboard, Platform, Dimensions } from 'react-native';
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

export default EditProfile = ({navigation, route}) => {

  const [classStateData, setClassStateData] = useState({
    speciality: '',
    pbtn: true,
    mabtn: false,
    mbtn: false,
    lbtn: false,
    country_code: '',
    febtn: false,
    country_codefocus: false,
    allergies: 'No',
    work_area: '',
    yesNoModal: false,
    smoking_btn: true,
    smoking: '',
    alcohol: '',

    nationalityModal: false,
    nationality_arr: "",


    bloodModal: false,
    bloodModal_arr: bloodModal_arr,

    occupation_arr: occupation_arr,
    activity_arr: activity_arr,
    food_arr: food_arr,
    activity_level: '',
    food: '',
    occupation: '',
    occ_food_activity: 'activity',
    occ_food_activitymodal: false,
    occ_food_activity_arr: activity_arr,

    namefocus: false,
    name: '',
    emailfocus: false,
    email: '',
    numberfocus: false,
    number: '',
    dobfocus: false,
    dob: '',
    nationalityfocus: false,
    nationality: '',
    addressfocus: false,
    address: '',
    identityfocus: false,
    id_number: '',

    allergiesfocus: false,
    allergie: '',
    currentfocus: false,
    current: '',
    pastfocus: false,
    past: '',
    injuriesfocus: false,
    injuries: '',
    sugeriesfocus: false,
    sugeries: '',
    chronicfocus: false,
    chronic: '',
    blood_group: '',
    name: '',

    mobile: '',
    address: '',
    hosp_moh_lic_no: '',
    hosp_reg_no: '',
    profile_img: 'NA',
    id_number: '',
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
    specialityArr: [],
    mediamodal: false,
    showSpeciality: false,

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
      get_all_notification()
      get_speciality()
    });
  }, [])

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  

  get_all_notification = async () => {
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

  get_all_nationlity = async () => {
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

  getProfile = async () => {
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
        console.log('result.nationality',)
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
          identityfocus: true,
          namefocus: true,
          emailfocus: true,

        }, () => {
          console.log("id_image:: ", classStateData.id_image);
          console.log("certificate:: ", classStateData.certificate);
          console.log("scfhs_image:: ", classStateData.scfhs_image);
        })

        if (result['phone_number'] != null && result['phone_number'] != '') {
          setState({ mobile: result['phone_number'], numberfocus: true })
        }
        if (result['address'] != null && result['address'] != '') {
          setState({ addressfocus: true })
        }

        if (result['dob'] != null && result['dob'] != '') {
          setState({ dob_date: result['dob'], dobfocus: true })
        }

        if (result.nationality != null && result.nationality != '') {

          setState({ nationality: result['nationality'], nationalityfocus: true })
        }
        if (result['gender'] != null && result['gender'] != '') {
          setState({
            gender: result['gender'],
            febtn: (result['gender'] == 'Female') ? true : false,
            mabtn: (result['gender'] == 'Male') ? true : false,
          })
          // if (result['gender'] == 'Female') {
          //   setState({ febtn: true })
          // }
          // else {
          //   setState({ mabtn: true })
          // }
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

  medical_click = async () => {
    let user_id = loginUserData['user_id']
    let url = Configurations.baseURL + "api-edit-patient-profile-medical";
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
        dispatch(setUserLoginData(obj.result))
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

  submit_click = async () => {
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


    // {"service _type":"nurse",
    // "user_id":"39",
    // "email":"sunidhi@gmail.com",
    // "first_name": "Sramana",
    // "last_name": "",
    // "speciality":"Trainee Nurse",
    // "image": "profile7.jpg",
    //  "phone_number": "9636323627",
    //  "dob": "1999-03-16",
    //  "gender": "Female",
    //  "id_number": "00000",
    //  "id_image": "imagename",
    //  "description":"Content" 
    //  "experience": "10", 
    //  "certificate": image,
    //  "qualification":"MA",
    //  "scfhs_number":"00000",
    //  "scfhs_image":"imagename"}

    // name: result['first_name'],
    // email: result['email'],
    // emailfocusget: true,
    // user_id: result['user_id'],
    // country_code: result['country_code'],
    // work_area: result['work_area'],
    // address: result['address'],
    // description: result['description'],
    // id_number: result['id_number'],
    // speciality: result['speciality'],
    // qualification: result['qualification'],
    // experience: result['experience'],
    // scfhs_number: result['scfhs_number'],
    // id_image: { filename: result['id_image'] },
    // certificate: { filename: result['qualification_certificate'] },
    // scfhs_image: { filename: result['scfhs_image'] },


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
    // data.append('moh_lic_image', classStateData.moh_lic_image.filename)
    // data.append('hosp_reg_image', classStateData.hosp_reg_image.filename)
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
  lifestyle_click = async () => {
    let user_id = loginUserData['user_id']



    if (classStateData.smoking.length <= 0) {
      MessageFunctions.toast(MessageTexts.smoking_msg[Configurations.language], 'center')
      return false;
    }
    if (classStateData.alcohol.length <= 0) {
      MessageFunctions.toast(MessageTexts.alcohal_msg[Configurations.language], 'center')
      return false;
    }
    if (classStateData.blood_group.length <= 0) {
      MessageFunctions.toast(MessageTexts.bloodgrp_msg[Configurations.language], 'center')
      return false;
    }
    if (classStateData.activity_level.length <= 0) {
      MessageFunctions.toast(MessageTexts.activity_level[Configurations.language], 'center')
      return false;
    }
    if (classStateData.food.length <= 0) {
      MessageFunctions.toast(MessageTexts.food_preferance[Configurations.language], 'center')
      return false;
    }
    if (classStateData.occupation.length <= 0) {
      MessageFunctions.toast(MessageTexts.occuation[Configurations.language], 'center')
      return false;
    }
    
    let url = Configurations.baseURL + "api-edit-patient-profile-style";
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
        dispatch(setUserLoginData(obj.result))
      } else {
        MessageFunctions.toast(obj.message, 'center')
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)

    });

  }

  get_speciality = async () => {
    let user_id = loginUserData['user_id']
    let user_type = loginUserData['user_type']

    let url = Configurations.baseURL + "api-provider-get-speciality";
    console.log("url", url)
    var data = new FormData();
    data.append('service_type', user_type)


    API.post(url, data).then((obj) => {
      //API.get(url, 1).then((obj) => {

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

  renderIDNumber = () => {
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
            // borderColor: classStateData.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
            // borderWidth: 1,
            // borderRadius: (mobileW * 1) / 100,
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
              {(classStateData.id_image != undefined) ? classStateData.id_image.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  renderSpeExpCer = () => {
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

  renderExpRegid = () => {
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

  renderExpCer = () => {
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

  renderExp = () => {
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

  renderHealthIDNumber = () => {
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

  renderCRC = () => {
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
            // isVisible={classStateData.isDatePickerVisibletwo}
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
          // locale="ko"
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

      {/* //------------------------nationality modal----- */}

      {/* -------------------Yes No MOdal----------------------- */}

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
                      textAlign: Configurations.textRotate,
                      fontFamily: Font.Regular,
                      fontSize: (mobileW * 4) / 100,
                      alignSelf: 'center',
                      color: Colors.textwhite,
                    }}>
                    {LanguageConfiguration.nationality[Configurations.language]}
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
                            nationalityfocus: true
                          });
                        }}
                      >
                        <View style={{ width: '100%', backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'flex-end' }}>
                          <View style={{ width: '95%', borderBottomColor: '#0000001F', borderBottomWidth: 1, paddingVertical: mobileW * 2 / 100, marginLeft: mobileW * 5 / 100 }}>
                            <Text
                              style={{
                                color: Colors.textblack,
                                fontSize: (mobileW * 4) / 100,
                                textAlign: Configurations.textRotate
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
                    textAlign: Configurations.textRotate,
                    fontFamily: Font.Regular,
                    fontSize: (mobileW * 4) / 100,

                    color: Colors.textwhite,
                  }}>
                  {classStateData.occ_food_activity == 'activity' ? LanguageConfiguration.ActivityLevel[Configurations.language] : classStateData.occ_food_activity == 'food' ? LanguageConfiguration.FoodPreference[Configurations.language] : LanguageConfiguration.Occupation[Configurations.language]}
                </Text>
              </View>
            </View>
            <View style={{ width: '100%', alignSelf: 'center' }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: mobileW * 4 / 100 }}
                data={classStateData.occ_food_activity_arr}
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
                            <Text style={{ color: Colors.textblack, fontSize: mobileW * 4 / 100, textAlign: Configurations.textRotate }}>{item.name}</Text>
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

              <Text style={{ paddingLeft: mobileW * 4.5 / 100, paddingRight: mobileW * 4.5 / 100, textAlign: Configurations.textRotate, fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.textwhite }}>{LanguageConfiguration.blood[Configurations.language]}</Text>

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
                          <Text style={{ color: Colors.textblack, fontSize: mobileW * 4 / 100, paddingLeft: mobileW * 2 / 100, textAlign: Configurations.textRotate }}>{item.blood}</Text>
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
          title={LanguageConfiguration.EditProfile[Configurations.language]}
          style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />
        <ScrollView
          style={{ backgroundColor: 'white', marginTop: 10 }}
          contentContainerStyle={{ paddingBottom: mobileW * 15 / 100 }}
          showsVerticalScrollIndicator={false}>
          <KeyboardAwareScrollView>
            {/* //----------------------------------------------------------------------------tab */}
            <CameraGallery mediamodal={classStateData.mediamodal}
              isCamera={true}
              isGallery={true}
              isDocument={false}
              Camerapopen={() => { Camerapopen() }}
              Galleryopen={() => { Galleryopen() }}
              Canclemedia={() => { setState({ mediamodal: false }) }}
            />
            {/* <View
                style={{
                  backgroundColor: "#F1F2F4",
                  width: '100%',

                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setState({ pbtn: true, mbtn: false, lbtn: false });
                  }}
                  style={{ width: '33%', alignSelf: 'center', }}>
                  <View style={{ width: '100%', }}>
                    <Text
                      style={
                        classStateData.pbtn == true
                          ? {
                            color: Colors.textblue,

                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: Configurations.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                          : {
                            color: Colors.tablightcolo,
                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: Configurations.textalign,
                            alignSelf: 'center',
                          }
                      }>
                      {LanguageConfiguration.tabnameprofile[Configurations.language]}
                    </Text>


                    <View style={classStateData.pbtn == true ? { width: mobileW * 28 / 100, alignSelf: 'center', borderWidth: 2.2, borderColor: Colors.bordercolorblue, borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.bordercolorblue, alignSelf: 'center' } : { width: mobileW * 30 / 100, alignSelf: 'center', borderColor: Colors.tab_background_color, borderWidth: 2.5 }}></View>

                  </View>


                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setState({ pbtn: false, mbtn: true, lbtn: false });
                  }}
                  style={{ width: '33%' }}>
                  <View style={{ width: '100%' }}>
                    <Text
                      style={
                        classStateData.mbtn == true
                          ? {
                            color: Colors.textblue,

                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: Configurations.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                          : {
                            color: Colors.tablightcolo,
                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: Configurations.textalign,
                            alignSelf: 'center',
                          }
                      }>
                      {LanguageConfiguration.tabnamemedical[Configurations.language]}
                    </Text>
                    <View style={classStateData.mbtn == true ? { width: mobileW * 28 / 100, alignSelf: 'center', borderWidth: 2.2, borderColor: Colors.bordercolorblue, borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.bordercolorblue, alignSelf: 'center' } : { width: mobileW * 30 / 100, alignSelf: 'center', borderColor: Colors.tab_background_color, borderWidth: 2.5 }}></View>



                  </View>


                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setState({ pbtn: false, mbtn: false, lbtn: true });
                  }}
                  style={{ width: '33%' }}>
                  <View style={{ width: '100%', }}>
                    <Text
                      style={
                        classStateData.lbtn == true
                          ? {
                            color: Colors.textblue,

                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: Configurations.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                          : {
                            color: Colors.tablightcolo,
                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: Configurations.textalign,
                            alignSelf: 'center',
                          }
                      }>
                      {LanguageConfiguration.tabnamelifestyle[Configurations.language]}
                    </Text>
                  </View>

                  <View style={classStateData.lbtn == true ? { width: mobileW * 28 / 100, alignSelf: 'center', borderWidth: 2.2, borderColor: Colors.bordercolorblue, borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.bordercolorblue, alignSelf: 'center' } : { width: mobileW * 30 / 100, alignSelf: 'center', borderColor: Colors.tab_background_color, borderWidth: 2.5 }}></View>
                </TouchableOpacity>
              </View> */}


            {/* -------------------------------personal-------------------------- */}
            {classStateData.pbtn == true && (
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
                    borderColor: Colors.placeholder_border, // classStateData.namefocus == true ? Colors.placholderactive : Colors.placeholder_border,
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

                {/* ---------------------------------------------------------------------------textinput */}

                {/* --------------------------------------------------name */}


                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                    // borderColor: classStateData.namefocus == true ? Colors.placholderactive : Colors.placeholder_border,
                    // borderWidth: 1,
                    // borderRadius: mobileW * 1 / 100,
                  }}>
                  <AuthInputBoxSec
                    mainContainer={{
                      width: '100%',
                    }}
                    // icon={layer9_icon}
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
                      //passwordInput.focus();
                    }}
                  />
                  {/* <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: Configurations.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={50}
                        placeholder={classStateData.namefocus != true ? LanguageConfiguration.textinputname[Configurations.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { setState({ name: txt }) }}
                        value={classStateData.name}
                        onFocus={() => { setState({ namefocus: true }) }}
                        onBlur={() => { setState({ namefocus: classStateData.name.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      /> */}
                  {/* {classStateData.namefocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textalign, }}>{LanguageConfiguration.textinputname[Configurations.language]}</Text>
                    </View>} */}

                </View>

                {/* -----------------------------------------------------------------------------mo no- */}
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
                    // setState({ bloodModal: true });
                  }}
                  isDisabled={true}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', width: mobileW * 90 / 100, justifyContent: 'space-between', alignSelf: 'center', }}>
                  <View
                    style={{
                      width: '20%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 3) / 100,
                      // borderColor: classStateData.country_code.length > 0 ? '#0057A5' : Colors.placeholder_border,
                      // borderWidth: 1,
                      // borderRadius: (mobileW * 1) / 100,
                    }}>
                    <AuthInputBoxSec
                      mainContainer={{
                        width: '100%',
                      }}
                      inputFieldStyle={{
                        textAlign: 'center',
                        marginBottom: (mobileW * 4) / 100,
                      }}
                      // icon={layer9_icon}
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
                    {/* <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: 'center',
                          height: Font.placeholder_height,
                          fontFamily: Font.placeholderfontfamily,

                        }}
                        maxLength={3}
                        editable={false}
                        placeholder={
                          classStateData.country_codefocus != true
                            ? LanguageConfiguration.CC_code[Configurations.language]
                            : null
                        }
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={txt => {
                          setState({ country_code: txt });
                        }}

                        onFocus={() => {
                          setState({ country_codefocus: true });
                        }}
                        onBlur={() => {
                          setState({
                            country_codefocus: classStateData.country_code.length > 0 ? true : false,
                          });
                        }}

                        value={"" + classStateData.country_code + ""}
                        keyboardType="number-pad"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        onSubmitEditing={() => { Keyboard.dismiss() }}
                      />

                      {classStateData.country_code.length > 0 &&
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: 'white',
                            left: (mobileW * 5) / 100,
                            top: (-mobileW * 2) / 100,
                            paddingHorizontal: (mobileW * 1) / 100,
                          }}>
                          <Text style={{ color: '#0057A5' }}>
                            {LanguageConfiguration.CC_code[Configurations.language]}
                          </Text>
                        </View>
                      } */}
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
                      // icon={layer9_icon}
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
                        //passwordInput.focus();
                      }}
                    />
                    <View
                      style={{
                        width: '89%',
                        // alignSelf: 'center',
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
                {/* //---------------email */}


                <View style={{
                  width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
                  //borderColor: classStateData.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                }}>
                  <AuthInputBoxSec
                    mainContainer={{
                      width: '100%',
                    }}
                    // icon={layer9_icon}
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
                      // mobileInput.focus();
                    }}
                  />
                  {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                    
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: Configurations.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={100}
                        placeholder={classStateData.emailfocus != true ? LanguageConfiguration.textinputemails[Configurations.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { setState({ email: txt }) }}
                        value={classStateData.email}
                        editable={false}
                        onFocus={() => { setState({ emailfocus: true }) }}
                        onBlur={() => { setState({ emailfocus: classStateData.email.length > 0 ? true : false }) }}
                        keyboardType='email-address'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {classStateData.emailfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.textinputemails[Configurations.language]}</Text>
                    </View>} */}

                </View>


                {/* ------------------------------------------------------------dob-----------      */}
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

                {/* <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100, flexDirection: 'row',
                    borderColor: classStateData.dobfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <TouchableOpacity onPress={() => { setState({ isDatePickerVisibletwo: true }) }} style={{ width: '100%', flexDirection: 'row' }}>
                      <View style={{ width: '1%' }}>
                      </View>
                      <View style={{ width: '100%', height: Font.placeholder_height, marginLeft: mobileW * 2 / 100, alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ width: '78%', textAlign: Configurations.textRotate, color: Colors.placeholder_text }}>{classStateData.dob_date.length <= 0 ? LanguageConfiguration.dob[Configurations.language] : classStateData.dob_date}</Text>
                        <View style={{ width: '15%', alignSelf: 'center', alignItems: 'flex-end' }}>

                          <Image source={Icons.DatePicker}
                            style={{ height: 25, width: 25 }}>
                          </Image>
                        </View>
                      </View>


                    </TouchableOpacity>

                    {classStateData.dobfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.dob[Configurations.language]}</Text>
                    </View>}

                  </View> */}
                {/* -----------------------------------radiobtn------------------------------- */}
                {
                  (classStateData.user_type == "lab") &&
                  <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
                    //borderColor: classStateData.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <AuthInputBoxSec
                      mainContainer={{
                        width: '100%',
                      }}
                      // icon={layer9_icon}
                      lableText={LanguageConfiguration.textinputaddress[Configurations.language]}
                      inputRef={(ref) => {
                        addressInput = ref;
                      }}
                      maxLength={50}
                      onChangeText={(text) =>
                        setState({ address: text })
                      }
                      value={classStateData.address}
                      // editable={false}
                      keyboardType="default"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        // mobileInput.focus();
                      }}
                    />


                  </View>
                }

                {/* -----------------------------------radiobtn------------------------------- */}
                {
                  (classStateData.user_type != "lab") &&
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
                          {/* {classStateData.mabtn == false && */}
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
                          // justifyContent:'space-between'
                        }}>
                        <View style={{ width: '100%', alignSelf: 'center', marginLeft: mobileW * 2 / 100 }}>
                          {/* {classStateData.febtn == false && */}
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
                {/* <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 3.2) / 100,
                      marginBottom: (mobileW * 2 / 100),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{ width: '23%' }}>
                      <Text
                        style={{
                          color: Colors.textGender,
                          fontFamily: Font.placeholderfontfamily,
                          fontSize: (mobileW * 4.1) / 100,
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
                          {classStateData.mabtn == false &&
                            <TouchableOpacity onPress={() => { setState({ mabtn: true, febtn: false, gender: 'Male' }); }}
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                flexDirection: 'row',
                              }}>
                              <Icon style={{ alignSelf: 'center' }}
                                name="circle-thin"
                                size={22}
                                color={'#8F98A7'}></Icon>

                              <View style={{ width: '70%', alignSelf: 'center' }}>
                                <Text
                                  style={{
                                    color: Colors.textGender,
                                    fontSize: mobileW * 4.1 / 100,
                                    fontFamily: Font.placeholderfontfamily,
                                    marginLeft: mobileW * 1.5 / 100,
                                    textAlign: Configurations.textRotate

                                  }}>
                                  {LanguageConfiguration.male[Configurations.language]}
                                </Text>
                              </View>
                            </TouchableOpacity>}
                          {classStateData.mabtn == true &&
                            <View
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>

                              <Icon style={{ alignSelf: 'center' }}
                                name="dot-circle-o"
                                size={22}
                                color={'#0168B3'}></Icon>
                              <View style={{ width: '70%', alignSelf: 'center' }}>
                                <Text
                                  style={{
                                    color: Colors.textGender,
                                    fontSize: mobileW * 4.1 / 100,
                                    fontFamily: Font.placeholderfontfamily,
                                    marginLeft: mobileW * 1.5 / 100,
                                    textAlign: Configurations.textRotate

                                  }}>
                                  {LanguageConfiguration.male[Configurations.language]}
                                </Text>
                              </View>
                            </View>}


                        </View>


                      </View>

                      <View
                        style={{
                          width: '33%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          alignItems: 'center',
                          // justifyContent:'space-between'
                        }}>
                        <View style={{ width: '100%', alignSelf: 'center', marginLeft: mobileW * 2 / 100 }}>
                          {classStateData.febtn == false &&
                            <TouchableOpacity onPress={() => { setState({ febtn: true, mabtn: false, gender: 'Female' }) }}
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                flexDirection: 'row',
                                alignItems: 'center'
                              }}>
                              <Icon style={{ alignSelf: 'center' }}
                                name="circle-thin"
                                size={22}
                                color={'#8F98A7'}></Icon>

                              <Text
                                style={{
                                  color: Colors.textGender,
                                  textAlign: Configurations.textRotate,
                                  fontSize: mobileW * 4.1 / 100,
                                  fontFamily: Font.placeholderfontfamily,
                                  marginLeft: mobileW * 1.5 / 100
                                  // alignSelf: 'center',
                                }}>
                                {LanguageConfiguration.female[Configurations.language]}
                              </Text>

                            </TouchableOpacity>}
                          {classStateData.febtn == true &&
                            <View
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Icon style={{ alignSelf: 'center' }}
                                name="dot-circle-o"
                                size={22}
                                color={'#0168B3'}

                              ></Icon>
                              <Text
                                style={{
                                  color: Colors.textGender,
                                  textAlign: Configurations.textRotate,
                                  fontSize: mobileW * 4.1 / 100,
                                  fontFamily: Font.placeholderfontfamily,
                                  marginLeft: mobileW * 1.5 / 100
                                  // alignSelf: 'center',
                                }}>
                                {LanguageConfiguration.female[Configurations.language]}
                              </Text>

                            </View>}


                        </View>



                      </View>
                    </View>
                  </View> */}


                {/* ================================nationality======================================= */}
                {/* <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100, flexDirection: 'row',
                    borderColor: classStateData.nationalityfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <TouchableOpacity onPress={() => { setState({ nationalityModal: true }); }}>
                      <View style={{
                        width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: Font.placeholder_height,
                        borderRadius: mobileW * 1 / 100, justifyContent: 'center'
                      }}>
                        <View style={{ width: '1%' }}>

                        </View>
                        <Text style={{ width: '77%', alignSelf: 'center', color: Colors.textblack, fontSize: Font.placeholdersize, textAlign: Configurations.textRotate, fontFamily: Font.placeholderfontfamily }}>{classStateData.nationality.length <= 0 ? LanguageConfiguration.nationality[Configurations.language] : classStateData.nationality}</Text>
                        <View style={{ width: '20%', alignSelf: 'center', alignItems: 'flex-end' }}>
                          <Image source={Icons.DownArrow} style={{ height: 16, width: 16 }}>
                          </Image>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {classStateData.nationalityfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textRotate }}>{LanguageConfiguration.nationality[Configurations.language]}</Text>
                    </View>}
                  </View> */}




                {/* ===================================address==================================== */}
                {/* <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
                    borderColor: classStateData.addressfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: Configurations.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={50}
                        placeholder={classStateData.addressfocus != true ? LanguageConfiguration.textinputaddress[Configurations.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { setState({ address: txt }) }}
                        value={classStateData.address}
                        onFocus={() => { setState({ addressfocus: true }) }}
                        onBlur={() => { setState({ addressfocus: classStateData.address.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {classStateData.addressfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.textinputaddress[Configurations.language]}</Text>
                    </View>}

                  </View> */}

                {/* =================================identity================================ */}
                {/* <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
                    borderColor: classStateData.identityfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: Configurations.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={15}
                        placeholder={classStateData.identityfocus != true ? LanguageConfiguration.textinputidentity[Configurations.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { setState({ identity: txt }) }}
                        value={classStateData.identity}
                        onFocus={() => { setState({ identityfocus: true }) }}
                        onBlur={() => { setState({ identityfocus: classStateData.identity.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {classStateData.identityfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.textinputidentity[Configurations.language]}</Text>
                    </View>}

                  </View> */}

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
                      // marginTop: mobileW * 1 / 100,
                      // backgroundColor: 'red',
                      width: '100%',
                      height: mobileW * 30 / 100,
                      color: Colors.textblack,
                      fontSize: Font.placeholdersize,
                      textAlign: Configurations.textalign,
                      fontFamily: Font.placeholderfontfamily,
                      textAlignVertical: 'top',
                      alignSelf: 'flex-start'
                      // paddingVertical: mobileW * 3 / 100,

                    }}
                    // icon={layer9_icon}
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
                  // onSubmitEditing={() => {
                  //   emailInput.focus();
                  // }}
                  />
                </View>

                {/* ==========================================person btn================================ */}
                <Button
                  text={LanguageConfiguration.submitbtntext[Configurations.language]}
                  // onLoading={classStateData.loading}
                  customStyles={
                    {
                      // mainContainer: styles.butonContainer
                    }
                  }
                  onPress={() => submit_click()}
                // isBlank={false}
                />

              </View>
            )}


            {/* ----------------------------------------------------------------------------------------------medical btn */}


            {classStateData.mbtn == true && (
              <View>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.tab_background_color
                  }}>
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 2) / 100,
                      paddingBottom: (mobileW * 3) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.allergic_heading_color,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate,
                        // textAlign:Configurations.textalign,
                      }}>
                      {LanguageConfiguration.allergies[Configurations.language]}
                    </Text>
                  </View>
                </View>

                <View style={{ width: '90%', alignSelf: 'center', marginTop: (mobileW * 2) / 100, }}>
                  <Text
                    style={{
                      color: Colors.textgray_que,
                      fontFamily: Font.allergies_heading_fontfamily,
                      fontSize: Font.quessize,
                      textAlign: Configurations.textRotate,
                      // textAlign:Configurations.textalign,


                    }}>
                    {LanguageConfiguration.q1[Configurations.language]}
                  </Text>
                </View>

                <View
                  style={{
                    width: '88%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 3) / 100,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { setalergy('Yes') }}
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View
                        style={{
                          width: mobileW * 5 / 100,
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon
                          name={classStateData.allergies == 'Yes' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}
                        >
                        </Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          alignSelf: 'center',
                          fontFamily: Font.allergies_heading_fontfamily
                        }}>
                        {LanguageConfiguration.yes_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.9} onPress={() => { setalergy('No'); }}
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon name={classStateData.allergies == 'No' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}></Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          fontFamily: Font.allergies_heading_fontfamily,
                          alignSelf: 'center',
                        }}>
                        {LanguageConfiguration.no_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                  {classStateData.allergies == 'Yes' &&

                    <View
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 6) / 100,
                        borderColor: classStateData.allergiesfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                        borderWidth: mobileW * 0.3 / 100,
                        borderRadius: (mobileW * 1) / 100
                      }}>


                      <View style={{ width: '95%', alignSelf: 'center' }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.textblack,
                            fontSize: Font.placeholdersize,
                            textAlign: Configurations.textalign,
                            height: (mobileW * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (mobileW * 1) / 100,

                          }}
                          maxLength={70}
                          placeholder={classStateData.allergiesfocus != true ? LanguageConfiguration.textinputallierdies[Configurations.language] : null}
                          placeholderTextColor={Colors.placeholder_text}
                          onChangeText={(txt) => { setState({ allergies_data: txt }) }}
                          value={classStateData.allergies_data}
                          onFocus={() => { setState({ allergiesfocus: true }) }}
                          onBlur={() => { setState({ allergiesfocus: classStateData.allergies_data.length > 0 ? true : false }) }}

                          returnKeyLabel="done"
                          returnKeyType="done"
                        />
                      </View>
                      {classStateData.allergiesfocus == true && (
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: 'white',
                            left: (mobileW * 4) / 100,
                            top: (-mobileW * 2) / 100,
                            paddingHorizontal: (mobileW * 1) / 100,
                          }}>
                          <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.textinputallierdies[Configurations.language]}</Text>
                        </View>
                      )}

                    </View>
                  }
                </View>
                {/* ---------------------------------------------------------------------------------------q2 */}

                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.tab_background_color
                  }}>
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 2) / 100,
                      paddingBottom: (mobileW * 3) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.allergic_heading_color,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate,

                      }}>
                      {LanguageConfiguration.current[Configurations.language]}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.textgray_que,
                      fontFamily: Font.allergies_heading_fontfamily,
                      fontSize: Font.quessize,
                      textAlign: Configurations.textRotate,

                    }}>
                    {LanguageConfiguration.q2[Configurations.language]}
                  </Text>
                </View>

                <View
                  style={{
                    width: '88%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 3) / 100,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    setcurrentmadiciens('Yes')
                  }}
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View

                        style={{
                          width: mobileW * 5 / 100,
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon
                          name={classStateData.current_medication == 'Yes' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}
                        >
                        </Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          alignSelf: 'center',
                          fontFamily: Font.allergies_heading_fontfamily
                        }}>
                        {LanguageConfiguration.yes_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    setcurrentmadiciens('No')
                  }}
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View

                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon
                          name={classStateData.current_medication == 'No' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}></Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          fontFamily: Font.allergies_heading_fontfamily,
                          alignSelf: 'center',
                        }}>
                        {LanguageConfiguration.no_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                  {classStateData.current_medication == 'Yes' && <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 5) / 100,
                      borderColor: classStateData.currentfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                      borderWidth: 1,
                      borderRadius: (mobileW * 1) / 100,
                    }}>





                    <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: Configurations.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={50}
                        placeholder={classStateData.currentfocus != true ? LanguageConfiguration.textinputcurrent[Configurations.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { setState({ current_medication_data: txt }) }}
                        value={classStateData.current_medication_data}
                        onFocus={() => { setState({ currentfocus: true }) }}
                        onBlur={() => { setState({ currentfocus: classStateData.current_medication_data.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {classStateData.currentfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.textinputcurrent[Configurations.language]}</Text>
                    </View>}




                  </View>}
                </View>

                {/* ----------------------------------------------------------------------------q3--------------------- */}
                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.tab_background_color
                  }}>
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 2) / 100,
                      paddingBottom: (mobileW * 3) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.allergic_heading_color,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate,

                      }}>
                      {LanguageConfiguration.pastmedication[Configurations.language]}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.textgray_que,
                      fontFamily: Font.allergies_heading_fontfamily,
                      fontSize: Font.quessize,
                      textAlign: Configurations.textRotate,

                    }}>
                    {LanguageConfiguration.q3[Configurations.language]}
                  </Text>
                </View>

                <View
                  style={{
                    width: '88%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 3) / 100,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => { setpastmedician('Yes') }}
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View

                        style={{
                          width: mobileW * 5 / 100,
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon
                          name={classStateData.past_medication == 'Yes' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}
                        >
                        </Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          alignSelf: 'center',
                          fontFamily: Font.allergies_heading_fontfamily
                        }}>
                        {LanguageConfiguration.yes_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    setpastmedician('No')
                  }}

                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View
                        style={{
                          width: mobileW * 5 / 100,
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon
                          name={classStateData.past_medication == 'No' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}></Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          fontFamily: Font.allergies_heading_fontfamily,
                          alignSelf: 'center',
                        }}>
                        {LanguageConfiguration.no_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                  {classStateData.past_medication == 'Yes' && <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 5) / 100,
                      borderColor: classStateData.pastfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                      borderWidth: 1,
                      borderRadius: (mobileW * 1) / 100,
                    }}>





                    <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: Configurations.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={50}
                        placeholder={classStateData.pastfocus != true ? LanguageConfiguration.textinputpastmedication[Configurations.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { setState({ past_medication_data: txt }) }}
                        value={classStateData.past_medication_data}
                        onFocus={() => { setState({ pastfocus: true }) }}
                        onBlur={() => { setState({ pastfocus: classStateData.past_medication_data.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {classStateData.pastfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.textinputpastmedication[Configurations.language]}</Text>
                    </View>}




                  </View>}
                </View>
                {/* ----------------------------------------------------------------------q4----------------------------------- */}

                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.tab_background_color
                  }}>
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 2) / 100,
                      paddingBottom: (mobileW * 3) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.allergic_heading_color,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate,

                      }}>
                      {LanguageConfiguration.injuries[Configurations.language]}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.textgray_que,
                      fontFamily: Font.allergies_heading_fontfamily,
                      fontSize: Font.quessize,
                      textAlign: Configurations.textRotate,

                    }}>
                    {LanguageConfiguration.q4[Configurations.language]}
                  </Text>
                </View>

                <View
                  style={{
                    width: '88%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 3) / 100,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity onPress={() => {
                    setinjuries('Yes')
                  }}
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View

                        style={{
                          width: mobileW * 5 / 100,
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon
                          name={classStateData.injuries == 'Yes' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}
                        >
                        </Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          alignSelf: 'center',
                          fontFamily: Font.allergies_heading_fontfamily
                        }}>
                        {LanguageConfiguration.yes_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.9} onPress={() => { setinjuries('No') }}
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View

                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon
                          name={classStateData.injuries == 'No' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}></Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          fontFamily: Font.allergies_heading_fontfamily,
                          alignSelf: 'center',
                        }}>
                        {LanguageConfiguration.no_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                  {classStateData.injuries == 'Yes' && <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 5) / 100,
                      borderColor: classStateData.injuriesfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                      borderWidth: 1,
                      borderRadius: (mobileW * 1) / 100,
                    }}>





                    <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: Configurations.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={50}
                        placeholder={classStateData.injuriesfocus != true ? LanguageConfiguration.textinputinjuries[Configurations.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { setState({ injuries_data: txt }) }}
                        value={classStateData.injuries_data}
                        onFocus={() => { setState({ injuriesfocus: true }) }}
                        onBlur={() => { setState({ injuriesfocus: classStateData.injuries_data.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {classStateData.injuriesfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.textinputinjuries[Configurations.language]}</Text>
                    </View>}




                  </View>}
                </View>
                {/* --------------------------------------------------------------------------------------q5 */}

                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.tab_background_color
                  }}>
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 2) / 100,
                      paddingBottom: (mobileW * 3) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.allergic_heading_color,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate,

                      }}>
                      {LanguageConfiguration.surgeries[Configurations.language]}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                  }}>
                  <Text
                    style={{
                      color: Colors.textgray_que,
                      fontFamily: Font.allergies_heading_fontfamily,
                      fontSize: Font.quessize,
                      textAlign: Configurations.textRotate,

                    }}>
                    {LanguageConfiguration.q5[Configurations.language]}
                  </Text>
                </View>

                <View
                  style={{
                    width: '88%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 3) / 100,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity activeOpacity={0.9} onPress={() => {
                    setsurgeries('Yes')
                  }}
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View

                        style={{
                          width: mobileW * 5 / 100,
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon
                          name={classStateData.surgeries == 'Yes' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}
                        >
                        </Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          alignSelf: 'center',
                          fontFamily: Font.allergies_heading_fontfamily
                        }}>
                        {LanguageConfiguration.yes_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    setsurgeries('No')
                  }}
                    style={{
                      width: '30%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{ width: '20%', alignSelf: 'center' }}>
                      <View

                        style={{
                          width: mobileW * 5 / 100,
                          alignSelf: 'center',
                          flexDirection: 'row',
                        }}>

                        <Icon
                          name={classStateData.surgeries == 'No' ? "dot-circle-o" : "circle-thin"}
                          size={22}
                          color={'#0168B3'}></Icon>

                      </View>
                    </View>

                    <View style={{ width: '35%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          color: Colors.textgray_que,
                          textAlign: 'center',
                          fontSize: Font.text_height,
                          fontFamily: Font.allergies_heading_fontfamily,
                          alignSelf: 'center',
                        }}>
                        {LanguageConfiguration.no_txt[Configurations.language]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                  {classStateData.surgeries == 'Yes' && <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 5) / 100,
                      borderColor: classStateData.sugeriesfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                      borderWidth: 1,
                      borderRadius: (mobileW * 1) / 100,
                    }}>





                    <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: Configurations.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={50}
                        placeholder={classStateData.sugeriesfocus != true ? LanguageConfiguration.textinputsurgeries[Configurations.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { setState({ surgeries_data: txt }) }}
                        value={classStateData.surgeries_data}
                        onFocus={() => { setState({ sugeriesfocus: true }) }}
                        onBlur={() => { setState({ sugeriesfocus: classStateData.surgeries_data.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {classStateData.sugeriesfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.textinputsurgeries[Configurations.language]}</Text>
                    </View>}




                  </View>}
                </View>

                {/* --------------------------------------------------------------------------------------q6 */}
                <View style={{ paddingBottom: mobileW * 3 / 100 }}>
                  <View
                    style={{
                      width: '100%',
                      backgroundColor: Colors.tab_background_color
                    }}>
                    <View
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 2) / 100,
                        paddingBottom: (mobileW * 3) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.allergic_heading_color,
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          textAlign: Configurations.textRotate,

                        }}>
                        {LanguageConfiguration.chronic[Configurations.language]}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 2) / 100,
                    }}>
                    <Text
                      style={{
                        color: Colors.textgray_que,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.quessize,
                        textAlign: Configurations.textRotate,

                      }}>
                      {LanguageConfiguration.q6[Configurations.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '88%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 3) / 100,
                      flexDirection: 'row',

                    }}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { setchronic_diseases('Yes') }}
                      style={{
                        width: '30%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      <View style={{ width: '20%', alignSelf: 'center' }}>
                        <View

                          style={{
                            width: mobileW * 5 / 100,
                            alignSelf: 'center',
                            flexDirection: 'row',
                          }}>

                          <Icon
                            name={classStateData.chronic_diseases == 'Yes' ? "dot-circle-o" : "circle-thin"}
                            size={22}
                            color={'#0168B3'}
                          >
                          </Icon>

                        </View>
                      </View>

                      <View style={{ width: '35%', alignSelf: 'center' }}>
                        <Text style={{
                          color: Colors.textgray_que, textAlign: 'center',
                          alignSelf: 'center', fontSize: Font.text_height,
                          fontFamily: Font.allergies_heading_fontfamily
                        }}>
                          {LanguageConfiguration.yes_txt[Configurations.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setchronic_diseases('No') }}
                      style={{
                        width: '30%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                      }}>
                      <View style={{ width: '20%', alignSelf: 'center', }}>
                        <View

                          style={{
                            width: mobileW * 5 / 100,
                            alignSelf: 'center',
                            flexDirection: 'row',
                          }}>

                          <Icon
                            name={classStateData.chronic_diseases == 'No' ? "dot-circle-o" : "circle-thin"}
                            size={22}
                            color={'#0168B3'}></Icon>

                        </View>
                      </View>

                      <View style={{ width: '35%', alignSelf: 'center', }}>
                        <Text
                          style={{
                            color: Colors.textgray_que,
                            textAlign: 'center',
                            fontSize: Font.text_height,
                            fontFamily: Font.allergies_heading_fontfamily,
                            alignSelf: 'center',
                          }}>
                          {LanguageConfiguration.no_txt[Configurations.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                    {classStateData.chronic_diseases == 'Yes' && <View
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 5) / 100,
                        borderColor: classStateData.chronicfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                        borderWidth: 1,
                        borderRadius: (mobileW * 1) / 100,
                      }}>





                      <View style={{ width: '95%', alignSelf: 'center', }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.textblack,
                            fontSize: Font.placeholdersize,
                            textAlign: Configurations.textalign,
                            height: (mobileW * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (mobileW * 1) / 100,

                          }}
                          maxLength={50}
                          placeholder={classStateData.chronicfocus != true ? LanguageConfiguration.textinputchronic[Configurations.language] : null}
                          placeholderTextColor={Colors.placeholder_text}
                          onChangeText={(txt) => { setState({ chronic_diseases_data: txt }) }}
                          value={classStateData.chronic_diseases_data}
                          onFocus={() => { setState({ chronicfocus: true }) }}
                          onBlur={() => { setState({ chronicfocus: classStateData.chronic_diseases_data.length > 0 ? true : false }) }}
                          keyboardType='default'
                          returnKeyLabel='done'
                          returnKeyType='done'
                        />
                      </View>
                      {classStateData.chronicfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.textinputchronic[Configurations.language]}</Text>
                      </View>}




                    </View>


                    }
                  </View>
                </View>
                <View style={{ paddingBottom: (mobileW * 5) / 100, backgroundColor: Colors.tab_background_color }}>
                  <TouchableOpacity onPress={() => { medical_click() }}
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      borderRadius: (mobileW * 2) / 100,
                      backgroundColor: Colors.buttoncolorblue,
                      paddingVertical: (mobileW * 4) / 100,
                      marginTop: (mobileW * 8) / 100,
                      shadowColor: '#000',
                      shadowOffset: { width: 1, height: 1 },
                      shadowOpacity: 0.5,
                      shadowRadius: 2,
                      elevation: 3,
                    }}>
                    <Text
                      style={{
                        color: Colors.textwhite,
                        fontFamily: Font.Medium,
                        fontSize: Font.buttontextsize,
                        alignSelf: 'flex-end',

                        alignSelf: 'center',
                      }}>
                      {LanguageConfiguration.savebtntext[Configurations.language]}
                    </Text>
                  </TouchableOpacity>
                </View>





              </View>

            )}


            {/* ----------------------------------------------------------------------lifebtn */}

            {classStateData.lbtn == true && (
              <View
                style={{
                  backgroundColor: Colors.backgroundcolorlight,
                  paddingBottom: (mobileW * 15) / 100,
                }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.whitebackgroundcolor,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      marginTop: (mobileW * 3) / 100,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate

                      }}>
                      {LanguageConfiguration.smoking[Configurations.language]}
                    </Text>
                  </View>

                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        setState({ yesNoModal: true, smoking_btn: true });
                      }}
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderColor: '#CCCCCC',
                        borderWidth: 1,
                        backgroundColor: Colors.tab_background_color,
                        borderRadius: mobileW * 1 / 100,
                        paddingVertical: (mobileW * 3.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}>
                      <View
                        style={{
                          width: '95%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}>
                        {/* <View style={{width: '80%'}}> */}
                        <Text style={{ fontSize: (mobileW * 3.7) / 100, fontFamily: Font.Regular, textAlign: Configurations.textRotate }}>
                          {classStateData.smoking.length <= 0 ? LanguageConfiguration.select[Configurations.language] : classStateData.smoking}
                        </Text>
                        {/* </View> */}

                        <View style={{ width: '20%', alignSelf: 'center' }}>
                          <Image
                            style={{
                              height: (mobileW * 4) / 100,
                              width: (mobileW * 4) / 100,
                              alignSelf: 'flex-end',
                            }}
                            source={Icons.DownArrow}></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* ------------------------------------------------------------------------------------------------------------------------------------- */}

                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.whitebackgroundcolor,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      marginTop: (mobileW * 3) / 100,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate

                      }}>
                      {LanguageConfiguration.Alcohol[Configurations.language]}
                    </Text>
                  </View>

                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        setState({ yesNoModal: true, smoking_btn: false });
                      }}
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderColor: '#CCCCCC',
                        borderWidth: 1,
                        backgroundColor: Colors.tab_background_color,
                        borderRadius: mobileW * 1 / 100,
                        paddingVertical: (mobileW * 3.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}>
                      <View
                        style={{
                          width: '95%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}>
                        {/* <View style={{width: '80%'}}> */}
                        <Text style={{ fontSize: (mobileW * 3.7) / 100 }}>
                          {classStateData.alcohol.length <= 0 ? LanguageConfiguration.select[Configurations.language] : classStateData.alcohol}
                        </Text>
                        {/* </View> */}

                        <View style={{ width: '20%', alignSelf: 'center' }}>
                          <Image
                            style={{
                              height: (mobileW * 4) / 100,
                              width: (mobileW * 4) / 100,
                              alignSelf: 'flex-end',
                            }}
                            source={Icons.DownArrow}></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* --------------------------------------------------------------------------------------------------------------- */}

                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.whitebackgroundcolor,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      marginTop: (mobileW * 3) / 100,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate
                      }}>
                      {LanguageConfiguration.blood[Configurations.language]}
                    </Text>
                  </View>

                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => {
                      setState({
                        bloodModal: true,
                        // nationality: item.nationality,
                      });
                    }}
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderColor: '#CCCCCC',
                        borderWidth: 1,
                        backgroundColor: Colors.tab_background_color,
                        borderRadius: mobileW * 1 / 100,
                        paddingVertical: (mobileW * 3.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}>
                      <View
                        style={{
                          width: '95%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}>
                        {/* <View style={{width: '80%'}}> */}
                        <Text style={{ fontSize: (mobileW * 3.7) / 100, textAlign: Configurations.textRotate }}>{classStateData.blood_group.length <= 0 ? LanguageConfiguration.select[Configurations.language] : classStateData.blood_group}</Text>
                        {/* </View> */}

                        <View style={{ width: '20%', alignSelf: 'center' }}>
                          <Image
                            style={{
                              height: (mobileW * 4) / 100,
                              width: (mobileW * 4) / 100,
                              alignSelf: 'flex-end',
                            }}
                            source={Icons.DownArrow}></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* ------------------------------------------------------------------------------------------------------------- */}

                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.whitebackgroundcolor,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      marginTop: (mobileW * 3) / 100,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate
                      }}>
                      {LanguageConfiguration.activity[Configurations.language]}
                    </Text>
                  </View>

                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        setState({ occ_food_activity: 'activity', occ_food_activitymodal: true, occ_food_activity_arr: classStateData.activity_arr })
                      }}
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderColor: '#CCCCCC',
                        borderWidth: 1,
                        backgroundColor: Colors.tab_background_color,
                        borderRadius: mobileW * 1 / 100,
                        paddingVertical: (mobileW * 3.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}>
                      <View
                        style={{
                          width: '95%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}>
                        {/* <View style={{width: '80%'}}> */}
                        <Text style={{ fontSize: (mobileW * 3.7) / 100, textAlign: Configurations.textRotate }}>
                          {classStateData.activity_level.length <= 0 ? LanguageConfiguration.select[Configurations.language] : classStateData.activity_level}
                        </Text>
                        {/* </View> */}

                        <View style={{ width: '20%', alignSelf: 'center' }}>
                          <Image
                            style={{
                              height: (mobileW * 4) / 100,
                              width: (mobileW * 4) / 100,
                              alignSelf: 'flex-end',
                            }}
                            source={Icons.DownArrow}></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* -------------------------------------------------------------------------------------------------- */}

                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.whitebackgroundcolor,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      marginTop: (mobileW * 3) / 100,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate
                      }}>
                      {LanguageConfiguration.food[Configurations.language]}
                    </Text>
                  </View>

                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        setState({ occ_food_activity: 'food', occ_food_activitymodal: true, occ_food_activity_arr: classStateData.food_arr })
                      }}
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderColor: '#CCCCCC',
                        borderWidth: 1,
                        backgroundColor: Colors.tab_background_color,
                        borderRadius: mobileW * 1 / 100,
                        paddingVertical: (mobileW * 3.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}>
                      <View
                        style={{
                          width: '95%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}>
                        {/* <View style={{width: '80%'}}> */}
                        <Text style={{ fontSize: (mobileW * 3.7) / 100, textAlign: Configurations.textRotate }}>
                          {classStateData.food.length <= 0 ? LanguageConfiguration.select[Configurations.language] : classStateData.food}
                        </Text>
                        {/* </View> */}

                        <View style={{ width: '20%', alignSelf: 'center' }}>
                          <Image
                            style={{
                              height: (mobileW * 4) / 100,
                              width: (mobileW * 4) / 100,
                              alignSelf: 'flex-end',
                            }}
                            source={Icons.DownArrow}></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ----------------------------------------------------------------------------------------------------- */}
                <View
                  style={{
                    width: '100%',
                    backgroundColor: Colors.whitebackgroundcolor,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      marginTop: (mobileW * 3) / 100,
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.allergies_txt_size_edit,
                        textAlign: Configurations.textRotate
                      }}>
                      {LanguageConfiguration.occupation[Configurations.language]}
                    </Text>
                  </View>

                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        setState({ occ_food_activity: 'occupation', occ_food_activitymodal: true, occ_food_activity_arr: classStateData.occupation_arr })
                      }}
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        borderColor: '#CCCCCC',
                        borderWidth: 1,
                        backgroundColor: Colors.tab_background_color,
                        borderRadius: mobileW * 1 / 100,
                        paddingVertical: (mobileW * 3.5) / 100,
                        marginTop: (mobileW * 3) / 100,
                      }}>
                      <View
                        style={{
                          width: '95%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}>
                        {/* <View style={{width: '80%'}}> */}
                        <Text style={{ fontSize: (mobileW * 3.7) / 100, textAlign: Configurations.textRotate }}>
                          {classStateData.occupation.length <= 0 ? LanguageConfiguration.select[Configurations.language] : classStateData.occupation}
                        </Text>
                        {/* </View> */}

                        <View style={{ width: '20%', alignSelf: 'center' }}>
                          <Image
                            style={{
                              height: (mobileW * 4) / 100,
                              width: (mobileW * 4) / 100,
                              alignSelf: 'flex-end',
                            }}
                            source={Icons.DownArrow}></Image>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (mobileW * 5) / 100 }}>
                    <TouchableOpacity onPress={() => { lifestyle_click() }}
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        borderRadius: (mobileW * 2) / 100,
                        backgroundColor: Colors.buttoncolorblue,
                        paddingVertical: (mobileW * 4) / 100,
                        marginTop: (mobileW * 8) / 100,
                        shadowColor: '#000',
                        shadowOffset: { width: 1, height: 1 },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 3,
                      }}>
                      <Text
                        style={{
                          color: Colors.textwhite,
                          fontFamily: Font.allergies_heading_fontfamily,
                          fontSize: Font.allergies_txt_size_edit,
                          alignSelf: 'flex-end',
                          textAlign: Configurations.textalign,
                          alignSelf: 'center',
                        }}>
                        {LanguageConfiguration.savebtntext[Configurations.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>

    </View>
  );
}
