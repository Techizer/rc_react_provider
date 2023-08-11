import React, { Component, useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import { Colors, Font, MessageFunctions, Configurations, LanguageConfiguration, API } from '../Helpers/Utils';
import { DrawerActions } from '@react-navigation/native';
import { s, vs } from 'react-native-size-matters';
import { dummyUser, leftArrow, rightArrow } from '../Icons/SvgIcons/Index';
import { SvgXml } from 'react-native-svg';
import DrawerItemContainer from '../Components/DrawerItem';
import { DrawerIcons } from '../Icons/drawer';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { onUserLogout } from '../Redux/Actions/UserActions';
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications';
const windowWidth = Dimensions.get('window').width

export default Drawer = ({ navigation, route }) => {


  const {
    loginUserData,
    profileCompletion,
    profileData
  } = useSelector(state => state.StorageReducer)

  const dispatch = useDispatch()

  const logoutApi = async () => {
    const fcm_token = await FBPushNotifications.getFcmToken()
    let url = Configurations.baseURL + "api-logout";
    var data = new FormData();
    data.append('user_id', loginUserData?.user_id)
    data.append('fcm_token', fcm_token)

    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {
        navigation.reset({
          index: 0,
          routes: [{ name: ScreenReferences.Login }],
        });
      } else {
        setTimeout(() => {
          MessageFunctions.showError(obj.message)
        }, 700);
        return false;
      }
    }).catch((error) => {
    })

  }

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: Colors.White, paddingBottom: Platform.OS === 'ios' ? vs(150) : vs(65) }}>
        <View
          style={{
            flex: 1,
            width: "100%",
            paddingBottom: Platform.OS === 'ios' ? vs(16) : vs(16),
          }}>
          <TouchableOpacity
            onPress={() => {
              setTimeout(() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.EditProfile);
              }, 350);
            }}
            activeOpacity={0.7}
            style={{ width: '100%', alignItems: "center", flexDirection: 'row', paddingTop: vs(20), height: vs(140), backgroundColor: Colors.White }}>

            <View style={{ width: '31%' }} >
              {
                (profileData?.image == "NA" || profileData?.image == "" || profileData?.image == null) ?
                  <SvgXml xml={dummyUser} style={{
                    alignSelf: "center",
                  }} />
                  :
                  <Image
                    source={{ uri: Configurations.img_url3 + profileData?.image }}
                    style={{ height: s(85), width: s(85), borderRadius: s(85), backgroundColor: Colors.backgroundcolor, alignSelf: 'center' }}
                  />

              }
            </View>

            <View style={{ width: '69%' }} >

              <View style={{ width: '100%', flexDirection: 'row', }} >

                <View style={{ width: '80%', justifyContent: 'center' }}>
                  <Text
                    style={{
                      color: Colors.Black,
                      fontFamily: Font.Medium,
                      fontSize: Font.xxxlarge,
                      textAlign: Configurations.textRotate,

                    }}>
                    {profileData?.first_name}
                  </Text>
                </View>

                <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                  <SvgXml xml={
                    Configurations.textalign == "right"
                      ? leftArrow : rightArrow
                  } height={vs(11.98)} width={s(6.42)} />
                </View>
              </View>

              <View style={{ width: '100%', }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setTimeout(() => {
                      navigation.dispatch(DrawerActions.closeDrawer())
                      navigation.navigate(ScreenReferences.EditProfile);
                    }, 350);
                  }}>
                  <Text
                    style={{
                      color: Colors.Theme,
                      fontFamily: Font.Medium,
                      fontSize: Font.medium,
                      textAlign: Configurations.textRotate,
                      marginTop: vs(5)

                    }}>
                    {Configurations.language == 0 ? 'View & edit profile' : 'عرض وتحرير الملف الشخصي'}
                  </Text>
                </TouchableOpacity>

                {
                  profileCompletion?.total_complete > 0 &&
                  <Text
                    style={{
                      color: Colors.DarkGrey,
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      textAlign: Configurations.textRotate,
                      marginTop: vs(4)
                    }}>
                    {Configurations.language == 0 ? `${profileCompletion?.total_complete}% Completed` : `${profileCompletion?.total_complete}٪ اكتمل`}
                  </Text>
                }

              </View>
            </View>
          </TouchableOpacity>

          {/* Appoints and bookings section */}
          <View style={{ width: '92%', height: 1.5, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>


          <View style={{ width: '100%', backgroundColor: Colors.White }}>

            <View style={{ paddingHorizontal: vs(19) }}>
              <Text
                style={{
                  color: Colors.Black,
                  fontFamily: Font.Medium,
                  fontSize: 14,
                  textAlign: Configurations.textRotate,
                }}>
                {'Appointment'}
              </Text>
            </View>

            <DrawerItemContainer
              rightIcon={
                Configurations.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.MyAppointment}

              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer()),
                  navigation.navigate(ScreenReferences.AppointmentsTabStack)
              }}

              title={LanguageConfiguration.MyAppointments[Configurations.language]}
              subtitle={LanguageConfiguration.MyAppointmentsSub[Configurations.language]}

            />



            <View style={{ width: '92%', height: 1.5, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>


            <View style={{ paddingHorizontal: vs(19) }}>
              <Text
                style={{
                  color: Colors.Black,
                  fontFamily: Font.Medium,
                  fontSize: 14,
                  textAlign: Configurations.textRotate,
                }}>
                {'Booking Preferences'}
              </Text>
            </View>

            <DrawerItemContainer
              rightIcon={
                Configurations.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.ScheduleAvailability}

              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.AvailabilityScheduleTabStack)
              }}

              title={LanguageConfiguration.scheduleavailability_heading[Configurations.language]}
              subtitle={LanguageConfiguration.scheduleavailabilitysub_heading[Configurations.language]}

            />

            <DrawerItemContainer
              rightIcon={
                Configurations.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.PriceList}

              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.PriceListTabStack)
              }}

              title={LanguageConfiguration.pricelist_heading[Configurations.language]}
              subtitle={LanguageConfiguration.pricelistsub_heading[Configurations.language]}

            />

            <DrawerItemContainer
              rightIcon={
                Configurations.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.ServiceAddress}

              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.ServiceAddress)
              }}

              title={'Service Address'}
              subtitle={'Setup your pickup address'}
              disable

            />

            <View style={{ width: '92%', height: 1.5, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>

            <View style={{ paddingHorizontal: vs(19) }}>
              <Text
                style={{
                  color: Colors.Black,
                  fontFamily: Font.Medium,
                  fontSize: 14,
                  textAlign: Configurations.textRotate,
                }}>
                {'Account & More'}
              </Text>
            </View>

            <DrawerItemContainer
              rightIcon={
                Configurations.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.ProfileSettings}

              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.ShowProfile);
              }}

              title={'Profile Settings'}

            />

            <DrawerItemContainer
              rightIcon={
                Configurations.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.TransactionsAndMore}
              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.TransactionTabStack);
              }}
              title={'Transaction & More'}

            />

            <DrawerItemContainer
              rightIcon={
                Configurations.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.ReviewAndRating}
              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.ReviewRating);
              }}
              title={'Review & Rating'}

            />
            <DrawerItemContainer
              rightIcon={
                Configurations.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.SupportAndMore}
              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.More);
              }}
              title={'Support & More'}

            />

            <View style={{ width: '92%', height: 1.5, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>

            <DrawerItemContainer
              leftIcon={DrawerIcons.Logout}
              onPress={() => {
                Alert.alert(
                  'Logout',
                  'Do you want to logout', [{
                    text: LanguageConfiguration.no_txt[Configurations.language],
                    onPress: () => console.log('Cancel Pressed'),
                    style: LanguageConfiguration.no_txt[Configurations.language],
                  }, {
                    text: LanguageConfiguration.yes_txt[Configurations.language],
                    onPress: () => {
                      logoutApi()
                    }
                  }], {
                  cancelable: false
                });
              }}
              title={LanguageConfiguration.Logout[Configurations.language]}
              titleStyle={{
                color: 'grey'
              }}
            />

            <View style={{ width: '92%', height: 0, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>


          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
