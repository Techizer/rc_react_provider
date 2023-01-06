import React, { Component } from 'react';
import { Alert, Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList } from 'react-native';

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
  
  consolepro,
  handleback,
  Lang_chg,
  apifuntion,
  msgTitle,
} from './Provider/utilslib/Utils';

import Styles from './Styles';

import Footer from './Footer';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { AppointmentBox } from './Components'
import { Icons } from './icons/IReferences';
const tabheadings = [
  {
    id: 1,
    name: 'Ongoing',
    arbic_name: 'الجميع ',
    pass_status: 'all',
    status: true,
  },
  {
    id: 2,
    name: 'Pending',
    arbic_name: 'ممرضة  ',
    pass_status: 'nurse',
    status: false,
  },
  {
    id: 3,
    name: 'Upcoming',
    arbic_name: 'مساعد ممرض   ',
    pass_status: 'caregiver',
    status: false,
  },
  {
    id: 4,
    name: 'Past',
    arbic_name: 'جليسه اطفال  ',
    pass_status: 'babysitter',
    status: false,
  },
  // {
  //   id: 5,
  //   name: 'Physiotherapist',
  //   arbic_name:'اخصائي العلاج الطبيعي   ',
  //   pass_status:'physiotherapy',
  //   status: false,
  // },

]



