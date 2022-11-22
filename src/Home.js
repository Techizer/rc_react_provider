import React, { Component } from 'react';
import { Modal, StatusBar, Text, FlatList, View, Alert, ScrollView, PermissionsAndroid, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { Colors, Font, mobileH, Mapprovider, msgProvider, msgText, config, mobileW, localStorage, localimag, consolepro, handleback, Lang_chg, apifuntion, msgTitle } from './Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Styles from './Styles';
import messaging from '@react-native-firebase/messaging';
import { AppHeader, Appheading, Searchbarandicon } from './Allcomponents';
import { DashBoardBox } from './components'
import Footer from './Footer';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
global.current_lat_long = 'NA';
global.myLatitude = 'NA';
global.myLongitude = 'NA';
global.post_location = 'NA'
global.cart_customer = [];
const HomeHealthcareServiceAppointments = [
  {
    img: localimag.appointmentIcon,
    title: 'My Appointment',
    details: 'Pending Appointment \n\nUpcoming Appointment \n\nOngoing Appointment \n\nPast Appointment',
    goTo: 'Appointmenttab' //'Appointment', //'Show_other_appoinment'
  },
  {
    img: localimag.ScheduleartIcon,
    title: 'My Availability Schedule',
    details: 'Schedule Availibility \n\nPlan Week, MON - SUN \n\nDay Wise Time Setting \n\nBooking OFF and ON',
    goTo: 'AvailabilityScheduletab'
  },
  {
    img: localimag.PricelistIcon,
    title: 'Price List',
    details: 'Select Tasks \n\nPrice Each Tasks \n\nSelect Duration \n\nON and OFF Tasks',
    titleL: 'Manage Tests & Packages',
    detailsL: 'Select Tests \n\nPrice Each Tests \n\nCreate Package \n\nON and OFF Tasks or Package',
    goTo: 'PriceListtab'
  },
  {
    img: localimag.transectionIcon,
    title: 'Transactions & More',
    details: 'Track Each Transaction \n\nFees & Charges \n\nWithdrawals \n\nSet & Transfer To Bank',
    goTo: 'Transactiontab'
  },
  {
    img: localimag.account2xIcon,
    title: 'Account & Settings',
    details: 'Upload Picture \n\nAdd Certifications \n\nAdd Experience \n\nPersonalise Anytime',
    goTo: 'MyProfile'
  },
  {
    img: '',
    title: 'About Rootscare',
    details: '',
    goTo: 'Tremsandcondition'
  },
  {
    img: '',
    title: 'Help & Support',
    details: '',
    goTo: 'More'
  },
];

const DoctorAppointment = [
  {
    id: 1,
    img: localimag.InstantVideoConsultation,
    star: '5.0',
    title: 'Instant Video Consultation',
    arabic_title: 'استشارة فيديو فورية',
    details: '15-30 mins',
    arabic_details: '30-15 دقيقة',
  },
  {
    id: 2,
    img: localimag.HomeVisitConsultation,
    star: '5.0',
    title: 'Home Visit Consultation',
    arabic_title: 'استشارة زيارة منزلية  ',
    arabic_details: 'لمدة 30 دقيقة    ',
    details: 'for 30 mins',
  },
];

const HospitalAppointment = [
  {
    id: 1,
    img: localimag.BookaLabTest,
    star: '5.0',
    title: 'Book a Lab Test',
    arabic_title: 'حجز فحص مختبر  ',
    details: 'Get the sample collected today',
    arabic_details: 'احجز لجمع العينات اليوم  ',
    arabic_condition: 'ونضمن لك الحصول على النتائج في نفس اليوم  ',
    condition: 'within 1 day report guaranteed',
    status: false
  },
  {
    id: 2,
    img: localimag.HoptlInstantVideoConsultation,
    star: '5.0',
    title: 'Instant Video Consultaion',
    arabic_title: ' استشارة فيديو فورية  ',
    details: '15-30 mins',
    arabic_details: '30-15 دقيقة',
    status: true
  },
];

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible3: false,
      latdelta: '0.0922',
      longdelta: '0.0421',
      profile_img: '',
      title: 'Booking',
      body: '',
      address_new: '',
      address_old: '',
      notification_count: '',
      app_status: ''

    };
    screens = 'Home'
  }
  componentDidMount() {
    // this.getnotification();
    var that = this;
    PushNotification.configure({
      onNotification: function (notification) {
        if (notification.userInteraction) {
          // Handle notification click
          console.log('PushNotification.configure', notification)
          if (notification.data?.type == "patient_to_doctor_video_call") {
            let data = (Platform.OS == "ios") ? 
            JSON.parse(notification.data.notidata) : notification.data
            Alert.alert(
              "Incoming Video call",
              data.message,
              [
                {
                  text: "Reject",
                  onPress: () => {
                    console.log("Cancel Pressed");
                    that.callRejectNotification(data)
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
                    that.showVideoCallAlert(data)
                  },
                  style: "default",
                },
              ],
              {
                cancelable: true,
                // onDismiss: () =>
                //   Alert.alert(
                //     "This alert was dismissed by tapping outside of the alert dialog."
                //   ),
              }
            )
          }
        }

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });
    this.messageListener();

    this.props.navigation.addListener('focus', () => {

      this.get_all_count()

    });
  }





  getnotification_Call = async () => {


    PushNotification.createChannel(
      {
        channelId: "rootscares1", // (required)
        channelName: "rootscare messasge", // (required)

        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    )

    // consolepro.consolelog('logmy',remoteMessage.notification.body)
    // consolepro.consolelog('logmy',remoteMessage.notification.title)



  }


  messageListener = async () => {

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
      console.log('hello', JSON.stringify(remoteMessage))
      //alert(JSON.stringify(remoteMessage));

      PushNotification.localNotification({
        channelId: 'rootscares1', //his must be same with channelid in createchannel
        title: remoteMessage.data.title, //'Appointment Booking',
        message: remoteMessage.data.body,
        userInfo: remoteMessage.data
      })
      // msgProvider.showSuccess("yes call coming")
    }
    )

  }

  showVideoCallAlert = (data) => {
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
    this.props.navigation.navigate('VideoCall', {
      item: myData
    });
  }

  callRejectNotification = async (notidata) => {
    let user_details = await localStorage.getItemObject("user_arr");
    let user_id = user_details["user_id"];
    let apiName = "api-get-video-access-token-with-push-notification";
    let url = config.baseURL + apiName;

    var data = new FormData();
    data.append("fromUserId", user_id);
    data.append("fromUserName", notidata.toUserName);
    data.append("order_id", notidata.order_id);
    data.append("room_name", notidata.room_name);
    data.append("toUserId", notidata.fromUserId);
    data.append("toUserName", notidata.fromUserName);
    data.append("type", "doctor_to_patient_video_call_reject");

    consolepro.consolelog("data", data);
    apifuntion
      .postApi(url, data, 1)
      .then((obj) => {
        consolepro.consolelog("obj", obj);
        if (obj.status == true) {
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- " + error);
      });
  };

  get_all_count = async () => {
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
        console.log('notification_count', obj.result)
        this.getProfile()


      } else {


        return false;
      }
    }).catch((error) => {
      this.getProfile()
      console.log("-------- error ------- " + error);
    })

  }

  getProfile = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    let address_arr = await localStorage.getItemObject('address_arr')
    console.log('user_details user_details', user_details)
    console.log('address_arr', address_arr)
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log("user_typeuser_type:: ", user_type);
    this.setState({ address_show: address_arr, 
      address_old: user_details.current_address,
      user_type: user_type
    })

    if (user_details.image != null) {
      this.setState({
        profile_img: config.img_url3 + user_details['image'],
      })
    }

  }




  render() {
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
                  this.props.navigation.toggleDrawer();
                }}>
                  <Image
                    source={this.state.profile_img == null || this.state.profile_img == '' ? localimag.p1 : { uri: this.state.profile_img }}
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
                    textAlign: config.textalign,
                    fontSize: mobileW * 4.5 / 100,
                    color: Colors.textblack,
                    fontFamily: Font.fontmedium,
                    alignSelf: 'center'
                  }}>
                    {Lang_chg.dashboardtext[config.language]}
                  </Text>
                </View>
                {/* <TouchableOpacity onPress={() => { this.props.navigation.navigate('Show_currentlocation') }} style={{ flexDirection: 'row', width: '25%', alignItems: 'center', marginLeft: mobileW * 2 / 100 }}>
                  <Text style={{
                    fontFamily: Font.fontmedium,
                    fontSize: (mobileW * 3.5) / 100,
                  }}>{Lang_chg.MyDashboard[config.language]}</Text>
                  <Image
                    source={require('./icons/back-svg.png')}
                    style={{
                      marginLeft: mobileW * 2 / 100,
                      width: 8.5,
                      height: 8.5,
                      tintColor: '#000'

                    }}></Image>
                </TouchableOpacity>
                {this.state.address_old != null && this.state.address_old != '' ?
                  <Text onPress={() => { this.props.navigation.navigate('Show_currentlocation') }}
                    numberOfLines={1}
                    style={{
                      color: '#6D737E',
                      fontFamily: Font.fontregular,
                      fontSize: Font.sregulartext_size,
                      textAlign: config.textRotate,
                      marginLeft: mobileW * 2 / 100,
                      width: '50%',
                    }}>{this.state.address_show}

                  </Text> :
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#6D737E',
                      fontFamily: Font.fontregular,
                      fontSize: Font.sregulartext_size,
                      textAlign: config.textRotate,
                      marginLeft: mobileW * 2 / 100,
                      width: '50%',
                    }}>NA

                  </Text>} */}
              </View>
              <View
                style={{
                  width: '10%',
                  paddingTop: (mobileW * 2) / 100,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Notifications') }}>
                  {/* <TouchableOpacity onPress={()=>{this.notificationfunctoion()}}> */}
                  <Image
                    // tintColor="#fff"
                    source={this.state.notification_count > 0 ? localimag.notifications : localimag.notifications_sec}
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
              data={HomeHealthcareServiceAppointments}
              renderItem={({ item, index }) => {
                return (
                  <DashBoardBox
                    textTitle={(this.state.user_type == 'lab' && index == 2) ? item?.titleL : item?.title}
                    textInfo={(this.state.user_type == 'lab' && index == 2) ? item?.detailsL : item?.details}
                    infoIcon={item?.img}
                    rightIcon={localimag.rightDIcon}
                    isBorder={(item?.title == "About Rootscare") ? false : true}
                    isMargin={(item?.title == "Help & Support") ? false : true}
                    onPress={() => {
                      if (item?.goTo != undefined) {
                        if (item?.title == "About Rootscare") {
                          this.props.navigation.navigate(item?.goTo,
                            {
                              contantpage: 0,
                              content: config.about_url_eng,
                              content_ar: config.about_url_ar
                            })
                        } else if (item?.title == 'My Appointment') {
                          this.props.navigation.navigate(item?.goTo)
                          // { title: Lang_chg.upcoming_heading[config.language], api_status: 0 })
                        } else {
                          this.props.navigation.navigate(item?.goTo);
                        }

                      }

                    }}
                  />
                );
              }}></FlatList>
          </View>
        </View>
        {/* </ScrollView> */}
        {/* <HideWithKeyboard>
          <Footer
            activepage="Home"
            usertype={1}
            footerpage={[
              {
                name: 'Home',
                fname:Lang_chg.home_footer[config.language],
                countshow: false,
                image: localimag.Home,
                activeimage: localimag.Home,
              },
              {
                name: 'Appointment',
                fname:Lang_chg.Appointment_footer[config.language],
                countshow: false,
                image: localimag.Appointment,
                activeimage: localimag.Appointment,
              },
              {
                name: 'Cart',
                fname:Lang_chg.Cart_footer[config.language],
                countshow: false,
                image: localimag.Cart,
                activeimage: localimag.Cart,
              },
              {
                name: 'More',
                fname:Lang_chg.More_footer[config.language],
                countshow: false,
                image: localimag.More,
                activeimage: localimag.More,
              },
            ]}
            navigation={this.props.navigation}
            imagestyle1={{
              width:25,
              height:25,
              paddingBottom: (mobileW * 5.4) / 100,
              backgroundColor: 'white',
              countcolor: 'red',
              countbackground: 'red',
            }}
          />
        </HideWithKeyboard> */}
      </View>
    );
  }
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
    fontFamily: Font.fontregular,
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
    fontFamily: Font.fontbold,
    // fontSize: Font.smalltextsize,
    fontFamily: Font.fontbold,
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
    fontFamily: Font.fontextrabold,
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
    fontFamily: Font.fontlight,
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
    fontFamily: Font.fontbold,
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
    fontFamily: Font.fontextrabold,
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
    fontFamily: Font.fontextrabold,
    fontSize: Font.mini,
    color: '#4B4B4B',
  },
});