import { TouchableWithoutFeedback, Keyboard, FlatList, Modal, Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import React, { Component } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Cameragallery, Colors,  Font, mobileH, localStorage, config, mobileW, Lang_chg, apifuntion, consolepro, msgProvider, msgText, msgTitle, mediaprovider } from './Provider/utilslib/Utils';
import { AuthInputBoxSec, DropDownboxSec, Button } from './Components'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from "react-native-modal-datetime-picker";
import DocumentPicker from 'react-native-document-picker';
import { Icons } from './Assets/Icons/IReferences';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSecurePassword: true,
      isSecurePassword1: true,
      namefocus: false,
      name: '',
      emailfocus: false,
      email: '',
      numberfocus: false,
      number: '',
      idfocus: false,
      id: '',
      id_number: '',
      speciality: '',
      qualification: '',
      experience: '',
      scfhs_number: '',
      country_name: '',
      passwordfocus: false,
      password: '',
      confirmpasswordfocus: false,
      confirm: '',
      device_lang: 'AR',
      mobile: '',
      fcm_token: 123456,
      modalVisible3: false,
      error_msg: '',
      country_codefocus: false,
      country_code: '',
      bloodModal: false,
      country_short_code: '',
      showUsertype: false,
      showSpeciality: false,
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
      // {
      //   title: "Hospital",
      //   value: "hospital"
      // },
      {
        title: "Lab",
        value: "lab"
      }
      ],
      selectuserType: -1,
      isDatePickerVisibletwo: false,
      dob_date: '',
      gender: '',
      mabtn: false,
      febtn: false,
      specialityArr: [],
      mediamodal: false,
      hosp_moh_lic_no: '',
      hosp_reg_no: ''
    };
  }
  componentDidMount() {
    // this.getnotification();



    this.props.navigation.addListener('focus', () => {

      this.get_all_count()

    });
  }
  signup_click = async () => {
    Keyboard.dismiss()

    var email = this.state.email.trim()
    var num = this.state.id;
    var digits = num.toString().split('');
    var realDigits = digits.map(Number)
    console.log('realDigits', realDigits[0])


    if (this.state.selectuserType == -1) {
      msgProvider.showError(msgText.emptyUsertype[config.language])
      // msgProvider.toast(msgText.emptyUsertype[config.language], 'bottom')
      return false;
    }
    if (this.state.name.length <= 0 || this.state.name.trim().length <= 0) {
      msgProvider.showError(msgText.emptyName[config.language])
      return false;
    }

    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email <= 0) {
      msgProvider.showError(msgText.emptyEmail[config.language])
      return false;
    }

    if (regemail.test(email) !== true) {
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
    // if (this.state.id.length <= 0 || this.state.id.trim().length <= 0) {
    //   msgProvider.showError(msgText.emptyid[config.language])
    //   return false;
    // }
    if (this.state.country_short_code == 'UAE') {
      if (realDigits[0] == 0 || realDigits[0] == 1 || realDigits[0] == 2 || realDigits[0] == 3 || realDigits[0] == 4 || realDigits[0] == 5 || realDigits[0] == 6 || realDigits[0] == 8 || realDigits[0] == 9) {
        msgProvider.showError(msgText.validIDnumberUAE[config.language])
        return false
      }
    }
    else {
      if (realDigits[0] == 0 || realDigits[0] == 3 || realDigits[0] == 4 || realDigits[0] == 5 || realDigits[0] == 6 || realDigits[0] == 7 || realDigits[0] == 8 || realDigits[0] == 9) {
        msgProvider.showError(msgText.validIDnumber[config.language])
        return false
      }
    }

    // if (this.state.id.length <= 9) {
    //   msgProvider.showError(msgText.emptyIdValid[config.language])
    //   return false;
    // }
    if (this.state.userType[this.state.selectuserType].value != "lab") {
      if (this.state.dob_date.length <= 0 || this.state.dob_date.trim().length <= 0) {
        msgProvider.showError("Please choose your date of birth")
        return false;
      }
      if (this.state.gender.length <= 0 || this.state.gender.trim().length <= 0) {
        msgProvider.showError("Please choose your gender")
        return false;
      }
    }

    let password = this.state.password;
    if (password.length <= 0) {
      msgProvider.showError(msgText.validataionnewpass[config.language])
      return false;
    }
    if (password.length <= 7) {
      msgProvider.showError(msgText.emptyPasswordValid[config.language])
      return false;
    }
    let confirmpass = this.state.confirm;
    if (confirmpass.length <= 0) {
      msgProvider.showError(msgText.emptyconfirmPassword[config.language])
      return false;
    }
    if (confirmpass.length <= 7) {
      msgProvider.showError(msgText.emptyPasswordValid[config.language])
      return false;
    }

    if (confirmpass != password) {
      msgProvider.showError(msgText.Password_notmatch[config.language])
      return false;
    }

    if (this.state.userType[this.state.selectuserType].value != "lab") {
      if ((this.state.id_number.length < 10 || this.state.id_number.trim().length < 10)) {
        msgProvider.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }

      if ((this.state.id_number.length > 15 || this.state.id_number.trim().length > 15)) {
        msgProvider.showError("Please enter ID Number between 10 to 15 characters or digits")
        return false;
      }
    } else {
      if (this.state.hosp_moh_lic_no.length <= 0 || this.state.hosp_moh_lic_no.trim().length <= 0) {
        msgProvider.showError("Please enter health registration ID")
        return false;
      }
      if ((this.state.hosp_moh_lic_no.length < 10 || this.state.hosp_moh_lic_no.trim().length < 10)) {
        msgProvider.showError("Please enter health registration ID between 10 to 15 characters or digits")
        return false;
      }

      if ((this.state.hosp_moh_lic_no.length > 15 || this.state.hosp_moh_lic_no.trim().length > 15)) {
        msgProvider.showError("Please enter health registration ID between 10 to 15 characters or digits")
        return false;
      }
    }

    if (this.state.id_image == undefined) {
      msgProvider.showError("Please upload ID image")
      return false;
    }

    if (this.state.userType[this.state.selectuserType].value != "lab") {
      if (this.state.selectuserType == 0 || this.state.selectuserType == 3 || this.state.selectuserType == 4) {
        if (this.state.speciality.length <= 0 || this.state.speciality.trim().length <= 0) {
          msgProvider.showError("Please select speciality")
          return false;
        }
      }


      if (this.state.qualification.length <= 0 || this.state.qualification.trim().length <= 0) {
        msgProvider.showError("Please enter your qualification")
        return false;
      }
    } else {
      if (this.state.hosp_reg_no.length <= 0 || this.state.hosp_reg_no.trim().length <= 0) {
        msgProvider.showError("Please enter company registration certificate number")
        return false;
      }
      if ((this.state.hosp_reg_no.length < 8 || this.state.hosp_reg_no.trim().length < 8)) {
        msgProvider.showError("Please enter minimum 8 or 11 digits company registration certificate number")
        return false;
      }

      if (this.state.hosp_reg_no.length > 11 || this.state.hosp_reg_no.trim().length > 11) {
        msgProvider.showError("Please enter minimum 8 or 11 digits company registration certificate number")
        return false;
      }
    }

    if (this.state.certificate == undefined) {
      msgProvider.showError("Please upload cerificate image")
      return false;
    }

    if (this.state.userType[this.state.selectuserType].value != "lab") {
      if (this.state.experience.length <= 0 || this.state.experience.trim().length <= 0) {
        msgProvider.showError("Please enter your years of experience")
        return false;
      }

      if (this.state.selectuserType == 0 || this.state.selectuserType == 3 || this.state.selectuserType == 4) {
        if ((this.state.scfhs_number.length < 8 || this.state.scfhs_number.trim().length < 8)) {
          msgProvider.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
          return false;
        }

        if (this.state.scfhs_number.length > 11 || this.state.scfhs_number.trim().length > 11) {
          msgProvider.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
          return false;
        }
        if (this.state.scfhs_image == undefined) {
          msgProvider.showError("Please upload SCFHS file")
          return false;
        }
      }
    }

    let url = config.baseURL + "api-service-provider-registration";
    console.log("url", url)
    var phone_number_send = this.state.country_code + this.state.mobile
    var data = new FormData();
    // {"user_type":"doctor", "name": "hello","email":"hello@test.com",
    // "mobile_number":"000000000000","dob":"1990-12-17","gender":"Male",
    // "password":"123456","confirm_password":"123456","id_number":"010000",
    // "id_image":"","speciality":"Test","qualification":"MBBS",
    // "certificate":"","experience":"10 Year","scfhs_number":"020000",
    // "scfhs_image":""}

    // {"user_type":"nurse", "name": "hello","email":"hello@test.com",
    // "mobile_number":"000000000000","dob":"1990-12-17","gender":"Male",
    // "password":"123456","confirm_password":"123456","id_number":"010000",
    // "id_image":"","speciality":"Test","qualification":"MBBS","certificate":"",
    // "experience":"10 Year","scfhs_number":"020000","scfhs_image":""}

    data.append('service_type', this.state.userType[this.state.selectuserType].value)
    data.append('name', this.state.name)
    data.append('email', this.state.email)
    data.append('mobile_number', phone_number_send)
    data.append('work_area', this.state.country_name)
    // data.append('id_number', this.state.id)
    // data.append('last_name', '')
    data.append('dob', this.state.dob_date)
    data.append('gender', this.state.gender)
    data.append('password', this.state.password)
    data.append('confirm_password', this.state.confirm)
    data.append('device_type', config.device_type)
    data.append('device_lang', this.state.device_lang)
    data.append('fcm_token', this.state.fcm_token)

    data.append('id_number', this.state.id_number)
    data.append('speciality', this.state.speciality)
    data.append('qualification', this.state.qualification)
    data.append('experience', this.state.experience)
    data.append('scfhs_number', this.state.scfhs_number)
    data.append('hosp_moh_lic_no', this.state.hosp_moh_lic_no)
    data.append('hosp_reg_no', this.state.hosp_reg_no)
    // data.append('player_id', player_id_me1)
    // console.log('player_id_me1',player_id_me1)
    console.log('this.state.id_image', this.state.id_image)
    console.log('this.state.certificate', this.state.certificate)
    console.log('this.state.scfhs_image', this.state.scfhs_image)
    if (this.state.id_image.path != undefined) {

      data.append('id_image', {
        uri: this.state.id_image.path,
        type: this.state.id_image.mime, //'image/jpg',
        name: (Platform.OS == 'ios') ? this.state.id_image.filename : 'image',
      })
    }
    if (this.state.certificate.path != undefined) {

      data.append('certificate', {
        uri: this.state.certificate.path,
        type: this.state.certificate.mime, //'image/jpg',
        name: (Platform.OS == 'ios') ? this.state.certificate.filename : 'image',
      })
    }
    if (this.state.selectuserType == 0 || this.state.selectuserType == 3 || this.state.selectuserType == 4) {
      if (this.state.scfhs_image.path != undefined) {

        data.append('scfhs_image', {
          uri: this.state.scfhs_image.path,
          type: this.state.scfhs_image.mime, //'image/jpg',
          name: (Platform.OS == 'ios') ? this.state.scfhs_image.filename : 'image',
        })
      }
    } else {
      data.append('scfhs_image', "")
    }

    consolepro.consolelog('data', data)

    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      console.log('obj mess', obj.message)
      if (obj.status == true) {

        setTimeout(() => {
          this.props.navigation.goBack()
          msgProvider.showSuccess(obj.message)
        }, 500);

      } else {
        setTimeout(() => {
          msgProvider.showError(obj.message)
        }, 200)
        // }
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });

  }

  Galleryopen = () => {
    console.log('Galleryopen');
    const { imageType } = this.state;
    mediaprovider.launchGellery(true).then((obj) => {
      console.log(obj);
      console.log(obj.path);
      this.setState({
        [imageType]: obj,
        mediamodal: false
      })
      // this.editImage(obj.path);
      // if (this.state.img_type == 0) {
      //   this.setState({ cover_img: obj.path, mediamodal: false })
      // }
      // else {
      //   this.setState({ profile_img: obj.path, mediamodal: false, profile_image: obj.path })
      // }
    }).catch((error) => {
      this.setState({ mediamodal: false })
    })
  }

  DocumentGalleryopen = async () => {
    // Pick a single file
    console.log('uploadVoiceFile');
    const { imageType } = this.state;
    mediaprovider.launchDocumentGellery(true).then((res) => {
      console.log('resresresres', res);
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );

      const source = {
        filename: res.name, //"speech_file.mp3", //(response.fileName != undefined) ? response.fileName : response.uri.substr(response.uri.length - 40),
        mime: res.type,
        path: res.uri,
        // serverFileName: "assignmentfile" //"upload_audio" //
        //imageData: response.data
      };

      console.log('source', source);
      this.setState({
        [imageType]: source,
        mediamodal: false
      }, () => {
        //this.handleUploadFile();
        console.log('this.state.id_image:: ', this.state.id_image);
      });
      // this.setState({
      //   [imageType]: obj,
      //   mediamodal: false
      // })
      // this.editImage(obj.path);
      // if (this.state.img_type == 0) {
      //   this.setState({ cover_img: obj.path, mediamodal: false })
      // }
      // else {
      //   this.setState({ profile_img: obj.path, mediamodal: false, profile_image: obj.path })
      // }
    }).catch((error) => {
      this.setState({ mediamodal: false })
    })

    // try {
    //   const res = await DocumentPicker.pick({
    //     type: [
    //       //DocumentPicker.types.images,
    //       // DocumentPicker.types.audio
    //       DocumentPicker.types.pdf
    //     ],
    //   });
    //   console.log('resresresres', res);
    //   console.log(
    //     res.uri,
    //     res.type, // mime type
    //     res.name,
    //     res.size
    //   );

    //   const source = {
    //     fileName: res.name, //"speech_file.mp3", //(response.fileName != undefined) ? response.fileName : response.uri.substr(response.uri.length - 40),
    //     type: res.type,
    //     path: res.uri,
    //     serverFileName: "assignmentfile" //"upload_audio" //
    //     //imageData: response.data
    //   };

    //   console.log('source', source);
    //   // this.setState({
    //   //   [imageType]: obj,
    //   //   mediamodal: false
    //   // })

    //   this.setState({
    //     [imageType]: source,
    //     mediamodal: false
    //   }, () => {
    //     //this.handleUploadFile();
    //   });

    // } catch (err) {
    //   if (DocumentPicker.isCancel(err)) {
    //     // User cancelled the picker, exit any dialogs or menus and move on
    //     this.setState({
    //       mediamodal: false
    //     }, () => {
    //       //this.handleUploadFile();
    //     });
    //   } else {
    //     console.log('errerr', err);
    //     this.setState({
    //       mediamodal: false
    //     }, () => {
    //       //this.handleUploadFile();
    //     });
    //     throw err;
    //   }
    // }
  }

  get_speciality = async () => {

    let url = config.baseURL + "api-provider-get-speciality";
    console.log("url", url)
    var data = new FormData();
    data.append('service_type', this.state.userType[this.state.selectuserType].value)

    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data, 1).then((obj) => {
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

  get_all_count = async () => {
    let url = config.baseURL + "api-medical-service-area";
    console.log("url", url)
    // var data = new FormData();
    // data.append('login_user_id',user_id)
    // consolepro.consolelog('data', data)
    apifuntion.getApi(url, 1).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        this.setState({ Countryarr: obj.result, country_name: obj.result[0].name, country_code: obj.result[0].country_code, country_short_code: obj.result[0].country_short_code })
        console.log('get area', obj.result)
      } else {
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);
    })
  }

  showUsertypeModal = (status) => {
    this.setState({
      showUsertype: status
    })
  }

  setdatetwo = (res) => {
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
    this.setState({ date_new: new Date(date1) })
    this.setState({ dob_date: date1, isDatePickerVisibletwo: false, })
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
              this.qualificationInput.focus()
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
              this.setState({
                imageType: 'id_image',
                mediamodal: true
              }, () => {
                // this.Galleryopen()
                // this.uploadVoiceFile()
              });

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
          </TouchableOpacity>




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
          <DropDownboxSec
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
                  //margin: 20,
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
          </Modal>
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
              this.experienceInput.focus()
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
              this.setState({
                imageType: 'certificate',
                mediamodal: true
              }, () => {
                //this.Galleryopen()
              });
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
          </TouchableOpacity>




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
              this.scfhs_numberInput.focus()
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
          <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '55%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              this.setState({
                imageType: 'scfhs_image',
                mediamodal: true
              }, () => {
                // this.Galleryopen()
              });
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
          </TouchableOpacity>




          <View style={{ width: '45%', alignSelf: 'center', }}>
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
              this.experienceInput.focus()
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
              this.setState({
                imageType: 'certificate',
                mediamodal: true
              }, () => {
                //this.Galleryopen()
              });
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
          </TouchableOpacity>




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
              this.scfhs_numberInput.focus()
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
          <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              this.setState({
                imageType: 'id_image',
                mediamodal: true
              }, () => {
                // this.Galleryopen()
                // this.uploadVoiceFile()
              });

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
          </TouchableOpacity>

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
          <TouchableOpacity activeOpacity={0.9}
            style={{
              width: '45%', flexDirection: 'row',
              paddingLeft: mobileW * 1 / 100
            }}
            onPress={() => {
              this.setState({
                imageType: 'certificate',
                mediamodal: true
              }, () => {
                // this.Galleryopen()
                // this.uploadVoiceFile()
              });

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
          </TouchableOpacity>

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
              {(this.state.certificate != undefined) ? this.state.certificate.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

  render() {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView>
          <View>
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
            <Cameragallery mediamodal={this.state.mediamodal}
              isCamera={false}
              isGallery={true}
              isDocument={true}
              Camerapopen={() => { this.Camerapopen() }}
              Galleryopen={() => { this.Galleryopen() }}
              DocumentGalleryopen={() => { this.DocumentGalleryopen() }}
              Canclemedia={() => { this.setState({ mediamodal: false }) }}
            />
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.bloodModal}
              onRequestClose={() => { }}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => { this.setState({ bloodModal: false }) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%' }}>
                <View style={{
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5, width: '70%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', alignSelf: 'center'
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
                    }}>{Lang_chg.Country_code[config.language]}</Text>

                  </View>

                  <View style={{ width: '100%', alignSelf: 'center' }}>
                    <FlatList
                      //contentContainerStyle={{ paddingBottom: mobileW * 2 / 100 }}
                      data={this.state.Countryarr}
                      renderItem={({ item, index }) => {
                        if (this.state.Countryarr != '' || this.state.Countryarr != null) {
                          return (

                            // <TouchableOpacity
                            //   onPress={() => { this.setState({ bloodModal: false, country_code: item.country_code, country_name: item.name, country_short_code: item.country_short_code }); }}
                            // >
                            //   <View style={{ width: '100%', backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'flex-end' }}>
                            //     <View style={[{ width: '95%', borderBottomWidth: 1, paddingVertical: mobileW * 2 / 100, marginLeft: mobileW * 5 / 100, borderBottomColor: '#0000001F' }]}>
                            //       <Text style={{ color: Colors.textblack, fontSize: mobileW * 4 / 100, paddingLeft: mobileW * 2 / 100, textAlign: config.textRotate }}>{item.name}</Text>
                            //     </View>
                            //   </View>
                            // </TouchableOpacity>
                            <TouchableOpacity style={{
                              width: '100%',
                            }}
                              onPress={() => { this.setState({ bloodModal: false, country_code: item.country_code, country_name: item.name, country_short_code: item.country_short_code }); }}
                            >
                              {/* <View style={{
                                width: '100%',
                              }}>
                                <Text style={{
                                  color: '#041A27',
                                  fontSize: 15,
                                  fontFamily: Font.headingfontfamily,
                                  marginLeft: 15,
                                  paddingTop: 15,
                                  paddingBottom: 15,
                                  width: '94.5%',
                                  borderBottomColor: Colors.gray6,
                                  borderBottomWidth: (index == (this.state.Countryarr.length - 1)) ? 0 : 1,
                                  // backgroundColor: 'red'
                                }}>{item.name}</Text>
                              </View> */}
                              <View style={{
                                width: (Platform.OS == "ios") ? '95%' : '94.5%',
                                marginLeft: 15,
                                borderBottomColor: Colors.gray6,
                                borderBottomWidth: (index == (this.state.Countryarr.length - 1)) ? 0 : 1,
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
                                }}>{item.name}</Text>
                              </View>
                            </TouchableOpacity>
                          )
                        }
                      }}
                      keyExtractor={(item, index) => index.toString()}>


                    </FlatList>
                  </View>
                </View>



              </TouchableOpacity>

            </Modal>

            <View style={{ paddingBottom: (mobileW * 14) / 100 }}>

              <View
                style={{
                  width: '50%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 1) / 100,
                }}>
                <Image
                  style={{
                    width: (mobileW * 40) / 100,
                    height: (mobileW * 40) / 100,
                    alignSelf: 'center',
                    resizeMode: 'contain',
                    alignItems: 'center',
                  }}
                  source={Icons.LogoWithText}></Image>
              </View>

              <View
                style={{
                  width: '15%',
                  marginTop: (mobileW * -21) / 100,
                  alignSelf: 'flex-start',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                  style={{ width: '100%' }}>
                  <Image
                    style={{
                      width: (mobileW * 10) / 100,
                      height: (mobileW * 10) / 100,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                    source={config.textalign == 'right' ? Icons.BackRTL : Icons.LeftArrow}></Image>
                </TouchableOpacity>
              </View>


              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 14) / 100,
                }}>
                <Text
                  style={{
                    fontSize: Font.headingblack,
                    fontFamily: Font.blackheadingfontfamily,
                    textAlign: config.textRotate
                  }}>
                  {Lang_chg.Signup[config.language]}
                </Text>
              </View>

              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 1) / 100,
                }}>
                <Text
                  style={{
                    textAlign: config.textRotate,
                    fontSize: Font.headinggray,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.placeholder_text,
                  }}>
                  {Lang_chg.Signuptext1[config.language]}
                </Text>
              </View>

              {/* ----------------------------------------user type------------------------------------ */}

              <DropDownboxSec
                lableText={(this.state.selectuserType == -1) ? Lang_chg.UserTypeText[config.language] : this.state.userType[this.state.selectuserType].title}
                boxPressAction={() => { this.showUsertypeModal(true) }}
              />

              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.showUsertype}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  //setModalVisible(!modalVisible);
                }}
              >
                <TouchableOpacity activeOpacity={0.9} onPress={() => { this.showUsertypeModal(false) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%' }}>
                  <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    //marginTop: 22
                  }}>
                    <View style={{
                      //margin: 20,
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
                        }}>Select User Type</Text>
                      </View>

                      {
                        this.state.userType.map((data, index) => {
                          return (
                            <TouchableOpacity style={{
                              width: '100%',
                            }} onPress={() => {
                              this.setState({
                                selectuserType: index
                              }, () => {
                                this.showUsertypeModal(false)
                                if (index == 0 || index == 3 || index == 4) {
                                  this.get_speciality()
                                }

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
                                }}>{data.title}</Text>
                              </View>
                            </TouchableOpacity>
                          )
                        })
                      }
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>

              {/* ---------------------------------------------------------------------fullname */}
              {/* {this.state.namefocus == true && (
                <View
                  style={{borderBottomColor:'red'
                   
                  }}>
                 
                </View>
              )} */}


              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 2) / 100,
                  // borderColor: this.state.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                  // borderWidth: 1,
                  // borderRadius: (mobileW * 1) / 100,
                }}>
                <AuthInputBoxSec
                  mainContainer={{
                    width: '100%',
                  }}
                  // icon={layer9_icon}
                  lableText={(this.state.selectuserType != -1 && this.state.userType[this.state.selectuserType].value == "lab") ? "Lab Name" : Lang_chg.textinputname[config.language]}
                  inputRef={(ref) => {
                    this.nameInput = ref;
                  }}
                  onChangeText={(text) =>
                    this.setState({ name: text })
                  }
                  value={this.state.name}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.emailInput.focus();
                  }}
                />


              </View>

              {/* -----------------------------------------------------------------------------------email */}

              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 2) / 100,
                  // borderColor: this.state.emailfocus == true ? '#0057A5' : Colors.placeholder_border,
                  // borderWidth: 1,
                  // borderRadius: (mobileW * 1) / 100,
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
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.mobileInput.focus();
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
                    textAlign: config.textRotate,
                    fontSize: Font.headinggray,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.placeholder_text,
                  }}>
                  {Lang_chg.selectcountrytitle[config.language]}
                </Text>
              </View>

              <DropDownboxSec
                lableText={this.state.country_name.length <= 0 ? Lang_chg.select[config.language] : this.state.country_name}
                boxPressAction={() => { this.setState({ bloodModal: true }); }}
              />

              {/* -----------------------------------------------------------------------------no- */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
                <View
                  style={{
                    width: '20%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 2.3) / 100,
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
                      height: 48,
                      color: Colors.textblack,
                      fontSize: Font.placeholdersize,
                      textAlign: config.textalign,
                      //height: (mobileW * 12) / 100,
                      fontFamily: Font.placeholderfontfamily,
                      borderRadius: (mobileW * 1) / 100,
                      backgroundColor: 'white',
                      marginBottom: (mobileW * 4) / 100,
                      // borderColor: 'red', //Colors.placeholder_border
                    }}
                    label={Lang_chg.CC_code[config.language]}
                    mode='outlined'
                    outlineColor={Colors.field_border_color}
                    activeOutlineColor={Colors.placholderactive}
                    maxLength={3}
                    editable={false}
                    // placeholder={
                    //   this.state.country_codefocus != true
                    //     ? Lang_chg.CC_code[config.language]
                    //     : null
                    // }
                    placeholderTextColor={Colors.placeholder_text}
                    onChangeText={txt => {
                      this.setState({ country_code: txt });
                    }}

                    // onFocus={() => {
                    //   this.setState({ country_codefocus: true });
                    // }}
                    // onBlur={() => {
                    //   this.setState({
                    //     country_codefocus: this.state.country_code.length > 0 ? true : false,
                    //   });
                    // }}

                    value={"" + this.state.country_code + ""}
                    keyboardType="number-pad"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                  /> */}

                  {/* {this.state.country_code.length > 0 &&
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
                    width: '78%',
                    alignSelf: 'center',
                    marginTop: (mobileW * 2) / 100,
                    // borderColor: this.state.numberfocus == true ? '#0057A5' : Colors.placeholder_border,
                    // borderWidth: 1,
                    // borderRadius: (mobileW * 1) / 100,
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
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.passwordInput.focus();
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
                  {/* {this.state.numberfocus == true && (
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                        left: (mobileW * 4) / 100,
                        top: (-mobileW * 2) / 100,
                        paddingHorizontal: (mobileW * 1) / 100,
                      }}>
                      <Text style={{ color: '#0057A5' }}>
                        {Lang_chg.textinputnumber[config.language]}
                      </Text>
                    </View>
                  )} */}
                </View>
              </View>

              {
                (this.state.selectuserType != -1 && this.state.userType[this.state.selectuserType].value == "lab") ?
                  null :
                  <>
                    {/* ------------------------------------------------------------dob-----------      */}
                    <View style={{
                      width: '90%', height: 48, alignSelf: 'center', marginTop: mobileW * 3 / 100, flexDirection: 'row',
                      borderColor: Colors.field_border_color, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                    }}>
                      <TouchableOpacity onPress={() => { this.setState({ isDatePickerVisibletwo: true }) }} style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '1%' }}>
                        </View>
                        <View style={{ width: '100%', height: Font.placeholder_height, marginLeft: mobileW * 2 / 100, alignItems: 'center', flexDirection: 'row' }}>
                          <Text style={{
                            width: '78%', textAlign: config.textRotate, color: Colors.placeholder_text,
                            fontFamily: Font.Regular,
                            fontSize: Font.placeholdersize,
                          }}>{this.state.dob_date.length <= 0 ? Lang_chg.dob[config.language] : this.state.dob_date}</Text>
                          <View style={{ width: '15%', alignSelf: 'center', alignItems: 'flex-end' }}>

                            <Image source={Icons.DatePicker}
                              style={{ height: 25, width: 25 }}>
                            </Image>
                          </View>
                        </View>


                      </TouchableOpacity>

                      {this.state.dobfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                        <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{Lang_chg.dob[config.language]}</Text>
                      </View>}

                    </View>
                    <DateTimePicker
                      dateFormat={"YYYY-MM-DD"}
                      isVisible={this.state.isDatePickerVisibletwo}
                      mode="date"
                      value={this.state.date_new}
                      maximumDate={new Date()}
                      onConfirm={(date) => {
                        console.log(date);
                        this.setdatetwo(date),
                          this.setState({ isDatePickerVisibletwo: false })
                      }}
                      onCancel={() => { this.setState({ isDatePickerVisibletwo: false }) }}
                    />

                    {/* -----------------------------------radiobtn------------------------------- */}

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
                              }}>
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
                            {/* {this.state.fbtn == false && */}
                            <TouchableOpacity onPress={() => { this.setState({ febtn: true, mabtn: false, gender: 'Female' }) }}
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                flexDirection: 'row',
                                alignItems: 'center'
                              }}>
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
                  </>
              }


              {/* ---------------------------------------------------------------------------idno */}

              {/* <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 3) / 100,
                  // borderColor: this.state.idfocus == true ? '#0057A5' : Colors.placeholder_border,
                  // borderWidth: 1,
                  // borderRadius: (mobileW * 1) / 100,
                }}>
                <View style={{ width: '100%', alignSelf: 'center' }}>
                  <TextInput
                    style={{
                      width: '100%',
                      height: 48,
                      color: Colors.textblack,
                      fontSize: Font.placeholdersize,
                      textAlign: config.textalign,
                      //height: (mobileW * 12) / 100,
                      fontFamily: Font.placeholderfontfamily,
                      borderRadius: (mobileW * 1) / 100,
                      borderColor: Colors.placeholder_border,
                      backgroundColor: 'white'
                    }}
                    mode='outlined'
                    label={Lang_chg.dob[config.language]}
                    outlineColor={Colors.field_border_color}
                    activeOutlineColor={Colors.placholderactive}
                    maxLength={15}
                    // placeholder={
                    //   this.state.idfocus != true
                    //     ? Lang_chg.textinputnationalid[config.language]
                    //     : null
                    // }
                    placeholderTextColor={Colors.placeholder_text}
                    onChangeText={txt => {
                      this.setState({ id: txt });
                    }}
                    value={this.state.id}
                    // onFocus={() => { this.setState({ idfocus: true }); }}
                    // onBlur={() => { this.setState({ idfocus: this.state.id.length > 0 ? true : false }); }}
                    keyboardType="number-pad"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                    right={
                      <TextInput.Icon
                        name={'calendar'}
                        // onPress={() => {
                        //   this.setState({
                        //     isSecurePassword: !this.state.isSecurePassword,
                        //   });
                        // }}
                        forceTextInputFocus={false}
                        color={Colors.regulartextcolor}
                        style={{
                          marginTop: 12
                        }}
                      />
                    }
                  />
                </View>
                {this.state.idfocus == true && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'white',
                      left: (mobileW * 4) / 100,
                      top: (-mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 1) / 100,
                    }}>
                    <Text style={{ color: '#0057A5' }}>
                      {Lang_chg.textinputnationalid[config.language]}
                    </Text>
                  </View>
                )}
              </View> */}

              {/* --------------------------------------------------------------------------------text */}

              {/* <View
                style={{
                  width: '89%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 0.5) / 100,
                }}>
                {this.state.country_short_code == 'UAE' ?
                  <Text
                    style={{
                      textAlign: config.textRotate,
                      fontSize: Font.textsize,
                      fontFamily: Font.headingfontfamily,
                      color: Colors.textgray,
                    }}>
                    {Lang_chg.ProvideUAE[config.language]}
                  </Text> : <Text
                    style={{
                      textAlign: config.textRotate,
                      fontSize: Font.textsize,
                      fontFamily: Font.headingfontfamily,
                      color: Colors.textgray,
                    }}>
                    {Lang_chg.Signuptext2[config.language]}
                  </Text>}
              </View> */}
              {/* ------------------------------------------------------password */}

              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 2) / 100,
                  flexDirection: 'row',
                  // borderColor: this.state.passwordfocus == true ? '#0057A5' : Colors.placeholder_border,
                  // borderWidth: 1,
                  // borderRadius: (mobileW * 1) / 100,
                }}>
                <AuthInputBoxSec
                  mainContainer={{
                    width: '100%',
                  }}
                  // icon={layer9_icon}
                  lableText={Lang_chg.password[config.language]}
                  inputRef={(ref) => {
                    this.passwordInput = ref;
                  }}
                  onChangeText={(text) =>
                    this.setState({ password: text })
                  }
                  value={this.state.password}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyLabel="done"
                  returnKeyType="done"
                  secureTextEntry={this.state.isSecurePassword}
                  disableImg={true}
                  iconName={this.state.isSecurePassword ? 'eye' : 'eye-off'}
                  iconPressAction={() => {
                    this.setState({
                      isSecurePassword: !this.state.isSecurePassword,
                    });
                  }}
                  onSubmitEditing={() => {
                    this.confirmInput.focus()
                  }}
                />

              </View>

              {/* -----------------------------------------------------------text*/}

              <View
                style={{
                  width: '89%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 0.5) / 100,
                }}>
                <Text
                  style={{
                    textAlign: config.textRotate,
                    fontSize: Font.textsize,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.textgray,
                  }}>
                  {Lang_chg.Signuptext3[config.language]}
                </Text>
              </View>
              {/* ----------------------------------------------------------------------confirmpasword */}

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
                  lableText={Lang_chg.confirmpassword1[config.language]}
                  inputRef={(ref) => {
                    this.confirmInput = ref;
                  }}
                  onChangeText={(text) =>
                    this.setState({ confirm: text })
                  }
                  value={this.state.confirm}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyLabel="next"
                  returnKeyType="next"
                  secureTextEntry={this.state.isSecurePassword1}
                  disableImg={true}
                  iconName={this.state.isSecurePassword1 ? 'eye' : 'eye-off'}
                  iconPressAction={() => {
                    this.setState({
                      isSecurePassword1: !this.state.isSecurePassword1,
                    });
                  }}
                  onSubmitEditing={() => {
                    // this.signup_click()
                  }}
                />

              </View>
              <View
                style={{
                  width: '89%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 0.5) / 100,

                }}>
                <Text
                  style={{
                    textAlign: config.textRotate,
                    fontSize: Font.textsize,
                    fontFamily: Font.headingfontfamily,
                    color: Colors.textgray,
                  }}>
                  {Lang_chg.Signuptext4[config.language]}
                </Text>
              </View>
              {/*   ---------------------------------------------------------------------------- */}





              {
                (this.state.selectuserType == 0 || this.state.selectuserType == 3 || this.state.selectuserType == 4) &&
                <>
                  {this.renderIDNumber()}
                  {this.renderSpeExpCer()}
                  {this.renderExpRegid()}
                </>
              }

              {
                (this.state.selectuserType == 1 || this.state.selectuserType == 2) &&
                <>
                  {this.renderIDNumber()}
                  {this.renderExpCer()}
                  {this.renderExp()}
                </>
              }

              {
                (this.state.selectuserType != -1 && this.state.userType[this.state.selectuserType].value == "lab") &&
                <>
                  {this.renderHealthIDNumber()}
                  {this.renderCRC()}
                </>
              }

              <Button
                text={Lang_chg.btntext[config.language]}
                // onLoading={this.state.loading}
                customStyles={
                  {
                    // mainContainer: styles.butonContainer
                  }
                }
                onPress={() => this.signup_click()}
              // isBlank={false}
              />

              <View
                style={{
                  width: '80%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 10) / 100, flexDirection: 'row'
                }}>
                <View
                  style={{
                    width: '100%',

                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: config.textalign,
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.headingfontfamily,
                      color: Colors.placeholder_text,
                      textAlign: 'center', alignSelf: 'center'
                    }}>
                    {Lang_chg.termsandconditiontext1[config.language]}
                  </Text>
                  <Text
                    onPress={() => {
                      this.props.navigation.navigate('Tremsandcondition', {
                        contantpage: 2,
                        content: config.term_url_eng,
                        content_ar: config.term_url_ar

                      });
                    }}
                    style={{
                      textAlign: config.textalign,
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.terms_text_font_family,
                      color: Colors.terms_text_color_blue, flexDirection: 'row', width: '100%', textAlign: 'center'

                    }}>
                    {Lang_chg.termsandconditiontext2[config.language]}
                    <Text
                      style={{
                        textAlign: config.textalign,
                        fontSize: (mobileW * 3.5) / 100,
                        fontFamily: Font.headingfontfamily,
                        color: Colors.placeholder_text,
                        textAlign: 'center', alignSelf: 'center'
                      }}>
                      {Lang_chg.termsandconditiontext3[config.language]}
                    </Text>
                    <Text
                      onPress={() => {
                        this.props.navigation.navigate('Tremsandcondition', {
                          contantpage: 1,
                          content: config.privacy_url_eng, content_ar: config.privacy_url_ar
                        });
                      }}
                      style={{
                        textAlign: config.textalign,
                        fontSize: (mobileW * 3.6) / 100,
                        fontFamily: Font.SemiBold,
                        color: Colors.terms_text_color_blue,

                      }}>
                      {Lang_chg.termsandconditiontext4[config.language]}
                    </Text>
                  </Text>

                </View>
              </View>







              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  borderColor: Colors.bordercolor,
                  borderBottomWidth: 1,
                  marginTop: (mobileW * 6) / 100,
                }}></View>

              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: (mobileW * 5) / 100,
                  justifyContent: 'space-between'
                }}>

                <Text
                  style={{
                    textAlign: config.textalign,
                    fontSize: (mobileW * 3.8) / 100,
                    fontFamily: Font.Medium,
                    color: Colors.placeholder_text,
                  }}>
                  {Lang_chg.allreadyhaveaccounttext[config.language]}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('Login');
                  }}
                >
                  <Text
                    style={{
                      textAlign: config.textalign,
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.terms_text_font_family,
                      color: Colors.textblue,
                      alignSelf: 'flex-end',

                    }}>
                    {Lang_chg.loginheretext[config.language]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible3}

              onRequestClose={() => { this.setState({ modalVisible3: false }) }}>
              <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
                <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
                  networkActivityIndicatorVisible={true} />
                <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

                  <View style={{ backgroundColor: '#fff', borderRadius: 2, width: "100%", }}>

                    <View style={{ alignSelf: 'flex-start', paddingVertical: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row', alignItems: 'center' }}>
                      <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100 }} source={require('./Assets/Icons/logo.png')}></Image>
                      <Text style={{ fontFamily: Font.Medium, color: '#000', fontSize: mobileW * 5 / 100, paddingLeft: mobileW * 4 / 100 }}>{Lang_chg.registration[config.language]}</Text>
                    </View>

                    <View style={{ alignSelf: 'flex-start', paddingLeft: mobileW * 4 / 100, width: '90%', marginTop: mobileW * 1.5 / 100 }}>
                      <Text style={{ fontFamily: Font.Light, color: '#000', fontSize: mobileW * 4 / 100, }}>{this.state.error_msg}</Text>
                    </View>

                    <View style={{
                      paddingBottom: mobileW * 5 / 100, marginTop: mobileW * 9 / 100,
                      alignSelf: 'flex-end',
                    }}>
                      <TouchableOpacity onPress={() => {
                        if (this.state.status_new == true) {
                          setTimeout(() => { this.setState({ modalVisible3: false }), this.props.navigation.navigate('Optpage', { country_name: this.state.country_name }) }, 200)
                        }
                        else {
                          this.setState({ modalVisible3: false })
                        }
                      }}
                        style={{ width: mobileW * 15 / 100, flexDirection: 'row', alignSelf: 'center', }}>
                        <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.theme_color, alignSelf: 'center', textAlign: config.textalign }}>{Lang_chg.OK[config.language]}</Text>
                      </TouchableOpacity>


                    </View>

                  </View>

                </View>
              </View>
            </Modal>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    );
  }
}