export default class Appointment extends Component {
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
      tabheadings: tabheadings,
      task_details: "",
    };
  }
  componentDidMount() {
    // if (this.props.route.params != undefined) {
    //   let title = this.props.route.params.title;
    //   let api_status = this.props.route.params.api_status
    //   this.setState({ title: title, api_status: api_status });
    //   console.log(title)
    // }
    console.log('this.props:: ', this.props);
    this.didFocusListener = this.props.navigation.addListener(
      'didFocus',
      () => { console.log('did focus') },
    );
    // this.props.navigation.addListener('focus', () => {
    //   // this.get_Services(1)
    //   // this.get_all_notification()
    //   console.log('this.props.pageName addListener:: ', this.props.pageName);
    // });
    // this.props.navigation.setParams({
    //   tapOnTabNavigator: this.tapOnTabNavigator
    // })
    // this.focusListener = this.props.navigation.addListener('focus',
    //   () => alert('Screen focused'))
    this.get_Services(1)
    this.get_day()
  }

  // Call on tab bar tap
  tapOnTabNavigator = (pageName) => {
    console.log('this.props.pageName addListener:: ', this.props.pageName);
    // this.get_Services_reload_tabpress(pageName)
    this.get_Services(1)
  }

  get_Services_reload_tabpress = async (pageName) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log('pageName:: ', pageName);


    let apiname = ""
    if (pageName == "ongoing") {
      apiname = "api-provider-ongoing-appointment-list"
    } else if (pageName == "pending") {
      apiname = "api-provider-pending-appointment-list"
    } else if (pageName == "upcoming") {
      apiname = "api-provider-upcoming-appointment-list"
    } else {
      apiname = "api-provider-past-appointment-list"
    }

    let apishow = apiname //"api-provider-past-appointment-list" //"api-patient-all-appointment"

    let url = config.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    // data.append('lgoin_user_id', user_id)
    data.append('user_id', user_id)

    // data.append('service_type', this.state.pass_status)
    // data.append('service_type', "nurse")
    data.append('service_type', user_type)



    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      this.setState({ appoinment_detetails: '' })
      if (obj.status == true) {
        this.setState({ appoinment_detetails: obj.result, message: obj.message })
        // console.log('obj.result', obj.result)



      } else {

        this.setState({ appoinment_detetails: obj.result, message: obj.message })
        // console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      //consolepro.consolelog("-------- error ------- " + error);

    });

  }

  reloadList = () => {
    this.get_Services(1)
  }

  check_date = (item, index) => {
    let data = this.state.date_array;
    console.log('new data', data)

    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].tick = 1;

      }
      else {
        data[i].tick = 0;
      }
    }
    // }
    this.setState({ date_array: data })

  }
  get_day = () => {
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
    this.setState({ set_date: date1_show, check_currentdate: date1_show })

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
    this.setState({ date_array: arr })
    console.log("check date muskan", arr)
  };


  get_Services = async (page) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log('this.props.pageName:: ', this.props.pageName);


    let apiname = ""
    if (this.props.pageName == "ongoing") {
      apiname = "api-provider-ongoing-appointment-list"
    } else if (this.props.pageName == "pending") {
      apiname = "api-provider-pending-appointment-list"
    } else if (this.props.pageName == "upcoming") {
      apiname = "api-provider-upcoming-appointment-list"
    } else {
      apiname = "api-provider-past-appointment-list"
    }

    let apishow = apiname //"api-provider-past-appointment-list" //"api-patient-all-appointment"

    let url = config.baseURL + apishow;
    //console.log("url", url)

    var data = new FormData();
    // data.append('lgoin_user_id', user_id)
    data.append('user_id', user_id)

    // data.append('service_type', this.state.pass_status)
    // data.append('service_type', "nurse")
    data.append('service_type', user_type)

    apifuntion.postApi(url, data).then((obj) => {
      // console.log({GetAppointments: obj.result});
      this.setState({ appoinment_detetails: '' })
      if (obj.status == true) {
        this.setState({ appoinment_detetails: obj.result, message: obj.message })
        // console.log('obj.result', obj.result)



      } else {

        this.setState({ appoinment_detetails: obj.result, message: obj.message })
        //console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      //consolepro.consolelog("-------- error ------- " + error);

    });

  }

  submit_btn = async () => {

    if (this.state.time_take_data.length <= 0) {
      msgProvider.toast(msgText.EmptyTime[config.language], 'center')
      return false;
    }



    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']

    let url = config.baseURL + "api-patient-update-reschedule-appointment";
    console.log('url', url)
    var data = new FormData();
    console.log('data', data)

    data.append('service_type', this.state.service_status)
    data.append('order_id', this.state.order_id)
    data.append('from_date', this.state.set_date)
    data.append('from_time', this.state.time_take_data)

    apifuntion.postApi(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('muskan', obj)
        this.setState({ modalVisible: false })
        setTimeout(() => {
          this.get_Services(1)
          msgProvider.toast(obj.message, 'center')
        }, 700);
      } else {

        setTimeout(() => {
          msgProvider.alert('', obj.message, false);
        }, 700);

        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });

  }

  showConfirmDialogReject = (acceptance_status) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to reject this appointment?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            this.updateProviderAppointmentStatus(acceptance_status)
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  updateProviderAppointmentStatus = async (acceptance_status) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let url = config.baseURL + "api-update-provider-appointment-status";
    console.log("url", url)
    // {id:126,service_type:nurse,'acceptance_status':Accept}
    var data = new FormData();
    data.append('id', this.state.id)
    data.append('service_type', user_type)
    data.append('acceptance_status', acceptance_status)

    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      //consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        // console.log('obj.result', obj.result)
        // let appoinment_detetails = [...this.state.appoinment_detetails];
        // appoinment_detetails[this.state.index] = { ...appoinment_detetails[this.state.index], key: obj.result[0] };
        // this.setState({ appoinment_detetails });

        var array = [...this.state.appoinment_detetails]; // make a separate copy of the array
        var index = this.state.index
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({ appoinment_detetails: array });
        }
        msgProvider.showSuccess(obj.message)
      } else {
        msgProvider.showError(obj.message)
        return false;
      }
    }).catch((error) => {
      // consolepro.consolelog("-------- error ------- " + error);
    });

  }
  get_all_notification = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    // console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']

    let url = config.baseURL + "api-notification-count";
    // console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)

    // consolepro.consolelog('data', data)
    apifuntion.postApi(url, data, 1).then((obj) => {
      // consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        this.setState({ notification_count: obj.result })
        // console.log('obj nationaltity', obj)



      } else {


        return false;
      }
    }).catch((error) => {

      // console.log("-------- error ------- " + error);
    })

  }
  get_time_date = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']

    let url = config.baseURL + "api-patient-next-date-time";
    // console.log("url", url)

    var data = new FormData();
    data.append('provider_id', this.state.send_id)
    data.append('date', this.state.set_date)
    data.append(' task_type', this.state.set_task)
    data.append('service_type', this.state.service_status)
    apifuntion.postApi(url, data).then((obj) => {


      if (obj.status == true) {
        var cureent = new Date();
        var timcurrent = cureent.getHours() + ":" + cureent.getMinutes();
        this.setState({ timcurrent_for_check: timcurrent })
        // consolepro.consolelog("obj.result", obj.result)
        if (this.state.check_booking == 'TASK_BOOKING') {
          if (obj.result.task_time != '') {
            var names = obj.result.task_time;
            var nameArr = names.split(',');

            const new_time_dlot = [];
            const Arr1 = [];
            const Arr2 = [];
            if (obj.result.task_time != '') {
              for (let l = 0; l < nameArr.length; l++) {
                if (this.state.check_currentdate == this.state.set_date) {
                  const timeStr = nameArr[l];

                  const convertTime = timeStr => {
                    const [time, modifier] = timeStr.split(' ');
                    let [hours, minutes] = time.split(':');
                    if (hours === '12') {
                      hours = '00';
                    }
                    if (modifier === 'PM') {
                      hours = parseInt(hours, 10) + 12;
                    }
                    return `${hours}:${minutes}`;
                  };
                  var finaltime = convertTime(timeStr);
                  if (finaltime >= this.state.timcurrent_for_check) {

                    new_time_dlot.push({ time: nameArr[l], time_status: false });
                    if ((l + 2) % 2 == 0) {

                      Arr1.push({ time: nameArr[l], time_status: false });
                    }

                    else {
                      Arr2.push({ time: nameArr[l], time_status: false });
                    }

                  }
                }
                else {
                  new_time_dlot.push({ time: nameArr[l], time_status: false });
                  if ((l + 2) % 2 == 0) {

                    Arr1.push({ time: nameArr[l], time_status: false });
                  }

                  else {
                    Arr2.push({ time: nameArr[l], time_status: false });
                  }

                }
              }
            }

            this.setState({ time_Arr: new_time_dlot, final_one: Arr1, final_arr_two: Arr2 })

          }
          else {
            this.setState({ time_Arr: obj.result.task_time })
          }
        }
        else {

          if (obj.result.hourly_time != '') {
            var names_time = obj.result.hourly_time;
            var nameArr_time = names_time.split(',');

          }


          const new_time_hourl = [];
          const Arr_hour = [];
          const Arr2_hour = [];
          if (obj.result.hourly_time != '') {
            for (let m = 0; m < nameArr_time.length; m++) {
              const timeStr_hour = nameArr_time[m];
              if (this.state.check_currentdate == this.state.set_date) {
                const convertTime_hour = timeStr_hour => {
                  const [time, modifier] = timeStr_hour.split(' ');
                  let [hours, minutes] = time.split(':');
                  if (hours === '12') {
                    hours = '00';
                  }
                  if (modifier === 'PM') {
                    hours = parseInt(hours, 10) + 12;
                  }
                  return `${hours}:${minutes}`;
                };
                var finaltime_hour = convertTime_hour(timeStr_hour);
                if (finaltime_hour >= timcurrent) {
                  new_time_hourl.push({ time: nameArr_time[m], time_status: false });

                  if ((m + 2) % 2 == 0) {

                    Arr_hour.push({ time: nameArr_time[m], time_status: false });
                  }

                  else {
                    Arr2_hour.push({ time: nameArr_time[m], time_status: false });
                  }
                }
              }
              else {
                new_time_hourl.push({ time: nameArr_time[m], time_status: false });
                if ((m + 2) % 2 == 0) {

                  Arr_hour.push({ time: nameArr_time[m], time_status: false });
                }

                else {
                  Arr2_hour.push({ time: nameArr_time[m], time_status: false });
                }
              }
            }
            this.setState({ time_Arr: new_time_hourl, final_arr_two: Arr2_hour, final_one: Arr_hour })
          }

          else {
            this.setState({ time_Arr: obj.result.hourly_time, final_arr_two: Arr2_hour, final_one: Arr_hour })
          }

        }

      } else {

        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);

    });

  }
  time_tick = (item, index) => {
    let data = this.state.time_Arr;
    console.log('new data', data)
    // if(data[index].time_status==true)
    // {
    //     data[index].time_status=false
    // }
    // else
    // {
    for (let i = 0; i < data.length; i++) {
      if (i == index) {
        data[i].time_status = true;
      }
      else {
        data[i].time_status = false;
      }
      // }
    }
    this.setState({ time_Arr: data })

  }
  render() {
    const { modalVisible } = this.state;
    var rescdule = this.state.rescdule_data

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            // paddingBottom: (mobileW * 10) / 100
          }}

        >
          <View style={{
            flex: 1,
            //  marginBottom: (mobileW * 10) / 100
          }}>
            {
              (this.state.appoinment_detetails != '' && this.state.appoinment_detetails != null) ?
                <FlatList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: mobileW * 5 / 100 }}
                  data={this.state.appoinment_detetails}
                  renderItem={({ item, index }) => {
                    if (this.state.appoinment_detetails != '' && this.state.appoinment_detetails != null) {
                      return (
                        <>
                          <AppointmentBox
                            item={item}
                            index={index}
                            onPressViewDetails={() => {
                              console.log("this.props:: ", this.props);
                              this.props.navigation.navigate('Appointmentdetails',
                                {
                                  status: item.provider_type,
                                  appoinment_id: item.id,
                                  send_id: item.provider_id,
                                  reloadList: this.reloadList.bind(this)
                                })
                            }}
                            onPressAccept={() => {
                              // msgProvider.showSuccess("tap accept")
                              this.setState({
                                id: item.id,
                                index: index
                              }, () => {
                                this.updateProviderAppointmentStatus("Accept")
                              })

                            }}
                            onPressReject={() => {
                              this.setState({
                                id: item.id,
                                index: index
                              }, () => {
                                this.showConfirmDialogReject("Reject")
                              })
                            }}
                            onPressVideoCall={() => {
                              // msgProvider.showSuccess("tap accept")
                              this.setState({
                                id: item.id,
                                index: index
                              }, () => {
                                this.props.navigation.navigate('VideoCall', {
                                  item: item
                                });
                              })

                            }}
                          />
                        </>
                      );
                    }
                  }
                  }
                /> :
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '90%'
                }}>
                  <Text style={{
                    fontFamily: Font.Regular,
                    fontSize: 16,
                    textTransform: 'capitalize'
                  }}>{this.props.pageName} Appointment List Not Found.</Text>
                </View>
            }

          </View>
        </View>


        {/* code for modal */}
        <Modal
          backdropOpacity={3}
          //  style={{backgroundColor: Colors.dim_grey}}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          presentationStyle="overFullScreen"
          onRequestClose={() => {
            this.setState({ modalVisible: false })

          }}>

          <View
            style={{
              flex: 1,
              backgroundColor: '#00000090',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 0,
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: Colors.white_color,
                // marginTop: (mobileW * 50) / 100,
                position: 'absolute',
                bottom: 0,
                borderTopLeftRadius: (mobileW * 10) / 100,
                borderTopRightRadius: (mobileW * 10) / 100,
                borderWidth: (mobileW * 0.3) / 100,
                borderColor: Colors.gainsboro,
                elevation: 5,
                height: mobileH * 80 / 100
              }}>
              {/* task booking section */}
              <ScrollView style={{ marginTop: mobileW * 2 / 100, borderTopRightRadius: mobileW * 5 / 100, borderTopLeftRadius: mobileW * 5 / 100 }} showsVerticalScrollIndicator={false}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: mobileW * 90 / 100,
                      // backgroundColor:'red',
                      alignSelf: 'center',
                      paddingTop: (mobileW * 4) / 100,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: Font.Medium,
                        fontSize: mobileW * 4 / 100,
                      }}>{Lang_chg.Reschedule[config.language]}

                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text
                        style={{
                          color: Colors.theme_color,
                          fontFamily: Font.Medium,
                          fontSize: Font.name,
                          paddingRight: (mobileW * 4) / 100,
                        }}>{rescdule.order_id}

                      </Text>

                      <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                        <Image
                          source={Icons.cross}
                          style={{
                            resizeMode: 'contain',
                            // backgroundColor: Colors.white_color,
                            width: 20,
                            height: 20,

                            alignSelf: 'center',
                          }}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* border */}
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderColor: Colors.gainsboro,
                      width: '90%',
                      alignSelf: 'center',
                      marginVertical: (mobileW * 2) / 100,
                    }}></View>
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      paddingVertical: (mobileW * 4) / 100,

                    }}>
                    <View style={{ paddingBottom: mobileW * 1.5 / 100 }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: mobileW * 3.5 / 100,
                          textAlign: config.textRotate,
                          color: Colors.theme_color,
                        }}>{rescdule.task_type}

                      </Text>
                    </View>
                    <View
                      style={[{

                        paddingVertical: (mobileW * 3) / 100,
                        borderTopWidth: (mobileW * 0.3) / 100,
                        borderColor: Colors.bordercolor,


                      }, this.state.task_details.length >= 3 ? { height: mobileW * 40 / 100 } : { paddingVertical: mobileW * 1.5 / 100 }]}>
                      {rescdule.slot_booking_id == 'TASK_BOOKING' ?
                        <FlatList
                          data={rescdule.task_details}
                          scrollEnabled={true}
                          nestedScrollEnabled={true}
                          renderItem={({ item, index }) => {
                            if (rescdule.task_details != '' && rescdule.task_details != null) {
                              return (
                                <View
                                  style={{
                                    alignItems: 'center', width: '100%',
                                    alignSelf: 'center',

                                    paddingVertical: (mobileW * 1.7) / 100,
                                    flexDirection: 'row',
                                    marginTop: mobileW * 0.3 / 100,

                                  }}>

                                  <Text
                                    style={{
                                      width: '70%',
                                      textAlign: config.textRotate,
                                      alignSelf: 'center',
                                      fontSize: mobileW * 3.6 / 100,
                                      fontFamily: Font.Regular,

                                      color: '#000',


                                    }}>
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={{

                                      width: '30%',

                                      fontSize: mobileW * 3.6 / 100,
                                      fontFamily: Font.Regular,
                                      color: '#000',

                                      textAlign: 'right',

                                    }}>
                                    {item.price}
                                  </Text>
                                </View>
                              );
                            }
                            else {
                              return (
                                <View></View>
                              )
                            }
                          }}></FlatList> :

                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          horizontal={true}
                          data={rescdule.task_details}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={{
                                borderRadius: (mobileW * 2) / 100,
                                marginRight: mobileW * 2 / 100,
                                marginTop: mobileW * 2 / 100,
                                borderColor: '#0168B3',
                                borderWidth: 2,

                                width: mobileW * 30 / 100, backgroundColor: '#fff',
                              }}>
                                <View
                                  style={{
                                    backgroundColor: '#0168B3',

                                    borderTopLeftRadius: (mobileW * 1.2) / 100,
                                    borderTopRightRadius: (mobileW * 1.2) / 100,
                                    width: '100%'

                                  }}>
                                  <Text
                                    style={{
                                      // backgroundColor:'red',
                                      // paddingHorizontal: (mobileW * 5) / 100,
                                      paddingVertical: (mobileW * 1.5) / 100,
                                      color: Colors.white_color,
                                      fontFamily: Font.Medium,
                                      fontSize: mobileW * 3 / 100,
                                      textAlign: 'center',
                                      textTransform: 'uppercase'
                                    }}>{item.name}

                                  </Text>
                                </View>
                                <Text
                                  style={{


                                    paddingVertical: (mobileW * 2) / 100,
                                    fontFamily: Font.Medium,
                                    textAlign: 'center',
                                    fontSize: Font.sregulartext_size,
                                  }}>
                                  {item.price}
                                </Text>
                              </View>
                            );
                          }}></FlatList>}
                    </View>





                    {/* hourlybooking */}



                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                        paddingTop: (mobileW * 4) / 100,
                        // paddingBottom: (mobileW * 4) / 100,
                        // borderBottomWidth: (mobileW * 0.3) / 100,
                        borderColor: Colors.gainsboro,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Medium,
                          fontSize: Font.name,
                          textAlign: config.textRotate,
                        }}>{Lang_chg.Appoinmentschedule[config.language]}

                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          source={Icons.calendarimg}
                          style={{
                            resizeMode: 'contain',
                            // backgroundColor: Colors.white_color,
                            width: 20,
                            height: 20,

                            alignSelf: 'center',
                          }}></Image>

                        <Text
                          style={{
                            color: Colors.theme_color,
                            fontFamily: Font.Medium,
                            fontSize: Font.name,
                            marginLeft: mobileW * 1 / 100,
                          }}>{this.state.set_date}

                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.gainsboro,
                        width: '100%',
                        marginTop: mobileW * 2 / 100,

                      }}></View>
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        paddingTop: (mobileW * 3) / 100,
                        paddingBottom: (mobileW * 3) / 100,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.subtext,
                          color: '#000',
                          textAlign: config.textRotate,
                        }}>{Lang_chg.SelectDate[config.language]}

                      </Text>

                      <View style={{ width: '100%' }}>
                        <FlatList
                          horizontal={true}
                          data={this.state.date_array}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item, index }) => {

                            return (
                              <TouchableOpacity onPress={() => { this.setState({ set_date: item.date1, set_task: 'task_base', time_take_data: '' }), this.get_time_date(), this.check_date(item, index) }} style={{ width: mobileW * 15 / 100, }}>
                                <Text
                                  style={{
                                    marginRight: (mobileW * 3) / 100,
                                    marginTop: (mobileW * 3) / 100,
                                    backgroundColor: item.tick == 1 ? '#0787D2' : Colors.gray6,
                                    color: item.tick == 1 ? 'white' : 'black',
                                    textAlign: 'center',
                                    paddingVertical: mobileW * 2 / 100,
                                    fontFamily: Font.ques_fontfamily,
                                    fontSize: Font.sregulartext_size,

                                    lineHeight: mobileW * 5 / 100,

                                  }}>
                                  {item.day}{"\n"}

                                  {item.datenew}
                                </Text>
                              </TouchableOpacity>
                            );

                          }}></FlatList>
                      </View>
                    </View>

                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: Colors.gainsboro,
                        width: '100%',
                        marginTop: mobileW * 1.5 / 100,
                        marginBottom: mobileW * 1.5 / 100
                      }}></View>
                    <View
                      style={{
                        width: '100%',
                        alignSelf: 'center',
                        paddingVertical: (mobileW * 3) / 100,
                      }}>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.subtext,
                          textAlign: config.textRotate,
                        }}>{Lang_chg.Select_start_time[config.language]}


                      </Text>
                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ width: '100%' }}>
                          {this.state.time_Arr != '' ?
                            <View style={{ width: '100%' }}>
                              <View style={{ width: '100%' }}>
                                <FlatList
                                  horizontal={true}

                                  showsHorizontalScrollIndicator={false}
                                  data={this.state.final_one}
                                  renderItem={({ item, index }) => {

                                    return (
                                      <TouchableOpacity onPress={() => { this.setState({ time_take_data: item.time }) }}>
                                        <Text
                                          style={[{
                                            marginRight: (mobileW * 3) / 100,
                                            marginTop: (mobileW * 3) / 100,

                                            fontFamily: Font.ques_fontfamily,
                                            fontSize: Font.sregulartext_size,
                                            padding: (mobileW * 2) / 100,
                                            paddingHorizontal: (mobileW * 3.3) / 100,
                                          }, item.time == this.state.time_take_data ? { backgroundColor: Colors.theme_color, color: '#fff' } : { backgroundColor: Colors.gray6, color: '#000' }]}>
                                          {item.time}
                                        </Text>
                                      </TouchableOpacity>
                                    );
                                  }
                                  }></FlatList>
                              </View>
                              <View style={{ width: '100%' }}>
                                <FlatList
                                  horizontal={true}

                                  showsHorizontalScrollIndicator={false}
                                  data={this.state.final_arr_two}
                                  renderItem={({ item, index }) => {

                                    return (
                                      <TouchableOpacity onPress={() => { this.setState({ time_take_data: item.time }) }}>
                                        <Text
                                          style={[{
                                            marginRight: (mobileW * 3) / 100,
                                            marginTop: (mobileW * 3) / 100,

                                            fontFamily: Font.ques_fontfamily,
                                            fontSize: Font.sregulartext_size,
                                            padding: (mobileW * 2) / 100,
                                            paddingHorizontal: (mobileW * 3.3) / 100,
                                          }, item.time == this.state.time_take_data ? { backgroundColor: Colors.theme_color, color: '#fff' } : { backgroundColor: Colors.gray6, color: '#000' }]}>
                                          {item.time}
                                        </Text>
                                      </TouchableOpacity>
                                    );
                                  }
                                  }></FlatList>
                              </View>
                            </View>
                            :
                            <Text style={{ fontFamily: Font.MediumItalic, fontSize: mobileW * 4 / 100, alignSelf: 'center', marginTop: mobileW * 3 / 100, textAlign: 'center', marginLeft: mobileW * 32 / 100 }}>{Lang_chg.no_data_Found[config.language]}</Text>}
                        </View>
                      </ScrollView>
                    </View>

                    <TouchableOpacity
                      onPress={() => { this.submit_btn() }}
                      style={{
                        width: '98%',
                        alignSelf: 'center',
                        borderRadius: (mobileW * 2) / 100,
                        backgroundColor: Colors.theme_color,
                        paddingVertical: (mobileW * 2.8) / 100,
                        marginVertical: (mobileW * 6) / 100,
                      }}>
                      <Text
                        style={{
                          color: Colors.textwhite,
                          fontFamily: Font.Medium,
                          fontSize: Font.subtext,
                          alignSelf: 'flex-end',
                          textAlign: config.textalign,
                          alignSelf: 'center',
                        }}>{Lang_chg.SAVECHANGERESCHEDULE[config.language]}

                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
