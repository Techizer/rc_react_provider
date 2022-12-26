import React, { Component } from 'react';
import { Switch, Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList } from 'react-native';

import {
  Colors,
  Font,
  msgProvider,
  config,
  mobileW,
  localStorage,
  localimag,
  consolepro,
  Lang_chg,
  apifuntion,
} from './Provider/utilslib/Utils';
import Moment from "moment-timezone";
import Styles from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Footer from './Footer';
// import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { SearchPlaceScreen, Button } from './components'
import { Dropdown } from 'react-native-material-dropdown-v2';
import ListBottomSheet from './components/ListBottomSheet';
import { Arrow } from './icons/SvgIcons/Index';
const radiusArr = [
  {
    id: 1,
    value: '15',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: '30',
    symbol: 'km',
    status: false,
  },
  {
    id: 1,
    value: '50',
    symbol: 'km',
    status: false,
  },
  {
    id: 1,
    value: '75',
    symbol: 'km',
    status: false,
  },
  {
    id: 1,
    value: '100',
    symbol: 'km',
    status: false,
  },
  {
    id: 1,
    value: '125',
    symbol: 'km',
    status: false,
  },
  {
    id: 1,
    value: '150',
    symbol: 'km',
    status: false,
  },
  {
    id: 1,
    value: '200',
    symbol: 'km',
    status: false,
  },
]


