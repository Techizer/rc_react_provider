import { Text, View, StatusBar, SafeAreaView, ScrollView, styles, TouchableOpacity, Image, TextInput, Modal, FlatList, keyboardType, Keyboard, Platform, Dimensions } from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { consolepro, Colors,  Font, mobileH, config, mobileW, Lang_chg, localStorage, apifuntion, msgProvider, msgText, msgTitle, Cameragallery, mediaprovider } from './Provider/utilslib/Utils';
import Styles from './Styles';
import DateTimePicker from "react-native-modal-datetime-picker";
import DatePicker from 'react-native-date-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthInputBoxSec, DropDownboxSec, DashBoardBox } from './Components'
import { Col } from 'ionic-angular';
import ScreenHeader from './Components/ScreenHeader';
import { Icons } from './icons/IReferences';
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

export default class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pbtn: true,
      mbtn: false,
      lbtn: false,
      country_modal: false,
      country_name: '',
      country_code: '',
      febtn: false,
      country_short_code: '',
      mabtn: false,
      country_codefocus: false,
      allergies: 'No',
      allergiesnobtn: false,
      work_area: '',
      currentyesbtn: false,
      currentnobtn: false,

      pastyesbtn: false,
      pastnobtn: false,

      injuriesyesbtn: false,
      injuriesnobtn: false,


      surgeriesyesbtn: false,
      surgeriesnobtn: false,

      chronicyesbtn: false,
      chronicnobtn: false,
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


      // modalvalue: false


      //--------------------------txtinput
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
      showUsertype: false,
      id_image: '',
      certificate: '',
      scfhs_image: '',
      userType: [{
        title: "Nurse",
        value: "nurse"
      },
      {
        title: "Nurse Assistant",
        value: "caregiver"
      },
      {
        title: "Babysitter",
        value: "babysitter"
      },
      {
        title: "Physiotherapy",
        value: "physiotherapy"
      },
      {
        title: "Doctor",
        value: "doctor"
      },
      {
        title: "Hospital",
        value: "hospital"
      }],
      selectuserType: -1,
    };
    screens = 'Editprofile';
  }
  componentDidMount() {
    console.log('jay', this.state.date_new)
    this.props.navigation.addListener('focus', () => {
      this.getProfile()

      this.get_all_nationlity()
      this.get_all_notification()
      // this.get_speciality()
      //   this. get_all_country()

    });
  }

  get_all_notification = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']

    let url = config.baseURL + "api-notification-count";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)

    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data, 1).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        this.setState({ notification_count: obj.result })
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

    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data, 1).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        console.log('obj nationaltity', obj)
        this.setState({ nationality_arr: obj.result })


      } else {


        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);
    })

  }

  setalergy = (item) => {
    console.log('item', item);
    this.setState({ allergies: item })
  }
  setcurrentmadiciens = (item) => {
    console.log('item', item);
    this.setState({ current_medication: item })
  }
  setpastmedician = (item) => {
    console.log('item', item);
    this.setState({ past_medication: item })
  }
  setinjuries = (item) => {
    console.log('item', item);
    this.setState({ injuries: item })
  }
  setsurgeries = (item) => {
    console.log('item', item);
    this.setState({ surgeries: item })
  }
  setchronic_diseases = (item) => {
    console.log('item', item);
    this.setState({ chronic_diseases: item })
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
    this.setState({ date_new: new Date(date1) })
    this.setState({ dob_date: date1, isDatePickerVisibletwo: false, })
  }

  getProfile = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']

    let url = config.baseURL + "api-get-provider-profile"; //"api-patient-profile";
    console.log("url", url)
    var data = new FormData();
    // data.append('user_id', user_id)
    data.append('id', user_id)
    data.append('service_type', user_type)


    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        console.log('result123456', obj.result)

        let result = obj.result
        console.log('result.nationality',)
        this.setState({
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
          identityfocus: true,
          namefocus: true,
          emailfocus: true,

        }, () => {
          console.log("id_image:: ", this.state.id_image);
          console.log("certificate:: ", this.state.certificate);
          console.log("scfhs_image:: ", this.state.scfhs_image);
        })


        // if(result['work_area']!=null && result['work_area']!='')
        // {
        //   this.setState({country_name:result['work_area'],country_codefocus:true})
        // }
        if (result['phone_number'] != null && result['phone_number'] != '') {
          this.setState({ mobile: result['phone_number'], numberfocus: true })
        }
        if (result['address'] != null && result['address'] != '') {
          this.setState({ addressfocus: true })
        }

        if (result['dob'] != null && result['dob'] != '') {
          this.setState({ dob_date: result['dob'], dobfocus: true })
          //  this.setState({date_new:new Date(result['dob'])})
          // console.log('date_new:new Date(result[dob])',new Date(result['dob']))
        }

        if (result.nationality != null && result.nationality != '') {

          this.setState({ nationality: result['nationality'], nationalityfocus: true })
        }
        if (result['gender'] != null && result['gender'] != '') {
          this.setState({
            gender: result['gender'],
            febtn: (result['gender'] == 'Female') ? true : false,
            mabtn: (result['gender'] == 'Male') ? true : false,
          })
          // if (result['gender'] == 'Female') {
          //   this.setState({ febtn: true })
          // }
          // else {
          //   this.setState({ mabtn: true })
          // }
        }
        if (result['smoking'] != null && result['smoking'] != '') {
          this.setState({ smoking: result['smoking'] })
        }
        if (result['blood_group'] != null) {
          this.setState({ blood_group: result['blood_group'] })
        }
        if (result['food_preference'] != null) {
          this.setState({ food: result['food_preference'] })
        }
        if (result['alcohol'] != null) {
          this.setState({ alcohol: result['alcohol'] })
        }
        if (result['occupation'] != null) {
          this.setState({ occupation: result['occupation'] })
        }
        if (result['activity_level'] != null) {
          this.setState({ activity_level: result['activity_level'] })
        }
        if (result['allergies_data'] != null && result['allergies_data'] != '') {
          this.setState({ allergies_data: result['allergies_data'] })
        }
        if (result['allergies'] != null && result['allergies'] != '') {
          this.setState({ allergies: result['allergies'] })
        }
        if (result['chronic_diseases'] != null && result['chronic_diseases'] != '') {
          this.setState({ chronic_diseases: result['chronic_diseases'] })
        }
        if (result['chronic_diseases_data'] != null && result['chronic_diseases_data'] != '') {
          this.setState({ chronic_diseases_data: result['chronic_diseases_data'] })
        }
        if (result['current_medication'] != null && result['current_medication'] != '') {
          this.setState({ current_medication: result['current_medication'] })
        }
        if (result['current_medication_data'] != null && result['current_medication_data'] != '') {
          this.setState({ current_medication_data: result['current_medication_data'] })
        }
        if (result['injuries'] != null && result['injuries'] != '') {
          this.setState({ injuries: result['injuries'] })
        }
        if (result['injuries_data'] != null && result['injuries_data'] != '') {
          this.setState({ injuries_data: result['injuries_data'] })
        }
        if (result['past_medication_data'] != null && result['past_medication_data'] != '') {
          this.setState({ past_medication_data: result['past_medication_data'] })
        }
        if (result['past_medication'] != null && result['past_medication'] != '') {
          this.setState({ past_medication: result['past_medication'] })
        }
        if (result['surgeries'] != null && result['surgeries'] != '') {
          this.setState({ surgeries: result['surgeries'] })
        }
        if (result['surgeries_data'] != null && result['surgeries_data'] != '') {
          this.setState({ surgeries_data: result['surgeries_data'] })
        }





        if (result.image != null) {
          this.setState({
            profile_img: config.img_url3 + result['image'],
          })
        }

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

  medical_click = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let url = config.baseURL + "api-edit-patient-profile-medical";
    console.log("url", url)

    var data = new FormData();
    data.append('user_id', user_id)
    data.append('allergies', this.state.allergies)
    data.append('allergies_data', this.state.allergies_data)
    data.append('current_medication', this.state.current_medication)
    data.append('current_medication_data', this.state.current_medication_data)
    data.append('past_medication', this.state.past_medication)
    data.append('past_medication_data', this.state.past_medication_data)
    data.append('injuries', this.state.injuries)
    data.append('injuries_data', this.state.injuries_data)
    data.append('surgeries', this.state.surgeries)
    data.append('surgeries_data', this.state.surgeries_data)
    data.append('chronic_diseases', this.state.chronic_diseases)
    data.append('chronic_diseases_data', this.state.chronic_diseases_data)
    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)

      if (obj.status == true) {

        let user_details = obj.result;
        localStorage.setItemObject('user_arr', user_details);

        // msgProvider.toast(obj.message,'center')

      } else {
        msgProvider.toast(obj.message, 'center')
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);

    });

  }

  Camerapopen = async () => {
    mediaprovider.launchCamera(true).then((obj) => {
      console.log(obj);
      console.log(obj.path);
      if (this.state.img_type == 0) {
        this.setState({ cover_img: obj.path, mediamodal: false })
      }
      else {
        this.setState({ profile_img: obj.path, mediamodal: false, profile_image: obj.path })
      }
    }).catch((error) => {
      this.setState({ mediamodal: false })

    })
  }
  Galleryopen = () => {
    mediaprovider.launchGellery(true).then((obj) => {
      console.log(obj);
      console.log(obj.path);
      // this.editImage(obj.path);
      if (this.state.img_type == 0) {
        this.setState({ cover_img: obj.path, mediamodal: false })
      }
      else {
        this.setState({ profile_img: obj.path, mediamodal: false, profile_image: obj.path })
      }
    }).catch((error) => {
      this.setState({ mediamodal: false })
    })
  }

  submit_click = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']

    Keyboard.dismiss()


    if (this.state.name.length <= 0 || this.state.name.trim().length <= 0) {
      msgProvider.toast(msgText.emptyName[config.language], 'center')
      return false;
    }

    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (this.state.email.length <= 0 || this.state.email.trim().length <= 0) {
      msgProvider.toast(msgText.emptyEmail[config.language], 'center')
      return false;
    }

    if (regemail.test(this.state.email) !== true) {
      msgProvider.toast(msgText.validEmail[config.language], 'center')
      return false
    }

    // if (this.state.mobile.length <= 0 || this.state.mobile.trim().length <= 0) {
    //   msgProvider.toast(msgText.emptymobileNumber[config.language], 'center')
    //   return false;
    // }
    if (this.state.id_number.length <= 0 || this.state.id_number.trim().length <= 0) {
      msgProvider.toast(msgText.emptyid[config.language], 'center')
      return false;
    }

    let url = config.baseURL + "api-sp-edit-profile";
    console.log("url", url)
    var phone_number_send = this.state.country_code + this.state.mobile
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
    data.append("service _type", "nurse")
    data.append('first_name', this.state.name)
    data.append('email', this.state.email)
    data.append('phone_number', phone_number_send)
    data.append('gender', this.state.gender)
    data.append('id_number', this.state.identity)
    data.append('dob', this.state.dob_date)
    data.append('speciality', this.state.speciality)
    data.append('description', this.state.description)
    data.append('experience', this.state.experience)
    data.append('qualification', this.state.qualification)
    data.append('id_image', this.state.id_image.filename)
    data.append('certificate', this.state.certificate.filename)
    data.append('scfhs_image', this.state.scfhs_image.filename)
    console.log('this.state.profile_img1234', this.state.profile_image)
    if (this.state.profile_image != '') {
      console.log('this.state.profile_img123409', this.state.profile_img)
      data.append('image', {
        uri: this.state.profile_img,
        type: 'image/jpg',
        name: this.state.profile_img
      })
    }

    consolepro.consolelog('data', data)
    this.setState({ loading: true })
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      this.setState({ loading: false });
      if (obj.status == true) {

        let user_details = obj.result;
        localStorage.setItemObject('user_arr', user_details);

        // msgProvider.toast(obj.message,'center')

      } else {

        msgProvider.alert(obj.message, false);
      }
      return false;

    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });

  }
  lifestyle_click = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']



    if (this.state.smoking.length <= 0) {
      msgProvider.toast(msgText.smoking_msg[config.language], 'center')
      return false;
    }
    if (this.state.alcohol.length <= 0) {
      msgProvider.toast(msgText.alcohal_msg[config.language], 'center')
      return false;
    }
    if (this.state.blood_group.length <= 0) {
      msgProvider.toast(msgText.bloodgrp_msg[config.language], 'center')
      return false;
    }
    if (this.state.activity_level.length <= 0) {
      msgProvider.toast(msgText.activity_level[config.language], 'center')
      return false;
    }
    if (this.state.food.length <= 0) {
      msgProvider.toast(msgText.food_preferance[config.language], 'center')
      return false;
    }
    if (this.state.occupation.length <= 0) {
      msgProvider.toast(msgText.occuation[config.language], 'center')
      return false;
    }




    let url = config.baseURL + "api-edit-patient-profile-style";
    console.log("url", url)

    var data = new FormData();
    data.append('user_id', user_id)
    data.append('smoking', this.state.smoking)
    data.append('alcohol', this.state.alcohol)
    data.append('blood_group', this.state.blood_group)
    data.append('activity_level', this.state.activity_level)
    data.append('food_preference', this.state.food)

    data.append('occupation', this.state.occupation)
    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)

      if (obj.status == true) {

        let user_details = obj.result;
        localStorage.setItemObject('user_arr', user_details);

        // msgProvider.toast(obj.message,'center')

      } else {
        msgProvider.toast(obj.message, 'center')
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);

    });

  }

  render() {

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


        {/* -------------------Yes No MOdal----------------------- */}

        {/* <DatePicker
                     
                     modal          
                     mode="date"
                     date={this.state.date_new}
                     title="Select Date"
                     titleIOS="Select Date"
                     maximumDate={new Date()}
                     open={this.state.isDatePickerVisibletwo}
                     onConfirm={(date)=>{this.setdatetwo(date),this.setState({isDatePickerVisibletwo:false})}}
                     onCancel={()=>{this.setState({isDatePickerVisibletwo:false})}}
                 />

       */}
        <DateTimePicker
          isVisible={this.state.isDatePickerVisibletwo}
          mode="date"
          value={this.state.date_new}
          maximumDate={new Date()}
          onConfirm={(date) => { this.setdatetwo(date), this.setState({ isDatePickerVisibletwo: false }) }}
          onCancel={() => { this.setState({ isDatePickerVisibletwo: false }) }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.yesNoModal}
          onRequestClose={() => { }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ yesNoModal: false }) }}
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
                    {this.state.smoking_btn == true
                      ? Lang_chg.smoking[config.language]
                      : Lang_chg.Alcohol[config.language]}
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.smoking_btn == true) {
                      this.setState({ yesNoModal: false, smoking: 'Yes' });
                    } else {
                      this.setState({ yesNoModal: false, alcohol: 'Yes' });
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
                      {Lang_chg.yes_txt_new[config.language]}
                    </Text>

                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.smoking_btn == true) {
                      this.setState({ yesNoModal: false, smoking: 'No' });
                    } else {
                      this.setState({ yesNoModal: false, alcohol: 'No' });
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
                        {Lang_chg.no_txt_new[config.language]}
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
          visible={this.state.nationalityModal}
          onRequestClose={() => { }}>
          <SafeAreaView style={{ flex: 1, }}>
            {/* <View style={{ height: mobileH * 100 / 100, backgroundColor: '#fff' }}> */}

            <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ nationalityModal: false }) }}
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
                      {Lang_chg.nationality[config.language]}
                    </Text>
                  </View>
                </View>
                <View style={{ width: '100%' }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: mobileW * 10 / 100 }}
                    data={this.state.nationality_arr}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
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
          visible={this.state.occ_food_activitymodal}
          onRequestClose={() => { }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ occ_food_activitymodal: false }) }}
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
                    {this.state.occ_food_activity == 'activity' ? Lang_chg.ActivityLevel[config.language] : this.state.occ_food_activity == 'food' ? Lang_chg.FoodPreference[config.language] : Lang_chg.Occupation[config.language]}
                  </Text>
                </View>
              </View>
              <View style={{ width: '100%', alignSelf: 'center' }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: mobileW * 4 / 100 }}
                  data={this.state.occ_food_activity_arr}
                  renderItem={({ item, index }) => {
                    return (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            if (this.state.occ_food_activity == 'activity') {
                              this.setState({ occ_food_activitymodal: false, activity_level: item.name });
                            }
                            else if (this.state.occ_food_activity == 'food') {
                              this.setState({ occ_food_activitymodal: false, food: item.name });
                            }
                            else {
                              this.setState({ occ_food_activitymodal: false, occupation: item.name });
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
          visible={this.state.bloodModal}
          onRequestClose={() => { }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ bloodModal: false }) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%' }}>
            <View style={{ width: '70%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
              <View style={{ width: '100%', backgroundColor: Colors.backgroundcolorblue, paddingVertical: mobileW * 2 / 100 }}>

                <Text style={{ paddingLeft: mobileW * 4.5 / 100, paddingRight: mobileW * 4.5 / 100, textAlign: config.textRotate, fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.textwhite }}>{Lang_chg.blood[config.language]}</Text>

              </View>

              <View style={{ width: '100%', alignSelf: 'center' }}>
                <FlatList
                  contentContainerStyle={{ paddingBottom: mobileW * 2 / 100 }}
                  data={bloodModal_arr}
                  renderItem={({ item, index }) => {
                    return (

                      <TouchableOpacity
                        onPress={() => { this.setState({ bloodModal: false, blood_group: item.blood }); }}
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
              this.props.navigation.goBack();
            }}
            leftIcon
            rightIcon={true}
            navigation={this.props.navigation}
            notiCount={this.state.notification_count > 0 ? this.state.notification_count : false}
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
              {this.state.pbtn == true && (
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
                          source={this.state.profile_img == 'NA' ||
                            this.state.profile_img == null ||
                            this.state.profile_img == '' ? Icons.ProfileImage :
                            { uri: this.state.profile_img }}
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
                          // fontFamily: Font.blackheadingfontfamily, 
                          // fontSize: Font.tabtextsize, 
                          fontFamily: Font.Medium, fontSize: 18,
                          textAlign: config.textRotate,
                        }}>{this.state.name}</Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('Editprofile');
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
                          }}>{this.state.speciality}</Text>
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

                            }}>{this.state.email}</Text>
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
                            }}>{this.state.phone_number}</Text>
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
                          }}>{(this.state.user_type == "lab") ? 'Established' : 'Experience'}
                        </Text>
                        <Text
                          style={{
                            marginTop: (mobileW * 2) / 100,
                            color: Colors.lightgraytext,
                            fontFamily: Font.Medium,
                            fontSize: 16, //(mobileW * 3) / 100,
                            textAlign: config.textRotate,
                          }}>{this.state.experience} {(this.state.user_type == "lab") ? '' : 'YR'}
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
                          }}>{(this.state.user_type == "lab") ? 'Lab Test' : 'Bookings'}
                        </Text>
                        <Text
                          style={{
                            marginTop: (mobileW * 2) / 100,
                            color: Colors.lightgraytext,
                            fontFamily: Font.Medium,
                            fontSize: 16, //(mobileW * 3) / 100,
                            textAlign: config.textRotate,
                          }}>{(this.state.user_type == "lab") ? this.state.lab_test_count : this.state.booking_count}
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
                            }}>{this.state.avg_rating}.0
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
                      }]}>{this.state.description}</Text>
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
                  (this.state.user_type == "lab") ?
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
                          }}>{this.state.hosp_moh_lic_no}</Text>
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
                          }}>{this.state.hosp_reg_no}</Text>
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
                          }}>{this.state.speciality}</Text>
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
                          }}>{this.state.id_number}</Text>
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
                          }}>{this.state.qualification}</Text>
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
                          }}>{this.state.scfhs_number}</Text>
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
                    (this.state.user_type == "lab") ?
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
                            source={this.state.moh_lic_image == 'NA' ||
                              this.state.moh_lic_image == null ||
                              this.state.moh_lic_image == '' ? Icons.Prescription :
                              { uri: config.img_url3 + this.state.moh_lic_image.filename }}
                          ></Image>
                          <Text>{this.state.hosp_moh_lic_no}</Text>
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
                            source={this.state.hosp_reg_image == 'NA' ||
                              this.state.hosp_reg_image == null ||
                              this.state.hosp_reg_image == '' ? Icons.Prescription :
                              { uri: config.img_url3 + this.state.hosp_reg_image.filename }}
                          ></Image>
                          <Text>{this.state.hosp_reg_no}</Text>
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
                            source={this.state.id_image == 'NA' ||
                              this.state.id_image == null ||
                              this.state.id_image == '' ? Icons.Prescription :
                              { uri: config.img_url3 + this.state.id_image.filename }}
                          ></Image>
                          <Text>{this.state.id_number}</Text>
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
                            source={this.state.certificate == 'NA' ||
                              this.state.certificate == null ||
                              this.state.certificate == '' ? Icons.Prescription :
                              { uri: config.img_url3 + this.state.certificate.filename }}
                          ></Image>
                          <Text>{this.state.qualification}</Text>
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
                            source={this.state.scfhs_image == 'NA' ||
                              this.state.scfhs_image == null ||
                              this.state.scfhs_image == '' ? Icons.Prescription :
                              { uri: config.img_url3 + this.state.scfhs_image.filename }}
                          ></Image>
                          <Text>{this.state.scfhs_number}</Text>
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
                  this.props.navigation.navigate('AvailabilityScheduletab');
                }}
              />
              <DashBoardBox
                textTitle={(this.state.user_type == "lab") ? 'Tests & Packages' : 'Price List'}
                // textInfo={item?.details}
                infoIcon={''}
                rightText={"Edit"}
                isBorder={true}
                isMargin={false}
                onPress={() => {
                  this.props.navigation.navigate('PriceListtab');
                }}
              />

            </KeyboardAwareScrollView>
          </ScrollView>
        </View>

      </View>
    );
  }
}
