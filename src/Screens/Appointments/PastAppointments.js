import React, { useEffect, useState } from 'react';
import { Alert, Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList, RefreshControl } from 'react-native';

import { Font, MessageFunctions, Configurations, mobileW, API, windowWidth, windowHeight } from '../../Helpers/Utils';
import { ScreenReferences } from '../../Stacks/ScreenReferences';
import AppointmentItem from '../../Components/AppointmentItem';
import { useSelector } from 'react-redux';
import { s, vs } from 'react-native-size-matters'
import { useIsFocused } from '@react-navigation/native';

const pageName = "past"

export default PastAppointments = ({ navigation, route }) => {

  const [appointments, setAppointments] = useState([1, 2, 3, 4, 5])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')

  const isFocused = useIsFocused()

  useEffect(() => {
    if(isFocused) {
    console.log('isFocused');
      getApppointments()
    }
  }, [isFocused])


  const {
    loginUserData
  } = useSelector(state => state.Auth)

  const reloadList = () => {
    getApppointments()
  }

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

    console.log({ apiname });

    API.post(url, data, 1).then((obj) => {
      if (apiname == "api-provider-ongoing-appointment-list") {
        console.log({
          OngoingApps: obj
        });
      }
      if (apiname == "api-provider-upcoming-appointment-list") {
        console.log({
          UpcomingApps: obj
        });
      }
      if (obj?.status == true) {
        console.log('first...', obj?.result[0]);
        setAppointments(obj?.result)
        setMessage(obj?.message)

      }
      else {
        setAppointments([])
      }
    }).catch(() => {
      setAppointments([])
    }).finally(() => {
      if (isLoading) {
        setIsLoading(false)
      }
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
          appointments.splice(listIndex, 1);
          setAppointments(prev => prev)
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
      <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: mobileW * 5 / 100 }}
          data={appointments}
          renderItem={({ item, index }) => {
            if (appointments != '' && appointments != null) {
              return (
                <>
                  <AppointmentItem
                    item={item}
                    index={index}
                    isLoading={isLoading}
                    onPressViewDetails={() => {
                      console.log("props:: ", props);
                      navigation.navigate(ScreenReferences.AppointmentDetails,
                        {
                          status: item.provider_type,
                          appoinment_id: item.id,
                          send_id: item.provider_id,
                        })
                    }}
                    onPressAccept={() => {
                      updateProviderAppointmentStatus("Accept", item.id, index)
                      reloadList()
                    }}
                    onPressReject={() => {
                      showConfirmDialogReject("Reject", item.id, index)
                      reloadList()
                    }}
                    onPressVideoCall={() => {
                      navigation.navigate(ScreenReferences.VideoCall, {
                        item: item
                      });
                    }}
                  />
                </>
              );
            }
          }}
          ListEmptyComponent={() => {
            return (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
                marginTop: vs(40)
              }}>
                <Text style={{
                  fontFamily: Font.Regular,
                  fontSize: 16,
                  textTransform: 'capitalize'
                }}>{`No ${pageName} appointments found`}</Text>
              </View>
            )
          }}
          refreshing={isLoading}
          onRefresh={async () => { await getApppointments() }}
        />
    </View>
  );

}
