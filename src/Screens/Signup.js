import { TouchableWithoutFeedback, Keyboard, FlatList, Modal, Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Cameragallery, Colors, Font, mobileH, localStorage, config, mobileW, LanguageConfiguration, API, MessageFunctions, MessageTexts, MessageHeadings, Media } from '../Provider/utilslib/Utils';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from "react-native-modal-datetime-picker";
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';

export default Signup = ({ navigation, route }) => {
  
  const [classStateData, setClassStateData] = useState({
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
  })

  useEffect(() => {
    navigation.addListener('focus', () => {
      get_all_count()
    });
  }, [])

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  signup_click = async () => {
    Keyboard.dismiss()

    var email = classStateData.email.trim()
    var num = classStateData.id;
    var digits = num.toString().split('');
    var realDigits = digits.map(Number)

    if (classStateData.selectuserType == -1) {
      MessageFunctions.showError(MessageTexts.emptyUsertype[config.language])
      return false;
    }
    if (classStateData.name.length <= 0 || classStateData.name.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyName[config.language])
      return false;
    }

    let regemail = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (email <= 0) {
      MessageFunctions.showError(MessageTexts.emptyEmail[config.language])
      return false;
    }

    if (regemail.test(email) !== true) {
      MessageFunctions.showError(MessageTexts.validEmail[config.language])
      return false
    }
    if (classStateData.country_code.length <= 0 || classStateData.country_code.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyCountrycode[config.language])
      return false;
    }

    if (classStateData.mobile.length <= 0 || classStateData.mobile.trim().length <= 0) {
      MessageFunctions.showError(MessageTexts.emptymobileNumber[config.language])
      return false;
    }
    
    if (classStateData.country_short_code == 'UAE') {
      if (realDigits[0] == 0 || realDigits[0] == 1 || realDigits[0] == 2 || realDigits[0] == 3 || realDigits[0] == 4 || realDigits[0] == 5 || realDigits[0] == 6 || realDigits[0] == 8 || realDigits[0] == 9) {
        MessageFunctions.showError(MessageTexts.validIDnumberUAE[config.language])
        return false
      }
    }
    else {
      if (realDigits[0] == 0 || realDigits[0] == 3 || realDigits[0] == 4 || realDigits[0] == 5 || realDigits[0] == 6 || realDigits[0] == 7 || realDigits[0] == 8 || realDigits[0] == 9) {
        MessageFunctions.showError(MessageTexts.validIDnumber[config.language])
        return false
      }
    }

    if (classStateData.userType[classStateData.selectuserType].value != "lab") {
      if (classStateData.dob_date.length <= 0 || classStateData.dob_date.trim().length <= 0) {
        MessageFunctions.showError("Please choose your date of birth")
        return false;
      }
      if (classStateData.gender.length <= 0 || classStateData.gender.trim().length <= 0) {
        MessageFunctions.showError("Please choose your gender")
        return false;
      }
    }

    let password = classStateData.password;
    if (password.length <= 0) {
      MessageFunctions.showError(MessageTexts.validataionnewpass[config.language])
      return false;
    }
    if (password.length <= 7) {
      MessageFunctions.showError(MessageTexts.emptyPasswordValid[config.language])
      return false;
    }
    let confirmpass = classStateData.confirm;
    if (confirmpass.length <= 0) {
      MessageFunctions.showError(MessageTexts.emptyconfirmPassword[config.language])
      return false;
    }
    if (confirmpass.length <= 7) {
      MessageFunctions.showError(MessageTexts.emptyPasswordValid[config.language])
      return false;
    }

    if (confirmpass != password) {
      MessageFunctions.showError(MessageTexts.Password_notmatch[config.language])
      return false;
    }

    if (classStateData.userType[classStateData.selectuserType].value != "lab") {
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

    if (classStateData.id_image == undefined) {
      MessageFunctions.showError("Please upload ID image")
      return false;
    }

    if (classStateData.userType[classStateData.selectuserType].value != "lab") {
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

    if (classStateData.certificate == undefined) {
      MessageFunctions.showError("Please upload cerificate image")
      return false;
    }

    if (classStateData.userType[classStateData.selectuserType].value != "lab") {
      if (classStateData.experience.length <= 0 || classStateData.experience.trim().length <= 0) {
        MessageFunctions.showError("Please enter your years of experience")
        return false;
      }

      if (classStateData.selectuserType == 0 || classStateData.selectuserType == 3 || classStateData.selectuserType == 4) {
        if ((classStateData.scfhs_number.length < 8 || classStateData.scfhs_number.trim().length < 8)) {
          MessageFunctions.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
          return false;
        }

        if (classStateData.scfhs_number.length > 11 || classStateData.scfhs_number.trim().length > 11) {
          MessageFunctions.showError("Please enter minimum 8 or 11 digits SCFHS registration ID")
          return false;
        }
        if (classStateData.scfhs_image == undefined) {
          MessageFunctions.showError("Please upload SCFHS file")
          return false;
        }
      }
    }

    let url = config.baseURL + "api-service-provider-registration";
    console.log("url", url)
    var phone_number_send = classStateData.country_code + classStateData.mobile
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

    data.append('service_type', classStateData.userType[classStateData.selectuserType].value)
    data.append('name', classStateData.name)
    data.append('email', classStateData.email)
    data.append('mobile_number', phone_number_send)
    data.append('work_area', classStateData.country_name)
    // data.append('id_number', classStateData.id)
    // data.append('last_name', '')
    data.append('dob', classStateData.dob_date)
    data.append('gender', classStateData.gender)
    data.append('password', classStateData.password)
    data.append('confirm_password', classStateData.confirm)
    data.append('device_type', config.device_type)
    data.append('device_lang', classStateData.device_lang)
    data.append('fcm_token', classStateData.fcm_token)

    data.append('id_number', classStateData.id_number)
    data.append('speciality', classStateData.speciality)
    data.append('qualification', classStateData.qualification)
    data.append('experience', classStateData.experience)
    data.append('scfhs_number', classStateData.scfhs_number)
    data.append('hosp_moh_lic_no', classStateData.hosp_moh_lic_no)
    data.append('hosp_reg_no', classStateData.hosp_reg_no)
    // data.append('player_id', player_id_me1)
    // console.log('player_id_me1',player_id_me1)
    console.log('classStateData.id_image', classStateData.id_image)
    console.log('classStateData.certificate', classStateData.certificate)
    console.log('classStateData.scfhs_image', classStateData.scfhs_image)
    if (classStateData.id_image.path != undefined) {

      data.append('id_image', {
        uri: classStateData.id_image.path,
        type: classStateData.id_image.mime, //'image/jpg',
        name: (Platform.OS == 'ios') ? classStateData.id_image.filename : 'image',
      })
    }
    if (classStateData.certificate.path != undefined) {

      data.append('certificate', {
        uri: classStateData.certificate.path,
        type: classStateData.certificate.mime, //'image/jpg',
        name: (Platform.OS == 'ios') ? classStateData.certificate.filename : 'image',
      })
    }
    if (classStateData.selectuserType == 0 || classStateData.selectuserType == 3 || classStateData.selectuserType == 4) {
      if (classStateData.scfhs_image.path != undefined) {

        data.append('scfhs_image', {
          uri: classStateData.scfhs_image.path,
          type: classStateData.scfhs_image.mime, //'image/jpg',
          name: (Platform.OS == 'ios') ? classStateData.scfhs_image.filename : 'image',
        })
      }
    } else {
      data.append('scfhs_image', "")
    }



    API.post(url, data).then((obj) => {

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
      setState({ loading: false });
    });

  }

  Galleryopen = () => {
    console.log('Galleryopen');
    const { imageType } = classStateData;
    Media.launchGellery(true).then((obj) => {
      console.log(obj);
      console.log(obj.path);
      setState({
        [imageType]: obj,
        mediamodal: false
      })
      // editImage(obj.path);
      // if (classStateData.img_type == 0) {
      //   setState({ cover_img: obj.path, mediamodal: false })
      // }
      // else {
      //   setState({ profile_img: obj.path, mediamodal: false, profile_image: obj.path })
      // }
    }).catch((error) => {
      setState({ mediamodal: false })
    })
  }

  DocumentGalleryopen = async () => {
    // Pick a single file
    console.log('uploadVoiceFile');
    const { imageType } = classStateData;
    Media.launchDocumentGellery(true).then((res) => {
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
      setState({
        [imageType]: source,
        mediamodal: false
      }, () => {
        //handleUploadFile();
        console.log('classStateData.id_image:: ', classStateData.id_image);
      });
      // setState({
      //   [imageType]: obj,
      //   mediamodal: false
      // })
      // editImage(obj.path);
      // if (classStateData.img_type == 0) {
      //   setState({ cover_img: obj.path, mediamodal: false })
      // }
      // else {
      //   setState({ profile_img: obj.path, mediamodal: false, profile_image: obj.path })
      // }
    }).catch((error) => {
      setState({ mediamodal: false })
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
    //   // setState({
    //   //   [imageType]: obj,
    //   //   mediamodal: false
    //   // })

    //   setState({
    //     [imageType]: source,
    //     mediamodal: false
    //   }, () => {
    //     //handleUploadFile();
    //   });

    // } catch (err) {
    //   if (DocumentPicker.isCancel(err)) {
    //     // User cancelled the picker, exit any dialogs or menus and move on
    //     setState({
    //       mediamodal: false
    //     }, () => {
    //       //handleUploadFile();
    //     });
    //   } else {
    //     console.log('errerr', err);
    //     setState({
    //       mediamodal: false
    //     }, () => {
    //       //handleUploadFile();
    //     });
    //     throw err;
    //   }
    // }
  }

  get_speciality = async () => {

    let url = config.baseURL + "api-provider-get-speciality";
    console.log("url", url)
    var data = new FormData();
    data.append('service_type', classStateData.userType[classStateData.selectuserType].value)


    API.post(url, data, 1).then((obj) => {
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

  get_all_count = async () => {
    let url = config.baseURL + "api-medical-service-area";
    console.log("url", url)
    // var data = new FormData();
    // data.append('login_user_id',user_id)
    // 
    API.get(url, 1).then((obj) => {

      if (obj.status == true) {
        setState({ Countryarr: obj.result, country_name: obj.result[0].name, country_code: obj.result[0].country_code, country_short_code: obj.result[0].country_short_code })
        console.log('get area', obj.result)
      } else {
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);
    })
  }

  showUsertypeModal = (status) => {
    setState({
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
    setState({ date_new: new Date(date1) })
    setState({ dob_date: date1, isDatePickerVisibletwo: false, })
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
            value={classStateData.id_number}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={classStateData.isSecurePassword1}
            // disableImg={true}
            // iconName={classStateData.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   setState({
            //     isSecurePassword1: !classStateData.isSecurePassword1,
            //   });
            // }}
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
                imageType: 'id_image',
                mediamodal: true
              }, () => {
                // Galleryopen()
                // uploadVoiceFile()
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
                
              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
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
            lableText={(classStateData.speciality == '') ? 'Speciality' : classStateData.speciality}
            boxPressAction={() => {
              setState({
                showSpeciality: true
              })
            }}
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={classStateData.showSpeciality}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              //setModalVisible(!modalVisible);
            }}
          >
            <TouchableOpacity activeOpacity={0.9} onPress={() => {
              setState({
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
                    scrollEnabled={(classStateData.specialityArr.length > 10) ? true : false}
                    style={{
                      width: '100%',
                    }}>
                    {
                      classStateData.specialityArr.map((data, index) => {
                        return (
                          <TouchableOpacity style={{
                            width: '100%',
                          }} onPress={() => {
                            setState({
                              speciality: data.name,
                              showSpeciality: false
                            })
                          }}>
                            <View style={{
                              width: (Platform.OS == "ios") ? '95%' : '94.5%',
                              marginLeft: 15,
                              borderBottomColor: Colors.gray6,
                              borderBottomWidth: (index == (classStateData.userType.length - 1)) ? 0 : 1,
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
            // secureTextEntry={classStateData.isSecurePassword1}
            // disableImg={true}
            // iconName={classStateData.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   setState({
            //     isSecurePassword1: !classStateData.isSecurePassword1,
            //   });
            // }}
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
                mediamodal: true
              }, () => {
                //Galleryopen()
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
                
              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
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
            // secureTextEntry={classStateData.isSecurePassword1}
            // disableImg={true}
            // iconName={classStateData.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   setState({
            //     isSecurePassword1: !classStateData.isSecurePassword1,
            //   });
            // }}
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
            // borderColor: classStateData.confirmpasswordfocus == true ? '#0057A5' : Colors.placeholder_border,
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
            // secureTextEntry={classStateData.isSecurePassword1}
            // disableImg={true}
            // iconName={classStateData.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   setState({
            //     isSecurePassword1: !classStateData.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              // signup_click()
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
                imageType: 'scfhs_image',
                mediamodal: true
              }, () => {
                // Galleryopen()
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
                
              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
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
            // secureTextEntry={classStateData.isSecurePassword1}
            // disableImg={true}
            // iconName={classStateData.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   setState({
            //     isSecurePassword1: !classStateData.isSecurePassword1,
            //   });
            // }}
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
                mediamodal: true
              }, () => {
                //Galleryopen()
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
                
              }}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
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
            // secureTextEntry={classStateData.isSecurePassword1}
            // disableImg={true}
            // iconName={classStateData.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   setState({
            //     isSecurePassword1: !classStateData.isSecurePassword1,
            //   });
            // }}
            onSubmitEditing={() => {
              scfhs_numberInput.focus()
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
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={classStateData.isSecurePassword1}
            // disableImg={true}
            // iconName={classStateData.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   setState({
            //     isSecurePassword1: !classStateData.isSecurePassword1,
            //   });
            // }}
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
                imageType: 'id_image',
                mediamodal: true
              }, () => {
                // Galleryopen()
                // uploadVoiceFile()
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
                
              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
              }}>
              {(classStateData.id_image != undefined) ? classStateData.id_image.filename.trim() : 'No Attachment'}
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
            keyboardType="default"
            autoCapitalize="none"
            returnKeyLabel="next"
            returnKeyType="next"
            // secureTextEntry={classStateData.isSecurePassword1}
            // disableImg={true}
            // iconName={classStateData.isSecurePassword1 ? 'eye' : 'eye-off'}
            // iconPressAction={() => {
            //   setState({
            //     isSecurePassword1: !classStateData.isSecurePassword1,
            //   });
            // }}
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
                imageType: 'certificate',
                mediamodal: true
              }, () => {
                // Galleryopen()
                // uploadVoiceFile()
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
                
              }}
              numberOfLines={1}
              style={{
                color: Colors.textgray,
                fontFamily: Font.Regular,
                fontSize: Font.Forgot,
                alignSelf: 'flex-end',
                textAlign: config.textalign,
              }}>
              {(classStateData.certificate != undefined) ? classStateData.certificate.filename.trim() : 'No Attachment'}
            </Text>
          </View>
        </View>
      </>
    )
  }

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
          <Cameragallery mediamodal={classStateData.mediamodal}
            isCamera={false}
            isGallery={true}
            isDocument={true}
            Camerapopen={() => { Camerapopen() }}
            Galleryopen={() => { Galleryopen() }}
            DocumentGalleryopen={() => { DocumentGalleryopen() }}
            Canclemedia={() => { setState({ mediamodal: false }) }}
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={classStateData.bloodModal}
            onRequestClose={() => { }}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => { setState({ bloodModal: false }) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%' }}>
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
                  }}>{LanguageConfiguration.Country_code[config.language]}</Text>

                </View>

                <View style={{ width: '100%', alignSelf: 'center' }}>
                  <FlatList
                    //contentContainerStyle={{ paddingBottom: mobileW * 2 / 100 }}
                    data={classStateData.Countryarr}
                    renderItem={({ item, index }) => {
                      if (classStateData.Countryarr != '' || classStateData.Countryarr != null) {
                        return (

                          // <TouchableOpacity
                          //   onPress={() => { setState({ bloodModal: false, country_code: item.country_code, country_name: item.name, country_short_code: item.country_short_code }); }}
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
                            onPress={() => { setState({ bloodModal: false, country_code: item.country_code, country_name: item.name, country_short_code: item.country_short_code }); }}
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
                                  borderBottomWidth: (index == (classStateData.Countryarr.length - 1)) ? 0 : 1,
                                  // backgroundColor: 'red'
                                }}>{item.name}</Text>
                              </View> */}
                            <View style={{
                              width: (Platform.OS == "ios") ? '95%' : '94.5%',
                              marginLeft: 15,
                              borderBottomColor: Colors.gray6,
                              borderBottomWidth: (index == (classStateData.Countryarr.length - 1)) ? 0 : 1,
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
                  navigation.goBack();
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
                {LanguageConfiguration.Signup[config.language]}
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
                {LanguageConfiguration.Signuptext1[config.language]}
              </Text>
            </View>

            {/* ----------------------------------------user type------------------------------------ */}

            <DropDownboxSec
              lableText={(classStateData.selectuserType == -1) ? LanguageConfiguration.UserTypeText[config.language] : classStateData.userType[classStateData.selectuserType].title}
              boxPressAction={() => { showUsertypeModal(true) }}
            />

            <Modal
              animationType="fade"
              transparent={true}
              visible={classStateData.showUsertype}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                //setModalVisible(!modalVisible);
              }}
            >
              <TouchableOpacity activeOpacity={0.9} onPress={() => { showUsertypeModal(false) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%' }}>
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
                      classStateData.userType.map((data, index) => {
                        return (
                          <TouchableOpacity style={{
                            width: '100%',
                          }} onPress={() => {
                            setState({
                              selectuserType: index
                            }, () => {
                              showUsertypeModal(false)
                              if (index == 0 || index == 3 || index == 4) {
                                get_speciality()
                              }

                            })
                          }}>
                            <View style={{
                              width: (Platform.OS == "ios") ? '95%' : '94.5%',
                              marginLeft: 15,
                              borderBottomColor: Colors.gray6,
                              borderBottomWidth: (index == (classStateData.userType.length - 1)) ? 0 : 1,
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
            {/* {classStateData.namefocus == true && (
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
                // borderColor: classStateData.namefocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={(classStateData.selectuserType != -1 && classStateData.userType[classStateData.selectuserType].value == "lab") ? "Lab Name" : LanguageConfiguration.textinputname[config.language]}
                inputRef={(ref) => {
                  nameInput = ref;
                }}
                onChangeText={(text) =>
                  setState({ name: text })
                }
                value={classStateData.name}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInput.focus();
                }}
              />


            </View>

            {/* -----------------------------------------------------------------------------------email */}

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 2) / 100,
                // borderColor: classStateData.emailfocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={LanguageConfiguration.Mobileno[config.language]}
                inputRef={(ref) => {
                  emailInput = ref;
                }}
                onChangeText={(text) =>
                  setState({ email: text })
                }
                value={classStateData.email}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  mobileInput.focus();
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
                {LanguageConfiguration.selectcountrytitle[config.language]}
              </Text>
            </View>

            <DropDownboxSec
              lableText={classStateData.country_name.length <= 0 ? LanguageConfiguration.select[config.language] : classStateData.country_name}
              boxPressAction={() => { setState({ bloodModal: true }); }}
            />

            {/* -----------------------------------------------------------------------------no- */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', alignSelf: 'center' }}>
              <View
                style={{
                  width: '20%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 2.3) / 100,
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
                  lableText={LanguageConfiguration.CC_code[config.language]}
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
                    label={LanguageConfiguration.CC_code[config.language]}
                    mode='outlined'
                    outlineColor={Colors.field_border_color}
                    activeOutlineColor={Colors.placholderactive}
                    maxLength={3}
                    editable={false}
                    // placeholder={
                    //   classStateData.country_codefocus != true
                    //     ? LanguageConfiguration.CC_code[config.language]
                    //     : null
                    // }
                    placeholderTextColor={Colors.placeholder_text}
                    onChangeText={txt => {
                      setState({ country_code: txt });
                    }}

                    // onFocus={() => {
                    //   setState({ country_codefocus: true });
                    // }}
                    // onBlur={() => {
                    //   setState({
                    //     country_codefocus: classStateData.country_code.length > 0 ? true : false,
                    //   });
                    // }}

                    value={"" + classStateData.country_code + ""}
                    keyboardType="number-pad"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                  /> */}

                {/* {classStateData.country_code.length > 0 &&
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                        left: (mobileW * 5) / 100,
                        top: (-mobileW * 2) / 100,
                        paddingHorizontal: (mobileW * 1) / 100,
                      }}>
                      <Text style={{ color: '#0057A5' }}>
                        {LanguageConfiguration.CC_code[config.language]}
                      </Text>
                    </View>
                  } */}
              </View>

              <View
                style={{
                  width: '78%',
                  alignSelf: 'center',
                  marginTop: (mobileW * 2) / 100,
                  // borderColor: classStateData.numberfocus == true ? '#0057A5' : Colors.placeholder_border,
                  // borderWidth: 1,
                  // borderRadius: (mobileW * 1) / 100,
                }}>
                <AuthInputBoxSec
                  mainContainer={{
                    width: '100%',
                  }}
                  // icon={layer9_icon}
                  lableText={LanguageConfiguration.textinputnumber[config.language]}
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
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    passwordInput.focus();
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
                    {LanguageConfiguration.mobletexttitle[config.language]}
                  </Text>
                </View>
                {/* {classStateData.numberfocus == true && (
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                        left: (mobileW * 4) / 100,
                        top: (-mobileW * 2) / 100,
                        paddingHorizontal: (mobileW * 1) / 100,
                      }}>
                      <Text style={{ color: '#0057A5' }}>
                        {LanguageConfiguration.textinputnumber[config.language]}
                      </Text>
                    </View>
                  )} */}
              </View>
            </View>

            {
              (classStateData.selectuserType != -1 && classStateData.userType[classStateData.selectuserType].value == "lab") ?
                null :
                <>
                  {/* ------------------------------------------------------------dob-----------      */}
                  <View style={{
                    width: '90%', height: 48, alignSelf: 'center', marginTop: mobileW * 3 / 100, flexDirection: 'row',
                    borderColor: Colors.field_border_color, borderWidth: 1, borderRadius: (mobileW * 1) / 100,
                  }}>
                    <TouchableOpacity onPress={() => { setState({ isDatePickerVisibletwo: true }) }} style={{ width: '100%', flexDirection: 'row' }}>
                      <View style={{ width: '1%' }}>
                      </View>
                      <View style={{ width: '100%', height: Font.placeholder_height, marginLeft: mobileW * 2 / 100, alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{
                          width: '78%', textAlign: config.textRotate, color: Colors.placeholder_text,
                          fontFamily: Font.Regular,
                          fontSize: Font.placeholdersize,
                        }}>{classStateData.dob_date.length <= 0 ? LanguageConfiguration.dob[config.language] : classStateData.dob_date}</Text>
                        <View style={{ width: '15%', alignSelf: 'center', alignItems: 'flex-end' }}>

                          <Image source={Icons.DatePicker}
                            style={{ height: 25, width: 25 }}>
                          </Image>
                        </View>
                      </View>


                    </TouchableOpacity>

                    {classStateData.dobfocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2.5 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
                      <Text style={{ color: '#0057A5', textAlign: config.textalign }}>{LanguageConfiguration.dob[config.language]}</Text>
                    </View>}

                  </View>
                  <DateTimePicker
                    dateFormat={"YYYY-MM-DD"}
                    isVisible={classStateData.isDatePickerVisibletwo}
                    mode="date"
                    value={classStateData.date_new}
                    maximumDate={new Date()}
                    onConfirm={(date) => {
                      console.log(date);
                      setdatetwo(date),
                        setState({ isDatePickerVisibletwo: false })
                    }}
                    onCancel={() => { setState({ isDatePickerVisibletwo: false }) }}
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
                        {LanguageConfiguration.Gender[config.language]}
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
                            }}>
                            <Icon style={{ alignSelf: 'center' }}
                              name={(classStateData.mabtn == false) ? "circle-thin" : "dot-circle-o"}
                              size={22}
                              color={(classStateData.mabtn == false) ? '#8F98A7' : '#0168B3'}></Icon>

                            <View style={{ width: '70%', alignSelf: 'center' }}>
                              <Text
                                style={{
                                  marginLeft: mobileW * 1.5 / 100,
                                  textAlign: config.textRotate,
                                  color: Colors.placeholder_text,
                                  fontFamily: Font.Regular,
                                  fontSize: Font.placeholdersize,
                                }}>
                                {LanguageConfiguration.male[config.language]}
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
                          {/* {classStateData.fbtn == false && */}
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
                                textAlign: config.textRotate,
                                marginLeft: mobileW * 1.5 / 100,
                                color: Colors.placeholder_text,
                                fontFamily: Font.Regular,
                                fontSize: Font.placeholdersize,
                                // alignSelf: 'center',
                              }}>
                              {LanguageConfiguration.female[config.language]}
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
                  // borderColor: classStateData.idfocus == true ? '#0057A5' : Colors.placeholder_border,
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
                    label={LanguageConfiguration.dob[config.language]}
                    outlineColor={Colors.field_border_color}
                    activeOutlineColor={Colors.placholderactive}
                    maxLength={15}
                    // placeholder={
                    //   classStateData.idfocus != true
                    //     ? LanguageConfiguration.textinputnationalid[config.language]
                    //     : null
                    // }
                    placeholderTextColor={Colors.placeholder_text}
                    onChangeText={txt => {
                      setState({ id: txt });
                    }}
                    value={classStateData.id}
                    // onFocus={() => { setState({ idfocus: true }); }}
                    // onBlur={() => { setState({ idfocus: classStateData.id.length > 0 ? true : false }); }}
                    keyboardType="number-pad"
                    returnKeyLabel="done"
                    returnKeyType="done"
                    onSubmitEditing={() => { Keyboard.dismiss() }}
                    right={
                      <TextInput.Icon
                        name={'calendar'}
                        // onPress={() => {
                        //   setState({
                        //     isSecurePassword: !classStateData.isSecurePassword,
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
                {classStateData.idfocus == true && (
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: 'white',
                      left: (mobileW * 4) / 100,
                      top: (-mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 1) / 100,
                    }}>
                    <Text style={{ color: '#0057A5' }}>
                      {LanguageConfiguration.textinputnationalid[config.language]}
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
                {classStateData.country_short_code == 'UAE' ?
                  <Text
                    style={{
                      textAlign: config.textRotate,
                      fontSize: Font.textsize,
                      fontFamily: Font.headingfontfamily,
                      color: Colors.textgray,
                    }}>
                    {LanguageConfiguration.ProvideUAE[config.language]}
                  </Text> : <Text
                    style={{
                      textAlign: config.textRotate,
                      fontSize: Font.textsize,
                      fontFamily: Font.headingfontfamily,
                      color: Colors.textgray,
                    }}>
                    {LanguageConfiguration.Signuptext2[config.language]}
                  </Text>}
              </View> */}
            {/* ------------------------------------------------------password */}

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                marginTop: (mobileW * 2) / 100,
                flexDirection: 'row',
                // borderColor: classStateData.passwordfocus == true ? '#0057A5' : Colors.placeholder_border,
                // borderWidth: 1,
                // borderRadius: (mobileW * 1) / 100,
              }}>
              <AuthInputBoxSec
                mainContainer={{
                  width: '100%',
                }}
                // icon={layer9_icon}
                lableText={LanguageConfiguration.password[config.language]}
                inputRef={(ref) => {
                  passwordInput = ref;
                }}
                onChangeText={(text) =>
                  setState({ password: text })
                }
                value={classStateData.password}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyLabel="done"
                returnKeyType="done"
                secureTextEntry={classStateData.isSecurePassword}
                disableImg={true}
                iconName={classStateData.isSecurePassword ? 'eye' : 'eye-off'}
                iconPressAction={() => {
                  setState({
                    isSecurePassword: !classStateData.isSecurePassword,
                  });
                }}
                onSubmitEditing={() => {
                  confirmInput.focus()
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
                {LanguageConfiguration.Signuptext3[config.language]}
              </Text>
            </View>
            {/* ----------------------------------------------------------------------confirmpasword */}

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
                lableText={LanguageConfiguration.confirmpassword1[config.language]}
                inputRef={(ref) => {
                  confirmInput = ref;
                }}
                onChangeText={(text) =>
                  setState({ confirm: text })
                }
                value={classStateData.confirm}
                keyboardType="default"
                autoCapitalize="none"
                returnKeyLabel="next"
                returnKeyType="next"
                secureTextEntry={classStateData.isSecurePassword1}
                disableImg={true}
                iconName={classStateData.isSecurePassword1 ? 'eye' : 'eye-off'}
                iconPressAction={() => {
                  setState({
                    isSecurePassword1: !classStateData.isSecurePassword1,
                  });
                }}
                onSubmitEditing={() => {
                  // signup_click()
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
                {LanguageConfiguration.Signuptext4[config.language]}
              </Text>
            </View>
            {/*   ---------------------------------------------------------------------------- */}





            {
              (classStateData.selectuserType == 0 || classStateData.selectuserType == 3 || classStateData.selectuserType == 4) &&
              <>
                {renderIDNumber()}
                {renderSpeExpCer()}
                {renderExpRegid()}
              </>
            }

            {
              (classStateData.selectuserType == 1 || classStateData.selectuserType == 2) &&
              <>
                {renderIDNumber()}
                {renderExpCer()}
                {renderExp()}
              </>
            }

            {
              (classStateData.selectuserType != -1 && classStateData.userType[classStateData.selectuserType].value == "lab") &&
              <>
                {renderHealthIDNumber()}
                {renderCRC()}
              </>
            }

            <Button
              text={LanguageConfiguration.btntext[config.language]}
              // onLoading={classStateData.loading}
              customStyles={
                {
                  // mainContainer: styles.butonContainer
                }
              }
              onPress={() => signup_click()}
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
                  {LanguageConfiguration.termsandconditiontext1[config.language]}
                </Text>
                <Text
                  onPress={() => {
                    navigation.navigate(ScreenReferences.TermsAndConditions, {
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
                  {LanguageConfiguration.termsandconditiontext2[config.language]}
                  <Text
                    style={{
                      textAlign: config.textalign,
                      fontSize: (mobileW * 3.5) / 100,
                      fontFamily: Font.headingfontfamily,
                      color: Colors.placeholder_text,
                      textAlign: 'center', alignSelf: 'center'
                    }}>
                    {LanguageConfiguration.termsandconditiontext3[config.language]}
                  </Text>
                  <Text
                    onPress={() => {
                      navigation.navigate(ScreenReferences.TermsAndConditions, {
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
                    {LanguageConfiguration.termsandconditiontext4[config.language]}
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
              }}>

              </View>

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
                {LanguageConfiguration.allreadyhaveaccounttext[config.language]}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
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
                  {LanguageConfiguration.loginheretext[config.language]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={classStateData.modalVisible3}

            onRequestClose={() => { setState({ modalVisible3: false }) }}>
            <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
              <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
                networkActivityIndicatorVisible={true} />
              <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

                <View style={{ backgroundColor: '#fff', borderRadius: 2, width: "100%", }}>

                  <View style={{ alignSelf: 'flex-start', paddingVertical: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100 }} source={Icons.Logo}></Image>
                    <Text style={{ fontFamily: Font.Medium, color: '#000', fontSize: mobileW * 5 / 100, paddingLeft: mobileW * 4 / 100 }}>{LanguageConfiguration.registration[config.language]}</Text>
                  </View>

                  <View style={{ alignSelf: 'flex-start', paddingLeft: mobileW * 4 / 100, width: '90%', marginTop: mobileW * 1.5 / 100 }}>
                    <Text style={{ fontFamily: Font.Light, color: '#000', fontSize: mobileW * 4 / 100, }}>{classStateData.error_msg}</Text>
                  </View>

                  <View style={{
                    paddingBottom: mobileW * 5 / 100, marginTop: mobileW * 9 / 100,
                    alignSelf: 'flex-end',
                  }}>
                    <TouchableOpacity onPress={() => {
                      if (classStateData.status_new == true) {
                        // setTimeout(() => { setState({ modalVisible3: false }), navigation.navigate('Optpage', { country_name: classStateData.country_name }) }, 200)
                        setTimeout(() => { setState({ modalVisible3: false }) }, 200)

                      }
                      else {
                        setState({ modalVisible3: false })
                      }
                    }}
                      style={{ width: mobileW * 15 / 100, flexDirection: 'row', alignSelf: 'center', }}>
                      <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.theme_color, alignSelf: 'center', textAlign: config.textalign }}>{LanguageConfiguration.OK[config.language]}</Text>
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
