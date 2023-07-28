import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Text, TextInput, View, Linking, Image, TouchableOpacity, Modal, FlatList, PermissionsAndroid, Platform, Dimensions, StatusBar, RefreshControl, StyleSheet, LogBox } from 'react-native';
import { Media, Colors, Font, mobileH, MessageFunctions, Configurations, mobileW, LanguageConfiguration, API } from '../Helpers/Utils';
import StarRating from 'react-native-star-rating';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import getDirections from 'react-native-google-maps-directions'
import moment from 'moment-timezone';
import RNFetchBlob from "rn-fetch-blob";
import { Button } from '../Components'
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { s, vs } from 'react-native-size-matters';
import { SvgXml } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { AudioPlayer } from '../Components/AudioPlayer';
import AppLoader from '../Components/AppLoader';
import { LabTest, Prescription, Report, VideoCall, _Cross, dummyUser } from '../Assets/Icons/SvgIcons/Index';
import { useRef } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { BottomSheetProps, BottomSheetStylesForSmall, BottomSheetViewStyles } from '../Styles/Sheet';
import { getISChatImplemented } from '../Helpers/AppFunctions';
import firestore from '@react-native-firebase/firestore'
import { Message } from '../Schemas/MessageRoomSchema';
import { setAppState, setVideoCall, setVideoCallData } from '../Redux/Actions/UserActions';

