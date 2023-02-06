import React, { useEffect, useState } from 'react';
import { Alert, Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList } from 'react-native';

import { Font, MessageFunctions, Configurations, mobileW, API, windowWidth } from '../Helpers/Utils';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import AppointmentItem from '../Components/AppointmentItem';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {s, vs} from 'react-native-size-matters'


export default Appointment = ({ navigation, route, pageName }) => {

  const [state, setState] = useState({
    id: '',
    appointments: [],
    send_id: '',
    message: '',
    isLoading: true
  })

  useEffect(() => {
    getApppointments()
    getDay()
  }, [])


  const {
    loginUserData
  } = useSelector(state => state.Auth)

  const reloadList = () => {
    getApppointments()
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
    setState(
      prev => ({
        ...prev,
        set_date: date1_show,
        check_currentdate: date1_show
      })
    )

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
  };

  const getApppointments = async () => {
    let user_details = loginUserData;
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']

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

    let url = Configurations.baseURL + apiname;

    var data = new FormData();
    data.append('user_id', user_id)
    data.append('service_type', user_type)

    API.post(url, data, 1).then((obj) => {
      // setState(
      //   prev => ({
      //     ...prev,
      //     appointments: ''
      //   })
      // )
      if (obj?.status == true) {
        setState(
          prev => ({
            ...prev,
            appointments: obj?.result, message: obj?.message
          })
        )
      }
    }).finally(() => {
      setState(prev => ({
        ...prev,
        isLoading: false
      }))
    })

  }

  const showConfirmDialogReject = (acceptanceStatus, appointmentID, listIndex) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to reject this appointment?",
      [
        {
          text: "Yes",
          onPress: () => {
            updateProviderAppointmentStatus(acceptanceStatus, appointmentID, listIndex)
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  const updateProviderAppointmentStatus = async (acceptanceStatus, appointmentID, listIndex) => {
    let user_details = loginUserData;
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let url = Configurations.baseURL + "api-update-provider-appointment-status";

    var data = new FormData();
    data.append('id', appointmentID)
    data.append('service_type', user_type)
    data.append('acceptance_status', acceptanceStatus)


    API.post(url, data).then((obj) => {
      if (obj.status == true) {
        if (listIndex !== -1) {
          state.appointments.splice(listIndex, 1);
          setState(prev => prev)
        }
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        return false;
      }
    });

  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
        }}>

        <View style={{
          flex: 1,
        }}>
          {
            (state.appointments != '' && state.appointments != null) ?
              <>
                {
                  !state.isLoading ?
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: mobileW * 5 / 100 }}
                      data={state.appointments}
                      renderItem={({ item, index }) => {
                        if (state.appointments != '' && state.appointments != null) {
                          return (
                            <>
                              <AppointmentItem
                                item={item}
                                index={index}
                                onPressViewDetails={() => {
                                  console.log("props:: ", props);
                                  navigation.navigate(ScreenReferences.AppointmentDetails,
                                    {
                                      status: item.provider_type,
                                      appoinment_id: item.id,
                                      send_id: item.provider_id,
                                      reloadList: reloadList
                                    })
                                }}
                                onPressAccept={() => {
                                  updateProviderAppointmentStatus("Accept", item.id, index)
                                }}
                                onPressReject={() => {
                                  showConfirmDialogReject("Reject", item.id, index)

                                }}
                                onPressVideoCall={() => {
                                  setState(
                                    prev => ({
                                      ...prev,
                                      id: item.id,
                                      index: index
                                    })
                                  )
                                  navigation.navigate(ScreenReferences.VideoCall, {
                                    item: item
                                  });


                                }}
                              />
                            </>
                          );
                        }
                      }}
                    /> :
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: mobileW * 5 / 100 }}
                      data={['', '', '', '', '', '', '', '', '', '', '', '']}
                      renderItem={({ item, index }) => {
                        <View
                          style={{
                            flexDirection: "row",
                            width: '100%',
                            paddingHorizontal: s(11),
                          }}>
                          <View style={{ width: "30%", }}>
                            <SkeletonPlaceholder>
                              <SkeletonPlaceholder.Item width={s(75)} height={s(75)} borderRadius={s(100)} />
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
                      }}
                    />
                }
              </>
              :
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%'
              }}>
                <Text style={{
                  fontFamily: Font.Regular,
                  fontSize: 16,
                  textTransform: 'capitalize'
                }}>{pageName} Appointment List Not Found.</Text>
              </View>
          }

        </View>
      </View>

    </View>
  );

}
