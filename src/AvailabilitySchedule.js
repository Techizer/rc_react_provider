import React, { Component } from 'react';
import { Switch, Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList } from 'react-native';

import {
  Colors,
  Font,
  mobileH,
  Mapprovider,
  msgProvider,
  msgText,
  config,
  mobileW,
  localStorage,
  localimag,
  consolepro,
  handleback,
  Lang_chg,
  apifuntion,
  msgTitle,
} from './Provider/utilslib/Utils';
import Moment from "moment-timezone";
import Styles from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from './Footer';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { SearchPlaceScreen, AuthInputBoxSec, DropDownboxSec, Button } from './components'
import { Dropdown } from 'react-native-material-dropdown';
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

const weekArr = [
  {
    id: 1,
    value: 'MON',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'TUE',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'WED',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'THU',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'FRI',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'SAT',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'SUN',
    symbol: 'km',
    status: true,
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
    console.log("user_details:: ", user_details);
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log('this.props.page:: ', this.props.pageName);

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
    console.log("url", url)

    var data = new FormData();
    // data.append('lgoin_user_id', user_id)
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
          message: obj.message
        })
        console.log('obj.result',
          obj.result,
          'obj.result.slots:: ',
          obj.result.slots[0]
        )



      } else {

        // this.setState({
        //   withdrawalArr: obj.result.withdrawal,
        //   abal: obj.result.abal,
        //   content: obj.result.content,
        //   bankdetails: obj.result.bankdetails,
        //   message: obj.message
        // })
        console.log('obj.result', obj.result)
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
        console.log("strStartTime:: ", strStartTime);
        console.log("strEndTime:: ", strEndTime);
        var startTime = new Date().setHours(this.GetHours(strStartTime), this.GetMinutes(strStartTime), 0);
        var endTime = new Date(startTime)
        endTime = endTime.setHours(this.GetHours(strEndTime), this.GetMinutes(strEndTime), 0);
        if (startTime > endTime) {
          console.log("Start Time is greater than end time");
          isError = true
        }
        if (startTime == endTime) {
          console.log("Start Time equals end time");
          isError = true
        }
        if (startTime < endTime) {
          console.log("Start Time is less than end time");
        }
      })
      console.log("this.state.service_radius:: ", this.state.service_radius);
      if (isError) {
        msgProvider.showError("End time should be greater than Start time")
      } else {
        if (this.state.service_address == "") {
          msgProvider.showError("Please select service location to continue")
        } else if (this.state.service_radius == "" || this.state.service_radius == undefined) {
          msgProvider.showError("Please select booking eligibility radius to continue")
        } else {
          this.insertUpdatePriceList()
        }

      }
    }


  }

  insertUpdatePriceList = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log('this.props.pageName:: ', this.props.pageName);


    let apiname = (this.props.page == "onlinehomeschedule") ?
      "api-doctor-add-preferable-time" : "insert-preferable-time"


    let apishow = apiname //"api-provider-past-appointment-list" //"api-patient-all-appointment"

    let url = config.baseURL + apishow;
    console.log("url", url)

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
    data.append('service_radius', this.state.service_radius)

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


    consolepro.consolelog('myDatamyData', myData)
    apifuntion.postRawApi(url, myData).then((obj) => {
      consolepro.consolelog("obj", obj)
      // this.setState({ appoinment_detetails: '' })
      if (obj.status == true) {
        msgProvider.showSuccess(obj.message)
        console.log('obj.result', obj.result)

      } else {
        msgProvider.showError(obj.message)
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);

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
    console.log("info:: ", info);
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
    console.log("strStartTime:: ", strStartTime);
    console.log("strEndTime:: ", strEndTime);
    var startTime = new Date().setHours(this.GetHours(strStartTime), this.GetMinutes(strStartTime), 0);
    var endTime = new Date(startTime)
    endTime = endTime.setHours(this.GetHours(strEndTime), this.GetMinutes(strEndTime), 0);
    if (startTime > endTime) {
      console.log("Start Time is greater than end time");
      isError = true
    }
    if (startTime == endTime) {
      console.log("Start Time equals end time");
      isError = true
    }
    if (startTime < endTime) {
      console.log("Start Time is less than end time");
      isError = false
    }
    var arr = [...this.state.slotArr]

    if (isError) {
      msgProvider.showError("End time should be greater than Start time")
      // this.firstDropdown[index].setState({ value: arr[index].slot_start_time });
      setTimeout(() => {
        if (isStart) {
          this["firstDropdown" + index].setState({ value: arr[index].slot_start_time });
        } else {
          this["secondDropdown" + index].setState({ value: arr[index].slot_end_time });
        }
      }, 800);


    }
    else {

      console.log("index: ", index)
      console.log("arrarr: ", arr)
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
      <View style={{
        flex: 1,
        //  backgroundColor: 'white',
      }}>
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
                            <Icon style={{ alignSelf: 'center' }}
                              name={(this.state.accept == false) ? "circle-thin" : "dot-circle-o"}
                              size={22}
                              color={(this.state.accept == false) ? '#8F98A7' : '#0168B3'}></Icon>

                            <View style={{ width: '70%', alignSelf: 'center' }}>
                              <Text
                                style={{
                                  marginLeft: mobileW * 1.5 / 100,
                                  textAlign: config.textRotate,
                                  color: Colors.placeholder_text,
                                  fontFamily: Font.fontregular,
                                  fontSize: Font.placeholdersize,
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
                            <Icon style={{ alignSelf: 'center' }}
                              name={(this.state.hide == false) ? "circle-thin" : "dot-circle-o"}
                              size={22}
                              color={(this.state.hide == false) ? '#8F98A7' : '#0168B3'}></Icon>

                            <Text
                              style={{
                                textAlign: config.textRotate,
                                marginLeft: mobileW * 1.5 / 100,
                                color: Colors.placeholder_text,
                                fontFamily: Font.fontregular,
                                fontSize: Font.placeholdersize,
                                // alignSelf: 'center',
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
                                                fontFamily: Font.fontregular,
                                                fontSize: Font.placeholdersize,
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
                                                fontFamily: Font.fontregular,
                                                fontSize: Font.placeholdersize,
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
                                            fontFamily: Font.fontregular,
                                            fontSize: Font.placeholdersize,
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
                                    width: '40%',
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
                                          console.log("valuevalue:: ", value);
                                          let arr = [...this.state.slotArr]
                                          arr[index].slot_day_enable = (value) ? "1" : "0"
                                          this.setState({
                                            slotArr: arr
                                          })
                                        }}
                                        value={(item?.slot_day_enable == "1") ? true : false}
                                      />
                                      <Text style={{
                                        fontFamily: Font.fontmedium,
                                        fontSize: mobileW * 4 / 100,
                                        color: (item?.slot_day_enable == "1") ? Colors.textblue : Colors.placeholder_textcolorlight,
                                        marginLeft: 10
                                      }}>{item?.slot_day}</Text>
                                    </View>
                                  </View>
                                  <View style={{
                                    width: '30%',
                                    height: (mobileW * 12) / 100,
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    // backgroundColor: 'yellow',
                                  }}>
                                    {/* <DropDownboxSec
                                    lableText={item?.slot_start_time}
                                    dHeight={25}
                                    isDisabled={(item?.slot_day_enable == "1") ? false : true}
                                  // boxPressAction={() => { this.showUsertypeModal(true) }}
                                  /> */}
                                    <View style={{
                                      // backgroundColor: 'red',
                                      width: '85%',
                                      height: 28
                                    }}>
                                      <Dropdown
                                        containerStyle={{
                                          width: '100%',
                                          height: 28,
                                        }}
                                        inputContainerStyle={{
                                          // height: 30,
                                          // backgroundColor:'red',
                                          backgroundColor: Colors.tab_background_color,
                                          borderColor: Colors.field_border_color,
                                          borderWidth: 1,
                                          borderBottomColor: Colors.field_border_color,
                                          borderBottomWidth: 1,
                                          borderRadius: 5,
                                          paddingTop: 3,
                                          paddingLeft: 6,
                                          // paddingRight: 6,
                                          justifyContent: 'center',
                                          alignItems: 'center',

                                        }}
                                        fontSize={(mobileW * 3) / 100}
                                        textColor={Colors.placeholder_text_color}
                                        dropdownOffset={{ 'top': 0 }}
                                        pickerStyle={{
                                          // borderBottomColor:'red',
                                          // borderWidth: 1,
                                          marginTop: (mobileW * 19) / 100,
                                          marginLeft: (mobileW * 42) / 100,
                                          width: (mobileW * 25) / 100,
                                          height: (mobileW * 50) / 100
                                        }}
                                        // itemPadding={20}
                                        // label='Favorite Fruit'
                                        disabled={(item?.slot_day_enable == "1") ? false : true}
                                        value={item?.slot_start_time}
                                        onChangeText={(value) => {
                                          this.validationTime(value, item?.slot_end_time, true, index)
                                        }}
                                        data={this.state.timeArray}
                                        // ref={c => (this.firstDropdown[index] = c)}
                                        ref={c => (this["firstDropdown" + index] = c)}

                                      />
                                    </View>

                                  </View>
                                  <View style={{
                                    width: '30%',
                                    height: (mobileW * 12) / 100,
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    // backgroundColor: 'green',
                                  }}>
                                    {/* <DropDownboxSec
                                    lableText={item?.slot_end_time}
                                    dHeight={25}
                                    isDisabled={(item?.slot_day_enable == "1") ? false : true}
                                  // boxPressAction={() => { this.showUsertypeModal(true) }}
                                  /> */}
                                    <View style={{
                                      // backgroundColor: 'red',
                                      width: '85%',
                                      height: 28
                                    }}>
                                      <Dropdown
                                        containerStyle={{
                                          width: '100%',
                                          height: 28,

                                        }}
                                        inputContainerStyle={{
                                          // height: 30,
                                          // backgroundColor:'red',
                                          backgroundColor: Colors.tab_background_color,
                                          borderColor: Colors.field_border_color,
                                          borderWidth: 1,
                                          borderBottomColor: Colors.field_border_color,
                                          borderBottomWidth: 1,
                                          borderRadius: 5,
                                          // marginTop: 0,
                                          paddingTop: 3,
                                          // paddingBottom: 0,
                                          paddingLeft: 6,
                                          // paddingRight: 6,
                                          justifyContent: 'center',
                                          alignItems: 'center',

                                        }}
                                        fontSize={(mobileW * 3) / 100}
                                        textColor={Colors.placeholder_text_color}
                                        dropdownOffset={{ 'top': 0 }}
                                        pickerStyle={{
                                          // borderBottomColor:'red',
                                          // borderWidth: 1,
                                          marginTop: (mobileW * 19) / 100,
                                          marginLeft: (mobileW * 70) / 100,
                                          width: (mobileW * 25) / 100,
                                          height: (mobileW * 50) / 100
                                        }}
                                        // itemPadding={20}
                                        // label='Favorite Fruit'
                                        disabled={(item?.slot_day_enable == "1") ? false : true}
                                        value={item?.slot_end_time}
                                        onChangeText={(value, indexSelect, data) => {
                                          console.log("slot_end_time value:: ", value);
                                          console.log("slot_end_time index:: ", indexSelect);
                                          console.log("slot_end_time data:: ", data);
                                          this.validationTime(item?.slot_start_time, value, false, index)
                                          // console.log("slot_end_time value:: ", value);
                                          // let arr = [...this.state.slotArr]
                                          // arr[index].slot_end_time = value
                                          // this.setState({
                                          //   slotArr: arr
                                          // })
                                        }}
                                        data={this.state.timeArray}
                                        // ref={c => (this.secondDropdown[index] = c)}
                                        ref={c => (this["secondDropdown" + index] = c)}
                                      />
                                    </View>
                                  </View>
                                </View>
                              </View>

                              {/* <View style={{
                              position: 'absolute',
                              top: 42,
                              left: 165,
                              backgroundColor: Colors.gray4,
                              width: 150,
                              height: 280
                            }}>

                            </View>
                            <View style={{
                              position: 'absolute',
                              top: 42,
                              right: 20,
                              backgroundColor: Colors.gray6,
                              width: 150,
                              height: 280
                            }}>

                            </View> */}
                            </>
                          )
                        })
                      }



                    </View>

                    <View style={{
                      marginTop: 15,
                      paddingLeft: 15,
                      paddingRight: 15
                    }}>
                      <Text style={Styles.textheading}>Add Service Radius</Text>
                      <Text style={[Styles.textcontent, {
                        marginTop: 6
                      }]}>Set the Kilometre Distance Radius for your service, where you prefer to provide service and not outside.</Text>
                    </View>

                    <View style={{
                      marginTop: 15,
                      paddingLeft: 15,
                      paddingRight: 15
                    }}>
                      <Text style={Styles.textheading}>Point Your Service Location</Text>
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
                        justifyContent: 'flex-end',
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
                            fontFamily: Font.fontregular,
                            fontSize: mobileW * 3.6 / 100,
                            color: Colors.textblue
                          }}>Manage Location</Text>
                        </TouchableOpacity>
                      </View>

                    </View>

                    <View style={{
                      marginTop: 15,
                      paddingLeft: 15,
                      paddingRight: 15
                    }}>
                      <Text style={Styles.textheading}>Booking Eligibility Radius</Text>
                      <View
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          marginTop: (mobileW * 1) / 100,
                          marginBottom: (mobileW * 2 / 100),
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}>
                        {
                          this.state.radiusArr.map((item, index) => {
                            return (
                              <>
                                <View
                                  style={{
                                    width: '25%',
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    // backgroundColor: 'red',
                                    marginTop: 15
                                  }}>
                                  <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                      {/* {this.state.mabtn == false && */}
                                      <TouchableOpacity
                                        onPress={() => {
                                          // this.setState({ mabtn: true, febtn: false, gender: 'Male' });
                                          console.log("valuevalue:: ", item?.value, index);
                                          let arr = [...this.state.radiusArr]
                                          arr.map((v, i) => {
                                            if (index == i) {
                                              v.status = true
                                            } else {
                                              v.status = false
                                            }
                                          });
                                          this.setState({
                                            radiusArr: arr,
                                            service_radius: item?.value
                                          })
                                        }}
                                        style={{
                                          width: '100%',
                                          alignSelf: 'center',
                                          flexDirection: 'row',
                                        }}>
                                        <Icon style={{ alignSelf: 'center' }}
                                          name={(item?.status == false) ? "circle-thin" : "dot-circle-o"}
                                          size={22}
                                          color={(item?.status == false) ? '#8F98A7' : '#0168B3'}></Icon>

                                        <View style={{ width: '70%', alignSelf: 'center' }}>
                                          <Text
                                            style={{
                                              marginLeft: mobileW * 1.5 / 100,
                                              textAlign: config.textRotate,
                                              color: Colors.placeholder_text,
                                              fontFamily: Font.fontregular,
                                              fontSize: Font.placeholdersize,
                                            }}>
                                            {item?.value}{item?.symbol}
                                          </Text>
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
                    </View>
                  </>
                }

              </View>
            </ScrollView>

            <View style={{
              // backgroundColor: 'red',
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
    );
  }
}
