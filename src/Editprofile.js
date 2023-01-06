import { Text, View, StatusBar, SafeAreaView, ScrollView, styles, TouchableOpacity, Image, TextInput, Modal, FlatList, keyboardType, Keyboard, Platform, Dimensions } from 'react-native';
import React, { Component } from 'react';
import Footer from './Footer';
import Icon from 'react-native-vector-icons/FontAwesome';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { consolepro, Colors, localimag, Font, mobileH, config, mobileW, Lang_chg, localStorage, apifuntion, msgProvider, msgText, msgTitle, Cameragallery, mediaprovider } from './Provider/utilslib/Utils';
import Styles from './Styles';
import DateTimePicker from "react-native-modal-datetime-picker";
import DatePicker from 'react-native-date-picker'
import MonthPicker from 'react-native-month-year-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthInputBoxSec, DropDownboxSec, Button } from './Components'
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

export default class Editprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speciality: '',
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
      showUsertype: false,
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
      this.get_speciality()
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
      msgProvider.showError(msgText.emptyName[config.language])
      return false;
    }

    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (this.state.email.length <= 0 || this.state.email.trim().length <= 0) {
      msgProvider.showError(msgText.emptyEmail[config.language])
      return false;
    }

    if (regemail.test(this.state.email) !== true) {
      msgProvider.showError(msgText.validEmail[config.language])
      return false
    }

    if (this.state.country_code.length <= 0 || this.state.country_code.trim().length <= 0) {
      msgProvider.showError(msgText.emptyCountrycode[config.language])
      return false;
    }

    if (this.state.mobile.length <= 0 || this.state.mobile.trim().length <= 0) {
      msgProvider.showError(msgText.emptymobileNumber[config.language])
      return false;
    }

    if (this.state.user_type == "lab") {
      if (this.state.dob_date.length <= 0) {
        msgProvider.showError("Please choose year of establishment")
        return false;
      }
      if (this.state.address.length <= 0 || this.state.address.trim().length <= 0) {
        msgProvider.showError("Please enter your address")
        return false;
      }
    } else {
      if (this.state.dob_date.length <= 0 || this.state.dob_date.trim().length <= 0) {
        msgProvider.showError("Please choose your date of birth")
        return false;
      }
    }
    if (this.state.user_type != "lab") {
      if (this.state.gender.length <= 0 || this.state.gender.trim().length <= 0) {
        msgProvider.showError("Please choose your gender")
        return false;
      }
    }
    // if (this.state.mobile.length <= 0 || this.state.mobile.trim().length <= 0) {
    //   msgProvider.toast(msgText.emptymobileNumber[config.language], 'center')
    //   return false;
    // }



    if (this.state.user_type != "lab") {
      if ((this.state.id_number.length < 10 || this.state.id_number.trim().length < 10)) {
        msgProvider.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }

      if ((this.state.id_number.length > 15 || this.state.id_number.trim().length > 15)) {
        msgProvider.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }
    }
    if (this.state.user_type == "nurse" || this.state.user_type == "physiotherapy"
      || this.state.user_type == "doctor") {
      if (this.state.speciality.length <= 0 || this.state.speciality.trim().length <= 0) {
        msgProvider.showError("Please select speciality")
        return false;
      }
    }

    if (this.state.user_type != "lab") {
      if (this.state.qualification.length <= 0 || this.state.qualification.trim().length <= 0) {
        msgProvider.showError("Please enter your qualification")
        return false;
      }

      if (this.state.experience.length <= 0 || this.state.experience.trim().length <= 0) {
        msgProvider.showError("Please enter your years of experience")
        return false;
      }
    }

    if (this.state.user_type == "nurse" || this.state.user_type == "physiotherapy"
      || this.state.user_type == "doctor") {
      if ((this.state.scfhs_number.length < 8 || this.state.scfhs_number.trim().length < 8)) {
        msgProvider.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
        return false;
      }

      if (this.state.scfhs_number.length > 11 || this.state.scfhs_number.trim().length > 11) {
        msgProvider.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
        return false;
      }
    }

    if (this.state.user_type == "lab") {
      if (this.state.hosp_moh_lic_no == null || this.state.hosp_moh_lic_no.length <= 0 || this.state.hosp_moh_lic_no.trim().length <= 0) {
        msgProvider.showError("Please enter health registration ID")
        return false;
      }

      if (this.state.hosp_reg_no == null || this.state.hosp_reg_no.length <= 0 || this.state.hosp_reg_no.trim().length <= 0) {
        msgProvider.showError("Please enter company registration certificate number")
        return false;
      }
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
    data.append("service_type", this.state.user_type)
    data.append('first_name', this.state.name)
    data.append('email', this.state.email)
    data.append('phone_number', phone_number_send)
    data.append('work_area', this.state.work_area)
    if (this.state.user_type != "lab") {

      data.append('gender', this.state.gender)
      data.append('id_number', this.state.id_number)
      data.append('scfhs_number', this.state.scfhs_number)
      data.append('dob', this.state.dob_date)
    }
    if (this.state.user_type == "lab") {
      data.append('address', this.state.address)
      data.append('hosp_moh_lic_no', this.state.hosp_moh_lic_no)
      data.append('hosp_reg_no', this.state.hosp_reg_no)
    }
    if (this.state.user_type != "lab") {
      data.append('speciality', this.state.speciality)

    }
    data.append('description', this.state.description)
    data.append('experience', (this.state.user_type == "lab") ? this.state.dob_date : this.state.experience)
    if (this.state.user_type != "lab") {
      data.append('qualification', this.state.qualification)
    }
    data.append('id_image', (this.state.user_type == "lab") ? this.state.moh_lic_image.filename : this.state.id_image.filename)
    data.append('certificate', (this.state.user_type == "lab") ? this.state.hosp_reg_image.filename : this.state.certificate.filename)
    if (this.state.user_type != "lab") {
      data.append('scfhs_image', this.state.scfhs_image.filename)
    }
    // data.append('moh_lic_image', this.state.moh_lic_image.filename)
    // data.append('hosp_reg_image', this.state.hosp_reg_image.filename)
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
        msgProvider.showSuccess(obj.message)
      } else {
        msgProvider.showError(obj.message)
        // msgProvider.alert(obj.message, false);
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

  get_speciality = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']

    let url = config.baseURL + "api-provider-get-speciality";
    console.log("url", url)
    var data = new FormData();
    data.append('service_type', user_type)

    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      //apifuntion.getApi(url, 1).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        this.setState({
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
              textAlign: config.textRotate,
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
            // borderColor: this.state.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
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
              this.id_numberInput = ref;
            }}
            maxLength={15}
            onChangeText={(text) =>
              this.setState({ id_number: text })
            }
            editable={false}
            value={this.state.id_number}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={this.state.isSecurePassword1}
            // disableImg={true}
            // iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   this.setState({
            //     isSecurePassword1: !this.state.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // this.qualificationInput.focus()
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
              // this.setState({
              //   imageType: 'id_image',
              //   mediamodal: true
              // }, () => {
              //   // this.Galleryopen()
              //   // this.uploadVoiceFile()
              // });

            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  // paddingLeft:mobileW*2/100,
                  // textAlign: config.textalign,
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
                //this.props.navigation.navigate('Forgotpage');
              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
              }}>
              {(this.state.id_image != undefined) ? this.state.id_image.filename.trim() : 'No Attachment'}
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
              textAlign: config.textRotate,
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
            //   this.qualificationInput = ref;
            // }}
            onChangeText={(text) =>
              this.setState({ speciality: text })
            }
            value={this.state.speciality}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            editable={false}
            // secureTextEntry={this.state.isSecurePassword1}
            // disableImg={true}
            // iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   this.setState({
            //     isSecurePassword1: !this.state.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // this.experienceInput.focus()
            }}
          />
          {/* <DropDownboxSec
            lableText={(this.state.speciality == '') ? 'Speciality' : this.state.speciality}
            boxPressAction={() => {
              this.setState({
                showSpeciality: true
              })
            }}
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showSpeciality}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              //setModalVisible(!modalVisible);
            }}
          >
            <TouchableOpacity activeOpacity={0.9} onPress={() => {
              this.setState({
                showSpeciality: false
              })
            }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%' }}>
              <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                //marginTop: 22
              }}>
                <View style={{
                  maxHeight: mobileH - 250,
                  width: mobileW / 1.3,
                  backgroundColor: "white",
                  borderRadius: 5,
                  //padding: 35,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}>
                  <View style={{
                    backgroundColor: Colors.textblue,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    paddingTop: 14,
                    paddingBottom: 14,
                    width: '100%'
                  }}>
                    <Text style={{
                      paddingLeft: 15,
                      color: Colors.white_color,
                      fontSize: 15,
                      fontFamily: Font.headingfontfamily,
                    }}>Speciality</Text>
                  </View>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={(this.state.specialityArr.length > 10) ? true : false}
                    style={{
                      width: '100%',
                    }}>
                    {
                      this.state.specialityArr.map((data, index) => {
                        return (
                          <TouchableOpacity style={{
                            width: '100%',
                          }} onPress={() => {
                            this.setState({
                              speciality: data.name,
                              showSpeciality: false
                            })
                          }}>
                            <View style={{
                              width: (Platform.OS == "ios") ? '95%' : '94.5%',
                              marginLeft: 15,
                              borderBottomColor: Colors.gray6,
                              borderBottomWidth: (index == (this.state.userType.length - 1)) ? 0 : 1,
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
                  </ScrollView>
                </View>
              </View>
            </TouchableOpacity>
          </Modal> */}
        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
            // borderColor: this.state.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
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
              this.qualificationInput = ref;
            }}
            onChangeText={(text) =>
              this.setState({ qualification: text })
            }
            value={this.state.qualification}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={this.state.isSecurePassword1}
            // disableImg={true}
            // iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   this.setState({
            //     isSecurePassword1: !this.state.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // this.experienceInput.focus()
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
              // this.setState({
              //   imageType: 'certificate',
              //   mediamodal: true
              // }, () => {
              //   //this.Galleryopen()
              // });
            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  // paddingLeft:mobileW*2/100,
                  // textAlign: config.textalign,
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
                //this.props.navigation.navigate('Forgotpage');
              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
              }} numberOfLines={1}>
              {(this.state.certificate != undefined) ? this.state.certificate.filename.trim() : 'No Attachment'}
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
            // borderColor: this.state.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
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
              this.experienceInput = ref;
            }}
            onChangeText={(text) =>
              this.setState({ experience: text })
            }
            value={this.state.experience}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={this.state.isSecurePassword1}
            // disableImg={true}
            // iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   this.setState({
            //     isSecurePassword1: !this.state.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // this.scfhs_numberInput.focus()
            }}
          />

        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: (mobileW * 2) / 100,
            flexDirection: 'row',
            // borderColor: this.state.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
            // borderWidth: 1,
            // borderRadius: (mobileW * 1) / 100,
          }}>
          <AuthInputBoxSec
            mainContainer={{
              width: '100%',
            }}
            // icon={layer9_icon}
            lableText={'SCFHS Registration ID'}
            inputRef={(ref) => {
              this.scfhs_numberInput = ref;
            }}
            onChangeText={(text) =>
              this.setState({ scfhs_number: text })
            }
            editable={false}
            maxLength={11}
            value={this.state.scfhs_number}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="done"
            returnKeyType="done"
            // secureTextEntry={this.state.isSecurePassword1}
            // disableImg={true}
            // iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   this.setState({
            //     isSecurePassword1: !this.state.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // this.signup_click()
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
              // this.setState({
              //   imageType: 'scfhs_image',
              //   mediamodal: true
              // }, () => {
              //   // this.Galleryopen()
              // });
            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  // paddingLeft:mobileW*2/100,
                  // textAlign: config.textalign,
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
                //this.props.navigation.navigate('Forgotpage');
              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
              }} numberOfLines={1}>
              {(this.state.scfhs_image != undefined) ? this.state.scfhs_image.filename.trim() : 'No Attachment'}
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
              textAlign: config.textRotate,
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
            // borderColor: this.state.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
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
              this.qualificationInput = ref;
            }}
            onChangeText={(text) =>
              this.setState({ qualification: text })
            }
            value={this.state.qualification}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={this.state.isSecurePassword1}
            // disableImg={true}
            // iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   this.setState({
            //     isSecurePassword1: !this.state.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // this.experienceInput.focus()
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
              // this.setState({
              //   imageType: 'certificate',
              //   mediamodal: true
              // }, () => {
              //   //this.Galleryopen()
              // });
            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  // paddingLeft:mobileW*2/100,
                  // textAlign: config.textalign,
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
                //this.props.navigation.navigate('Forgotpage');
              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
              }} numberOfLines={1}>
              {(this.state.certificate != undefined) ? this.state.certificate.filename.trim() : 'No Attachment'}
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
            // borderColor: this.state.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
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
              this.experienceInput = ref;
            }}
            onChangeText={(text) =>
              this.setState({ experience: text })
            }
            value={this.state.experience}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={this.state.isSecurePassword1}
            // disableImg={true}
            // iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   this.setState({
            //     isSecurePassword1: !this.state.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // this.scfhs_numberInput.focus()
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
              textAlign: config.textRotate,
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
            // borderColor: this.state.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
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
              this.hosp_moh_lic_noInput = ref;
            }}
            maxLength={15}
            onChangeText={(text) =>
              this.setState({ hosp_moh_lic_no: text })
            }
            value={this.state.hosp_moh_lic_no}
            editable={(this.state.hosp_moh_lic_no != null) ? false : true}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={this.state.isSecurePassword1}
            // disableImg={true}
            // iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   this.setState({
            //     isSecurePassword1: !this.state.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // this.qualificationInput.focus()
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
              // this.setState({
              //   imageType: 'id_image',
              //   mediamodal: true
              // }, () => {
              //   // this.Galleryopen()
              //   // this.uploadVoiceFile()
              // });

            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  // paddingLeft:mobileW*2/100,
                  // textAlign: config.textalign,
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
                //this.props.navigation.navigate('Forgotpage');
              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
              }}>
              {(this.state.moh_lic_image != undefined) ? this.state.moh_lic_image.filename.trim() : 'No Attachment'}
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
              textAlign: config.textRotate,
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
            // borderColor: this.state.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
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
              this.hosp_reg_noInput = ref;
            }}
            maxLength={15}
            onChangeText={(text) =>
              this.setState({ hosp_reg_no: text })
            }
            value={this.state.hosp_reg_no}
            editable={(this.state.hosp_reg_no != null) ? false : true}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={this.state.isSecurePassword1}
            // disableImg={true}
            // iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   this.setState({
            //     isSecurePassword1: !this.state.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // this.qualificationInput.focus()
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
              // this.setState({
              //   imageType: 'certificate',
              //   mediamodal: true
              // }, () => {
              //   // this.Galleryopen()
              //   // this.uploadVoiceFile()
              // });

            }}
          >
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>

              <Text
                style={{
                  color: Colors.textblue,
                  fontFamily: Font.Regular,
                  // paddingLeft:mobileW*2/100,
                  // textAlign: config.textalign,
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
                //this.props.navigation.navigate('Forgotpage');
              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
              }}>
              {(this.state.hosp_reg_image != undefined) ? this.state.hosp_reg_image.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
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
        {
          (this.state.isDatePickerVisibletwo && this.state.user_type == "lab") ?
            <MonthPicker
              // isVisible={this.state.isDatePickerVisibletwo}
              onChange={(event, date) => {
                console.log('event:: ', event);
                console.log('datedate:: ', date);
                console.log('getFullYear:: ', new Date(date).getFullYear());
                // this.setdatetwo(date),
                this.setState({
                  dob_date: new Date(date).getFullYear(),
                  isDatePickerVisibletwo: false
                })
              }}
              value={this.state.date_new}
              // minimumDate={new Date()}
              maximumDate={new Date()}
            // locale="ko"
            /> :
            <DateTimePicker
              isVisible={this.state.isDatePickerVisibletwo}
              mode="date"
              value={this.state.date_new}
              maximumDate={new Date()}
              onConfirm={(date) => { this.setdatetwo(date), this.setState({ isDatePickerVisibletwo: false }) }}
              onCancel={() => { this.setState({ isDatePickerVisibletwo: false }) }}
            />
        }


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
            title={Lang_chg.Editprofile[config.language]}
            style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />
          <ScrollView
            style={{ backgroundColor: 'white', marginTop: 10 }}
            contentContainerStyle={{ paddingBottom: mobileW * 15 / 100 }}
            showsVerticalScrollIndicator={false}>
            <KeyboardAwareScrollView>
              {/* //----------------------------------------------------------------------------tab */}
              <Cameragallery mediamodal={this.state.mediamodal}
                isCamera={true}
                isGallery={true}
                isDocument={false}
                Camerapopen={() => { this.Camerapopen() }}
                Galleryopen={() => { this.Galleryopen() }}
                Canclemedia={() => { this.setState({ mediamodal: false }) }}
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
                    this.setState({ pbtn: true, mbtn: false, lbtn: false });
                  }}
                  style={{ width: '33%', alignSelf: 'center', }}>
                  <View style={{ width: '100%', }}>
                    <Text
                      style={
                        this.state.pbtn == true
                          ? {
                            color: Colors.textblue,

                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                          : {
                            color: Colors.tablightcolo,
                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                          }
                      }>
                      {Lang_chg.tabnameprofile[config.language]}
                    </Text>


                    <View style={this.state.pbtn == true ? { width: mobileW * 28 / 100, alignSelf: 'center', borderWidth: 2.2, borderColor: Colors.bordercolorblue, borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.bordercolorblue, alignSelf: 'center' } : { width: mobileW * 30 / 100, alignSelf: 'center', borderColor: Colors.tab_background_color, borderWidth: 2.5 }}></View>

                  </View>


                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({ pbtn: false, mbtn: true, lbtn: false });
                  }}
                  style={{ width: '33%' }}>
                  <View style={{ width: '100%' }}>
                    <Text
                      style={
                        this.state.mbtn == true
                          ? {
                            color: Colors.textblue,

                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                          : {
                            color: Colors.tablightcolo,
                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                          }
                      }>
                      {Lang_chg.tabnamemedical[config.language]}
                    </Text>
                    <View style={this.state.mbtn == true ? { width: mobileW * 28 / 100, alignSelf: 'center', borderWidth: 2.2, borderColor: Colors.bordercolorblue, borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.bordercolorblue, alignSelf: 'center' } : { width: mobileW * 30 / 100, alignSelf: 'center', borderColor: Colors.tab_background_color, borderWidth: 2.5 }}></View>



                  </View>


                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this.setState({ pbtn: false, mbtn: false, lbtn: true });
                  }}
                  style={{ width: '33%' }}>
                  <View style={{ width: '100%', }}>
                    <Text
                      style={
                        this.state.lbtn == true
                          ? {
                            color: Colors.textblue,

                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                            paddingVertical: (mobileW * 3) / 100,
                          }
                          : {
                            color: Colors.tablightcolo,
                            fontFamily: Font.blackheadingfontfamily,
                            fontSize: Font.tabtextsize,
                            textAlign: config.textalign,
                            alignSelf: 'center',
                          }
                      }>
                      {Lang_chg.tabnamelifestyle[config.language]}
                    </Text>
                  </View>

                  <View style={this.state.lbtn == true ? { width: mobileW * 28 / 100, alignSelf: 'center', borderWidth: 2.2, borderColor: Colors.bordercolorblue, borderTopLeftRadius: mobileW * 2 / 100, borderTopRightRadius: mobileW * 2 / 100, backgroundColor: Colors.bordercolorblue, alignSelf: 'center' } : { width: mobileW * 30 / 100, alignSelf: 'center', borderColor: Colors.tab_background_color, borderWidth: 2.5 }}></View>
                </TouchableOpacity>
              </View> */}


              {/* -------------------------------personal-------------------------- */}
              {this.state.pbtn == true && (
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
                          source={this.state.profile_img == 'NA' || this.state.profile_img == null || this.state.profile_img == '' ? Icons.ProfileImage : { uri: this.state.profile_img }}
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
                          textAlign: config.textRotate,
                        }}>{this.state.name}</Text>
                      </View>

                      <View style={{ width: '100%', alignSelf: 'center', marginTop: mobileW * 1 / 100 }}>
                        <Text
                          style={{
                            color: Colors.placeholder_textcolorlight,
                            fontFamily: Font.Regular,
                            fontSize: 14, //(mobileW * 3) / 100,
                            textAlign: config.textRotate,
                          }}>{this.state.email}
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
                      <TouchableOpacity onPress={() => { this.setState({ mediamodal: true }) }}>
                        <Image
                          style={{
                            height: (mobileW * 3.5) / 100,
                            width: (mobileW * 3.5) / 100,
                            alignSelf: 'center',
                            marginTop: (mobileW * 1.8) / 100,

                          }}
                          source={Icons.camera}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* --------------------------------------------------------------------------- usertype */}

                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 10) / 100,
                      borderColor: Colors.placeholder_border, // this.state.namefocus == true ? Colors.placholderactive : Colors.placeholder_border,
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
                          }}>{this.state.display_user_type}</Text>
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
                      // borderColor: this.state.namefocus == true ? Colors.placholderactive : Colors.placeholder_border,
                      // borderWidth: 1,
                      // borderRadius: mobileW * 1 / 100,
                    }}>
                    <AuthInputBoxSec
                      mainContainer={{
                        width: '100%',
                      }}
                      // icon={layer9_icon}
                      lableText={Lang_chg.textinputname[config.language]}
                      inputRef={(ref) => {
                        this.nameInput = ref;
                      }}
                      onChangeText={(text) =>
                        this.setState({ name: text })
                      }
                      value={this.state.name}
                      keyboardType="default"
                      autoCapitalize="none"
                      returnKeyLabel='done'
                      returnKeyType='done'
                      onSubmitEditing={() => {
                        //this.passwordInput.focus();
                      }}
                    />
                    {/* <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: config.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={50}
                        placeholder={this.state.namefocus != true ? Lang_chg.textinputname[config.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { this.setState({ name: txt }) }}
                        value={this.state.name}
                        onFocus={() => { this.setState({ namefocus: true }) }}
                        onBlur={() => { this.setState({ namefocus: this.state.name.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      /> */}
                    {/* {this.state.namefocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign, }}>{Lang_chg.textinputname[config.language]}</Text>
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
                        textAlign: config.textRotate,
                        fontSize: Font.headinggray,
                        fontFamily: Font.headingfontfamily,
                        color: Colors.placeholder_text,
                      }}>
                      {Lang_chg.selectcountrytitle[config.language]}
                    </Text>
                  </View>

                  <DropDownboxSec
                    lableText={this.state.work_area.length <= 0 ? Lang_chg.select[config.language] : this.state.work_area}
                    boxPressAction={() => {
                      // this.setState({ bloodModal: true });
                    }}
                    isDisabled={true}
                  />

                  <View style={{ flexDirection: 'row', alignItems: 'center', width: mobileW * 90 / 100, justifyContent: 'space-between', alignSelf: 'center', }}>
                    <View
                      style={{
                        width: '20%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 3) / 100,
                        // borderColor: this.state.country_code.length > 0 ? '#0057A5' : Colors.placeholder_border,
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
                        lableText={Lang_chg.CC_code[config.language]}
                        inputRef={(ref) => {
                          this.country_codeInput = ref;
                        }}
                        onChangeText={(text) =>
                          this.setState({ country_code: text })
                        }
                        maxLength={3}
                        editable={false}
                        value={this.state.country_code}
                        keyboardType="number-pad"
                        autoCapitalize="none"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          //this.passwordInput.focus();
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
                          this.state.country_codefocus != true
                            ? Lang_chg.CC_code[config.language]
                            : null
                        }
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={txt => {
                          this.setState({ country_code: txt });
                        }}

                        onFocus={() => {
                          this.setState({ country_codefocus: true });
                        }}
                        onBlur={() => {
                          this.setState({
                            country_codefocus: this.state.country_code.length > 0 ? true : false,
                          });
                        }}

                        value={"" + this.state.country_code + ""}
                        keyboardType="number-pad"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        onSubmitEditing={() => { Keyboard.dismiss() }}
                      />

                      {this.state.country_code.length > 0 &&
                        <View
                          style={{
                            position: 'absolute',
                            backgroundColor: 'white',
                            left: (mobileW * 5) / 100,
                            top: (-mobileW * 2) / 100,
                            paddingHorizontal: (mobileW * 1) / 100,
                          }}>
                          <Text style={{ color: '#0057A5' }}>
                            {Lang_chg.CC_code[config.language]}
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
                        lableText={Lang_chg.textinputnumber[config.language]}
                        inputRef={(ref) => {
                          this.mobileInput = ref;
                        }}
                        maxLength={9}
                        onChangeText={(text) =>
                          this.setState({ mobile: text })
                        }
                        value={this.state.mobile}
                        keyboardType="number-pad"
                        autoCapitalize="none"
                        returnKeyLabel='done'
                        returnKeyType='done'
                        onSubmitEditing={() => {
                          //this.passwordInput.focus();
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
                            textAlign: config.textRotate,
                            fontSize: Font.textsize,
                            fontFamily: Font.headingfontfamily,
                            color: Colors.textgray,
                          }}>
                          {Lang_chg.mobletexttitle[config.language]}
                        </Text>
                      </View>

                      {/* <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: config.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,
                          marginLeft: mobileW * 1.5 / 100

                        }}
                        maxLength={50}
                        placeholder={this.state.numberfocus != true ? Lang_chg.textinputnumber[config.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { this.setState({ mobile: txt }) }}
                        value={this.state.mobile}
                        onFocus={() => { this.setState({ numberfocus: true }) }}
                        onBlur={() => { this.setState({ numberfocus: this.state.mobile.length > 0 ? true : false }) }}
                        keyboardType='number-pad'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />

                      {this.state.numberfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputnumber[config.language]}</Text>
                      </View>} */}

                    </View>
                  </View>
                  {/* //---------------email */}


                  <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
                    //borderColor: this.state.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <AuthInputBoxSec
                      mainContainer={{
                        width: '100%',
                      }}
                      // icon={layer9_icon}
                      lableText={Lang_chg.Mobileno[config.language]}
                      inputRef={(ref) => {
                        this.emailInput = ref;
                      }}
                      onChangeText={(text) =>
                        this.setState({ email: text })
                      }
                      value={this.state.email}
                      editable={false}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        // this.mobileInput.focus();
                      }}
                    />
                    {/* <View style={{ width: '95%', alignSelf: 'center', }}>
                    
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: config.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={100}
                        placeholder={this.state.emailfocus != true ? Lang_chg.textinputemails[config.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { this.setState({ email: txt }) }}
                        value={this.state.email}
                        editable={false}
                        onFocus={() => { this.setState({ emailfocus: true }) }}
                        onBlur={() => { this.setState({ emailfocus: this.state.email.length > 0 ? true : false }) }}
                        keyboardType='email-address'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {this.state.emailfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputemails[config.language]}</Text>
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
                        textAlign: config.textRotate,
                        fontSize: Font.headinggray,
                        fontFamily: Font.headingfontfamily,
                        color: Colors.placeholder_text,
                      }}>
                      {(this.state?.user_type == "lab") ? "Year of Establishment" : Lang_chg.dob[config.language]}
                    </Text>
                  </View>
                  <View style={{
                    width: '90%', height: 48, alignSelf: 'center', marginTop: mobileW * 2 / 100, flexDirection: 'row',
                    borderColor: Colors.field_border_color, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <TouchableOpacity
                      onPress={() => { this.setState({ isDatePickerVisibletwo: true }) }}
                      style={{ width: '100%', flexDirection: 'row' }}>
                      <View style={{ width: '1%' }}>
                      </View>
                      <View style={{
                        width: '100%',
                        height: Font.placeholder_height,
                        marginLeft: mobileW * 2 / 100, alignItems: 'center', flexDirection: 'row'
                      }}>
                        <Text style={{
                          width: '78%', textAlign: config.textRotate,
                          color: Colors.placeholder_text,
                          fontFamily: Font.Regular,
                          fontSize: Font.placeholdersize,
                        }}>{this.state.dob_date.length <= 0 ? (this.state.user_type == "lab") ? "Year of Establishment" : Lang_chg.dob[config.language] : this.state.dob_date}</Text>
                        <View style={{ width: '15%', alignSelf: 'center', alignItems: 'flex-end' }}>

                          <Image source={Icons.dobimg}
                            style={{ height: 25, width: 25 }}>
                          </Image>
                        </View>
                      </View>


                    </TouchableOpacity>

                    {this.state.dobfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.1 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{
                        color: this.state.dob_date.length <= 0 ? '#0057A5' : Colors.gray4,
                        fontSize: Font.sregulartext_size,
                        fontFamily: Font.placeholderfontfamily,
                        textAlign: config.textalign
                      }}>{(this.state.user_type == "lab") ? "Year of Establishment" : Lang_chg.dob[config.language]}</Text>
                    </View>}

                  </View>

                  {/* <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100, flexDirection: 'row',
                    borderColor: this.state.dobfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <TouchableOpacity onPress={() => { this.setState({ isDatePickerVisibletwo: true }) }} style={{ width: '100%', flexDirection: 'row' }}>
                      <View style={{ width: '1%' }}>
                      </View>
                      <View style={{ width: '100%', height: Font.placeholder_height, marginLeft: mobileW * 2 / 100, alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ width: '78%', textAlign: config.textRotate, color: Colors.placeholder_text }}>{this.state.dob_date.length <= 0 ? Lang_chg.dob[config.language] : this.state.dob_date}</Text>
                        <View style={{ width: '15%', alignSelf: 'center', alignItems: 'flex-end' }}>

                          <Image source={Icons.dobimg}
                            style={{ height: 25, width: 25 }}>
                          </Image>
                        </View>
                      </View>


                    </TouchableOpacity>

                    {this.state.dobfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.dob[config.language]}</Text>
                    </View>}

                  </View> */}
                  {/* -----------------------------------radiobtn------------------------------- */}
                  {
                    (this.state.user_type == "lab") &&
                    <View style={{
                      width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
                      //borderColor: this.state.emailfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                    }}>
                      <AuthInputBoxSec
                        mainContainer={{
                          width: '100%',
                        }}
                        // icon={layer9_icon}
                        lableText={Lang_chg.textinputaddress[config.language]}
                        inputRef={(ref) => {
                          this.addressInput = ref;
                        }}
                        maxLength={50}
                        onChangeText={(text) =>
                          this.setState({ address: text })
                        }
                        value={this.state.address}
                        // editable={false}
                        keyboardType="default"
                        autoCapitalize="none"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          // this.mobileInput.focus();
                        }}
                      />


                    </View>
                  }

                  {/* -----------------------------------radiobtn------------------------------- */}
                  {
                    (this.state.user_type != "lab") &&
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
                            textAlign: config.textRotate,
                          }}>
                          {Lang_chg.Gender[config.language]}
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
                            {/* {this.state.mabtn == false && */}
                            <TouchableOpacity onPress={() => { this.setState({ mabtn: true, febtn: false, gender: 'Male' }); }}
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                flexDirection: 'row',
                              }} disabled >
                              <Icon style={{ alignSelf: 'center' }}
                                name={(this.state.mabtn == false) ? "circle-thin" : "dot-circle-o"}
                                size={22}
                                color={(this.state.mabtn == false) ? '#8F98A7' : '#0168B3'}></Icon>

                              <View style={{ width: '70%', alignSelf: 'center' }}>
                                <Text
                                  style={{
                                    marginLeft: mobileW * 1.5 / 100,
                                    textAlign: config.textRotate,
                                    color: Colors.placeholder_text,
                                    fontFamily: Font.Regular,
                                    fontSize: Font.placeholdersize,
                                  }}>
                                  {Lang_chg.male[config.language]}
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
                            {/* {this.state.febtn == false && */}
                            <TouchableOpacity onPress={() => { this.setState({ febtn: true, mabtn: false, gender: 'Female' }) }}
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                flexDirection: 'row',
                                alignItems: 'center'
                              }} disabled>
                              <Icon style={{ alignSelf: 'center' }}
                                name={(this.state.febtn == false) ? "circle-thin" : "dot-circle-o"}
                                size={22}
                                color={(this.state.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>

                              <Text
                                style={{
                                  textAlign: config.textRotate,
                                  marginLeft: mobileW * 1.5 / 100,
                                  color: Colors.placeholder_text,
                                  fontFamily: Font.Regular,
                                  fontSize: Font.placeholdersize,
                                  // alignSelf: 'center',
                                }}>
                                {Lang_chg.female[config.language]}
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
                          textAlign: config.textRotate,
                        }}>
                        {Lang_chg.Gender[config.language]}
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
                          {this.state.mabtn == false &&
                            <TouchableOpacity onPress={() => { this.setState({ mabtn: true, febtn: false, gender: 'Male' }); }}
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
                                    textAlign: config.textRotate

                                  }}>
                                  {Lang_chg.male[config.language]}
                                </Text>
                              </View>
                            </TouchableOpacity>}
                          {this.state.mabtn == true &&
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
                                    textAlign: config.textRotate

                                  }}>
                                  {Lang_chg.male[config.language]}
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
                          {this.state.febtn == false &&
                            <TouchableOpacity onPress={() => { this.setState({ febtn: true, mabtn: false, gender: 'Female' }) }}
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
                                  textAlign: config.textRotate,
                                  fontSize: mobileW * 4.1 / 100,
                                  fontFamily: Font.placeholderfontfamily,
                                  marginLeft: mobileW * 1.5 / 100
                                  // alignSelf: 'center',
                                }}>
                                {Lang_chg.female[config.language]}
                              </Text>

                            </TouchableOpacity>}
                          {this.state.febtn == true &&
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
                                  textAlign: config.textRotate,
                                  fontSize: mobileW * 4.1 / 100,
                                  fontFamily: Font.placeholderfontfamily,
                                  marginLeft: mobileW * 1.5 / 100
                                  // alignSelf: 'center',
                                }}>
                                {Lang_chg.female[config.language]}
                              </Text>

                            </View>}


                        </View>



                      </View>
                    </View>
                  </View> */}


                  {/* ================================nationality======================================= */}
                  {/* <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100, flexDirection: 'row',
                    borderColor: this.state.nationalityfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <TouchableOpacity onPress={() => { this.setState({ nationalityModal: true }); }}>
                      <View style={{
                        width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: Font.placeholder_height,
                        borderRadius: mobileW * 1 / 100, justifyContent: 'center'
                      }}>
                        <View style={{ width: '1%' }}>

                        </View>
                        <Text style={{ width: '77%', alignSelf: 'center', color: Colors.textblack, fontSize: Font.placeholdersize, textAlign: config.textRotate, fontFamily: Font.placeholderfontfamily }}>{this.state.nationality.length <= 0 ? Lang_chg.nationality[config.language] : this.state.nationality}</Text>
                        <View style={{ width: '20%', alignSelf: 'center', alignItems: 'flex-end' }}>
                          <Image source={Icons.downarrow} style={{ height: 16, width: 16 }}>
                          </Image>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {this.state.nationalityfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textRotate }}>{Lang_chg.nationality[config.language]}</Text>
                    </View>}
                  </View> */}




                  {/* ===================================address==================================== */}
                  {/* <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
                    borderColor: this.state.addressfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: config.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={50}
                        placeholder={this.state.addressfocus != true ? Lang_chg.textinputaddress[config.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { this.setState({ address: txt }) }}
                        value={this.state.address}
                        onFocus={() => { this.setState({ addressfocus: true }) }}
                        onBlur={() => { this.setState({ addressfocus: this.state.address.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {this.state.addressfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputaddress[config.language]}</Text>
                    </View>}

                  </View> */}

                  {/* =================================identity================================ */}
                  {/* <View style={{
                    width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100,
                    borderColor: this.state.identityfocus == true ? Colors.placholderactive : Colors.placeholder_border, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <View style={{ width: '95%', alignSelf: 'center', }}>
                      <TextInput
                        style={{
                          width: '100%',
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          textAlign: config.textalign,
                          height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,

                        }}
                        maxLength={15}
                        placeholder={this.state.identityfocus != true ? Lang_chg.textinputidentity[config.language] : null}
                        placeholderTextColor={Colors.placeholder_text}
                        onChangeText={(txt) => { this.setState({ identity: txt }) }}
                        value={this.state.identity}
                        onFocus={() => { this.setState({ identityfocus: true }) }}
                        onBlur={() => { this.setState({ identityfocus: this.state.identity.length > 0 ? true : false }) }}
                        keyboardType='default'
                        returnKeyLabel='done'
                        returnKeyType='done'
                      />
                    </View>
                    {this.state.identityfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputidentity[config.language]}</Text>
                    </View>}

                  </View> */}

                  {
                    (this.state.user_type == "nurse" || this.state.user_type == "physiotherapy"
                      || this.state.user_type == "doctor") &&
                    <>
                      {this.renderIDNumber()}
                      {this.renderSpeExpCer()}
                      {this.renderExpRegid()}
                    </>
                  }

                  {
                    (this.state.user_type == "caregiver" || this.state.user_type == "babysitter") &&
                    <>
                      {this.renderIDNumber()}
                      {this.renderExpCer()}
                      {this.renderExp()}
                    </>
                  }

                  {
                    (this.state.user_type == "lab") &&
                    <>
                      {this.renderHealthIDNumber()}
                      {this.renderCRC()}
                    </>
                  }

                  <View style={{
                    width: '90%', alignSelf: 'center',
                    marginTop: mobileW * 3 / 100,
                    justifyContent: 'flex-start'
                    // borderColor: this.state.selectissuefocus == true ? '#0057A5' : Colors.bordercolor, borderWidth: mobileW * 0.3 / 100, borderRadius: mobileW * 2 / 100, height: mobileW * 40 / 100
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
                        textAlign: config.textalign,
                        fontFamily: Font.placeholderfontfamily,
                        textAlignVertical: 'top',
                        alignSelf: 'flex-start'
                        // paddingVertical: mobileW * 3 / 100,

                      }}
                      // icon={layer9_icon}
                      lableText={'About'}
                      inputRef={(ref) => {
                        this.messageInput = ref;
                      }}
                      onChangeText={(text) =>
                        this.setState({ description: text })
                      }
                      value={this.state.description}
                      maxLength={250}
                      multiline={true}
                      keyboardType="default"
                      autoCapitalize="none"
                      returnKeyType="next"
                    // onSubmitEditing={() => {
                    //   this.emailInput.focus();
                    // }}
                    />
                  </View>

                  {/* ==========================================person btn================================ */}
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

                </View>
              )}


              {/* ----------------------------------------------------------------------------------------------medical btn */}


              {this.state.mbtn == true && (
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
                          textAlign: config.textRotate,
                          // textAlign:config.textalign,
                        }}>
                        {Lang_chg.allergies[config.language]}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: '90%', alignSelf: 'center', marginTop: (mobileW * 2) / 100, }}>
                    <Text
                      style={{
                        color: Colors.textgray_que,
                        fontFamily: Font.allergies_heading_fontfamily,
                        fontSize: Font.quessize,
                        textAlign: config.textRotate,
                        // textAlign:config.textalign,


                      }}>
                      {Lang_chg.q1[config.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '88%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 3) / 100,
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setalergy('Yes') }}
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
                            name={this.state.allergies == 'Yes' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setalergy('No'); }}
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

                          <Icon name={this.state.allergies == 'No' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                    {this.state.allergies == 'Yes' &&

                      <View
                        style={{
                          width: '90%',
                          alignSelf: 'center',
                          marginTop: (mobileW * 6) / 100,
                          borderColor: this.state.allergiesfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                          borderWidth: mobileW * 0.3 / 100,
                          borderRadius: (mobileW * 1) / 100
                        }}>


                        <View style={{ width: '95%', alignSelf: 'center' }}>
                          <TextInput
                            style={{
                              width: '100%',
                              color: Colors.textblack,
                              fontSize: Font.placeholdersize,
                              textAlign: config.textalign,
                              height: (mobileW * 12) / 100,
                              fontFamily: Font.placeholderfontfamily,
                              borderRadius: (mobileW * 1) / 100,

                            }}
                            maxLength={70}
                            placeholder={this.state.allergiesfocus != true ? Lang_chg.textinputallierdies[config.language] : null}
                            placeholderTextColor={Colors.placeholder_text}
                            onChangeText={(txt) => { this.setState({ allergies_data: txt }) }}
                            value={this.state.allergies_data}
                            onFocus={() => { this.setState({ allergiesfocus: true }) }}
                            onBlur={() => { this.setState({ allergiesfocus: this.state.allergies_data.length > 0 ? true : false }) }}

                            returnKeyLabel="done"
                            returnKeyType="done"
                          />
                        </View>
                        {this.state.allergiesfocus == true && (
                          <View
                            style={{
                              position: 'absolute',
                              backgroundColor: 'white',
                              left: (mobileW * 4) / 100,
                              top: (-mobileW * 2) / 100,
                              paddingHorizontal: (mobileW * 1) / 100,
                            }}>
                            <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputallierdies[config.language]}</Text>
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
                          textAlign: config.textRotate,

                        }}>
                        {Lang_chg.current[config.language]}
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
                        textAlign: config.textRotate,

                      }}>
                      {Lang_chg.q2[config.language]}
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
                      this.setcurrentmadiciens('Yes')
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
                            name={this.state.current_medication == 'Yes' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                      this.setcurrentmadiciens('No')
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
                            name={this.state.current_medication == 'No' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                    {this.state.current_medication == 'Yes' && <View
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 5) / 100,
                        borderColor: this.state.currentfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                        borderWidth: 1,
                        borderRadius: (mobileW * 1) / 100,
                      }}>





                      <View style={{ width: '95%', alignSelf: 'center', }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.textblack,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textalign,
                            height: (mobileW * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (mobileW * 1) / 100,

                          }}
                          maxLength={50}
                          placeholder={this.state.currentfocus != true ? Lang_chg.textinputcurrent[config.language] : null}
                          placeholderTextColor={Colors.placeholder_text}
                          onChangeText={(txt) => { this.setState({ current_medication_data: txt }) }}
                          value={this.state.current_medication_data}
                          onFocus={() => { this.setState({ currentfocus: true }) }}
                          onBlur={() => { this.setState({ currentfocus: this.state.current_medication_data.length > 0 ? true : false }) }}
                          keyboardType='default'
                          returnKeyLabel='done'
                          returnKeyType='done'
                        />
                      </View>
                      {this.state.currentfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputcurrent[config.language]}</Text>
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
                          textAlign: config.textRotate,

                        }}>
                        {Lang_chg.pastmedication[config.language]}
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
                        textAlign: config.textRotate,

                      }}>
                      {Lang_chg.q3[config.language]}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '88%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 3) / 100,
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setpastmedician('Yes') }}
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
                            name={this.state.past_medication == 'Yes' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} onPress={() => {
                      this.setpastmedician('No')
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
                            name={this.state.past_medication == 'No' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                    {this.state.past_medication == 'Yes' && <View
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 5) / 100,
                        borderColor: this.state.pastfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                        borderWidth: 1,
                        borderRadius: (mobileW * 1) / 100,
                      }}>





                      <View style={{ width: '95%', alignSelf: 'center', }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.textblack,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textalign,
                            height: (mobileW * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (mobileW * 1) / 100,

                          }}
                          maxLength={50}
                          placeholder={this.state.pastfocus != true ? Lang_chg.textinputpastmedication[config.language] : null}
                          placeholderTextColor={Colors.placeholder_text}
                          onChangeText={(txt) => { this.setState({ past_medication_data: txt }) }}
                          value={this.state.past_medication_data}
                          onFocus={() => { this.setState({ pastfocus: true }) }}
                          onBlur={() => { this.setState({ pastfocus: this.state.past_medication_data.length > 0 ? true : false }) }}
                          keyboardType='default'
                          returnKeyLabel='done'
                          returnKeyType='done'
                        />
                      </View>
                      {this.state.pastfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputpastmedication[config.language]}</Text>
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
                          textAlign: config.textRotate,

                        }}>
                        {Lang_chg.injuries[config.language]}
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
                        textAlign: config.textRotate,

                      }}>
                      {Lang_chg.q4[config.language]}
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
                      this.setinjuries('Yes')
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
                            name={this.state.injuries == 'Yes' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setinjuries('No') }}
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
                            name={this.state.injuries == 'No' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                    {this.state.injuries == 'Yes' && <View
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 5) / 100,
                        borderColor: this.state.injuriesfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                        borderWidth: 1,
                        borderRadius: (mobileW * 1) / 100,
                      }}>





                      <View style={{ width: '95%', alignSelf: 'center', }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.textblack,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textalign,
                            height: (mobileW * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (mobileW * 1) / 100,

                          }}
                          maxLength={50}
                          placeholder={this.state.injuriesfocus != true ? Lang_chg.textinputinjuries[config.language] : null}
                          placeholderTextColor={Colors.placeholder_text}
                          onChangeText={(txt) => { this.setState({ injuries_data: txt }) }}
                          value={this.state.injuries_data}
                          onFocus={() => { this.setState({ injuriesfocus: true }) }}
                          onBlur={() => { this.setState({ injuriesfocus: this.state.injuries_data.length > 0 ? true : false }) }}
                          keyboardType='default'
                          returnKeyLabel='done'
                          returnKeyType='done'
                        />
                      </View>
                      {this.state.injuriesfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputinjuries[config.language]}</Text>
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
                          textAlign: config.textRotate,

                        }}>
                        {Lang_chg.surgeries[config.language]}
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
                        textAlign: config.textRotate,

                      }}>
                      {Lang_chg.q5[config.language]}
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
                      this.setsurgeries('Yes')
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
                            name={this.state.surgeries == 'Yes' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.yes_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                      this.setsurgeries('No')
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
                            name={this.state.surgeries == 'No' ? "dot-circle-o" : "circle-thin"}
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
                          {Lang_chg.no_txt[config.language]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                    {this.state.surgeries == 'Yes' && <View
                      style={{
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 5) / 100,
                        borderColor: this.state.sugeriesfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                        borderWidth: 1,
                        borderRadius: (mobileW * 1) / 100,
                      }}>





                      <View style={{ width: '95%', alignSelf: 'center', }}>
                        <TextInput
                          style={{
                            width: '100%',
                            color: Colors.textblack,
                            fontSize: Font.placeholdersize,
                            textAlign: config.textalign,
                            height: (mobileW * 12) / 100,
                            fontFamily: Font.placeholderfontfamily,
                            borderRadius: (mobileW * 1) / 100,

                          }}
                          maxLength={50}
                          placeholder={this.state.sugeriesfocus != true ? Lang_chg.textinputsurgeries[config.language] : null}
                          placeholderTextColor={Colors.placeholder_text}
                          onChangeText={(txt) => { this.setState({ surgeries_data: txt }) }}
                          value={this.state.surgeries_data}
                          onFocus={() => { this.setState({ sugeriesfocus: true }) }}
                          onBlur={() => { this.setState({ sugeriesfocus: this.state.surgeries_data.length > 0 ? true : false }) }}
                          keyboardType='default'
                          returnKeyLabel='done'
                          returnKeyType='done'
                        />
                      </View>
                      {this.state.sugeriesfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputsurgeries[config.language]}</Text>
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
                            textAlign: config.textRotate,

                          }}>
                          {Lang_chg.chronic[config.language]}
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
                          textAlign: config.textRotate,

                        }}>
                        {Lang_chg.q6[config.language]}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: '88%',
                        alignSelf: 'center',
                        marginTop: (mobileW * 3) / 100,
                        flexDirection: 'row',

                      }}>
                      <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setchronic_diseases('Yes') }}
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
                              name={this.state.chronic_diseases == 'Yes' ? "dot-circle-o" : "circle-thin"}
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
                            {Lang_chg.yes_txt[config.language]}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => { this.setchronic_diseases('No') }}
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
                              name={this.state.chronic_diseases == 'No' ? "dot-circle-o" : "circle-thin"}
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
                            {Lang_chg.no_txt[config.language]}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: (mobileW * 3) / 100 }}>
                      {this.state.chronic_diseases == 'Yes' && <View
                        style={{
                          width: '90%',
                          alignSelf: 'center',
                          marginTop: (mobileW * 5) / 100,
                          borderColor: this.state.chronicfocus == true ? Colors.placholderactive : Colors.placeholder_border,
                          borderWidth: 1,
                          borderRadius: (mobileW * 1) / 100,
                        }}>





                        <View style={{ width: '95%', alignSelf: 'center', }}>
                          <TextInput
                            style={{
                              width: '100%',
                              color: Colors.textblack,
                              fontSize: Font.placeholdersize,
                              textAlign: config.textalign,
                              height: (mobileW * 12) / 100,
                              fontFamily: Font.placeholderfontfamily,
                              borderRadius: (mobileW * 1) / 100,

                            }}
                            maxLength={50}
                            placeholder={this.state.chronicfocus != true ? Lang_chg.textinputchronic[config.language] : null}
                            placeholderTextColor={Colors.placeholder_text}
                            onChangeText={(txt) => { this.setState({ chronic_diseases_data: txt }) }}
                            value={this.state.chronic_diseases_data}
                            onFocus={() => { this.setState({ chronicfocus: true }) }}
                            onBlur={() => { this.setState({ chronicfocus: this.state.chronic_diseases_data.length > 0 ? true : false }) }}
                            keyboardType='default'
                            returnKeyLabel='done'
                            returnKeyType='done'
                          />
                        </View>
                        {this.state.chronicfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                          <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.textinputchronic[config.language]}</Text>
                        </View>}




                      </View>


                      }
                    </View>
                  </View>
                  <View style={{ paddingBottom: (mobileW * 5) / 100, backgroundColor: Colors.tab_background_color }}>
                    <TouchableOpacity onPress={() => { this.medical_click() }}
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
                        {Lang_chg.savebtntext[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>





                </View>

              )}


              {/* ----------------------------------------------------------------------lifebtn */}

              {this.state.lbtn == true && (
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
                          textAlign: config.textRotate

                        }}>
                        {Lang_chg.smoking[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: '90%', alignSelf: 'center' }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ yesNoModal: true, smoking_btn: true });
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
                          <Text style={{ fontSize: (mobileW * 3.7) / 100, fontFamily: Font.Regular, textAlign: config.textRotate }}>
                            {this.state.smoking.length <= 0 ? Lang_chg.select[config.language] : this.state.smoking}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: '20%', alignSelf: 'center' }}>
                            <Image
                              style={{
                                height: (mobileW * 4) / 100,
                                width: (mobileW * 4) / 100,
                                alignSelf: 'flex-end',
                              }}
                              source={Icons.downarrow}></Image>
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
                          textAlign: config.textRotate

                        }}>
                        {Lang_chg.Alcohol[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: '90%', alignSelf: 'center' }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ yesNoModal: true, smoking_btn: false });
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
                            {this.state.alcohol.length <= 0 ? Lang_chg.select[config.language] : this.state.alcohol}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: '20%', alignSelf: 'center' }}>
                            <Image
                              style={{
                                height: (mobileW * 4) / 100,
                                width: (mobileW * 4) / 100,
                                alignSelf: 'flex-end',
                              }}
                              source={Icons.downarrow}></Image>
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
                          textAlign: config.textRotate
                        }}>
                        {Lang_chg.blood[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: '90%', alignSelf: 'center' }}>
                      <TouchableOpacity onPress={() => {
                        this.setState({
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
                          <Text style={{ fontSize: (mobileW * 3.7) / 100, textAlign: config.textRotate }}>{this.state.blood_group.length <= 0 ? Lang_chg.select[config.language] : this.state.blood_group}</Text>
                          {/* </View> */}

                          <View style={{ width: '20%', alignSelf: 'center' }}>
                            <Image
                              style={{
                                height: (mobileW * 4) / 100,
                                width: (mobileW * 4) / 100,
                                alignSelf: 'flex-end',
                              }}
                              source={Icons.downarrow}></Image>
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
                          textAlign: config.textRotate
                        }}>
                        {Lang_chg.activity[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: '90%', alignSelf: 'center' }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ occ_food_activity: 'activity', occ_food_activitymodal: true, occ_food_activity_arr: this.state.activity_arr })
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
                          <Text style={{ fontSize: (mobileW * 3.7) / 100, textAlign: config.textRotate }}>
                            {this.state.activity_level.length <= 0 ? Lang_chg.select[config.language] : this.state.activity_level}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: '20%', alignSelf: 'center' }}>
                            <Image
                              style={{
                                height: (mobileW * 4) / 100,
                                width: (mobileW * 4) / 100,
                                alignSelf: 'flex-end',
                              }}
                              source={Icons.downarrow}></Image>
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
                          textAlign: config.textRotate
                        }}>
                        {Lang_chg.food[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: '90%', alignSelf: 'center' }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ occ_food_activity: 'food', occ_food_activitymodal: true, occ_food_activity_arr: this.state.food_arr })
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
                          <Text style={{ fontSize: (mobileW * 3.7) / 100, textAlign: config.textRotate }}>
                            {this.state.food.length <= 0 ? Lang_chg.select[config.language] : this.state.food}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: '20%', alignSelf: 'center' }}>
                            <Image
                              style={{
                                height: (mobileW * 4) / 100,
                                width: (mobileW * 4) / 100,
                                alignSelf: 'flex-end',
                              }}
                              source={Icons.downarrow}></Image>
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
                          textAlign: config.textRotate
                        }}>
                        {Lang_chg.occupation[config.language]}
                      </Text>
                    </View>

                    <View style={{ width: '90%', alignSelf: 'center' }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({ occ_food_activity: 'occupation', occ_food_activitymodal: true, occ_food_activity_arr: this.state.occupation_arr })
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
                          <Text style={{ fontSize: (mobileW * 3.7) / 100, textAlign: config.textRotate }}>
                            {this.state.occupation.length <= 0 ? Lang_chg.select[config.language] : this.state.occupation}
                          </Text>
                          {/* </View> */}

                          <View style={{ width: '20%', alignSelf: 'center' }}>
                            <Image
                              style={{
                                height: (mobileW * 4) / 100,
                                width: (mobileW * 4) / 100,
                                alignSelf: 'flex-end',
                              }}
                              source={Icons.downarrow}></Image>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: (mobileW * 5) / 100 }}>
                      <TouchableOpacity onPress={() => { this.lifestyle_click() }}
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
                            textAlign: config.textalign,
                            alignSelf: 'center',
                          }}>
                          {Lang_chg.savebtntext[config.language]}
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
}
