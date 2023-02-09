import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, Alert, StyleSheet, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Colors, Font, Configurations, mobileW, LanguageConfiguration, API, localStorage } from '../Helpers/Utils';
import Styles from '../Styles';
import messaging from '@react-native-firebase/messaging';
import { DashBoardBox } from '../Components'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { onUserLogout } from '../Redux/Actions/UserActions';
import { vs } from 'react-native-size-matters';
global.current_lat_long = 'NA';
global.myLatitude = 'NA';
global.myLongitude = 'NA';
global.post_location = 'NA'
global.cart_customer = [];

export default Home = ({ navigation, route }) => {

  const [state, setState] = useState({
    notification_count: '',
    profileCompletionData: null,
    HomeHealthcareServiceAppointments: [
      {
        img: Icons.AppointmentArt,
        title: 'My Appointment',
        details: 'Pending Appointment \n\nUpcoming Appointment \n\nOngoing Appointment \n\nPast Appointment',
        goTo: ScreenReferences.AppointmentTabStack,
        actionColor: '',
        actionMessage: '',
        actionTextColor: ''
      },
      {
        img: Icons.ScheduleArt,
        title: 'My Availability Schedule',
        details: 'Schedule Availibility \n\nPlan Week, MON - SUN \n\nDay Wise Time Setting \n\nBooking OFF and ON',
        goTo: ScreenReferences.AvailabilityScheduleTabStack,
        actionColor: '',
        actionMessage: '',
        actionTextColor: ''
      },
      {
        img: Icons.PriceListArt,
        title: 'Price List',
        details: 'Select Tasks \n\nPrice Each Tasks \n\nSelect Duration \n\nON and OFF Tasks',
        titleL: 'Manage Tests & Packages',
        detailsL: 'Select Tests \n\nPrice Each Tests \n\nCreate Package \n\nON and OFF Tasks or Package',
        goTo: ScreenReferences.PriceListTabStack,
        actionColor: '',
        actionMessage: '',
        actionTextColor: ''
      },
      {
        img: Icons.ServiceAddressArt,
        title: 'Service Address',
        details: 'Point Service Location \n\nManage Location Anytime \n\nGoogle Map Integrated \n\nPatient Address Assistance',
        goTo: ScreenReferences.ServiceAddress,
        actionColor: '',
        actionMessage: '',
        actionTextColor: ''
      },
      {
        img: Icons.TransactionArt,
        title: 'Transactions & More',
        details: 'Track Each Transaction \n\nFees & Charges \n\nWithdrawals \n\nSet & Transfer To Bank',
        goTo: ScreenReferences.TransactionTabStack,
        actionColor: '',
        actionMessage: '',
        actionTextColor: ''
      },
      {
        img: Icons.AccountArt,
        title: 'Account & Settings',
        details: 'Upload Picture \n\nAdd Certifications \n\nAdd Experience \n\nPersonalise Anytime',
        goTo: ScreenReferences.ShowProfile,
        actionColor: '',
        actionMessage: '',
        actionTextColor: ''
      },
      {
        img: '',
        title: 'About Rootscare',
        details: '',
        goTo: ScreenReferences.TermsAndConditions
      },
      {
        img: '',
        title: 'Help & Support',
        details: '',
        goTo: ScreenReferences.More
      },
    ]

  })

  const dispatch = useDispatch()

  const {
    loginUserData
  } = useSelector(state => state.Auth)

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    PushNotification.configure({
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        if (notification.data?.type == "Logout") {
          logout();
        }
        if (notification.userInteraction) {
          // Handle notification click
          console.log('PushNotification.configure', notification)
          if (notification.data?.type == "patient_to_doctor_video_call") {
            let data = (Platform.OS == "ios") ? JSON.parse(notification.data.notidata) : notification.data
            Alert.alert(
              "Incoming Video call",
              data.message,
              [
                {
                  text: "Reject",
                  onPress: () => {
                    console.log("Cancel Pressed");
                    callRejectNotification(data)
                  },
                  style: "cancel",
                },
                {
                  text: "Accept",
                  onPress: () => {
                    console.log("Accept Pressed");
                    //   val messageBody = json.optString("message")
                    // val roomName = json.getString("room_name")
                    // val fromUserName = json.optString("fromUserName")
                    // val fromUserId = json.getString("fromUserId")
                    // val toUserName = json.getString("toUserName")
                    // val toUserId = json.getString("toUserId")
                    // val orderId = json.getString("order_id")
                    showVideoCallAlert(data)
                  },
                  style: "default",
                },
              ],
              {
                cancelable: true,
              }
            )
          }
        }

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });
    messageListener();

    navigation.addListener('focus', () => {

      get_all_count()
      getPercentage()

    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    }
  }, [])

  const logout = async () => {
    localStorage.setItemString('logout_bit', '100')
    dispatch(onUserLogout())
    navigation.reset({
      index: 0,
      routes: [{ name: ScreenReferences.Login }],
    });
  };

  const handleBackButton = () => {
    console.log('Back button is pressed', route.name);
    if (route.name == ScreenReferences.Home) {
      return true;
    } else {
      return false;
    }

  }

  const getPercentage = async () => {
    let url = Configurations.baseURL + "api-provider-profile-complete";

    var data = new FormData();
    data.append("login_user_id", loginUserData?.user_id);
    data.append("user_type", loginUserData?.user_type);
    API
      .post(url, data, 1)
      .then((completionData) => {
        state.HomeHealthcareServiceAppointments[0].actionColor = '#FFD553'
        state.HomeHealthcareServiceAppointments[0].actionTextColor = '#886701'
        state.HomeHealthcareServiceAppointments[0].actionMessage = completionData?.result?.pending_appointment

        state.HomeHealthcareServiceAppointments[1].actionColor = completionData?.result?.availability_schedule == 0 ? '#EB8C8C' : '#86D348'
        state.HomeHealthcareServiceAppointments[1].actionTextColor = completionData?.result?.availability_schedule == 0 ? '#900000' : '#347401'
        state.HomeHealthcareServiceAppointments[1].actionMessage = completionData?.result?.availability_schedule == 0 ? 'Incomplete Setup' : 'Completed'

        state.HomeHealthcareServiceAppointments[2].actionColor = completionData?.result?.price_section == 0 ? '#EB8C8C' : '#86D348'
        state.HomeHealthcareServiceAppointments[2].actionTextColor = completionData?.result?.price_section == 0 ? '#900000' : '#347401'
        state.HomeHealthcareServiceAppointments[2].actionMessage = completionData?.result?.price_section == 0 ? 'Incomplete Setup' : 'Completed'

        state.HomeHealthcareServiceAppointments[3].actionColor = completionData?.result?.address == 0 ? '#EB8C8C' : '#86D348'
        state.HomeHealthcareServiceAppointments[3].actionTextColor = completionData?.result?.address == 0 ? '#900000' : '#347401'
        state.HomeHealthcareServiceAppointments[3].actionMessage = completionData?.result?.address == 0 ? 'Incomplete Setup' : 'Completed'

        state.HomeHealthcareServiceAppointments[5].actionColor = completionData?.result?.profile_section == 0 ? '#EB8C8C' : '#86D348'
        state.HomeHealthcareServiceAppointments[5].actionTextColor = completionData?.result?.profile_section == 0 ? '#900000' : '#347401'
        state.HomeHealthcareServiceAppointments[5].actionMessage = completionData?.result?.profile_section == 0 ? 'Incomplete Setup' : 'Completed'

        setState(prev => ({
          ...prev,
          profileCompletionData: completionData?.result,
          HomeHealthcareServiceAppointments: [...state.HomeHealthcareServiceAppointments]

        }))
      })
      .catch((error) => {
        console.log({ errorz: error });
      });
  }

  const messageListener = async () => {

    //alert('come')
    // console.log('inside message listener ****** ')
    PushNotification.createChannel(
      {
        channelId: "rootscares1", // (required)
        channelName: "rootscare messasge", // (required)

        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    )
    messaging().onMessage(async remoteMessage => {

      console.log({ remoteMessage });

      if (remoteMessage.data?.type == "Logout") {
        logout();
      }

      PushNotification.localNotification({
        channelId: 'rootscares1', //his must be same with channelid in createchannel
        title: remoteMessage.data.title, //'Appointment Booking',
        message: remoteMessage.data.body,
        userInfo: remoteMessage.data
      })
      // MessageFunctions.showSuccess("yes call coming")
    }
    )

  }

  const showVideoCallAlert = (data) => {
    var myData = {
      "fromUserId": data.fromUserId,
      "fromUserName": data.fromUserName,
      "order_id": data.order_id,
      "room_name": data.room_name,
      "toUserId": data.toUserId,
      "toUserName": data.toUserName,
      "type": data.type,
      "ispage": "accept"
    }
    navigation.navigate(ScreenReferences.VideoCall, {
      item: myData
    });
  }

  const callRejectNotification = async (notidata) => {
    let apiName = "api-get-video-access-token-with-push-notification";
    let url = Configurations.baseURL + apiName;

    var data = new FormData();
    data.append("fromUserId", loginUserData?.user_id);
    data.append("fromUserName", notidata.toUserName);
    data.append("order_id", notidata.order_id);
    data.append("room_name", notidata.room_name);
    data.append("toUserId", notidata.fromUserId);
    data.append("toUserName", notidata.fromUserName);
    data.append("type", "doctor_to_patient_video_call_reject");


    API
      .post(url, data, 1)
      .then((obj) => {
        ;
        if (obj.status == true) {
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };

  const get_all_count = async () => {
    let url = Configurations.baseURL + "api-notification-count";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', loginUserData?.user_id)


    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        setState(prev => ({
          ...prev,
          notification_count: obj.result
        }))
      } else {
        return false;
      }
    }).catch((error) => {
      getProfile()
      setState(prev => ({
        ...prev,
        notification_count: 0
      }))
      console.log("-------- error ------- " + error);
    })

  }


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      <View style={Styles.container3}>

        <View style={styles_new.headerstyle}>
          <View
            style={{
              padding: (mobileW * 2.5) / 100,
              flexDirection: 'row',
              width: '95%',
              alignSelf: 'center',
              paddingTop: (mobileW * 3) / 100,
              backgroundColor: Colors.white_color,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '10%',
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignSelf: 'center',
                paddingTop: (mobileW * 1.5) / 100,
              }}>
              <TouchableOpacity onPress={() => {
                navigation.toggleDrawer();
              }}>
                <Image
                  source={loginUserData?.image == null || loginUserData?.image == '' ? Icons.AccountFilled : { uri: Configurations.img_url3 + loginUserData?.image }}
                  style={{
                    // resizeMode: 'contain',
                    width: (mobileW * 9) / 100,
                    height: (mobileW * 9) / 100,
                    borderRadius: mobileW * 4.5 / 100
                  }}></Image>
              </TouchableOpacity>
            </View>
            <View style={{ width: '80%', alignSelf: 'center', paddingTop: (mobileW * 1.5) / 100, }}>

              <View style={{ width: '95%', alignSelf: 'center' }}>
                <Text style={{
                  textAlign: Configurations.textalign,
                  fontSize: mobileW * 4.5 / 100,
                  color: Colors.textblack,
                  fontFamily: Font.Medium,
                  alignSelf: 'center'
                }}>
                  {LanguageConfiguration.dashboardtext[Configurations.language]}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '10%',
                paddingTop: (mobileW * 2) / 100,
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={() => { navigation.navigate(ScreenReferences.Notifications) }}>
                {/* <TouchableOpacity onPress={()=>{notificationfunctoion()}}> */}
                <Image
                  // tintColor="#fff"
                  source={state?.notification_count > 0 ? Icons.NotificationBadge : Icons.Notification}
                  style={{
                    alignSelf: 'flex-end',
                    resizeMode: 'contain',
                    width: (mobileW * 6) / 100,
                    height: (mobileW * 6) / 100,
                  }}></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{
          //paddingBottom: 120
        }}>
          <FlatList
            style={{
              backgroundColor: Colors.backgroundcolor,
            }}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            ListHeaderComponent={(state?.profileCompletionData && state?.notification_count !== '') ? () => {
              const cProgress = (state?.profileCompletionData) ? state?.profileCompletionData?.total_complete : 25
              return (
                <View style={{
                  width: mobileW,
                  flexDirection: 'column',
                  marginTop: 8,
                  backgroundColor: 'white'
                }}>
                  <View style={{
                    width: mobileW,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                    backgroundColor: 'white'
                  }}>
                    <View style={{
                      width: mobileW / 3,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 16,
                      height: 'auto'
                      //backgroundColor: 'pink'
                    }}>

                      <CircularProgress
                        duration={400}
                        activeStrokeColor={'#0888D1'}
                        inActiveStrokeColor='#E2E7EE'
                        maxValue={100}
                        titleStyle={{ fontWeight: 'bold' }}
                        // value={state?.profileCompletionData?.total_complete}
                        value={cProgress}
                        showProgressValue={true}
                        valueSuffix={'%'}
                        progressValueFontSize={Font.large}
                        activeStrokeWidth={20}
                        inActiveStrokeWidth={16}
                        strokeLinecap={'butt'}
                        radius={mobileW / 7.5}
                        progressValueColor='#0888D1'


                      />

                      <View style={{
                        width: 24,
                        height: 2,
                        position: 'absolute',
                        right: 8,
                        top: mobileW / 6,
                        bottom: mobileW / 6,
                        backgroundColor: (cProgress >= 25) ? '#0888D1' : '#E2E7EE'
                      }}>
                      </View>

                      <View style={{
                        width: 24,
                        height: 2,
                        position: 'absolute',
                        left: 8,
                        top: mobileW / 6,
                        bottom: mobileW / 6,
                        backgroundColor: (cProgress >= 75) ? '#0888D1' : '#E2E7EE'
                      }}>
                      </View>

                      <View style={{
                        width: 2,
                        height: 24,
                        position: 'absolute',
                        bottom: 12,
                        left: mobileW / 6,
                        right: mobileW / 6,
                        backgroundColor: (cProgress >= 50) ? '#0888D1' : '#E2E7EE'
                      }}>
                      </View>

                      <View style={{
                        width: 2,
                        height: 24,
                        position: 'absolute',
                        top: 12,
                        left: mobileW / 6,
                        right: mobileW / 6,
                        backgroundColor: (cProgress >= 100 || cProgress === 0) ? '#0888D1' : '#E2E7EE'
                      }}>
                      </View>

                    </View>
                    <View style={{
                      width: (mobileW * 2) / 3,
                      justifyContent: 'center',
                      padding: 16,
                    }}>

                      <Text style={{
                        color: Colors.textblack,
                        fontFamily: Font.Medium,
                        fontSize: Font.medium
                      }}>
                        {cProgress >= 100 ? `Profile Complete` : 'Profile In Progress'}
                      </Text>

                      <Text style={{
                        color: '#0888D1',
                        fontFamily: Font.Light,
                        fontSize: Font.medium,
                        marginVertical: 4
                      }}>
                        {`${cProgress}% completed`}
                      </Text>

                      <Text style={{
                        color: '#8F98A7',
                        fontFamily: Font.Regular,
                        fontSize: Font.small,
                        marginVertical: 4
                      }}>
                        {`One must complete Profile, Service Address, Schedule Availability & Price List, etc steps`}
                      </Text>



                    </View>
                  </View>
                  {
                    (state?.profileCompletionData?.availability_schedule === 0 ||
                      state?.profileCompletionData?.price_section === 0 ||
                      state?.profileCompletionData?.address === 0 ||
                      state?.profileCompletionData?.profile_section === 0) &&
                    <TouchableOpacity onPress={() => {
                      if (state?.profileCompletionData?.availability_schedule === 0) {
                        navigation.navigate(ScreenReferences.AvailabilityScheduleTabStack)
                      } else if (state?.profileCompletionData?.price_section === 0) {
                        navigation.navigate(ScreenReferences.PriceListTabStack)
                      } else if (state?.profileCompletionData?.address === 0) {
                        navigation.navigate(ScreenReferences.ServiceAddress)
                      } else if (state?.profileCompletionData?.profile_section === 0) {
                        navigation.navigate(ScreenReferences.ShowProfile)
                      }
                    }} >
                      <View style={{
                        backgroundColor: '#0168B3',
                        flexDirection: 'row',
                        padding: 8,
                        alignItems: 'center'
                      }}>
                        <Text style={{
                          flex: 5,
                          color: Colors.White,
                          fontFamily: Font.Medium,
                          fontSize: Font.medium
                        }}>
                          {'Complete Now to Appear In Booking App'}
                        </Text>

                        <View style={{
                          flex: 1,
                          alignSelf: 'flex-end',
                          alignItems: 'flex-end',
                          paddingHorizontal: 4
                        }}>
                          <View style={{
                            height: vs(16),
                            width: vs(16),
                            borderRadius: vs(16),
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                            <Image source={Icons.RightArrow} style={{
                              width: vs(10),
                              height: vs(10)
                            }} resizeMethod='scale' resizeMode='contain' />
                          </View>
                        </View>



                      </View>
                    </TouchableOpacity>
                  }

                </View>
              )
            } : () => {
              return (
                <></>
              )
            }}
            data={state.HomeHealthcareServiceAppointments}
            renderItem={({ item, index }) => {
              return (
                <DashBoardBox
                  textTitle={(loginUserData?.user_type == 'lab' && index == 2) ? item?.titleL : item?.title}
                  textInfo={(loginUserData?.user_type == 'lab' && index == 2) ? item?.detailsL : item?.details}
                  infoIcon={item?.img}
                  actionColor={item.actionColor}
                  actionTextColor={item?.actionTextColor}
                  actionMessage={item?.actionMessage}
                  rightIcon={Icons.RightArrow}
                  isBorder={(item?.title == "About Rootscare") ? false : true}
                  isMargin={(item?.title == "Help & Support") ? false : true}
                  onPress={() => {
                    if (item?.goTo != undefined) {
                      if (item?.title == "About Rootscare") {
                        navigation.navigate(item?.goTo,
                          {
                            contantpage: 0,
                            content: Configurations.about_url_eng,
                            content_ar: Configurations.about_url_ar
                          })
                      } else if (item?.title == 'My Appointment') {
                        navigation.navigate(item?.goTo)
                        // { title: LanguageConfiguration.upcoming_heading[Configurations.language], api_status: 0 })
                      } else {
                        navigation.navigate(item?.goTo);
                      }

                    }

                  }}
                />
              );
            }} />
        </View>
      </View>
    </View>
  );
}

