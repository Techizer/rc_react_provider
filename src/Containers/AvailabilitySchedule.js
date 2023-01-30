import React, { useEffect, useState } from 'react';
import { Switch, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';

import { Colors, Font, MessageFunctions, Configurations, mobileW, API } from '../Helpers/Utils';
import Styles from '../Screens/Styles';
import { Button } from '../Components'
import ListBottomSheet from '../Components/ListBottomSheet';
import { Arrow } from '../Assets/Icons/SvgIcons/Index';
import { useSelector } from 'react-redux';

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

const timeArray = [
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
]

export default AvailabilitySchedule = ({ navigation, route, page }) => {
  const [state, setState] = useState({
    modalVisible: false,
    message: '',
    searchPlaceVisible: false,
    flag: true,
    accept: true,
    hide: false,
    accept_booking: '0',
    service_address: "",
    service_lat: "",
    service_long: "",
    service_radius: "",
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
  })

  useEffect(() => {
    getAvailabilityScheduleData()
  }, [])


  const {
    loginUserData
  } = useSelector(state => state.Auth)

  const getAvailabilityScheduleData = async () => {
    let user_details = loginUserData;
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let task_type = ""
    if (page == "onlinehomeschedule") {  //doctor
      task_type = "api-doctor-get-timeslot"
    } else if (page == "taskschedule") {
      task_type = "provider-nurse-task-base-time-slot"
    } else if (page == "labschedule") {
      task_type = "provider-get-time-slot"
    } else {
      task_type = "provider-nurse-hour-base-time-slot"
    }
    let apiname = task_type

    let url = Configurations.baseURL + apiname;
    var data = new FormData();
    data.append('user_id', user_id)
    data.append('service_type', user_type)
    
    API.post(url, data).then((obj) => {
      if (obj.status == true) {

        if (obj.result.service_radius != null) {
          let arr = [...radiusArr]
          arr.map((v, i) => {
            if (obj.result.service_radius == v.value) {
              v.status = true
            } else {
              v.status = false
            }
          });
        } else {
          let arr = [...radiusArr]
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

        setState(
          prev => ({
            ...prev,
             slotArr: (obj.result.slots.length > 0) ? obj.result.slots : state.slotArr,
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
        )


      } else {
        return false;
      }
    }).catch((error) => {
    });

  }

  const submitPress = () => {
    if (state.accept_booking == '1') {
      insertUpdatePriceList()
    } else {
      var isError = false;
      var arr = state.slotArr

      arr.map((item, index) => {
        var strStartTime = item.slot_start_time //value;
        var strEndTime = item?.slot_end_time;
        var startTime = new Date().setHours(GetHours(strStartTime), GetMinutes(strStartTime), 0);
        var endTime = new Date(startTime)
        endTime = endTime.setHours(GetHours(strEndTime), GetMinutes(strEndTime), 0);
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
        MessageFunctions.showError("End time should be greater than Start time")
      } else {
        insertUpdatePriceList()
      }
    }


  }

  const insertUpdatePriceList = async () => {
    let user_details = loginUserData;
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    
    let apiname = (page == "onlinehomeschedule") ?
      "api-doctor-add-preferable-time" : "insert-preferable-time"

    let url = Configurations.baseURL + apiname;

    var myData = JSON.stringify({
      accept_booking: state.accept_booking,
      user_id: user_id,
      service_type: user_type,
      slots: state.slotArr,
    });
    
    API.postRaw(url, myData).then((obj) => {
      if (obj.status == true) {
        MessageFunctions.showSuccess(obj.message)

      } else {
        MessageFunctions.showError(obj.message)
        return false;
      }
    }).catch((error) => {

    });

  }

  const GetHours = (d) => {
    var h = parseInt(d.split(':')[0]);
    if (d.split(':')[1].split(' ')[1] == "PM") {
      h = h + 12;
    }
    return h;
  }
  const GetMinutes = (d) => {
    return parseInt(d.split(':')[1].split(' ')[0]);
  }

  const validationTime = (strStartTime, strEndTime, isStart, index) => {
    var isError = false;
    var strStartTime = strStartTime //value;
    var strEndTime = strEndTime //item?.slot_end_time;
    var startTime = new Date().setHours(GetHours(strStartTime), GetMinutes(strStartTime), 0);
    var endTime = new Date(startTime)
    endTime = endTime.setHours(GetHours(strEndTime), GetMinutes(strEndTime), 0);
    if (startTime > endTime) {
      isError = true
    }
    if (startTime == endTime) {
      isError = true
    }
    if (startTime < endTime) {
      isError = false
    }
    var arr = [...state.slotArr]

    if (isError) {
      MessageFunctions.showError("End time should be greater than Start time")
    }
    else {
      if (isStart) {
        arr[index].slot_start_time = strStartTime
      } else {
        arr[index].slot_end_time = strEndTime
      }

      setState(
        prev => ({
          ...prev,
          slotArr: arr
        })
      )
    }
  }

  return (

    <>
      {(state.shouldShow) &&
        < View style={{
          flex: 1,
          //  backgroundColor: 'white',
        }}>
          <ListBottomSheet
            data={timeArray}
            onRequestClose={() => { 
              setState(
                prev => ({
                  ...prev,
                  modalVisible: false
                })
              )
            }}
            visible={state.modalVisible}
            title='Select time'
            currentIndex={state.currentIndex}
            currentItem={state.currentItem}
            flag={state.flag}
            onSelectTime={(value, cIndex, cItem, flag) => {
              var arr = state.slotArr
              if (flag) {
                validationTime(value, state.slotArr[cIndex].slot_end_time, flag, cIndex)
                
                arr[cIndex].slot_start_time = value
                setState(
                  prev => ({
                    ...prev,
                    slotArr: arr
                  })
                )
              } else {
                validationTime(state.slotArr[cIndex].slot_start_time, value, flag, cIndex)
                arr[cIndex].slot_end_time = value
                setState(
                  prev => ({
                    ...prev,
                    slotArr: arr
                  })
                )
              }
            }} />
          {state.searchPlaceVisible ? (
            <></>
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
                            {/* {state.mabtn == false && */}
                            <TouchableOpacity
                              onPress={() => {
                                setState(
                                  prev => ({
                                    ...prev,
                                    accept: true,
                                  hide: false,
                                  accept_booking: '0'
                                  })
                                )
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
                                borderWidth: (state.accept == false) ? 1 : 6,
                                borderColor: (state.accept == false) ? 'grey' : Colors.textblue
                              }} />

                              <View style={{ width: '70%', alignSelf: 'center' }}>
                                <Text
                                  style={{
                                    marginLeft: mobileW * 1.5 / 100,
                                    textAlign: Configurations.textRotate,
                                    color: (state.accept == false) ? Colors.placeholder_text : 'black',
                                    fontFamily: (state.accept == false) ? Font.Regular : Font.Regular,
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
                            <TouchableOpacity onPress={() => {
                              setState(
                                prev => ({
                                  ...prev,
                                  accept: false,
                                hide: true,
                                accept_booking: '1'
                                })
                              )
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
                                borderWidth: (state.hide == false) ? 1 : 6,
                                borderColor: (state.hide == false) ? 'grey' : Colors.textblue
                              }} />
                              <Text
                                style={{
                                  marginLeft: mobileW * 1.5 / 100,
                                  textAlign: Configurations.textRotate,
                                  color: (state.hide == false) ? Colors.placeholder_text : 'black',
                                  fontFamily: (state.hide == false) ? Font.Regular : Font.Regular,
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
                    (state.accept) &&
                    <>
                      <View style={{
                        marginTop: 15,
                        paddingLeft: 15,
                        paddingRight: 15
                      }}>
                        {
                          (page == "onlinehomeschedule") &&
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
                                  }}>
                                  <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                      <TouchableOpacity
                                        onPress={() => {
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
                                          borderWidth: (state.mabtn == false) ? 1 : 6,
                                          borderColor: (state.mabtn == false) ? 'grey' : Colors.textblue
                                        }} />
                                        <View style={{ width: '70%', alignSelf: 'center' }}>
                                          <Text
                                            style={{
                                              marginLeft: mobileW * 1.5 / 100,
                                              textAlign: Configurations.textRotate,
                                              fontFamily: Font.Regular,
                                              color: (state.mabtn == false) ? Colors.placeholder_text : 'black',
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
                                      {/* {state.mabtn == false && */}
                                      <TouchableOpacity
                                        onPress={() => {
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
                                          borderWidth: (state.mabtn == false) ? 1 : 6,
                                          borderColor: (state.mabtn == false) ? 'grey' : Colors.textblue
                                        }} />

                                        <View style={{ width: '70%', alignSelf: 'center' }}>
                                          <Text
                                            style={{
                                              marginLeft: mobileW * 1.5 / 100,
                                              textAlign: Configurations.textRotate,
                                              fontFamily: Font.Regular,
                                              color: (state.mabtn == false) ? Colors.placeholder_text : 'black',
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
                          state.slotArr.map((item, index) => {

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
                                          style={{
                                            transform: [{ scaleX: .7 }, { scaleY: .7 }],
                                            marginLeft: -8.5,
                                            marginRight: -8.5
                                          }}
                                          onValueChange={(value) => {
                                            let arr = [...state.slotArr]
                                            arr[index].slot_day_enable = (value) ? "1" : "0"
                                            setState(
                                              prev => ({
                                                ...prev,
                                                slotArr: arr
                                              })
                                            )
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
                                          setState(
                                            prev => ({
                                              ...prev,
                                              currentIndex: index,
                                            currentItem: item,
                                            modalVisible: true,
                                            flag: true
                                            })
                                          )
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
                                          setState(
                                            prev => ({
                                              ...prev,
                                              currentIndex: index,
                                            currentItem: item,
                                            modalVisible: true,
                                            flag: false
                                            })
                                          )
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
                  // onLoading={state.loading}
                  customStyles={
                    {
                      mainContainer: {
                        marginTop: 0
                      }
                    }
                  }
                  onPress={() => submitPress()}
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