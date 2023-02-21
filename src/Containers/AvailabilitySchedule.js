import React, { useEffect, useState } from 'react';
import { Switch, Text, View, ScrollView, Image, TouchableOpacity, FlatList, TouchableHighlight } from 'react-native';

import { Colors, Font, MessageFunctions, Configurations, mobileW, API, windowHeight } from '../Helpers/Utils';
import Styles from '../Screens/Styles';
import { Button } from '../Components'
import ListBottomSheet from '../Components/ListBottomSheet';
import { Arrow, Cross } from '../Assets/Icons/SvgIcons/Index';
import { useDispatch, useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { s, vs } from 'react-native-size-matters';
import { setScheduleAvailabilityData } from '../Redux/Actions/UserActions';
import { useRef } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SvgXml } from 'react-native-svg';

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


const Days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const BookingStatus = {
  Accept: '0',
  Hide: '1'
}

const DaysEnability = {
  On: '1',
  Off: '0'
}

export default AvailabilitySchedule = ({ navigation, route, page }) => {

  const {
    loginUserData,
    scheduleAvailability
  } = useSelector(state => state.Auth)

  const [state, setState] = useState({
    message: '',
    flag: true,
    accept: (scheduleAvailability === null) ? true : scheduleAvailability?.accept,
    hide: (scheduleAvailability === null) ? false : scheduleAvailability?.hide,
    accept_booking: (scheduleAvailability === null) ? BookingStatus.Accept : scheduleAvailability?.accept_booking,
    currentIndex: 0,
    isLoading: (scheduleAvailability === null) ? true : false,
    isOnButtonLoading: false,
    currentItem: { "slot_day": "MON", "slot_day_enable": "1", "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
    slotArr: (scheduleAvailability === null) ? [
      { "slot_day": "MON", "slot_day_enable": DaysEnability.Off, "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
      { "slot_day": "TUE", "slot_day_enable": DaysEnability.Off, "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
      { "slot_day": "WED", "slot_day_enable": DaysEnability.Off, "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
      { "slot_day": "THU", "slot_day_enable": DaysEnability.Off, "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
      { "slot_day": "FRI", "slot_day_enable": DaysEnability.Off, "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
      { "slot_day": "SAT", "slot_day_enable": DaysEnability.Off, "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" },
      { "slot_day": "SUN", "slot_day_enable": DaysEnability.Off, "slot_end_time": "08:30 PM", "slot_start_time": "08:30 AM" }
    ] : scheduleAvailability?.slotArr
  })

  const timeSheetRef = useRef()

  useEffect(() => {
    getAvailabilityScheduleData(scheduleAvailability === null ? true : false)
  }, [])

  const dispatch = useDispatch()

  const isPartOfHospital = ((loginUserData?.hospital_id != '') && (loginUserData?.hospital_id != null))

  const getAvailabilityScheduleData = async (showLoading) => {
    let user_id = loginUserData['user_id']
    let user_type = loginUserData['user_type']
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

    // if (showLoading) {
    //   setState(prev => ({isLoading: true}))
    // }

    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {

        console.log('ScheduleStatus...', obj.result.accept_booking);

        dispatch(setScheduleAvailabilityData({
          slotArr: (obj.result.slots.length > 0) ? obj.result.slots : state.slotArr,
          accept_booking: (obj.result.accept_booking == null) ? BookingStatus.Accept : obj.result.accept_booking,
          accept: (obj.result.accept_booking == null) ? true : (obj.result.accept_booking == BookingStatus.Accept) ? true : false,
          hide: (obj.result.accept_booking == null) ? false : (obj.result.accept_booking == BookingStatus.Hide) ? true : false,
        }))

        setState(
          prev => ({
            ...prev,
            slotArr: (obj.result.slots.length > 0) ? obj.result.slots : state.slotArr,
            accept_booking: (obj.result.accept_booking == null) ? BookingStatus.Accept : obj.result.accept_booking,
            accept: (obj.result.accept_booking == null) ? true : (obj.result.accept_booking == BookingStatus.Accept) ? true : false,
            hide: (obj.result.accept_booking == null) ? false : (obj.result.accept_booking == BookingStatus.Hide) ? true : false,
            message: obj.message,
          })
        )

      } else {
        return false;
      }
    }).catch((error) => {
    }).finally(() => {
      setState(prev => ({
        ...prev,
        isLoading: false
      }))
    })

  }

  const submitPress = () => {
    if (state.accept_booking == BookingStatus.Hide) {
      onUpdateScheduleData()
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
        onUpdateScheduleData()
      }
    }
  }

  const onUpdateScheduleData = async () => {
    let user_details = loginUserData;
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']

    setState(prev => ({
      ...prev,
      isOnButtonLoading: true
    }))

    let apiname = (page == "onlinehomeschedule") ?
      "api-doctor-add-preferable-time" : "insert-preferable-time"

    let url = Configurations.baseURL + apiname;
    const enabledDaysCount = state.slotArr.filter(slot => slot.slot_day_enable === '1').length

    if (state.accept_booking === BookingStatus.Accept && enabledDaysCount <= 0) {
      console.log({ enabledDaysCount });
      MessageFunctions.showError("You must switch on at list 'One Day' with start and closing time to make yourself available for the booking.")
      setState(prev => ({
        ...prev,
        isOnButtonLoading: false
      }))
    } else {
      var myData = JSON.stringify({
        accept_booking: state.accept_booking,
        user_id: user_id,
        service_type: user_type,
        slots: state.slotArr,
      });

      console.log('myData...', myData);

      API.postRaw(url, myData, 1).then((obj) => {
        if (obj.status == true) {
          MessageFunctions.showSuccess(obj.message)
          dispatch(setScheduleAvailabilityData({
            slotArr: state.slotArr,
            accept_booking: state.accept_booking,
            accept: state.accept,
            hide: state.hide,
          }))
        } else {
          MessageFunctions.showError(obj.message)
          return false;
        }
      }).catch((error) => {
      }).finally(() => {

        setState(prev => ({
          ...prev,
          isOnButtonLoading: false
        }))

      })
    }
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
    <View style={{
      flex: 1,
    }}>


      <RBSheet ref={timeSheetRef} animationType='slide' height={windowHeight / 1.75} customStyles={{
        container: {
          borderTopLeftRadius: vs(12),
          borderTopRightRadius: vs(12),
        }
      }} closeOnPressBack>
        <View style={{
          width: '100%',
          backgroundColor: "white",
          height: '100%',
          borderTopLeftRadius: vs(12),
          borderTopRightRadius: vs(12),
        }}>
          <View style={{
            backgroundColor: Colors.textblue,
            borderTopLeftRadius: vs(12),
            borderTopRightRadius: vs(12),
            paddingVertical: vs(14),
            width: '100%'
          }}>
            <Text style={{
              paddingLeft: 15,
              color: Colors.white_color,
              fontSize: Font.large,
              fontFamily: Font.SemiBold,
            }}>{`Select ${state.flag ? 'start' : 'end'} time for ${Days[state.currentIndex]}`}</Text>
          </View>
          <FlatList
            data={state.flag ? timeArray : timeArray.filter((t, i) => i > timeArray.findIndex(v => v.value === state.slotArr[state.currentIndex]?.slot_start_time))}
            contentContainerStyle={{ paddingTop: vs(10) }}
            renderItem={({ item, index }) => {
              return (
                <View style={{
                  justifyContent: 'center',
                }}>
                  <TouchableOpacity style={{
                    alignSelf: 'center',
                    backgroundColor: '#DEF7FF',
                    padding: vs(6),
                    paddingHorizontal: vs(12),
                    marginVertical: vs(8),
                    borderRadius: vs(16)
                  }}
                    onPress={() => {
                      var arr = state.slotArr
                      if (state.flag) {
                        validationTime(item.value, state.slotArr[state.currentIndex].slot_end_time, state.flag, state.currentIndex)

                        arr[state.currentIndex].slot_start_time = item.value
                        setState(
                          prev => ({
                            ...prev,
                            slotArr: arr
                          })
                        )
                      } else {
                        validationTime(state.slotArr[state.currentIndex].slot_start_time, item.value, state.flag, state.currentIndex)
                        arr[state.currentIndex].slot_end_time = item.value
                        setState(
                          prev => ({
                            ...prev,
                            slotArr: arr
                          })
                        )
                      }
                      timeSheetRef.current.close()
                    }}>
                    <Text
                      style={{
                        color: Colors.textblack_new,
                        textAlign: Configurations.textRotate,
                        fontSize: Font.large
                      }} >
                      {item.value}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(item, index) => 'kyi' + index}
            showsVerticalScrollIndicator={false}
            numColumns={3}
            ListFooterComponent={() => (
              <View style={{ marginVertical: vs(16) }} />
            )}
            columnWrapperStyle={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          />
        </View>



      </RBSheet>


      {
        !state.isLoading ?
          <View
            style={{
              flex: 1,
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
                                  accept_booking: BookingStatus.Accept
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
                        }}>
                        <View style={{ width: '100%', alignSelf: 'center', marginLeft: mobileW * 2 / 100 }}>
                          <TouchableOpacity onPress={() => {
                            setState(
                              prev => ({
                                ...prev,
                                accept: false,
                                hide: true,
                                accept_booking: BookingStatus.Hide
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

                          {!isPartOfHospital &&
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

                          }
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
                              }} key={'slott' + index} >
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
                                  }}>
                                    <View style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      width: '100%',
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
                                            flag: true
                                          })

                                        )
                                        timeSheetRef.current.open()
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
                                            flag: false
                                          })
                                        )
                                        timeSheetRef.current.open()
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
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 15,
              height: mobileW * 22 / 100
            }}>
              <Button
                text={'SAVE SCHEDULE'}
                onLoading={state.isOnButtonLoading}
                customStyles={
                  {
                    mainContainer: {
                      marginTop: 0
                    }
                  }
                }
                onPress={() => submitPress()}
              />
            </View>
          </View> :

          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: mobileW * 5 / 100 }}
            data={[1, 2, 3, 4, 5, 6, 7]}
            ListHeaderComponent={() => (
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: s(11),
                }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width='50%' height={s(20)} borderRadius={s(6)} marginTop={s(11)} />
                  <SkeletonPlaceholder.Item width='98%' height={s(25)} borderRadius={s(6)} marginTop={s(3)} />
                </SkeletonPlaceholder>

                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width='90%' height={s(20)} borderRadius={s(6)} marginTop={s(20)} />

                  <View style={{
                    flexDirection: 'row',
                    marginTop: s(8)
                  }} >
                    <SkeletonPlaceholder.Item width='40%' height={s(30)} borderRadius={s(6)} />
                    <SkeletonPlaceholder.Item width='40%' height={s(30)} borderRadius={s(6)} marginLeft={'10%'} />
                  </View>
                </SkeletonPlaceholder>

                {(page == "onlinehomeschedule") &&
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width='90%' height={s(20)} borderRadius={s(6)} marginTop={s(20)} />

                    <View style={{
                      flexDirection: 'row',
                      marginTop: s(8)
                    }} >
                      <SkeletonPlaceholder.Item width='40%' height={s(30)} borderRadius={s(6)} />
                      <SkeletonPlaceholder.Item width='40%' height={s(30)} borderRadius={s(6)} marginLeft={'10%'} />
                    </View>
                  </SkeletonPlaceholder>
                }

                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width='75%' height={s(22)} borderRadius={s(6)} marginTop={s(20)} marginBottom={s(10)} />
                </SkeletonPlaceholder>

              </View>
            )}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    width: '100%',
                    paddingHorizontal: s(11),
                  }}>
                  <SkeletonPlaceholder>

                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      backgroundColor: (item?.slot_day_enable == "1") ? '#FBFBFB' : Colors.gray6, //(index == weekArr.length - 1) ? '#E5E5E5' : '#FBFBFB', //Colors.tab_background_color,
                      height: (mobileW * 14) / 100,
                      marginBottom: 5
                    }} key={'slott' + index} >

                      <SkeletonPlaceholder.Item width='10%' height={(mobileW * 10) / 100} borderRadius={s(6)} marginTop={vs(2)} />
                      <SkeletonPlaceholder.Item width='18%' height={(mobileW * 10) / 100} borderRadius={s(6)} marginTop={vs(2)} marginLeft={'1%'} />
                      <SkeletonPlaceholder.Item width='28%' height={(mobileW * 10) / 100} borderRadius={s(6)} marginTop={vs(2)} marginLeft={'6%'} />
                      <SkeletonPlaceholder.Item width='28%' height={(mobileW * 10) / 100} borderRadius={s(6)} marginTop={vs(2)} marginLeft={'6%'} />

                    </View>
                  </SkeletonPlaceholder>
                </View>
              )

            }}
            ItemSeparatorComponent={() => (
              <View style={{
                marginTop: vs(8)
              }} />
            )}
          />
      }

    </View>

  );
}