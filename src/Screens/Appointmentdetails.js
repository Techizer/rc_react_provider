import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, View, ScrollView, Linking, SafeAreaView, Image, TouchableOpacity, Modal, FlatList, PermissionsAndroid, Platform, Dimensions, StatusBar } from 'react-native';
import { CameraGallery, Media, Colors, Font, mobileH, MessageFunctions, Configurations, mobileW, LanguageConfiguration, API } from '../Helpers/Utils';
import StarRating from 'react-native-star-rating';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import getDirections from 'react-native-google-maps-directions'
import Slider from '@react-native-community/slider';
import moment from 'moment-timezone';
import RNFetchBlob from "rn-fetch-blob";
import { Button } from '../Components'
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { s, vs } from 'react-native-size-matters';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';

var Sound = require('react-native-sound');

export default AppointmentDetails = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    showPDetails: false,
    appoinment_id: route.params.appoinment_id,
    appoinment_detetails: '',
    task_details: '',
    rating: '',
    ennterOTP: '',
    mediamodal: false,
    playState: 'paused', //playing, paused
    playSeconds: 0,
    duration: 0,
    reportModalVisible: false,
    reportsArr: [],
    modalPatientPrescription: false,
    sound: {
      //Just for Schema
      _duration: 0,
      getDuration: () => 0,
      setCurrentTime: () => {},
      isLoaded: () => false,
      getCurrentTime: () => ({seconds: 0 ,isPlaying: false}),
      pause: () => {}

    },
    sliderEditing: false
  })

  const setState = (payload, resolver) => {
    setClassStateData(prev => ({
      ...prev,
      ...payload
    }))

    if (resolver) {
      setTimeout(resolver, 300)
    }
  }


  const {
    loginUserData
  } = useSelector(state => state.Auth)


  useEffect(() => {
    get_all_details(0)
    get_day()
    Sound.setCategory('Playback', true); // true = mixWithOthers
    FontAwesome.getImageSource('circle', 20, Colors.theme_color).then(source =>
      setState({ sliderIcon: source })
    );
  }, [])

  useEffect(() => {
    loadSoundConfigurations(false)
  }, [classStateData.appoinment_detetails])

  const loadSoundConfigurations = (isPlay) => {
    if (classStateData.appoinment_detetails.symptom_recording) {
      let recordingUrl = Configurations.img_url3 + classStateData.appoinment_detetails.symptom_recording;

      console.log({recordingUrl});

      setState({
        sound: new Sound(recordingUrl, '', (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
        }),
        playState: (isPlay) ? 'playing' : 'paused',
      })
    }
  }

  const onSliderEditStart = () => {
    setState({
      sliderEditing: true
    })
  }

  const onSliderEditEnd = () => {
    setState({
      sliderEditing: false
    })
  }

  const onSliderEditing = value => {
    if (Platform.OS == "android") {
      if (classStateData.sound && classStateData.playState == 'pause' && !classStateData.sliderEditing) {
        classStateData.sound.setCurrentTime(value);
        setState({ playSeconds: value });
      }
    } else {
      if (classStateData.sound) {
        classStateData.sound.setCurrentTime(value);
        setState({ playSeconds: value });
      }
    }


  }

  const onStartPlay = async (isPlay = false) => {
    if (classStateData.sound != null) {
      if (isPlay) {
        playMusic()
        classStateData.sound.play(playComplete);
        setState({ playState: 'playing' });
      }
    } else {

      loadSoundConfigurations(isPlay)
      onStartPlay(isPlay)

    }
  };

  const playComplete = (success) => {
    if (success) {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
        Alert.alert('Notice', 'audio file error. (Error code : 2)');
      }
      if (timeout) {
        clearInterval(timeout);
      }
      setState({ playState: 'paused', playSeconds: 0 });
      classStateData.sound.setCurrentTime(0);

    } else {
      console.log('playback failed due to audio decoding errors');
    }
  }

  const playMusic = () => {
    timeout = setInterval(() => {

      if (classStateData.sound != null && classStateData.sound.isLoaded() && !classStateData.sliderEditing) {
        classStateData.sound.getCurrentTime((seconds, isPlaying) => {
          setState({
            playSeconds: seconds
          });
        })
      }
    }, 100);
  }

  const pause = () => {
    if (classStateData.sound != null) {
      classStateData.sound.pause();
    }

    setState({ playState: 'paused' });
  }

  const get_all_details = async (page) => {
    let user_id = loginUserData['user_id']
    let user_type = loginUserData['user_type']
    let url = Configurations.baseURL + "api-provider-appointment-details" //"api-patient-appointment-details";  

    var data = new FormData();
    data.append('id', classStateData.appoinment_id)

    data.append('service_type', user_type)

    API.post(url, data, page).then((obj) => {
      if (obj.status == true) {
        setState({
          appoinment_detetails: obj.result,
          message: obj.message
        }, () => {
          onStartPlay(false)
        })
      } else {

        setState({ nurse_data: obj.result, message: obj.message })
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)

    });

  }

  const handleGetDirections = (lat, long, address) => {
    const data = {
      destination: {
        latitude: lat, //-33.8600024,
        longitude: long, //18.697459
        address: address
      },
      
    }

    getDirections(data)
  }

  const get_day = () => {
    var today = new Date();
    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 28);
    let datenew_show = today.getDate()
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let month_show = today.getMonth() + 1
    let year_show = today.getFullYear()
    let show_month1 = ''
    let show_get_date = ''
    if (month_show <= 9) {
      show_month1 = "0" + month_show
    }
    else {
      show_month1 = month_show
    }
    if (datenew_show <= 9) {
      show_get_date = "0" + datenew_show
    }
    else {
      show_get_date = datenew_show
    }
    let date1_show = year_show + '-' + show_month1 + '-' + show_get_date
    setState({ set_date: date1_show, check_currentdate: date1_show })

    for (var arr = [], dt = new Date(today); dt <= new Date(nextweek); dt.setDate(dt.getDate() + 1)) {

      let date_final = new Date(dt)
      let month = date_final.getMonth() + 1
      let year = date_final.getFullYear()
      var dayName = days[date_final.getDay()];
      let final_date = date_final.getDate()
      let datenew = ''
      let show_month = ''
      if (final_date <= 9) {
        datenew = "0" + final_date
      }
      else {
        datenew = final_date
      }
      if (month <= 9) {
        show_month = "0" + month
      }
      else {
        show_month = month
      }
      let date1 = year + '-' + show_month + '-' + datenew
      let tick = 0
      if (date1 == date1_show) {
        tick = 1
      }

      arr.push({ date1: date1, datenew: datenew, day: dayName, tick: tick });
    }
    setState({ date_array: arr })
  };

  const showConfirmDialogReject = (acceptanceStatus, appointmentID) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to reject this appointment?",
      [
        {
          text: "Yes",
          onPress: () => {
            updateProviderAppointmentStatus(acceptanceStatus, appointmentID)
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  const updateProviderAppointmentStatus = async (acceptanceStatus, appointmentID) => {
    let user_type = loginUserData['user_type']
    let url = Configurations.baseURL + "api-update-provider-appointment-status";

    var data = new FormData();
    data.append('id', appointmentID)
    data.append('service_type', user_type)
    data.append('acceptance_status', acceptanceStatus)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        route.params.reloadList()
        get_all_details(0)
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        return false;
      }
    }).catch((error) => {

    });
  }

  const otpPressed = async (id) => {

    if (classStateData.ennterOTP.length <= 0) {
      MessageFunctions.showError("Please enter OTP to continue!")
      return false;
    }

    let user_id = loginUserData['user_id']
    let user_type = loginUserData['user_type']
    let url = Configurations.baseURL + "api-complete-provider-appointment-status";
    var data = new FormData();
    data.append('id', id)
    data.append('service_type', user_type)
    data.append('otp', classStateData.ennterOTP)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        route.params.reloadList()
        get_all_details(0)
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
    });

  }

  const upload_report_click = async () => {

    let url = Configurations.baseURL + "api-upload-lab-report";
    var data = new FormData();

    data.append('appointment_id', classStateData.appoinment_detetails.id)
    data.append('patient_id', classStateData.appoinment_detetails.patient_id)
    data.append('hospital_id', (classStateData.appoinment_detetails.hospital_id != "") ?
      classStateData.appoinment_detetails.hospital_id : 0)

    if (classStateData.reportsArr.length > 0) {
      for (var i = 0; i < classStateData.reportsArr.length; i++) {

        let dataObj = {
          uri: classStateData.reportsArr[i].path,
          type: classStateData.reportsArr[i].mime, //'image/jpg',
          name: (Platform.OS == 'ios') ? classStateData.reportsArr[i].filename : classStateData.reportsArr[i].path !== undefined ?
            classStateData.reportsArr[i].path.substring(classStateData.reportsArr[i].path.lastIndexOf("/") + 1, classStateData.reportsArr[i].length) : 'image',
        }
        data.append('report[]', dataObj)
      }
    }

    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        setState({
          reportModalVisible: false,
          reportsArr: [],
          isFromReportModal: false,
        })
        setTimeout(() => {
          route.params.reloadList()
          get_all_details(0)
          MessageFunctions.showSuccess(obj.message)
        }, 800);

      } else {
        setTimeout(() => {
          setState({
            reportModalVisible: true,
          })
          MessageFunctions.showError(obj.message)
        }, 200)
        return false;
      }
    }).catch((error) => {
      setState({ loading: false, reportModalVisible: true, });
    });

  }

  const visibleReportModal = () => {
    setState({
      reportModalVisible: (classStateData.isFromReportModal == true) ? true : false
    }, () => {

    })
  }

  const Galleryopen = () => {
    const { imageType } = state;
    Media.launchGellery(false).then((obj) => {
      if (classStateData.isFromReportModal == true) {
        var objF = undefined
        if (Platform.OS == "ios") {
          objF = {
            uri: obj.path,
            type: obj.mime, //'image/jpg',
            name: (Platform.OS == 'ios') ? obj.filename : obj.path !== undefined ?
              obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length) : 'image',
            filename: (Platform.OS == 'ios') ? obj.filename : obj.path !== undefined ?
              obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length) : 'image',
          }
        } else {
          objF = {
            uri: obj.path,
            type: obj.mime,
            path: obj.path,
            mime: obj.mime, //'image/jpg',
            name: (Platform.OS == 'ios') ? obj.filename : obj.path !== undefined ?
              obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length) : 'image',
            filename: (Platform.OS == 'ios') ? obj.filename : obj.path !== undefined ?
              obj.path.substring(obj.path.lastIndexOf("/") + 1, obj.length) : 'image',
          }
        }

        setState({
          reportsArr: [...classStateData.reportsArr, objF],
          mediamodal: false,
        }, () => {
          (classStateData.isFromReportModal == true) ? visibleReportModal() : null
        })
      } else {
        setState({
          [imageType]: obj,
          mediamodal: false
        }, () => {
          upload_prescription_click()
        })
      }


    }).catch((error) => {
      setState({
        mediamodal: false,
        reportModalVisible: (classStateData.isFromReportModal == true) ? true : false
      })
    })
  }

  const DocumentGalleryopen = async () => {
    const { imageType } = state;
    Media.launchDocumentGellery(true).then((res) => {

      const source = {
        filename: res.name, //"speech_file.mp3", //(response.fileName != undefined) ? response.fileName : response.uri.substr(response.uri.length - 40),
        mime: res.type,
        path: res.uri,
        // serverFileName: "assignmentfile" //"upload_audio" //
        //imageData: response.data
      };

      if (classStateData.isFromReportModal == true) {

        setState({
          reportsArr: [...classStateData.reportsArr, source],
          mediamodal: false,
        }, () => {
          (classStateData.isFromReportModal == true) ? visibleReportModal() : null
        })
      } else {

        setState({
          [imageType]: source,
          mediamodal: false
        }, () => {
          upload_prescription_click()
        });
      }

    }).catch((error) => {
      setState({
        mediamodal: false,
        reportModalVisible: (classStateData.isFromReportModal == true) ? true : false
      })
    })

  }

  const upload_prescription_click = async () => {
    // Keyboard.dismiss()

    let url = Configurations.baseURL + "api-doctor-upload-prescription";
    var data = new FormData();

    data.append('id', classStateData.appoinment_detetails.id)

    if (classStateData.provider_prescription.path != undefined) {

      data.append('provider_prescription', {
        uri: classStateData.provider_prescription.path,
        type: classStateData.provider_prescription.mime, //'image/jpg',
        name: (Platform.OS == 'ios') ? classStateData.provider_prescription.filename : 'image',
      })
    }


    API.post(url, data).then((obj) => {
      if (obj.status == true) {

        setTimeout(() => {
          route.params.reloadList()
          get_all_details(0)
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

  const downloadPrescription = async (imgUrl, filename) => {
    if (Platform.OS == 'ios') {
      actualDownload(imgUrl, filename);
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          actualDownload(imgUrl, filename);
        } else {
          MessageFunctions.showError('You need to give storage permission to download the file');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const actualDownload = (imgUrl, filename) => {
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: filename,
      path: `${dirToSave}/${filename}`,
    }
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        //appendExt: 'pdf',
      },
      android: configfb,
    });

    console.log('The file saved to 23233', configfb, dirs);

    RNFetchBlob.config(configOptions)
      .fetch('GET', imgUrl, {})
      .then((res) => {
        if (Platform.OS === "ios") {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        if (Platform.OS == 'android') {
          MessageFunctions.showSuccess('File downloaded');
        }
        console.log('The file saved to ', res);
      })
      .catch((e) => {
        MessageFunctions.showError(e.message);
        console.log('The file saved to ERROR', e.message)
      });
  }

  const getAudioTimeString = (seconds) => {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt(seconds % (60 * 60) / 60);
    const s = parseInt(seconds % 60);

    return ((h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
  }

  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60
  var item = classStateData.appoinment_detetails
  const durationString = getAudioTimeString((classStateData.sound.getDuration() === -1 ? 0 : classStateData.sound.getDuration()));

  if (classStateData.appoinment_detetails != '' && classStateData.appoinment_detetails != null) {

    var VideoCallBtn = false
    var UploadprecriptionBtn = false
    var UploadReportBtn = false

    var CurrentDate = moment().unix();
    var MyDate = moment(item.appointment_date + " " + item.from_time, 'YYYY-MM-DD hh:mm A').unix();
    var MyEndDate = moment(item.appointment_date + " 11:59 PM", 'YYYY-MM-DD hh:mm A').unix();


    if (CurrentDate > MyDate) {
      UploadprecriptionBtn = true
      UploadReportBtn = true
      if ((CurrentDate - MyDate) > (24 * 3600 * 7)) {
        UploadprecriptionBtn = false
        UploadReportBtn = false
      }
    }

    if (CurrentDate < MyDate) {
      let diff = (MyDate - CurrentDate) / 60
      if (diff <= 10) {
        VideoCallBtn = true
      }
    }
    else if (CurrentDate > MyDate) {
      VideoCallBtn = true
    }
    if (CurrentDate > MyEndDate) {
      VideoCallBtn = false
    }

    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}></SafeAreaView>

        <ScreenHeader
          onBackPress={() => {
            navigation.goBack();
          }}
          leftIcon
          rightIcon={false}
          navigation={navigation}
          title={LanguageConfiguration.AppointmentDetails[Configurations.language]}
          style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />


        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}

          showsVerticalScrollIndicator={false}  >
          <KeyboardAwareScrollView extraScrollHeight={50}
            enableOnAndroid={true}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{
              justifyContent: 'center',
              paddingBottom: vs(30),
            }}
            showsVerticalScrollIndicator={false}>

            <View
              style={{
                flex: 1,
                marginBottom: (mobileW * 40) / 100,
                shadowOpacity: 0.3,
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 2 },
                elevation: 2,
                paddingVertical: vs(9),
                backgroundColor: Colors.White,
              }}>
              <View style={{}}>

                <View>

                  {/* Order ID & Status */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: 'space-between',
                      width: "100%",
                      alignSelf: "center",
                      borderBottomWidth: 1.5,
                      borderBottomColor: Colors.backgroundcolor,
                      paddingBottom: vs(5),
                      paddingHorizontal: s(13),

                    }}>

                    <Text
                      style={{
                        fontSize: Font.small,
                        fontFamily: Font.Medium,
                        color: Colors.Theme
                      }}
                    >
                      {item.order_id}
                    </Text>
                    <Text
                      style={{
                        fontSize: Font.small,
                        fontFamily: Font.Medium,
                        color: item?.acceptance_status === 'Pending' ? Colors.Yellow : (item?.acceptance_status === 'Completed' || item?.acceptance_status === 'Accepted') ? Colors.Green : Colors.Red,
                      }}
                    >
                      {item.acceptance_status}
                    </Text>

                  </View>

                  {/* Profile Image and Personal Details */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: vs(11),
                      paddingHorizontal: s(13),
                    }}>
                    <View style={{ width: "28%", alignSelf: "center" }}>
                      {
                        (item.provider_image == "NA" || item.provider_image == null || item.provider_image == "") ?
                          <SvgXml xml={dummyUser = ''} style={{
                            alignSelf: "center",
                            marginTop: vs(5)
                          }} />
                          :
                          <Image
                            source={{ uri: Configurations.img_url3 + item.provider_image }}
                            style={{ height: s(75), width: s(75), borderRadius: s(85), borderWidth: 0.5, bordercolor: Colors.Highlight }}
                          />
                      }
                    </View>

                    <View
                      style={{
                        width: "60%",
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            color: Colors.Theme,
                            fontSize: Font.small,
                            alignSelf: 'flex-start',
                          }}>
                          {item.service_type}
                        </Text>
                        {item.hospital_id != "" && (
                          <Text
                            style={{
                              color: "#FCFFFE",
                              backgroundColor: "#FFA800",
                              fontFamily: Font.Medium,
                              fontSize: Font.medium,
                              padding: (windowWidth * 2) / 100,
                              marginTop: -3,
                              marginLeft: 10,
                              paddingVertical: (windowWidth * 0.6) / 100,
                            }}
                          >
                            {LanguageConfiguration.Hospital[Configurations.language]}
                          </Text>
                        )}
                      </View>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.medium,
                          paddingVertical: (windowWidth * 1.1) / 100,
                          color: Colors.DarkGrey,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {item.provider_name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.small,
                          color: Colors.DarkGrey,
                          alignSelf: 'flex-start',
                        }}
                      >
                        {item.speciality}
                      </Text>
                    </View>
                  </View>

                  {/* Appointment Schedule Section */}
                  <View
                    style={{
                      backgroundColor: Colors.appointmentdetaillightblue,
                      paddingHorizontal: s(13),
                      paddingVertical: vs(10)
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.small,
                        color: Colors.darkText,
                        alignSelf: 'flex-start',
                        paddingBottom: (windowWidth * 3) / 100,
                      }}
                    >
                      {LanguageConfiguration.appointment_schedule[Configurations.language]}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}>

                      <View
                        style={{
                          flex: 1,
                          marginTop: (windowWidth * 1) / 100,
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            alignSelf: 'flex-start',
                          }}
                        >
                          {LanguageConfiguration.Date[Configurations.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            alignSelf: 'flex-start',
                            marginTop: vs(5)
                          }} >
                          {item.app_date}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1.35,
                          marginTop: (windowWidth * 1) / 100,
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            alignSelf: 'flex-start',
                          }}
                        >
                          {LanguageConfiguration.Time[Configurations.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            alignSelf: 'flex-start',
                            marginTop: vs(5)
                          }} >
                          {item.app_time}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 0.65,
                          marginTop: (windowWidth * 1) / 100,
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            alignSelf: 'flex-start',
                          }}
                        >
                          {'Type'}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            alignSelf: 'flex-start',
                            textAlign: 'left',
                            marginTop: vs(5)
                          }} >
                          {item?.task_type}
                        </Text>
                      </View>

                    </View>

                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        borderTopWidth: 1.5,
                        borderTopColor: '#D8D8D8',
                        marginTop: vs(10),
                        paddingTop: vs(8)
                      }}>

                      <View
                        style={{
                          width: "42%",
                          justifyContent: "space-between",
                          flexDirection: "row",
                          alignItems: 'center'
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.DarkGrey,
                          }}>
                          {LanguageConfiguration.BookingOn[Configurations.language]}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.DarkGrey,
                            textTransform: "uppercase",
                          }}>
                          {item.booking_date}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* // patient symptom doctor */}
                  {
                    (item.service_type == "Doctor" &&
                      (item.symptom_recording != "" || item.symptom_text != "")) &&
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        backgroundColor: "#FDF7EB",
                        paddingVertical: vs(9),
                        paddingHorizontal: s(13)
                      }}>
                      <Text style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.small,
                        color: Colors.Theme,
                        alignSelf: 'flex-start',
                      }}>
                        Patient Symptom
                      </Text>
                      {
                        (item.symptom_recording != "") &&
                        <View
                          style={{
                            width: "100%",
                            alignSelf: "center",
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderBottomWidth: 1.5,
                            borderColor: Colors.gainsboro,
                            paddingVertical: vs(5)
                          }}>

                          <Text
                            style={{
                              width: '30%',
                              fontFamily: Font.Medium,
                              fontSize: Font.small,
                              color: Colors.detailTitles,
                              textAlign: 'left',
                            }}
                          >
                            {'Voice Recording'}
                          </Text>
                          <View style={{
                            width: '70%',
                            flexDirection: "row",
                            alignItems: 'center'
                          }}>
                            <TouchableOpacity onPress={() => {
                              (classStateData.playState == 'paused') ?
                                onStartPlay(true) : pause()
                            }}>
                              <Image
                                source={(classStateData.playState == 'paused') ?
                                  Icons.Play : Icons.Pause}

                                style={{
                                  width: (mobileW * 8) / 100,
                                  height: (mobileW * 8) / 100,

                                }}></Image>
                            </TouchableOpacity>
                            <Slider
                              onTouchStart={onSliderEditStart}
                              onTouchEnd={onSliderEditEnd}
                              onValueChange={onSliderEditing}
                              value={classStateData.playSeconds}
                              maximumValue={(classStateData.sound.getDuration() === -1) ? 0: classStateData.sound.getDuration()}
                              maximumTrackTintColor='gray'
                              minimumTrackTintColor={Colors.theme_color}
                              thumbImage={classStateData.sliderIcon}
                              style={{
                                flex: 1,
                                alignSelf: "center",
                                marginHorizontal: Platform.select({ ios: 5 }),
                                height: (windowWidth * 10) / 100,
                              }} />
                            <Text style={{ color: 'black', alignSelf: 'center' }}>{durationString}</Text>
                          </View>
                        </View>
                      }
                      {
                        (item.symptom_text != "") &&
                        <View
                          style={{
                            borderBottomWidth: 1.5,
                            borderColor: Colors.gainsboro,
                            paddingVertical: vs(9)
                          }}>
                          <Text style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            alignSelf: 'flex-start',
                            marginBottom: (windowWidth * 3.5) / 100,
                          }}>
                            Symptom description
                          </Text>
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.detailTitles,
                            alignSelf: 'flex-start',
                          }}>
                            {item.symptom_text}
                          </Text>
                        </View>
                      }
                      {item.patient_prescription != "" && (
                        <View
                          style={{
                            width: "100%",
                            justifyContent: 'space-between',
                            flexDirection: "row",
                            alignItems: 'center',
                            alignSelf: "center",
                            paddingTop: vs(9)
                          }}
                        >
                          <View style={{
                            width: "90%",
                            flexDirection: "row",
                            alignItems: 'center',
                          }}>
                            <Image
                              resizeMode="contain"
                              source={Icons.FileAttachment}
                              style={{
                                width: "5%",
                                height: 15,
                                marginRight: (windowWidth * 2) / 100,
                                borderColor: Colors.Theme,
                              }}
                            />
                          </View>
                          <View style={{
                            width: '74%',
                          }}>
                            <Text
                              numberOfLines={1}
                              lineBreakMode='tail'
                              style={{
                                fontFamily: Font.Regular,
                                fontSize: Font.small,
                                color: Colors.detailTitles,
                                textAlign: "auto",
                              }}
                            >
                              {item.patient_prescription}
                            </Text>
                          </View>

                          <View style={{
                            width: "10%",
                            flexDirection: "row",
                            justifyContent: 'flex-end',
                          }}>
                            <Text
                              onPress={() => {
                                setState({
                                  modalPatientPrescription: true,
                                });
                              }}
                              style={{
                                fontFamily: Font.Medium,
                                fontSize: Font.small,
                                color: Colors.Theme,
                              }}
                            >
                              View
                            </Text>
                          </View>
                        </View>
                      )}
                      <Modal
                        backdropOpacity={3}
                        animationType="fade"
                        transparent={true}
                        visible={classStateData.modalPatientPrescription}
                        presentationStyle="overFullScreen"
                        onRequestClose={() => {
                          setState({ modalPatientPrescription: false });
                        }}
                      >
                        <View
                          style={{
                            width: "95%",
                            height: mobileH - 100,
                            backgroundColor: Colors.white_color,
                            margin: (mobileW * 15) / 100,
                            borderRadius: (mobileW * 2) / 100,
                            borderWidth: 1,
                            borderColor: Colors.gray5,
                            shadowOpacity: 0.5,
                            shadowColor: "#000",
                            shadowOffset: { width: 2, height: 2 },
                            elevation: 5,
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: "center",
                            flex: 1,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              top: -10,
                              right: -5,
                            }}
                            onPress={() =>
                              setState({
                                modalPatientPrescription: false,
                              })
                            }
                          >
                            <Image
                              source={Icons.Cross}
                              style={{
                                resizeMode: "contain",
                                width: 30,
                                height: 30,
                                alignSelf: "center",
                              }}
                            />
                          </TouchableOpacity>
                          <Image
                            source={{ uri: Configurations.img_url3 + item.patient_prescription }}
                            style={{
                              resizeMode: "cover",
                              width: "100%",
                              height: (mobileH * 40) / 100,
                            }}
                          />
                        </View>
                      </Modal>
                    </View>
                  }

                  {/* // prescription doctor */}
                  {
                    (item.acceptance_status == 'Completed' &&
                      item.service_type == "Doctor") &&
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        paddingVertical: vs(10),
                        paddingHorizontal: s(13),
                      }}>
                      <Text style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.small,
                        color: Colors.Theme,
                        alignSelf: 'flex-start',
                        paddingBottom: (windowWidth * 4) / 100,
                      }}>
                        Prescription
                      </Text>
                      <View style={{
                        flexDirection: "row",
                        width: "100%",
                        paddingVertical: vs(10),
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.Border
                      }}>
                        <View style={{
                          width: '17%',
                        }}>
                          <Image
                            defaultSource={Icons.Prescription}
                            source={Icons.Prescription}
                            style={{
                              width: vs(40),
                              height: s(40)
                            }} />
                        </View>
                        <View style={{
                          width: "83%",
                        }}>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontFamily: Font.Regular,
                                fontSize: Font.small,
                                color: Colors.detailTitles,
                                alignSelf: 'flex-start',
                                width: '50%'
                              }}>{item.provider_prescription}</Text>



                            <TouchableOpacity style={{
                              width: '25%'
                            }} onPress={() => {
                              if (item.provider_prescription != "") {
                                downloadPrescription(Configurations.img_url3 + item.provider_prescription, item.provider_prescription)
                              }

                            }}>
                              <Text style={{
                                textAlign: "right",
                                fontFamily: Font.Regular,
                                fontSize: Font.xsmall,
                                color: Colors.Theme,
                              }}>Download</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                              width: '25%'
                            }} onPress={() => {
                              setState({
                                imageType: 'provider_prescription',
                                mediamodal: true
                              }, () => {

                              })
                            }}>
                              <Text style={{
                                textAlign: "right",
                                fontFamily: Font.Regular,
                                fontSize: Font.xsmall,
                                color: Colors.orange,
                              }}>Re-Upload</Text>
                            </TouchableOpacity>
                          </View>

                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.xsmall,
                            color: Colors.lightGrey,
                            alignSelf: 'flex-start',
                            marginTop: vs(3)
                          }}>{item.provider_upd}</Text>
                        </View>
                      </View>
                    </View>
                  }
                  {/* // report lab */}
                  {
                    ((item.acceptance_status == 'Accepted' || item.acceptance_status == 'Completed') &&
                      item.service_type == "Lab") &&
                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",
                        paddingHorizontal: s(13),
                        borderBottomWidth: (windowWidth * 0.3) / 100,
                        borderColor: Colors.gainsboro,
                        paddingVertical: (windowWidth * 2.5) / 100,
                      }}>
                      <Text style={{
                        fontFamily: Font.Medium,
                        fontSize: Font.regulartext_size,
                        color: Colors.Theme,
                        alignSelf: 'flex-start',
                        paddingBottom: (windowWidth * 4) / 100,
                      }}>
                        Report Attachment
                      </Text>
                      {
                        (item.report != null && item.report.length > 0) &&
                        item.report.map((rItem, rIndex) => {
                          return (
                            <View style={{
                              flexDirection: 'row',
                              width: '100%',
                              borderBottomWidth: 1,
                              borderBottomColor: Colors.gainsboro,
                              marginBottom: 10
                            }}>
                              <View style={{
                                width: '20%',
                                marginBottom: 10
                                // backgroundColor: 'red'
                              }}>
                                <Image
                                  defaultSource={Icons.Report}
                                  source={Icons.Report}
                                  style={{
                                    width: (mobileW * 14) / 100,
                                    height: (mobileW * 16) / 100,
                                  }}></Image>
                              </View>
                              <View style={{
                                width: '80%',
                                // backgroundColor: 'blue'
                              }}>
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontFamily: Font.Medium,
                                    fontSize: Font.smallheadingfont,
                                    color: Colors.darkgraytextheading,
                                    textAlign: Configurations.textRotate,
                                    marginTop: (mobileW * 1) / 100,
                                    marginBottom: (mobileW * 2) / 100,
                                  }}>{rItem.report}</Text>
                                <Text style={{
                                  fontFamily: Font.Medium,
                                  fontSize: Font.ssubtext,
                                  color: Colors.gray4,
                                  textAlign: Configurations.textRotate,
                                  marginBottom: (mobileW * 1) / 100,
                                }}>{rItem.upload_date}</Text>
                                <TouchableOpacity onPress={() => {
                                  if (item.provider_prescription != "") {
                                    downloadPrescription(Configurations.img_url3 + rItem.report, rItem.report)
                                  }

                                }}>
                                  <Text style={{
                                    textAlign: 'right',
                                    fontFamily: Font.Medium,
                                    fontSize: Font.tabtextsize,
                                    color: Colors.theme_color,
                                    marginBottom: (mobileW * 3) / 100,
                                  }}>Download</Text>
                                </TouchableOpacity>

                              </View>
                            </View>
                          )
                        })
                      }
                      {
                        (UploadReportBtn == true) &&
                        <>
                          <View style={{
                            width: '30%',
                            alignSelf: 'flex-end'
                          }}>
                            <TouchableOpacity style={{
                              borderWidth: 1,
                              borderColor: Colors.theme_color,
                              borderRadius: 5,
                              padding: 6,
                            }}
                              onPress={() => {
                                setState({
                                  reportModalVisible: !classStateData.reportModalVisible
                                })
                              }}
                            >
                              <Text style={{
                                textAlign: 'center',
                                color: Colors.theme_color,
                                fontFamily: Font.Regular,
                                fontSize: Font.buttontextsize,
                              }}>UPLOAD</Text>
                            </TouchableOpacity>
                          </View>
                          <Modal
                            backdropOpacity={3}
                            animationType="fade"
                            transparent={true}
                            visible={classStateData.reportModalVisible}
                            onRequestClose={() => {
                              // closeButtonFunction()
                            }}

                          >
                            <View
                              style={{
                                // height: '100%',
                                flex: 1,
                                // marginTop: 'auto',
                                // backgroundColor: 'red'
                                backgroundColor: '#00000090',
                              }}>
                              <View
                                style={{
                                  marginTop: 'auto',
                                  minHeight: '25%',
                                  maxHeight: '90%',
                                  // alignSelf: 'flex-end',
                                  backgroundColor: 'white',
                                  borderTopStartRadius: 20,
                                  borderTopEndRadius: 20
                                }}
                              >
                                <View style={{
                                  padding: 20,
                                }}>
                                  <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}>
                                    <Text style={{
                                      fontFamily: Font.Medium,
                                      fontSize: Font.headingfont_booking,
                                      color: Colors.theme_color,
                                      textTransform: 'uppercase',
                                    }}>Report Attachment</Text>
                                    <TouchableOpacity
                                      style={{
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        textAlign: 'center',
                                      }}
                                      onPress={() => {
                                        setState({
                                          reportModalVisible: !classStateData.reportModalVisible
                                        })
                                      }}>
                                      <Image
                                        // source={require('../assets/images/close.png')}
                                        source={Icons.Cross}
                                        style={{ width: 25, height: 25 }}
                                      />

                                    </TouchableOpacity>
                                  </View>

                                  <TouchableOpacity onPress={() => {
                                    setState({
                                      reportModalVisible: false,
                                      isFromReportModal: true,
                                      mediamodal: true
                                    }, () => {

                                    })
                                  }}>
                                    <View style={{
                                      padding: 10,
                                      paddingTop: 10,
                                      paddingBottom: 10,
                                      marginTop: 20,
                                      marginBottom: 20,
                                      borderRadius: 10,
                                      borderWidth: 1,
                                      borderStyle: 'dashed',
                                      bordercolor: Colors.gainsboro,
                                      flexDirection: 'row'
                                    }}>
                                      <View style={{
                                        // backgroundColor: 'red',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10,
                                        paddingRight: 0,
                                        marginRight: 10
                                      }}>
                                        {/* <Image
                                      // source={require('../assets/images/close.png')}
                                      source={Icons.Cross}
                                      style={{ width: 25, height: 25 }}
                                    /> */}
                                        <FontAwesome5 style={{ alignSelf: 'center' }}
                                          name={"file-upload"}
                                          size={50}
                                          color={Colors.gainsboro}></FontAwesome5>
                                      </View>
                                      <View style={{
                                        // backgroundColor: 'yellow',
                                        justifyContent: 'center'
                                      }}>
                                        <Text style={{
                                          fontFamily: Font.Medium,
                                          fontSize: Font.headingfont_booking,
                                          color: Colors.darkgraytextheading,
                                        }}>Tap or click to upload</Text>
                                        <Text style={{
                                          fontFamily: Font.Regular,
                                          fontSize: Font.headinggray,
                                          color: Colors.darkgraytextheading,
                                        }}>Maximum file size allowed 10 MB</Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>

                                  {
                                    (classStateData.reportsArr.length > 0) &&
                                    <>
                                      <ScrollView
                                        scrollEnabled={(classStateData.reportsArr.length >= 4) ? true : false}
                                        style={{
                                          maxHeight: '68%',
                                          marginBottom: (classStateData.reportsArr.length <= 4) ? 60 : 0
                                        }}
                                        showsVerticalScrollIndicator={false}
                                      >
                                        {
                                          classStateData.reportsArr.map((file, index) => {
                                            return (

                                              <View style={{
                                                flexDirection: 'row',
                                                width: '100%',
                                                borderBottomWidth: 1,
                                                borderBottomColor: Colors.gainsboro,
                                                marginBottom: 10
                                              }}>
                                                <View style={{
                                                  width: '18%',
                                                  marginBottom: 10
                                                  // backgroundColor: 'red'
                                                }}>
                                                  <Image
                                                    defaultSource={Icons.Report}
                                                    source={Icons.Report}
                                                    style={{
                                                      width: (mobileW * 12) / 100,
                                                      height: (mobileW * 16) / 100,
                                                    }}></Image>
                                                </View>
                                                <View style={{
                                                  width: '82%',
                                                  // backgroundColor: 'blue'
                                                }}>
                                                  <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                    // backgroundColor: 'red'
                                                  }}>
                                                    <Text
                                                      numberOfLines={2}
                                                      lineBreakMode={'tail'}
                                                      style={{
                                                        width: '80%',
                                                        fontFamily: Font.Medium,
                                                        fontSize: Font.headinggray,
                                                        color: Colors.darkgraytextheading,
                                                        textAlign: Configurations.textRotate,
                                                        marginTop: (mobileW * 2) / 100,
                                                        marginBottom: (mobileW * 2) / 100,
                                                      }}>{file.filename}</Text>
                                                    <TouchableOpacity
                                                      style={{
                                                        justifyContent: 'flex-end',
                                                        alignContent: 'flex-end',
                                                        alignItems: 'flex-end',
                                                        width: '20%',
                                                        // backgroundColor: 'blue'
                                                      }}
                                                      onPress={() => {
                                                        var array = [...classStateData.reportsArr]; // make a separate copy of the array
                                                        var index = index
                                                        if (index !== -1) {
                                                          array.splice(index, 1);
                                                          setState({ reportsArr: array });
                                                        }
                                                      }}>
                                                      {/* <Entypo style={{
                                                          // alignSelf: 'flex-end'
                                                        }}
                                                          name={"cross"}
                                                          size={30}
                                                          color={Colors.gray4}></Entypo> */}
                                                      <Image
                                                        // source={require('../assets/images/close.png')}
                                                        source={Icons.Cross}
                                                        style={{ width: 20, height: 20 }}
                                                      />
                                                    </TouchableOpacity>
                                                  </View>

                                                  <View style={{
                                                    marginTop: 15,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                  }}>
                                                    <View style={{
                                                      height: 2,
                                                      width: '80%',
                                                      backgroundColor: Colors.theme_color
                                                    }}>

                                                    </View>
                                                    <Text style={{
                                                      fontFamily: Font.Regular,
                                                      fontSize: Font.smallheadingfont,
                                                      color: Colors.darkgraytextheading,
                                                      textAlign: 'right',
                                                      width: '20%'
                                                    }}>100%</Text>
                                                  </View>

                                                </View>
                                              </View>

                                            )
                                          })
                                        }
                                      </ScrollView>

                                    </>
                                  }


                                </View>

                                {
                                  (classStateData.reportsArr.length > 0) &&
                                  <View style={{
                                    position: 'absolute',
                                    bottom: 25,
                                    left: 0,
                                    width: '100%'
                                    // marginTop: 20
                                  }}>
                                    <Button
                                      text={'Submit'}
                                      // onLoading={classStateData.loading}
                                      customStyles={
                                        {
                                          // mainContainer: styles.butonContainer
                                          mainContainer: {
                                            // width: '100%',

                                          }
                                        }
                                      }
                                      onPress={() => {
                                        setState({
                                          reportModalVisible: false,
                                        }, () => {
                                          upload_report_click()
                                        })

                                      }}
                                    // isBlank={false}
                                    />
                                  </View>
                                }


                              </View>

                            </View>
                          </Modal>
                        </>
                      }

                    </View>
                  }

                  {/* patient details */}
                  <View style={{
                    width: "100%",
                    alignSelf: "center",
                    paddingVertical: (windowWidth * 3) / 100,
                  }}>
                    <View style={{
                      width: "100%",
                      paddingHorizontal: s(13),
                      flexDirection: "row",
                      alignItems: 'center',
                      justifyContent: "space-between",
                    }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          color: Colors.darkText,
                          alignSelf: 'center',

                        }}>{LanguageConfiguration.patient_details[Configurations.language]}</Text>
                      <TouchableOpacity onPress={() => {
                        setState({
                          showPDetails: !classStateData.showPDetails
                        })
                      }}>
                        <View style={{
                          padding: 15,
                          backgroundColor: Colors.backgroundcolor,
                          justifyContent: "center",
                        }}>
                          <Image
                            style={{
                              height: (mobileW * 4.5) / 100,
                              width: (mobileW * 4.5) / 100,
                            }}
                            source={(classStateData.showPDetails) ? Icons.UpArrow : Icons.DownArrow} />
                        </View>
                      </TouchableOpacity>
                    </View>
                    {
                      (classStateData.showPDetails) &&
                      <View style={{
                        width: "100%",
                        paddingHorizontal: s(13),
                      }}>
                        <Text
                          style={{
                            color: Colors.DarkGrey,
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            textAlign: Configurations.textalign,
                            alignSelf: 'flex-start',
                            marginTop: (windowWidth * 1) / 100,

                          }}>
                          {item.patient_name}
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            marginTop: (windowWidth * 1.5) / 100,
                            width: "100%",
                          }}>
                          <Image
                            source={Icons.Location}
                            style={{
                              marginTop: (windowWidth * 1) / 100,
                              width: (windowWidth * 3.5) / 100,
                              height: (windowWidth * 3.5) / 100,
                              resizeMode: "contain",
                              tintColor: Colors.Theme,
                            }}></Image>

                          <Text
                            style={{
                              color: Colors.DarkGrey,
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              alignSelf: 'flex-start',
                              marginLeft: (windowWidth * 3) / 100,
                              width: "96%",

                            }}>
                            {item.patient_address}
                          </Text>


                        </View>

                        <View>
                          <TouchableOpacity onPress={() => {
                            handleGetDirections(item?.patient_lat, item?.patient_long, item?.patient_address)
                          }}>
                            <Text
                              style={{
                                color: Colors.textblue,
                                fontFamily: Font.Medium,
                                fontSize: Font.sregulartext_size,
                                textAlign: Configurations.textRotate,
                                marginLeft: mobileW * 6.5 / 100,
                                marginTop: mobileW * 2 / 100,
                                width: '96%'

                              }}>
                              Open Google Map
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: mobileW * 2 / 100
                          }}>
                          {Configurations.language == 0 ?
                            <Image
                              source={Icons.PhoneSettings}
                              style={{
                                width: (mobileW * 3.5) / 100,
                                height: (mobileW * 3.5) / 100,
                                resizeMode: 'contain',
                                tintColor: Colors.theme_color,
                              }}></Image> :
                            <Image
                              source={Icons.CallRTL}
                              style={{
                                width: (mobileW * 3.5) / 100,
                                height: (mobileW * 3.5) / 100,
                                resizeMode: 'contain',
                                tintColor: Colors.theme_color,
                              }}></Image>}
                          <Text
                            style={{
                              color: Colors.lightgraytext,
                              fontFamily: Font.Medium,
                              fontSize: Font.sregulartext_size,
                              textAlign: Configurations.textalign,
                              marginHorizontal: (mobileW * 3) / 100,
                            }}>
                            {item.patient_contact}
                          </Text>
                          <TouchableOpacity onPress={() => {
                            Linking.openURL(`tel:${item.patient_contact}`)
                          }}>
                            <Text
                              style={{
                                color: Colors.textblue,
                                fontFamily: Font.Medium,
                                fontSize: Font.sregulartext_size,
                                textAlign: Configurations.textRotate,
                                marginLeft: mobileW * 2 / 100,
                                width: '96%'

                              }}>
                              Call
                            </Text>
                          </TouchableOpacity>

                        </View>
                      </View>
                    }
                  </View>
                  {(item.acceptance_status == 'Accepted' && (item.service_type != "Doctor" && item.service_type != "Lab")) ?
                    (item?.OTP == "") ?
                      <>
                        <View style={{
                          width: '90%',
                          alignSelf: 'center', paddingVertical: mobileW * 2 / 100,
                          flexDirection: 'row', borderTopWidth: 1,
                          borderTopColor: Colors.bordercolor,
                          alignItems: 'center'
                        }}>
                          <View style={{
                            // backgroundColor: '#F7F8FA'
                            width: '60%'
                          }}>
                            <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.lightgraytext, width: '75%', textAlign: Configurations.textRotate, fontFamily: Font.Medium }}>Enter OTP to complete</Text>
                          </View>
                          <View style={{
                            backgroundColor: '#F7F8FA',
                            width: '40%',
                            flexDirection: 'row',
                            borderRadius: 5
                            // justifyContent: 'space-between'
                          }}>
                            <TextInput
                              style={{
                                height: 30,
                                width: '75%',
                                // backgroundColor: 'red',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: 0,
                                color: 'black'
                              }}
                              onChangeText={(text) => {
                                setState({
                                  ennterOTP: text
                                })
                              }}
                              value={classStateData.ennterOTP}
                              placeholder='Enter OTP'
                              placeholderTextColor={'#354052'}
                              keyboardType="number-pad"
                              returnKeyLabel='done'
                              returnKeyType='done'
                            />
                            <TouchableOpacity
                              onPress={() => {
                                otpPressed(item?.id)
                              }}
                              style={{
                                width: '25%',
                                // paddingLeft: 5,
                                // paddingRight: 3,
                                borderLeftWidth: 1,
                                borderLeftColor: '#E2E7EE',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                              <Icon style={{ alignSelf: 'center' }}
                                name={"send-sharp"}
                                size={20}
                                color={'#0888D1'}></Icon>
                            </TouchableOpacity>
                          </View>

                        </View>
                      </> :
                      <>
                        <View style={{ width: '90%', alignSelf: 'center', paddingVertical: mobileW * 2 / 100, flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.bordercolor }}>
                          <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.lightgraytext, width: '75%', textAlign: Configurations.textRotate, fontFamily: Font.Medium }}>{LanguageConfiguration.appointment_closed_otp_text[Configurations.language]}</Text>
                          <Text style={{ fontSize: mobileW * 3.5 / 100, color: Colors.lightgraytext, width: '25%', textAlign: 'right', fontFamily: Font.Medium }}>{item.OTP}</Text>
                        </View>
                      </> : null


                  }
                  {(item.acceptance_status == 'Completed' && (item.service_type != "Doctor" && item.service_type != "Lab")) &&
                    <View style={{
                      width: "100%",
                      alignSelf: "center",
                      paddingVertical: (windowWidth * 2) / 100,
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderTopColor: Colors.backgroundcolor,
                      paddingHorizontal: s(13)
                    }}>
                      <Text style={{
                        fontSize: Font.small,
                        color: Colors.Green,
                        width: "75%",
                        alignSelf: 'flex-start',
                        fontFamily: Font.Regular,
                      }}>{LanguageConfiguration.appointment_closed_otp_text[Configurations.language]}</Text>
                      <Text style={{ fontSize: Font.small, color: Colors.buttoncolorhgreen, width: '25%', textAlign: 'right', fontFamily: Font.Regular }}>{item.OTP}</Text>
                    </View>
                  }
                  {/* payment details */}
                  <View style={{
                    backgroundColor: Colors.appointmentdetaillightgray,
                    width: "100%",
                    paddingHorizontal: s(13),
                    paddingVertical: vs(9)
                  }}>

                    <View
                      style={{
                        width: "100%",
                        alignSelf: "center",


                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.small,
                          alignSelf: 'flex-start',
                          color: Colors.darkText,
                        }}>{LanguageConfiguration.Payment[Configurations.language]}

                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: (windowWidth * 2) / 100,
                          borderBottomWidth: 1.5,
                          borderColor: '#CCCCCC',
                        }}>
                        <FlatList
                          data={item.task_details}
                          scrollEnabled={true}
                          nestedScrollEnabled={true}
                          renderItem={({ item, index }) => {
                            if (item.task_details != '') {
                              return (
                                <TouchableOpacity activeOpacity={0.9}
                                  // onPress={() => { check_all(item, index) }}
                                  style={{
                                    alignItems: "center",
                                    width: "100%",
                                    paddingVertical: (windowWidth * 1.7) / 100,
                                    flexDirection: "row",
                                    justifyContent: 'space-between'
                                  }}>

                                  <Text
                                    style={{
                                      alignSelf: "center",
                                      fontSize: Font.small,
                                      fontFamily: Font.Regular,
                                      color: Colors.DarkGrey,
                                    }}>
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: Font.small,
                                      fontFamily: Font.Regular,
                                      color: Colors.DarkGrey,
                                    }}>
                                    {item.price}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          }}></FlatList>

                      </View>
                      {
                        (item.appointment_type != "Online") &&
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: (windowWidth * 2) / 100,
                            // borderBottomWidth: (windowWidth * 0.3) / 100,
                            borderColor: Colors.bordercolor,
                          }}>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.DarkGrey,
                            }}>{LanguageConfiguration.distanceFare[Configurations.language]}

                          </Text>
                          <Text
                            style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.small,
                              color: Colors.DarkGrey,
                            }}>{item.distance_fee}

                          </Text>
                        </View>
                      }

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: (windowWidth * 1) / 100,
                          borderColor: Colors.bordercolor,
                          marginTop: (windowWidth * 1) / 100,
                          marginBottom: (windowWidth * 3) / 100,
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.DarkGrey,
                          }}>{item.vat_percent}

                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.small,
                            color: Colors.DarkGrey,
                          }}>{item.vat}

                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: (windowWidth * 2) / 100,
                        }}>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.darkText,
                          }}>
                          {'Subtotal'}
                        </Text>
                        <Text
                          style={{
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            color: Colors.darkText,
                          }}>
                          {item.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* last button */}
                  <View
                    style={[{
                      width: '91%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      backgroundColor: Colors.white_color,
                      paddingTop: (mobileW * 3) / 100,
                      paddingBottom: mobileW * 3 / 100,
                      alignItems: 'center',

                      // borderTopWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.bordercolor,

                    }, item.acceptance_status != 'Rejected' ? { justifyContent: 'space-between' } : null]}>
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        width: '40%'
                      }}>
                      {Configurations.language == 0 ?
                        <Image
                          source={Icons.Wallet}
                          style={{
                            resizeMode: 'contain',
                            width: 15,
                            height: 15,
                          }}></Image> :
                        <Image
                          source={Icons.Wallet_arbic}
                          style={{
                            resizeMode: 'contain',
                            width: 15,
                            height: 15,
                          }}></Image>}
                      <Text
                        style={{
                          color: Colors.theme_color,
                          fontSize: (mobileW * 3.7) / 100,
                          fontFamily: Font.Medium,
                          marginTop: 0.5,
                          marginLeft: mobileW * 2 / 100
                        }}>{item.price}

                      </Text>
                    </View>
                    <View style={{
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      width: '60%',
                      // backgroundColor: 'red'
                    }}>
                      {item.acceptance_status == 'Pending' &&
                        <>
                          <TouchableOpacity onPress={() => {
                            updateProviderAppointmentStatus("Accept", item.id)
                          }}

                            style={{
                              backgroundColor: Colors.buttoncolorhgreen,
                              width: '40%',
                              borderRadius: (mobileW * 1) / 100,
                              paddingVertical: (mobileW * 2) / 100,
                              justifyContent: 'center',
                              marginHorizontal: '4%'
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: Colors.white_color,
                                textTransform: 'uppercase',
                                fontFamily: Font.SemiBold,
                                fontSize: mobileW * 3 / 100,
                              }}>Accept</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => {
                            showConfirmDialogReject("Reject", item.id)
                          }}

                            style={{
                              backgroundColor: '#FF4500',
                              width: '40%',
                              borderRadius: (mobileW * 1) / 100,
                              paddingVertical: (mobileW * 2) / 100,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: Colors.white_color,
                                textTransform: 'uppercase',
                                fontFamily: Font.SemiBold,
                                fontSize: mobileW * 3 / 100,
                              }}>Reject</Text>
                          </TouchableOpacity>
                        </>
                      }
                      <CameraGallery mediamodal={classStateData.mediamodal}
                        isCamera={false}
                        isGallery={true}
                        isDocument={true}
                        Camerapopen={() => { Camerapopen() }}
                        Galleryopen={() => { Galleryopen() }}
                        DocumentGalleryopen={() => { DocumentGalleryopen() }}
                        Canclemedia={() => {
                          setState({
                            mediamodal: false,
                            reportModalVisible: (classStateData.isFromReportModal == true) ? true : false
                          })
                        }}
                      />
                      {(item.acceptance_status == 'Accepted' &&
                        item.service_type == "Doctor" &&
                        item.appointment_type == "Online" && VideoCallBtn == true) &&
                        item.booking_type === 'online_task' &&
                        <>
                          <TouchableOpacity onPress={() => {
                            navigation.navigate(ScreenReferences.VideoCall, {
                              item: item
                            });
                          }}

                            style={{
                              backgroundColor: Colors.buttoncolorhgreen,
                              // width: mobileW * 22 / 100,
                              borderRadius: (mobileW * 1) / 100,
                              // paddingVertical: (mobileW * 1.5) / 100,
                              padding: (mobileW * 2) / 100,
                              justifyContent: 'center',

                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: Colors.white_color,
                                textTransform: 'uppercase',
                                fontFamily: Font.SemiBold,
                                fontSize: mobileW * 3 / 100,
                              }}>VIDEO CALL</Text>
                          </TouchableOpacity>
                          {/* <TouchableOpacity
                              onPress={() => {
                                setState({
                                  id: item.id,
                                }, () => {
                                  showConfirmDialogReject("Reject")
                                })
                              }}
                              style={{
                                // width: '10%',
                                // alignSelf: 'center',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                marginLeft: 10
                              }}>
                              <Image
                                source={Icons.Cross}
                                style={{
                                  width: mobileW * 6 / 100,
                                  height: mobileW * 6 / 100,
                                }}
                              />
                            </TouchableOpacity> */}
                        </>
                      }

                      {
                        (item.acceptance_status == 'Accepted' && UploadprecriptionBtn == true &&
                          item.service_type == "Doctor" && item.provider_prescription == null) &&
                        <>
                          <TouchableOpacity onPress={() => {
                            setState({
                              imageType: 'provider_prescription',
                              mediamodal: true
                            }, () => {

                            })
                          }}

                            style={{
                              backgroundColor: Colors.orange,
                              // width: mobileW * 39 / 100,
                              borderRadius: (mobileW * 1) / 100,
                              // paddingVertical: (mobileW * 1.5) / 100,
                              padding: (mobileW * 2) / 100,
                              justifyContent: 'center',
                              marginLeft: 7
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: Colors.white_color,
                                textTransform: 'uppercase',
                                fontFamily: Font.SemiBold,
                                fontSize: mobileW * 3 / 100,
                              }}>UPLOAD Prescription</Text>
                          </TouchableOpacity>
                        </>
                      }

                      {item.acceptance_status == 'Completed' &&
                        <View style={{ alignItems: 'flex-end' }}>
                          {item.avg_rating != '' && item.avg_rating != 0 ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: '2%' }}>
                              <Text style={{ fontFamily: Font.Regular, color: '#000', fontSize: mobileW * 3.5 / 100, marginRight: mobileW * 2 / 100 }}>{LanguageConfiguration.rated[Configurations.language]}</Text>
                              <StarRating
                                disabled={false}
                                fullStar={Icons.YellowStar}
                                emptyStar={Icons.UnfilledStar}
                                maxStars={5}
                                starSize={15}
                                rating={item.avg_rating}

                              />

                            </View> :
                            <>
                              <Text style={{
                                fontFamily: Font.Regular, color: '#000',
                                fontSize: mobileW * 3.5 / 100,
                                //  marginRight: mobileW * 2 / 100,
                                textAlign: 'right',
                              }}>{'Not Rated Yet'}</Text>
                            </>
                          }
                        </View>
                      }
                      {item.acceptance_status == 'Rejected' && item.rf_text != '' &&
                        <View

                          style={{
                            width: mobileW * 24 / 100,
                            borderRadius: 1,
                            paddingVertical: (mobileW * 1) / 100,
                            justifyContent: 'center',
                            marginLeft: mobileW * 2 / 100
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color: '#FF4500',
                              textTransform: 'uppercase',
                              fontFamily: Font.SemiBold,
                              fontSize: Font.medium,
                            }}>{LanguageConfiguration.Refunde[Configurations.language]}

                          </Text>
                        </View>}
                    </View>
                  </View>
                </View>

              </View>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>
    );
  }
  else {
    return (
      <View>

      </View>
    )
  }

}