const styles_new = StyleSheet.create({
  headerstyle: {
    backgroundColor: '#fff',
    paddingVertical: mobileW * 2 / 100,
    borderBottomColor: Colors.LIGHT_CLIENT_BORDER,
    borderBottomWidth: 1,
    // shadowOpacity: 0.3,
    // shadowColor:'#000',
    // shadowOffset: {width:1,height:1},
    // elevation:5,

  },
  headerstyle_new: {
    backgroundColor: 'red',
    shadowOpacity: 0.3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    elevation: 10,
    width: '100%',
    paddingVertical: mobileW * 2 / 100,

  },
  icons: {
    width: (mobileW * 13) / 100,
    height: (mobileW * 13) / 100,
    borderRadius: (mobileW * 5) / 50,
  },
  notebox: {
    backgroundColor: '#fff',
    padding: (mobileW * 4) / 100,
    marginTop: (mobileW * 2) / 100,
    borderRadius: (mobileW * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.Regular,
    lineHeight: (mobileW * 5) / 100,
  },
  notecard: {
    paddingTop: (mobileW * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (mobileW * 3) / 100,
  },
  allcheckbox: {
    width: '93%',
    alignSelf: 'flex-end',
  },

  checkboxview: {
    // paddingVertical: (mobileW * 1.5) / 100,

    alignItems: 'center',
    alignSelf: 'center',
    // backgroundColor: 'red',
    paddingVertical: (mobileW * 1.3) / 100,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboximg: {
    width: (mobileW * 7) / 100,
    height: (mobileW * 7) / 100,
    borderRadius: (mobileW * 0.4) / 100,
    marginRight: (mobileW * 2) / 100,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    flex: 0.1,
  },
  uncheckboximg: {
    resizeMode: 'contain',
    width: (mobileW * 6) / 100,
    height: (mobileW * 6) / 100,
    borderRadius: (mobileW * 0.4) / 100,
    marginRight: (mobileW * 2.9) / 100,
    marginLeft: (mobileW * 0.6) / 100,
    flex: 0.1,
  },
  checkboxtext: {
    color: '#666666',
    fontSize: Font.smalltextsize,
    fontFamily: Font.Bold,
    // fontSize: Font.smalltextsize,
    fontFamily: Font.Bold,
    flex: 0.88,
  },
  buttonstyle: {
    width: '70%',
    alignSelf: 'center',
    marginVertical: (mobileW * 9) / 100,
  },
  buttontext: {
    paddingVertical: (mobileW * 3) / 100,
    paddingHorizontal: (mobileW * 3) / 100,
    borderRadius: (mobileW * 2) / 100,
    textAlign: 'center',
    backgroundColor: '#4C94DB',
    textAlign: 'center',
    color: Colors.whiteColor,
    fontFamily: Font.ExtraBold,
    fontSize: (mobileW * 4.2) / 100,
  },

  profilecontainer: {
    marginVertical: (mobileW * 1.2) / 100,
  },
  profileinfo: {
    backgroundColor: '#fff',
    marginVertical: (mobileW * 1.2) / 100,
    padding: (mobileW * 3) / 100,
    borderRadius: (mobileW * 1) / 100,
  },
  profileinfowithimg: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginVertical: (mobileW * 1.2) / 100,
    padding: (mobileW * 3) / 100,
    paddingVertical: (mobileW * 2) / 100,
    borderRadius: (mobileW * 1) / 100,
    // backgroundColor: 'red',
  },
  infoimgicon: {
    resizeMode: 'contain',
    width: (mobileW * 8) / 100,
    height: (mobileW * 8) / 100,
    borderRadius: (mobileW * 10) / 100,
    marginRight: (mobileW * 2) / 100,
    alignSelf: 'center',
  },
  infosmalltext: {
    // width: '90%',
    // alignSelf: 'flex-end',
    alignSelf: 'center',
    fontSize: Font.ssregulartext_size,
    fontFamily: Font.Light,
    // backgroundColor: 'red',
    // color: Colors.gray3,
    // color: 'red',
    flex: 0.86,
  },

  notes: {},

  icons: {
    width: (mobileW * 13) / 100,
    height: (mobileW * 13) / 100,
    borderRadius: (mobileW * 5) / 50,
  },
  notebox: {
    backgroundColor: '#fff',
    padding: (mobileW * 6) / 100,
    marginTop: (mobileW * 2) / 100,
    borderRadius: (mobileW * 2) / 100,
  },
  noteboxtxt: {
    fontFamily: Font.Bold,
    fontSize: (mobileW * 3.8) / 100,
    lineHeight: (mobileW * 5) / 100,
  },
  notecard: {
    paddingTop: (mobileW * 3) / 100,
  },
  checkboxcontainer: {
    paddingTop: (mobileW * 3) / 100,
  },

  notecardheading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addoptioncontainer: { marginTop: (mobileW * 9) / 100 },

  imgboxcontainer: {
    borderRadius: (mobileW * 1) / 100,
  },
  imgbox: {
    height: (mobileW * 30) / 100,
    width: (mobileW * 39) / 100,
    padding: (mobileW * 2) / 100,
    borderWidth: (mobileW * 0.6) / 100,
    borderRadius: (mobileW * 3) / 100,
    borderColor: Colors.gainsboro,
    overflow: 'hidden',
    marginRight: (mobileW * 4) / 100,
    marginBottom: (mobileW * 4) / 100,
  },
  imgboxstyle: { borderRadius: (mobileW * 3) / 100 },
  insideview: {
    marginTop: (mobileW * 2) / 100,
  },
  insideviewtext: {
    alignSelf: 'flex-end',
    fontFamily: Font.ExtraBold,
    fontSize: Font.bigheadingfont,
    color: '#4B4B4B',
    marginRight: (mobileW * 0.2) / 100,
  },
  insideviewimg: {
    alignSelf: 'center',
    height: (mobileW * 8.5) / 100,
    width: (mobileW * 8.2) / 100,
    alignSelf: 'center',
    marginBottom: (mobileW * 2.5) / 100,
    resizeMode: 'center',
  },
  insideviewname: {
    alignSelf: 'center',
    fontFamily: Font.ExtraBold,
    fontSize: Font.mini,
    color: '#4B4B4B',
  },
});