export default AppointmentsDetails = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    showPDetails: false,
    appointmentDetails: '',
    otp: '',
    reportModalVisible: false,
    reports: [],
    modalPatientPrescription: false,
    isLoading: true,
    isFromReportModal: false,
    isChat: false
  })
  const [explicitLoader, setExplicitLoader] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
  }, [classStateData.isChat])
  const setState = (payload, resolver = () => { }) => {
    setClassStateData(prev => ({
      ...prev,
      ...payload
    }))

    if (resolver) {
      resolver()
    }
  }

  const attachmentOptionSheetRef = useRef()

  const {
    loginUserData
  } = useSelector(state => state.Auth)

  LogBox.ignoreAllLogs()

  const onRefresh = useCallback(() => {
    getDetails(0)
    getDay()
    FontAwesome.getImageSource('circle', 20, Colors.theme_color).then(source =>
      setState({ sliderIcon: source })
    );
  }, [])

  useEffect(() => {
    onRefresh()
  }, [])


  const getDetails = async () => {
    let url = Configurations.baseURL + "api-provider-appointment-details" //"api-patient-appointment-details";  
    setState({
      appointmentDetails: '',
      isLoading: true
    })
    var data = new FormData();
    data.append('id', route?.params?.appoinment_id)
    data.append('service_type', loginUserData?.user_type)

    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {
        // console.log({ appointmentDetails: obj?.result});
        if (obj.result.acceptance_status === 'Accepted' || obj.result.acceptance_status === 'Completed') {
          if (getISChatImplemented(obj.result.app_date, obj.result.app_time)) {
            firestore()
              .collection(`Chats-${Configurations.mode}`)
              .doc(obj.result?.order_id)
              .onSnapshot(documentSnapshot => {
                if (!documentSnapshot.exists) {
                  setState({ isChat: false })
                } else {
                  const roomDetails = documentSnapshot.data()
                  setState({ isChat: false })
                }
              })
          } else {
            setState({ isChat: true })
          }
        } else {
          setState({ isChat: false })
        }

        setState({
          appointmentDetails: obj.result,
        })
      } else {
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ad------- ", error)
    }).finally(() => {
      setState({
        isLoading: false
      })
    })

  }

  const handleGetDirections = async (lat, long, address) => {
    const data = {
      destination: {
        latitude: parseFloat(lat), //-33.8600024,
        longitude: parseFloat(long), //18.697459
        // address: address
      }
    }

    await getDirections(data)
  }

  const getDay = () => {
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
        getDetails(0)
        firestore().collection(`Chats-${Configurations.mode}`)
          .doc(classStateData?.appointmentDetails?.order_id)
          .update('MessageRoomDetails.Messages', firestore.FieldValue.arrayUnion(new Message({
            Body: `Appointment ${acceptanceStatus}ed on ${moment().format('hh:mm A, ddd, DD MMM YYYY')}`,
            DateTime: new Date(),
            DocPaths: [],
            ImagePaths: [],
            Milliseconds: moment().valueOf(),
            NumChars: 0,
            ReadBit: 1,
            SenderID: loginUserData?.user_id,
            Shown: true,
            SYSTEM: true,
            ReceiverID: item?.patient_id,
          })))
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        return false;
      }
    }).catch((error) => {

    });
  }

  const onOTP = async (id) => {

    if (classStateData.otp.length <= 0) {
      MessageFunctions.showError("Please enter OTP to continue!")
      return false;
    }

    let user_id = loginUserData['user_id']
    let user_type = loginUserData['user_type']
    let url = Configurations.baseURL + "api-complete-provider-appointment-status";
    var data = new FormData();
    data.append('id', id)
    data.append('service_type', user_type)
    data.append('otp', classStateData.otp)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        // route.params.reloadList()
        getDetails(0)
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
    });

  }

  const onUploadReport = async () => {

    let url = Configurations.baseURL + "api-upload-lab-report";
    var data = new FormData();

    data.append('appointment_id', classStateData.appointmentDetails?.id)
    data.append('patient_id', classStateData.appointmentDetails?.patient_id)
    data.append('hospital_id', (classStateData.appointmentDetails?.hospital_id != "") ?
      classStateData.appointmentDetails?.hospital_id : 0)

    if (classStateData.reports.length > 0) {
      for (var i = 0; i < classStateData.reports.length; i++) {

        let dataObj = {
          uri: classStateData.reports[i].path,
          type: classStateData.reports[i].mime, //'image/jpg',
          name: (Platform.OS == 'ios') ? classStateData.reports[i].filename : classStateData.reports[i].path !== undefined ?
            classStateData.reports[i].path.substring(classStateData.reports[i].path.lastIndexOf("/") + 1, classStateData.reports[i].length) : 'image',
        }
        data.append('report[]', dataObj)
      }
    }

    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        setState({
          reportModalVisible: false,
          reports: [],
          isFromReportModal: false,
        })
        setTimeout(() => {
          // route.params.reloadList()
          getDetails(0)
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
      reportModalVisible: true
    })
  }

  const openGalleryPicker = () => {

    dispatch(setAppState('active'))
    Media.launchGellery(false).then((obj) => {

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

      if (classStateData.isFromReportModal == true) {
        setState({
          reports: [...classStateData.reports, objF],
        })

      } else {
        setTimeout(() => {
          onUploadPrescription(Platform.OS === 'android' ? objF : obj)
        }, 800)

      }


    }).catch((error) => {

    }).finally(() => {
      // console.log({ RM: classStateData.isFromReportModal });
      attachmentOptionSheetRef.current.close()
      setTimeout(() => {
        if (classStateData.isFromReportModal == true) visibleReportModal()
      }, 1000)
    })
  }

  const openDocumentPicker = async () => {

    dispatch(setAppState('active'))
    Media.launchDocumentGellery(true).then((res) => {

      const source = {
        filename: res.name,
        mime: res.type,
        path: res.uri,
      };

      if (classStateData.isFromReportModal == true) {

        setState({
          reports: [...classStateData.reports, source],
        })
      } else {

        setTimeout(() => {
          onUploadPrescription(source)
        }, 800)

      }

    }).finally(() => {
      attachmentOptionSheetRef.current.close()
      setTimeout(() => {
        if (classStateData.isFromReportModal == true) visibleReportModal()
      }, 1000)
    })

  }

  const onUploadPrescription = async (file) => {
    let url = Configurations.baseURL + "api-doctor-upload-prescription";
    var data = new FormData();

    data.append('id', classStateData.appointmentDetails?.id)

    if (file) {
      data.append('provider_prescription', {
        uri: file?.path,
        type: file?.mime, //'image/jpg',
        name: file?.filename,
      })
    }

    // console.log('provider_prescription', {
    //   uri: file?.path,
    //   type: file?.mime, //'image/jpg',
    //   name: file?.filename,
    // })


    API.post(url, data).then((obj) => {
      if (obj.status == true) {

        // console.log({ AppointmentUpload: obj });

        setTimeout(() => {
          // route.params.reloadList()
          getDetails(0)
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
      MessageFunctions.showError(error.message)
      setState({ loading: false });
    });

  }

  const onDownloadPrescription = async (imgUrl, filename) => {
    if (Platform.OS == 'ios') {
      onActualDownload(imgUrl, filename);
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          onActualDownload(imgUrl, filename);
        } else {
          MessageFunctions.showError('You need to give storage permission to download the file');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const onActualDownload = async (imgUrl, filename) => {
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir
    setExplicitLoader(true)
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

    // console.log('The file saved to 23233', configfb, dirs);

    RNFetchBlob.config(configOptions)
      .fetch('GET', imgUrl, {})
      .then(async (res) => {
        if (Platform.OS === "ios") {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          setTimeout(() => {
            const xsm = RNFetchBlob.ios.previewDocument(configfb.path);
          }, 500)
        } else {
          MessageFunctions.showSuccess('File downloaded');
        }

        console.log('The file saved to ', res.path());
      })
      .catch((e) => {
        MessageFunctions.showError(e.message);
        console.log('The file saved to ERROR', e.message)
      }).finally(() => {
        setExplicitLoader(false)
        return null
      })

    return null
  }

  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60

  try {
    var item = classStateData.appointmentDetails
    if (classStateData.appointmentDetails != '' && classStateData.appointmentDetails != null && !classStateData.isLoading) {

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


      const chatOptions = {
        provider: {
          id: loginUserData?.user_id,
          name: item?.provider_name,
          image: Configurations.img_url3 + item?.provider_image,
          service: item?.service_type,
        },
        patient: {
          id: item?.patient_id,
          name: item?.booked_by,
          image: Configurations.img_url3 + item?.patient_image,
          address: item?.patient_address
        },
        appointment: {
          id: item?.id,
          order: item?.order_id,
          date: item?.appointment_date,
          status: item?.acceptance_status,
          bookingDate: item?.booking_dates
        }

      }

      return (
        <View style={{ flex: 1 }}>
          <ScreenHeader
            onBackPress={() => {
              navigation.goBack();
            }}
            leftIcon
            rightIcon={false}
            navigation={navigation}
            title={LanguageConfiguration.AppointmentDetails[Configurations.language]}
            style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

          <AppLoader loading={explicitLoader} />

          <KeyboardAwareScrollView extraScrollHeight={50}
            enableOnAndroid={true}
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{
              justifyContent: 'center',
              paddingBottom: vs(30),
            }}
            showsVerticalScrollIndicator={false}>
            <RefreshControl
              key={'refresher'}
              refreshing={classStateData.isLoading}
              onRefresh={onRefresh}
              enabled />
            <View
              key={'main-view'}
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
                        <SvgXml xml={dummyUser} style={{
                          alignSelf: "center",
                          marginTop: vs(5)
                        }} />
                        :
                        <Image
                          source={{ uri: Configurations.img_url3 + item.provider_image }}
                          style={{ height: s(75), width: s(75), borderRadius: s(85), borderWidth: 0.5, borderColor: Colors.Highlight }}
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
                      {item.hospital_id != undefined && item.hospital_id != "" && (
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
                        }}>

                        <AudioPlayer
                          url={Configurations.img_url3 + classStateData.appointmentDetails.symptom_recording}
                          style={{
                            width: '100%',
                            height: '100%',

                          }} />

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
                        <SvgXml xml={Prescription} height={vs(36)} width={vs(36)} />
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



                          {(item.provider_prescription != "" && item.provider_prescription != null) ?
                            <TouchableOpacity style={{
                              width: '25%'
                            }} onPress={() => {
                              if (item.provider_prescription != "" && item.provider_prescription != null) {
                                onDownloadPrescription(Configurations.img_url3 + item.provider_prescription, item.provider_prescription)
                              } else {
                                MessageFunctions.showError('Prescription not found')
                              }

                            }}>
                              <Text style={{
                                textAlign: "right",
                                fontFamily: Font.Regular,
                                fontSize: Font.xsmall,
                                color: Colors.Theme,
                              }}>Download</Text>
                            </TouchableOpacity> :
                            <View style={{
                              width: '25%'
                            }} >
                            </View>}

                          <TouchableOpacity style={{
                            width: '25%'
                          }} onPress={() => {
                            attachmentOptionSheetRef.current.open()
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
                              width: '16%',
                              marginBottom: 10,
                            }}>
                              <SvgXml xml={Report} height={(mobileW * 12) / 100} width={(mobileW * 12) / 100} />
                            </View>
                            <View style={{
                              width: '84%',
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
                                  onDownloadPrescription(Configurations.img_url3 + rItem.report, rItem.report)
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
                                reportModalVisible: true
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
                          }}

                        >
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: '#00000090',
                            }}>
                            <View
                              style={{
                                marginTop: 'auto',
                                minHeight: '25%',
                                maxHeight: '90%',
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
                                        reportModalVisible: false
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
                                  })
                                  attachmentOptionSheetRef.current.open()
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
                                      <FontAwesome5 style={{ alignSelf: 'center' }}
                                        name={"file-upload"}
                                        size={50}
                                        color={Colors.gainsboro}></FontAwesome5>
                                    </View>
                                    <View style={{
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

                                <KeyboardAwareScrollView style={{
                                  marginBottom: vs(64)
                                }} key={'kasw1'}>
                                  {
                                    classStateData.reports.map((file, index) => {
                                      return (

                                        <View style={{
                                          flexDirection: 'row',
                                          width: '100%',
                                          borderBottomWidth: 1,
                                          borderBottomColor: Colors.gainsboro,
                                          marginBottom: 10,

                                        }} key={'filee' + index}>
                                          <View style={{
                                            width: '18%',
                                            marginBottom: 10
                                          }}>
                                            <SvgXml xml={Report} height={(mobileW * 12) / 100} width={(mobileW * 12) / 100} />
                                          </View>
                                          <View style={{
                                            width: '82%',
                                          }}>
                                            <View style={{
                                              flexDirection: 'row',
                                              justifyContent: 'space-between',
                                              alignItems: 'center',
                                              width: '100%',
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
                                                }}
                                                onPress={() => {
                                                  var array = [...classStateData.reports];
                                                  var index = index
                                                  if (index !== -1) {
                                                    array.splice(index, 1);
                                                    setState({ reports: array });
                                                  }
                                                }}>
                                                <Image
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

                                </KeyboardAwareScrollView>


                              </View>

                              {
                                (classStateData.reports.length > 0) &&
                                <View style={{
                                  position: 'absolute',
                                  bottom: 25,
                                  left: 0,
                                  width: '100%'
                                  // marginTop: 20
                                }}>
                                  <Button
                                    text={'Submit'}
                                    customStyles={
                                      {
                                        mainContainer: {
                                        }
                                      }
                                    }
                                    onPress={() => {
                                      setState({
                                        reportModalVisible: false,
                                      })
                                      onUploadReport()
                                    }}
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
                        padding: 8,
                        backgroundColor: Colors.backgroundcolor,
                        justifyContent: "center",
                      }}>
                        <Image
                          style={{
                            height: (mobileW * 4) / 100,
                            width: (mobileW * 4) / 100,
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

                      {
                        (item?.patient_name != null) &&
                        <Text
                          style={{
                            color: Colors.DarkGrey,
                            fontFamily: Font.Medium,
                            fontSize: Font.small,
                            textAlign: Configurations.textalign,
                            alignSelf: 'flex-start',
                            marginTop: (windowWidth * 1) / 100,

                          }}>
                          {item?.patient_name}
                        </Text>
                      }


                      {
                        (item?.patient_address != null) &&
                        <>

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
                              {item?.patient_address}
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
                        </>
                      }

                      {
                        (item?.patient_contact != null) &&
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
                      }


                    </View>
                  }
                </View>


                {((item?.acceptance_status == 'Accepted' || item?.acceptance_status == 'Completed') && (item.service_type == "Doctor")) &&
                  <TouchableOpacity style={{
                    marginHorizontal: '3%',
                    marginBottom: vs(16)
                  }}
                    onPress={() => {
                      navigation.navigate(ScreenReferences.ChatScreen, { chatOptions, isEnabled: (classStateData.isChat) })
                    }} >
                    <Text style={{
                      color: Colors.textblue,
                      fontFamily: Font.Medium
                    }}>Chat with patient</Text>
                  </TouchableOpacity>
                }

                {(item.acceptance_status == 'Accepted' && (item.service_type != "Doctor" && item.service_type != "Lab")) ?
                  (item?.OTP == "") ?
                    <>
                      <View style={{
                        width: '92%',
                        alignSelf: 'center',
                        paddingVertical: mobileW * 2 / 100,
                        flexDirection: 'row',
                        borderTopWidth: 1,
                        borderTopColor: Colors.bordercolor,
                        alignItems: 'center'
                      }}>
                        <View style={{
                          width: '60%',
                        }}>
                          <Text allowFontScaling={false} style={{ fontSize: Font.medium, color: Colors.lightgraytext, width: '96%', textAlign: Configurations.textRotate, fontFamily: Font.Medium }}>Enter OTP to complete</Text>
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
                                otp: text
                              })
                            }}
                            value={classStateData.otp}
                            placeholder='Enter OTP'
                            placeholderTextColor={'#354052'}
                            keyboardType="number-pad"
                            returnKeyLabel='done'
                            returnKeyType='done'
                          />
                          <TouchableOpacity
                            onPress={() => {
                              onOTP(item?.id)
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
                        justifyContent: "center",
                        paddingVertical: (windowWidth * 2) / 100,
                        borderBottomWidth: 1.5,
                        borderColor: '#CCCCCC',
                      }}>

                      {
                        item.task_details.map((i, index) => {
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
                                  {i?.pname || i?.name}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Regular,
                                    color: Colors.DarkGrey,
                                  }}>
                                  {i.price}
                                </Text>
                              </TouchableOpacity>
                            );
                          }
                        })
                      }

                    </View>
                    {
                      (item.appointment_type != "Online" || item.service_type == 'Lab') &&
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
                    alignItems: 'center',
                    backgroundColor: Colors.white_color,
                    paddingTop: (mobileW * 3) / 100,
                    paddingBottom: mobileW * 3 / 100,
                    borderColor: Colors.bordercolor,

                  }, item.acceptance_status != 'Rejected' ? { justifyContent: 'space-between' } : null]}>


                  <View
                    style={{
                      flexDirection: 'row',
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

                  {
                    item.acceptance_status == 'Pending' &&
                    <View style={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>

                      <>
                        <TouchableOpacity onPress={() => {
                          updateProviderAppointmentStatus("Accept", item.id)
                        }}

                          style={{
                            backgroundColor: Colors.buttoncolorhgreen,
                            borderRadius: (mobileW * 1) / 100,
                            paddingVertical: (mobileW * 2) / 100,
                            paddingHorizontal: (mobileW * 6) / 100,
                            justifyContent: 'center',
                            marginHorizontal: '2%'
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
                            paddingVertical: (mobileW * 2) / 100,
                            borderRadius: (mobileW * 1) / 100,
                            paddingHorizontal: (mobileW * 6) / 100,
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
                    </View>
                  }



                  {
                    item.acceptance_status == 'Accepted' &&
                    <View>
                      {
                        (item.acceptance_status == 'Accepted' && UploadprecriptionBtn == true &&
                          item.service_type == "Doctor" && item.provider_prescription == null) &&
                        <>
                          <TouchableOpacity onPress={() => {

                            attachmentOptionSheetRef.current.open()
                          }}

                            style={{
                              backgroundColor: Colors.orange,
                              // width: mobileW * 39 / 100,
                              borderRadius: (mobileW * 1) / 100,
                              // paddingVertical: (mobileW * 1.5) / 100,
                              padding: (mobileW * 2) / 100,
                              justifyContent: 'center',
                              marginBottom: 6
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


                      {
                        (item.acceptance_status == 'Accepted' &&
                          item.service_type == "Doctor" &&
                          item.appointment_type == "Online" && VideoCallBtn == true) &&
                        item.booking_type === 'online_task' &&
                        <>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                              var videoDetails = {
                                fromUserId: loginUserData?.user_id,
                                fromUserName: loginUserData?.first_name,
                                order_id: item?.order_id,
                                room_name: "rootvideo_room_" + loginUserData?.user_id + "_" + item?.patient_id,
                                toUserId: item?.patient_id,
                                toUserName: item?.patient_name,
                                type: 'doctor_to_patient_video_call',
                                image: item?.patient_image,
                                isPage: "outGoing",
                              };
                              dispatch(setVideoCallData(videoDetails))
                              setTimeout(() => {
                                dispatch(setVideoCall(true))
                              }, 500);
                            }}
                            style={{
                              backgroundColor: Colors.Green,
                              borderRadius: (mobileW * 1) / 100,
                              padding: (mobileW * 2) / 100,
                              alignItems: 'center',
                              flexDirection: 'row',
                              alignSelf: 'flex-end',
                            }} >
                            <SvgXml xml={VideoCall} />
                            <Text
                              style={{
                                textAlign: 'center',
                                color: Colors.white_color,
                                textTransform: 'uppercase',
                                fontFamily: Font.SemiBold,
                                fontSize: mobileW * 3 / 100,
                                marginLeft: s(7)
                              }}
                            >VIDEO CALL</Text>
                          </TouchableOpacity>

                        </>
                      }

                    </View>
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


                  {
                    item.acceptance_status == 'Rejected' && item.rf_text != '' &&
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
                    </View>
                  }


                </View>

              </View>
            </View>
          </KeyboardAwareScrollView>

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
                      openGalleryPicker()
                    }} style={styles.roundButtonAttachmentContainer}>
                      <Image source={Icons.Gallery} style={{
                        marginVertical: vs(4),
                        width: vs(16),
                        height: vs(16),
                        tintColor: Colors.textblue
                      }} resizeMode='contain' resizeMethod='scale' />
                      <Text>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                      openDocumentPicker()
                    }} style={styles.roundButtonAttachmentContainer}>
                      <Image source={Icons.Documents} style={{
                        marginVertical: vs(4),
                        width: vs(16),
                        height: vs(16),
                        tintColor: Colors.textblue
                      }} resizeMode='contain' resizeMethod='scale' />
                      <Text style={{
                      }}>Documents</Text>
                    </TouchableOpacity>
                  </View>

                </KeyboardAwareScrollView>
              </View>
            </View>

          </RBSheet>


        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ScreenHeader
            onBackPress={() => { navigation.goBack() }}
            leftIcon
            rightIcon={false}
            navigation={navigation}
            title={LanguageConfiguration.AppointmentDetails[Configurations.language]}
            style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }}
          />

          <KeyboardAwareScrollView>

            <RefreshControl
              refreshing={classStateData.isLoading}
              enabled
              key={'refresher'} />

            <View style={{
              width: windowWidth,
              backgroundColor: Colors.White,
              paddingHorizontal: s(11),
              paddingVertical: vs(9),
              marginTop: vs(7),
            }}>

              <View
                style={{
                  flexDirection: "row",
                  width: '100%',
                  paddingHorizontal: s(11)
                }}>
                <View style={{ width: "30%" }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={vs(50)} height={vs(50)} borderRadius={vs(50)} />
                  </SkeletonPlaceholder>
                </View>

                <View style={{ justifyContent: 'center' }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 30) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                  </SkeletonPlaceholder>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(7) }} />
                  </SkeletonPlaceholder>
                </View>
              </View>
              <View style={{ width: '100%', height: 1.5, backgroundColor: Colors.backgroundcolor, marginTop: vs(7), marginBottom: vs(7) }}></View>

              <View>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 12) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                </SkeletonPlaceholder>

                <View style={{ flexDirection: 'row', marginTop: vs(7) }}>

                  <View style={{ flex: 1 }}>
                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item width={(windowWidth * 10) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(5) }} />
                    </SkeletonPlaceholder>
                  </View>

                  <View style={{ flex: 1 }}>
                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item width={(windowWidth * 10) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(5) }} />
                    </SkeletonPlaceholder>
                  </View>

                  <View style={{ flex: 1 }}>
                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item width={(windowWidth * 10) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                    </SkeletonPlaceholder>
                    <SkeletonPlaceholder>
                      <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginTop: vs(5) }} />
                    </SkeletonPlaceholder>
                  </View>

                </View>

                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 99) / 100} height={(windowWidth * 20) / 100} borderRadius={s(4)} marginTop={22} />
                </SkeletonPlaceholder>

                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 99) / 100} height={(windowWidth * 12) / 100} borderRadius={s(4)} marginTop={12} />
                </SkeletonPlaceholder>


                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 99) / 100} height={(windowWidth * 10) / 100} borderRadius={s(4)} marginTop={10} />
                </SkeletonPlaceholder>


                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={(windowWidth * 99) / 100} height={(windowWidth * 40) / 100} borderRadius={s(4)} marginTop={20} />
                </SkeletonPlaceholder>

              </View>
            </View>
          </KeyboardAwareScrollView>

        </View>
      )
    }

  } catch (e) {
    console.error({ e });
    return <>
      <ScreenHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        leftIcon
        rightIcon={false}
        navigation={navigation}
        title={LanguageConfiguration.AppointmentDetails[Configurations.language]}
        style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />
    </>
  }

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