export default class AvailabilitySchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: Lang_chg.MyAppointments[config.language],
      modalVisible: false,
      All: true,

      Nurse: false,
      Babysitter: false,
      Listenquiries: false,
      Physiotherapist: false,
      service_status: "",
      manageTab: 'All',
      appoinment_detetails: '',
      pass_status: 'all',
      time_take_data: '',
      rescdule_data: '',
      notification_count: '',
      date_array: '',
      send_id: '',
      message: '',
      api_status: 3,
      searchPlaceVisible: false,
      // tabheadings: tabheadings,
      task_details: "",
      isEnabled: false,
      flag: true,
      timeArray: [
        { value: '00:00 AM' },
        { value: '00:30 AM' },
        { value: '01:00 AM' },
        { value: '01:30 AM' },
        { value: '02:00 AM' },
        { value: '02:30 AM' },
        { value: '03:00 AM' },
        { value: '03:30 AM' },
        { value: '04:00 AM' },
        { value: '04:30 AM' },
        { value: '05:00 AM' },
        { value: '05:30 AM' },
        { value: '06:00 AM' },
        { value: '06:30 AM' },
        { value: '07:00 AM' },
        { value: '07:30 AM' },
        { value: '08:00 AM' },
        { value: '08:30 AM' },
        { value: '09:00 AM' },
        { value: '09:30 AM' },
        { value: '10:00 AM' },
        { value: '10:30 AM' },
        { value: '11:00 AM' },
        { value: '11:30 AM' },
        { value: '12:00 PM' },
        { value: '12:30 PM' },
        { value: '01:00 PM' },
        { value: '01:30 PM' },
        { value: '02:00 PM' },
        { value: '02:30 PM' },
        { value: '03:00 PM' },
        { value: '03:30 PM' },
        { value: '04:00 PM' },
        { value: '04:30 PM' },
        { value: '05:00 PM' },
        { value: '05:30 PM' },
        { value: '06:00 PM' },
        { value: '06:30 PM' },
        { value: '07:00 PM' },
        { value: '07:30 PM' },
        { value: '08:00 PM' },
        { value: '08:30 PM' },
        { value: '09:00 PM' },
        { value: '09:30 PM' },
        { value: '10:00 PM' },
        { value: '10:30 PM' },
        { value: '11:00 PM' },
        { value: '11:30 PM' }
      ],
      accept: true,
      hide: false,
      accept_booking: '0',
      service_address: "",
      service_lat: "",
      service_long: "",
      service_radius: "",
      radiusArr: radiusArr,
      shouldShow: false,
      currentIndex: 0,
      currentItem: { "slot_day": "MON", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },


      slotArr: [
        { "slot_day": "MON", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
        { "slot_day": "TUE", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
        { "slot_day": "WED", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
        { "slot_day": "THU", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
        { "slot_day": "FRI", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
        { "slot_day": "SAT", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
        { "slot_day": "SUN", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" }]
    };

    this.firstDropdown = null; // variable for referring to first dropdown
    this.secondDropdown = null; // variable for referring to second dropdown
  }

  componentDidMount() {
    this.get_Services()
  }

  get_Services = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let task_type = ""
    if (this.props.page == "onlinehomeschedule") {  //doctor
      task_type = "api-doctor-get-timeslot"
    } else if (this.props.page == "taskschedule") {
      task_type = "provider-nurse-task-base-time-slot"
    } else if (this.props.page == "labschedule") {
      task_type = "provider-get-time-slot"
    } else {
      task_type = "provider-nurse-hour-base-time-slot"
    }
    let apiname = task_type //"provider-nurse-task-base-time-slot"


    let apishow = apiname //"api-provider-past-appointment-list" //"api-patient-all-appointment"

    let url = config.baseURL + apishow;
    var data = new FormData();
    data.append('user_id', user_id)
    data.append('service_type', user_type)



    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      // this.setState({ appoinment_detetails: '' })
      if (obj.status == true) {

        if (obj.result.service_radius != null) {
          let arr = [...this.state.radiusArr]
          arr.map((v, i) => {
            if (obj.result.service_radius == v.value) {
              v.status = true
            } else {
              v.status = false
            }
          });
        } else {
          let arr = [...this.state.radiusArr]
          var r = 0
          arr.map((v, i) => {
            if (i == 0) {
              v.status = true
              r = v.value
            } else {
              v.status = false
            }
          });
        }



        this.setState({
          slotArr: (obj.result.slots.length > 0) ? obj.result.slots : this.state.slotArr,
          accept_booking: (obj.result.accept_booking == null) ? '1' : obj.result.accept_booking,
          accept: (obj.result.accept_booking == null) ? false : (obj.result.accept_booking == '0') ? true : false,
          hide: (obj.result.accept_booking == null) ? true : (obj.result.accept_booking == '1') ? true : false,
          service_radius: (obj.result.service_radius == null) ? r : obj.result.service_radius,
          service_address: (obj.result.service_address == null) ? '' : obj.result.service_address,
          service_lat: (obj.result.service_lat == null) ? '' : obj.result.service_lat,
          service_long: (obj.result.service_long == null) ? '' : obj.result.service_long,
          message: obj.message,
          shouldShow: true
        })

      } else {

        // this.setState({
        //   withdrawalArr: obj.result.withdrawal,
        //   abal: obj.result.abal,
        //   content: obj.result.content,
        //   bankdetails: obj.result.bankdetails,
        //   message: obj.message
        // })
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);

    });

  }

  submitPress = () => {
    if (this.state.accept_booking == '1') {
      this.insertUpdatePriceList()
    } else {
      var isError = false;
      var arr = this.state.slotArr

      arr.map((item, index) => {
        var strStartTime = item.slot_start_time //value;
        var strEndTime = item?.slot_end_time;
        var startTime = new Date().setHours(this.GetHours(strStartTime), this.GetMinutes(strStartTime), 0);
        var endTime = new Date(startTime)
        endTime = endTime.setHours(this.GetHours(strEndTime), this.GetMinutes(strEndTime), 0);
        if (startTime > endTime) {
          isError = true
        }
        if (startTime == endTime) {
          isError = true
        }
        if (startTime < endTime) {
        }
      })
      if (isError) {
        msgProvider.showError("End time should be greater than Start time")
      } else {
        if (this.state.service_address == "") {
          msgProvider.showError("Please select service location to continue")
        }
        // else if (this.state.service_radius == "" || this.state.service_radius == undefined) {
        //   msgProvider.showError("Please select booking eligibility radius to continue")
        // } 
        else {
          this.insertUpdatePriceList()
        }

      }
    }


  }

  insertUpdatePriceList = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    console.log({user_details});
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']

    console.log({ user_details });


    let apiname = (this.props.page == "onlinehomeschedule") ?
      "api-doctor-add-preferable-time" : "insert-preferable-time"


    let apishow = apiname //"api-provider-past-appointment-list" //"api-patient-all-appointment"

    let url = config.baseURL + apishow;

    var data = new FormData();
    // data.append('lgoin_user_id', user_id)
    // { "user_id":"39","service_type":"nurse",
    // "task_type":"hour_base","task_id":"1,2,3,4,5","price":"100,200,300,400,600"}

    //   {"accept_booking":"0",
    //   "service_type":"doctor",
    //   "slot_type":"online/home_visit",
    //   "slots":[{"slot_day":"MON","slot_day_enable":"1",
    //   "slot_end_time":"08:30 PM","slot_start_time":"08:30 AM"},
    //   {"slot_day":"TUE","slot_day_enable":"1",
    //   "slot_end_time":"08:30 PM","slot_start_time":"08:30 AM"},
    //   {"slot_day":"WED","slot_day_enable":"1",
    //   "slot_end_time":"08:30 PM","slot_start_time":"08:30 AM"},
    //   {"slot_day":"THU","slot_day_enable":"1",
    //   "slot_end_time":"08:30 PM","slot_start_time":"08:30 AM"},
    //   {"slot_day":"FRI","slot_day_enable":"1",
    //   "slot_end_time":"08:30 PM","slot_start_time":"08:30 AM"},
    //   {"slot_day":"SAT","slot_day_enable":"1",
    //   "slot_end_time":"08:30 PM","slot_start_time":"08:30 AM"},
    //   {"slot_day":"SUN","slot_day_enable":"1",
    //   "slot_end_time":"08:30 PM","slot_start_time":"08:30 AM"}],

    //   "user_id":"Login User id",
    //   "service_address":"service addree",
    //   "service_lat":"Service Lat",
    //   "service_long": "Service long",
    //   "service_radius": "Radius"
    // }

    // let slotsArr = [{ "slot_day": "MON", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" }, { "slot_day": "TUE", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" }, { "slot_day": "WED", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" }, { "slot_day": "THU", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" }, { "slot_day": "FRI", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" }, { "slot_day": "SAT", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" }, { "slot_day": "SUN", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" }];

    data.append('accept_booking', this.state.accept_booking)
    data.append('user_id', user_id)

    let task_type = ""
    if (this.props.page == "onlinehomeschedule") {
      task_type = "doctorslot"
    } else if (this.props.page == "taskschedule") {
      task_type = "task_base"
    } else if (this.props.page == "labschedule") {
      task_type = "task_base"
    } else {
      task_type = "hour_base"
    }
    data.append('slot_type', task_type)
    data.append('service_type', user_type)
    data.append('slots', JSON.stringify(this.state.slotArr))

    data.append('service_address', "Riyadh Road, Al Hofuf Saudi Arabia")
    data.append('service_lat', "25.3535551")
    data.append('service_long', "49.5264586")
    data.append('service_radius', "")

    var myData = JSON.stringify({
      accept_booking: this.state.accept_booking,
      user_id: user_id,
      slot_type: task_type,
      service_type: user_type,
      slots: this.state.slotArr,
      service_address: this.state.service_address,
      service_lat: this.state.service_lat,
      service_long: this.state.service_long,
      service_radius: this.state.service_radius,
    });
    console.log('-------------------------------');
    console.log({
      accept_booking: this.state.accept_booking,
      user_id: user_id,
      slot_type: task_type,
      service_type: user_type,
      slots: this.state.slotArr,
      service_address: this.state.service_address,
      service_lat: this.state.service_lat,
      service_long: this.state.service_long,
      service_radius: this.state.service_radius,
    });
    console.log('-------------------------------');
    apifuntion.postRawApi(url, myData).then((obj) => {
      // this.setState({ appoinment_detetails: '' })
      if (obj.status == true) {
        msgProvider.showSuccess(obj.message)

      } else {
        msgProvider.showError(obj.message)
        return false;
      }
    }).catch((error) => {

    });

  }

  GetHours = (d) => {
    var h = parseInt(d.split(':')[0]);
    if (d.split(':')[1].split(' ')[1] == "PM") {
      h = h + 12;
    }
    return h;
  }
  GetMinutes = (d) => {
    return parseInt(d.split(':')[1].split(' ')[0]);
  }

  openGooglePlace = () => {
    this.setState({
      searchPlaceVisible: true,
    });
  };

  closeGooglePlace = () => {
    this.setState({
      searchPlaceVisible: false,
    });
  };

  selectGooglePlace = (info) => {
    this.setState(
      {
        searchPlaceVisible: false,
        service_lat: info?.latitude,
        service_long: info?.longitude,
        service_address: info?.data?.description,
      },
      () => {
        // global.userAddress = info?.data?.description;
        // global.userLat = info?.latitude;
        // global.userLong = info?.longitude;
        // this.homeApi();
      }
    );
  };

  validationTime = (strStartTime, strEndTime, isStart, index) => {
    var isError = false;
    var strStartTime = strStartTime //value;
    var strEndTime = strEndTime //item?.slot_end_time;
    var startTime = new Date().setHours(this.GetHours(strStartTime), this.GetMinutes(strStartTime), 0);
    var endTime = new Date(startTime)
    endTime = endTime.setHours(this.GetHours(strEndTime), this.GetMinutes(strEndTime), 0);
    if (startTime > endTime) {
      isError = true
    }
    if (startTime == endTime) {
      isError = true
    }
    if (startTime < endTime) {
      isError = false
    }
    var arr = [...this.state.slotArr]

    if (isError) {
      msgProvider.showError("End time should be greater than Start time")
      // this.firstDropdown[index].setState({ value: arr[index].slot_start_time });
      // setTimeout(() => {
      //   if (isStart) {
      //     this.firstDropdown[index].setState({ value: arr[index].slot_start_time });
      //   } else {
      //     this.secondDropdown[index].setState({ value: arr[index].slot_end_time });
      //   }
      // }, 800);


    }
    else {
      if (isStart) {
        arr[index].slot_start_time = strStartTime
      } else {
        arr[index].slot_end_time = strEndTime
      }

      this.setState({
        slotArr: arr
      })
    }
  }

  render() {
    const { modalVisible } = this.state;
    var rescdule = this.state.rescdule_data

    return (

      <>
        {(this.state.shouldShow) && 
          < View style={{
            flex: 1,
            //  backgroundColor: 'white',
          }}>
        <ListBottomSheet
          data={this.state.timeArray}
          onRequestClose={() => { this.setState({ modalVisible: false }) }}
          visible={this.state.modalVisible}
          title='Select time'
          currentIndex={this.state.currentIndex}
          currentItem={this.state.currentItem}
          flag={this.state.flag}
          onSelectTime={(value, cIndex, cItem, flag) => {
            var arr = this.state.slotArr
            if (flag) {
              this.validationTime(value, this.state.slotArr[cIndex].slot_end_time, flag, cIndex)
              arr[cIndex].slot_start_time = value
              this.setState({ slotArr: arr })
            } else {
              this.validationTime(this.state.slotArr[cIndex].slot_start_time, value, flag, cIndex)
              arr[cIndex].slot_end_time = value
              this.setState({ slotArr: arr })
            }
          }} />
        {this.state.searchPlaceVisible ? (
          <SearchPlaceScreen
            closeGooglePlace={this.closeGooglePlace.bind(this)}
            selectGooglePlace={this.selectGooglePlace.bind(this)}
          />
        ) :
          <View
            style={{
              flex: 1,
              // paddingBottom: (mobileW * 10) / 100
            }}

          >
            <ScrollView
              style={{ backgroundColor: 'white', marginTop: 0 }}
              contentContainerStyle={{ paddingBottom: mobileW * 5 / 100 }}
              showsVerticalScrollIndicator={false}>
              <View style={{
                flex: 1,
                //  marginBottom: (mobileW * 10) / 100
              }}>
                <View style={{
                  marginTop: 15,
                  paddingLeft: 15,
                  paddingRight: 15
                }}>
                  <Text style={Styles.textheading}>Add Available Schedule</Text>
                  <Text style={[Styles.textcontent, {
                    marginTop: 6
                  }]}>This refers to your available time slot for patients/users to book you for their appointments.</Text>
                </View>
                <View style={{
                  marginTop: 15,
                  paddingLeft: 15,
                  paddingRight: 15
                }}>
                  <Text style={Styles.textheading}>Accept or Disable your booking:</Text>
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      marginTop: (mobileW * 3) / 100,
                      marginBottom: (mobileW * 2 / 100),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        // backgroundColor: 'red'
                      }}>
                      <View style={{ width: '50%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                          {/* {this.state.mabtn == false && */}
                          <TouchableOpacity
                            onPress={() => {
                              this.setState({
                                accept: true,
                                hide: false,
                                accept_booking: '0'
                              });
                            }}
                            style={{
                              width: '100%',
                              alignSelf: 'center',
                              flexDirection: 'row',
                            }}>

                            <View style={{
                              width: 22,
                              height: 22,
                              borderRadius: 22,
                              borderWidth: (this.state.accept == false) ? 1 : 6,
                              borderColor: (this.state.accept == false) ? 'grey' : Colors.textblue
                            }} />

                            {/* <Icon style={{ alignSelf: 'center' }}
                              name={(this.state.accept == false) ? "circle-thin" : "dot-circle-o"}
                              size={22}
                              color={(this.state.accept == false) ? '#8F98A7' : Colors.textblue}></Icon> */}

                            <View style={{ width: '70%', alignSelf: 'center' }}>
                              <Text
                                style={{
                                  marginLeft: mobileW * 1.5 / 100,
                                  textAlign: config.textRotate,
                                  color: (this.state.accept == false) ? Colors.placeholder_text : 'black',
                                  fontFamily: (this.state.accept == false) ? Font.Regular : Font.Regular,
                                  fontSize: Font.placeholdersize + 1,
                                }}>
                                Accept Booking
                              </Text>
                            </View>
                          </TouchableOpacity>



                        </View>


                      </View>

                      <View
                        style={{
                          width: '50%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          alignItems: 'center',
                          // justifyContent:'space-between'
                        }}>
                        <View style={{ width: '100%', alignSelf: 'center', marginLeft: mobileW * 2 / 100 }}>
                          {/* {this.state.fbtn == false && */}
                          <TouchableOpacity onPress={() => {
                            this.setState({
                              accept: false,
                              hide: true,
                              accept_booking: '1'
                            })
                          }}
                            style={{
                              width: '100%',
                              alignSelf: 'center',
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}>
                            <View style={{
                              width: 22,
                              height: 22,
                              borderRadius: 22,
                              borderWidth: (this.state.hide == false) ? 1 : 6,
                              borderColor: (this.state.hide == false) ? 'grey' : Colors.textblue
                            }} />
                            {/* <Icon style={{ alignSelf: 'center' }}
                              name={(this.state.hide == false) ? "circle-thin" : "dot-circle-o"}
                              size={22}
                              color={(this.state.hide == false) ? '#8F98A7' : Colors.textblue}></Icon> */}

                            <Text
                              style={{
                                marginLeft: mobileW * 1.5 / 100,
                                textAlign: config.textRotate,
                                color: (this.state.hide == false) ? Colors.placeholder_text : 'black',
                                fontFamily: (this.state.hide == false) ? Font.Regular : Font.Regular,
                                fontSize: Font.placeholdersize + 1,
                              }}>
                              Hide Booking
                            </Text>

                          </TouchableOpacity>



                        </View>



                      </View>
                    </View>
                  </View>
                </View>

                {
                  (this.state.accept) &&
                  <>
                    <View style={{
                      marginTop: 15,
                      paddingLeft: 15,
                      paddingRight: 15
                    }}>
                      {
                        (this.props.page == "onlinehomeschedule") ?
                          <>
                            <View style={{
                              width: '100%',
                              flexDirection: 'row'
                            }}>

                              <View style={{
                                width: '50%'
                              }}>
                                <Text style={Styles.textheading}>Online Consultation</Text>
                                <View
                                  style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    marginTop: (mobileW * 3) / 100,
                                    marginBottom: (mobileW * 2 / 100),
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      width: '100%',
                                      alignSelf: 'center',
                                      flexDirection: 'row',
                                      // backgroundColor: 'red'
                                    }}>
                                    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                      <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                        {/* {this.state.mabtn == false && */}
                                        <TouchableOpacity
                                          onPress={() => {
                                            // this.setState({ mabtn: true, febtn: false, gender: 'Male' });
                                          }}
                                          style={{
                                            width: '100%',
                                            alignSelf: 'center',
                                            flexDirection: 'row',
                                          }}>

                                          <View style={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: 22,
                                            borderWidth: (this.state.mabtn == false) ? 1 : 6,
                                            borderColor: (this.state.mabtn == false) ? 'grey' : Colors.textblue
                                          }} />
                                          {/* <Icon style={{ alignSelf: 'center' }}
                                            name={(this.state.mabtn == false) ? "circle-thin" : "dot-circle-o"}
                                            size={22}
                                            color={(this.state.mabtn == false) ? '#8F98A7' : Colors.textblue}></Icon> */}

                                          <View style={{ width: '70%', alignSelf: 'center' }}>
                                            <Text
                                              style={{
                                                marginLeft: mobileW * 1.5 / 100,
                                                textAlign: config.textRotate,
                                                fontFamily: Font.Regular,
                                                color: (this.state.mabtn == false) ? Colors.placeholder_text : 'black',
                                                fontSize: Font.placeholdersize + 1,
                                              }}>
                                              15 Min Slots
                                            </Text>
                                          </View>
                                        </TouchableOpacity>



                                      </View>


                                    </View>
                                  </View>
                                </View>
                              </View>

                              <View style={{
                                width: '50%'
                              }}>
                                <Text style={Styles.textheading}>Home Visit Consultation</Text>
                                <View
                                  style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    marginTop: (mobileW * 3) / 100,
                                    marginBottom: (mobileW * 2 / 100),
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <View
                                    style={{
                                      width: '100%',
                                      alignSelf: 'center',
                                      flexDirection: 'row',
                                      // backgroundColor: 'red'
                                    }}>
                                    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                      <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                        {/* {this.state.mabtn == false && */}
                                        <TouchableOpacity
                                          onPress={() => {
                                            // this.setState({ mabtn: true, febtn: false, gender: 'Male' });
                                          }}
                                          style={{
                                            width: '100%',
                                            alignSelf: 'center',
                                            flexDirection: 'row',
                                          }}>

                                          <View style={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: 22,
                                            borderWidth: (this.state.mabtn == false) ? 1 : 6,
                                            borderColor: (this.state.mabtn == false) ? 'grey' : Colors.textblue
                                          }} />
                                          {/* <Icon style={{ alignSelf: 'center' }}
                                            name={(this.state.mabtn == false) ? "circle-thin" : "dot-circle-o"}
                                            size={22}
                                            color={(this.state.mabtn == false) ? '#8F98A7' : Colors.textblue}></Icon> */}

                                          <View style={{ width: '70%', alignSelf: 'center' }}>
                                            <Text
                                              style={{
                                                marginLeft: mobileW * 1.5 / 100,
                                                textAlign: config.textRotate,
                                                fontFamily: Font.Regular,
                                                color: (this.state.mabtn == false) ? Colors.placeholder_text : 'black',
                                                fontSize: Font.placeholdersize + 1,
                                              }}>
                                              45 Min Slots
                                            </Text>
                                          </View>
                                        </TouchableOpacity>



                                      </View>


                                    </View>
                                  </View>
                                </View>
                              </View>

                            </View>
                          </> :
                          <>
                            <Text style={Styles.textheading}>Bookings Preferences:</Text>
                            <View
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                marginTop: (mobileW * 3) / 100,
                                marginBottom: (mobileW * 2 / 100),
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  width: '100%',
                                  alignSelf: 'center',
                                  flexDirection: 'row',
                                  // backgroundColor: 'red'
                                }}>
                                <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                    {/* {this.state.mabtn == false && */}
                                    <TouchableOpacity
                                      onPress={() => {
                                        // this.setState({ mabtn: true, febtn: false, gender: 'Male' });
                                      }}
                                      style={{
                                        width: '100%',
                                        alignSelf: 'center',
                                        flexDirection: 'row',
                                      }}>
                                      <View style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 22,
                                        borderWidth: (this.state.mabtn == false) ? 1 : 6,
                                        borderColor: (this.state.mabtn == false) ? 'grey' : Colors.textblue
                                      }} />
                                      {/* <Icon style={{ alignSelf: 'center' }}
                                        name={(this.state.mabtn == false) ? "circle-thin" : "dot-circle-o"}
                                        size={22}
                                        color={(this.state.mabtn == false) ? '#8F98A7' : Colors.textblue}></Icon> */}

                                      <View style={{ width: '70%', alignSelf: 'center' }}>
                                        <Text
                                          style={{
                                            marginLeft: mobileW * 1.5 / 100,
                                            textAlign: config.textRotate,
                                            fontFamily: Font.Regular,
                                            color: (this.state.mabtn == false) ? Colors.placeholder_text : 'black',
                                            fontSize: Font.placeholdersize + 1,
                                          }}>
                                          {(this.props.page == 'taskschedule') ? '30 Min Slots' : (this.props.page == 'labschedule') ? '45 Min Slots' : '2, 4, 6, 8, 12 Hours'}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>



                                  </View>


                                </View>
                              </View>
                            </View>
                          </>
                      }


                    </View>

                    <View style={{
                      marginTop: 15,
                      paddingLeft: 15,
                      paddingRight: 15
                    }}>
                      <Text style={[Styles.textheading, {
                        marginBottom: 10
                      }]}>Point your Availability for Appointment</Text>
                    </View>
                    <View>

                      {
                        this.state.slotArr.map((item, index) => {

                          return (
                            <>
                              <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '100%',
                                backgroundColor: (item?.slot_day_enable == "1") ? '#FBFBFB' : Colors.gray6, //(index == weekArr.length - 1) ? '#E5E5E5' : '#FBFBFB', //Colors.tab_background_color,
                                height: (mobileW * 14) / 100,
                                paddingLeft: 15,
                                paddingRight: 15,
                                marginBottom: 5
                              }}>
                                <View style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  width: '100%',
                                  // backgroundColor: Colors.tab_background_color,
                                  height: (mobileW * 14) / 100,
                                }}>
                                  <View style={{
                                    width: '30%',
                                    height: (mobileW * 12) / 100,
                                    // backgroundColor: 'blue',
                                  }}>
                                    <View style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      width: '100%',
                                      // backgroundColor: 'white',
                                      height: (mobileW * 12) / 100,
                                    }}>
                                      <Switch
                                        thumbColor={(item?.slot_day_enable == "1") ? Colors.white_color : "#767577"}
                                        trackColor={{ false: "#767577", true: Colors.textblue }}
                                        // thumbColor={this.state.isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                        // ios_backgroundColor={Colors.textblue}
                                        style={{
                                          transform: [{ scaleX: .7 }, { scaleY: .7 }],
                                          marginLeft: -8.5,
                                          marginRight: -8.5
                                        }}
                                        onValueChange={(value) => {
                                          let arr = [...this.state.slotArr]
                                          arr[index].slot_day_enable = (value) ? "1" : "0"
                                          this.setState({
                                            slotArr: arr
                                          })
                                        }}
                                        value={(item?.slot_day_enable == "1") ? true : false}
                                      />
                                      <Text style={{
                                        fontFamily: Font.Medium,
                                        fontSize: mobileW * 4 / 100,
                                        color: (item?.slot_day_enable == "1") ? Colors.textblue : Colors.placeholder_textcolorlight,
                                        marginLeft: 10
                                      }}>{item?.slot_day}</Text>
                                    </View>
                                  </View>
                                  <View style={{
                                    width: '35%',
                                    height: (mobileW * 12) / 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // backgroundColor: 'yellow',
                                  }}>

                                    <TouchableOpacity
                                      onPress={() => {
                                        this.setState({
                                          currentIndex: index,
                                          currentItem: item,
                                          modalVisible: true,
                                          flag: true
                                        })
                                      }}
                                      disabled={(item?.slot_day_enable == "1") ? false : true}
                                      style={{
                                        backgroundColor: 'rgb(229,229,229)',
                                        padding: 6,
                                        paddingHorizontal: 12,
                                        flexDirection: 'row',
                                        justifyContent: 'space-evenly'
                                      }} >
                                      <Text style={{
                                        color: (item?.slot_day_enable == "1") ? 'black' : Colors.placeholder_text,
                                        fontFamily: Font.Regular,
                                        fontSize: (mobileW * 3.5) / 100
                                      }} allowFontScaling={false}>
                                        {item?.slot_start_time}
                                      </Text>
                                      <View style={{
                                        justifyContent: 'space-evenly',
                                        paddingHorizontal: 4
                                      }}>
                                        <Image source={Arrow} style={{
                                          width: (mobileW * 2) / 100,
                                          height: (mobileW * 1) / 100,
                                          tintColor: 'black',
                                          transform: [{ rotateX: '180deg' }]
                                        }} resizeMethod='resize' resizeMode='contain' />

                                        <Image source={Arrow} style={{
                                          width: (mobileW * 2) / 100,
                                          height: (mobileW * 1) / 100,
                                          tintColor: 'black'
                                        }} resizeMethod='resize' resizeMode='contain' />

                                      </View>
                                    </TouchableOpacity>


                                  </View>
                                  <View style={{
                                    width: '35%',
                                    height: (mobileW * 12) / 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // backgroundColor: 'yellow',
                                  }}>

                                    <TouchableOpacity
                                      onPress={() => {
                                        this.setState({
                                          currentIndex: index,
                                          currentItem: item,
                                          modalVisible: true,
                                          flag: false
                                        })
                                      }}
                                      disabled={(item?.slot_day_enable == "1") ? false : true}
                                      style={{
                                        backgroundColor: 'rgb(229,229,229)',
                                        padding: 6,
                                        paddingHorizontal: 12,
                                        flexDirection: 'row',
                                        justifyContent: 'space-evenly'
                                      }} >
                                      <Text style={{
                                        color: (item?.slot_day_enable == "1") ? 'black' : Colors.placeholder_text,
                                        fontFamily: Font.Regular,
                                        fontSize: (mobileW * 3.5) / 100
                                      }} allowFontScaling={false}>
                                        {item?.slot_end_time}
                                      </Text>
                                      <View style={{
                                        justifyContent: 'space-evenly',
                                        paddingHorizontal: 4
                                      }}>
                                        <Image source={Arrow} style={{
                                          width: (mobileW * 2) / 100,
                                          height: (mobileW * 1) / 100,
                                          tintColor: 'black',
                                          transform: [{ rotateX: '180deg' }]
                                        }} resizeMethod='resize' resizeMode='contain' />

                                        <Image source={Arrow} style={{
                                          width: (mobileW * 2) / 100,
                                          height: (mobileW * 1) / 100,
                                          tintColor: 'black'
                                        }} resizeMethod='resize' resizeMode='contain' />

                                      </View>
                                    </TouchableOpacity>

                                  </View>
                                </View>
                              </View>

                            </>
                          )
                        })
                      }

                    </View>

                    <View style={{
                      marginTop: 28,
                      paddingLeft: 15,
                      paddingRight: 15,
                      paddingBottom: 16
                    }}>
                      <Text style={Styles.textheading}>Service Address or Pickup Point</Text>
                      <Text style={[Styles.textcontent, {
                        marginTop: 6,
                        borderColor: Colors.field_border_color,
                        borderWidth: 1,
                        borderRadius: 5,
                        paddingVertical: (mobileW * 2) / 100,
                        paddingHorizontal: (mobileW * 2) / 100,
                      }]}>{this.state.service_address}</Text>
                      <View style={{
                        // backgroundColor: 'red',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginTop: 8
                      }}>
                        <Image
                          source={localimag.locationcurrent}
                          style={{
                            height: (mobileW * 4) / 100,
                            width: (mobileW * 4) / 100,
                            marginRight: 6
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            this.openGooglePlace();
                          }}
                        >
                          <Text style={{
                            fontFamily: Font.Regular,
                            fontSize: mobileW * 3.6 / 100,
                            color: Colors.textblue
                          }}>Manage Location</Text>
                        </TouchableOpacity>
                      </View>

                    </View>


                  </>
                }

              </View>
            </ScrollView>

            <View style={{
              //backgroundColor: 'red',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 15,
              height: mobileW * 22 / 100
            }}>
              <Button
                text={'SAVE SCHEDULE'}
                // onLoading={this.state.loading}
                customStyles={
                  {
                    mainContainer: {
                      marginTop: 0
                    }
                  }
                }
                onPress={() => this.submitPress()}
              // isBlank={false}
              />
            </View>
          </View>
        }
      </View>
}

      </>

    );
  }
}
