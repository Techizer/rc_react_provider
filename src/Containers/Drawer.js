import React, { Component, useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, StatusBar, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Colors, Font, mobileH, MessageFunctions, MessageTexts, config, mobileW, localStorage, handleback, LanguageConfiguration, API, MessageHeadings } from '../Helpers/Utils';
import { DrawerSubMenu } from '../Components'
import Styles from '../Styles';
import { DrawerActions } from '@react-navigation/native';
import { s, vs } from 'react-native-size-matters';
import { Appointment, MyAppointment, dummyUser, leftArrow, rightArrow } from '../Assets/Icons/SvgIcons/Index';
import { SvgXml } from 'react-native-svg';
import DrawerItemContainer from '../Components/DrawerItem';
import { DrawerIcons } from '../Assets/Icons/drawer';
import { ScreenReferences } from '../Stacks/ScreenReferences';
global.add_location = 'NA';
const windowWidth = Dimensions.get('window').width

export default Drawer = ({ navigation, route }) => {
  const [classStateData, setClassStateData] = useState({
    modalVisible: false,
    address_new: 'NA',
    name: '',
    profile_img: null,
    totalCompletionPercentage: 0
  })
  
  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      if (add_location != 'NA') {
        setState({
          address_new: add_location.address,
          latitude: add_location.latitude,
          longitude: add_location.longitude
        })
      }
      getProfile()
      getPercentage()
    });
  }, [])

  const getPercentage = async () => {
    var user_details = await localStorage.getItemObject("user_arr");
    let { user_id, user_type } = user_details;
    let url = config.baseURL + "api-provider-profile-complete";

    var data = new FormData();
    console.log({ user_id, user_type });
    data.append("login_user_id", user_id);
    data.append("user_type", user_type);
    API
      .post(url, data, 1)
      .then((completionData) => {
        setState({
          totalCompletionPercentage: completionData?.result?.total_complete
        })
      })
      .catch((error) => {
        console.log({ errorz: error });
        // setIsLoading(false)
        // setIsDelete(false)
        // MessageFunctions.showError(obj.message)
        // onRequestClose()
        // console.log("-------- error ------- " + error);
      });
  }

  const getProfile = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    let address_arr = await localStorage.getItemObject('address_arr')
    let user_type = user_details['user_type']
    setState({
      address_new: address_arr,
      user_type: user_type
    })

    setState({
      name: user_details['first_name'],
      email: user_details['email'],
      mobile: user_details['phone_number'],
      //address_old: user_details['current_address'],
    })
    if (user_details.image != null) {
      setState({
        profile_img: config.img_url3 + user_details['image'],
      })
    }

  }

  const confirm_click = async () => {
    logoutApi()
  }

  const logout = async () => {
    await localStorage.removeItem('user_arr');
    await localStorage.removeItem('user_login');
    setState({ show: false })
    navigation.navigate('Login')

  }

  const logoutApi = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    let user_id = user_details['user_id']
    let url = config.baseURL + "api-logout";
    var data = new FormData();
    data.append('user_id', user_id)

    API.post(url, data).then((obj) => {
      if (obj.status == true) {
        setTimeout(() => {
          logout()
        }, 500);
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
        style={{ flex: 1, backgroundColor: Colors.White, paddingBottom: Platform.OS === 'ios' ? vs(150) : vs(65), }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            // paddingHorizontal: s(15),
            paddingBottom: Platform.OS === 'ios' ? vs(16) : vs(16),
          }}
        >
          {/* user Profile */}
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
                (classStateData.profile_img == "NA" || classStateData.profile_img == "" || classStateData.profile_img == null) ?
                  <SvgXml xml={dummyUser} style={{
                    alignSelf: "center",
                  }} />
                  :
                  // <SvgUri uri={classStateData.profile_img} />
                  <Image
                    source={{ uri: classStateData.profile_img }}
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
                      textAlign: config.textRotate,

                    }}>
                    {classStateData.name}
                  </Text>
                </View>

                <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                  <SvgXml xml={
                    config.textalign == "right"
                      ? leftArrow : rightArrow
                  } height={vs(11.98)} width={s(6.42)} />
                </View>
              </View>

              <View style={{ width: '100%', }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    // navigation.dispatch(DrawerActions.toggleDrawer())
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
                      textAlign: config.textRotate,
                      marginTop: vs(5)

                    }}>
                    {config.language == 0 ? 'View & edit profile' : 'عرض وتحرير الملف الشخصي'}
                  </Text>
                </TouchableOpacity>

                {
                  classStateData.totalCompletionPercentage > 0 &&
                  <Text
                    style={{
                      color: Colors.DarkGrey,
                      fontFamily: Font.Regular,
                      fontSize: Font.small,
                      textAlign: config.textRotate,
                      marginTop: vs(4)
                    }}>
                    {config.language == 0 ? `${classStateData.totalCompletionPercentage}% Completed` : `${classStateData.totalCompletionPercentage}٪ اكتمل`}
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
                  textAlign: config.textRotate,
                }}>
                {'Appointment'}
              </Text>
            </View>

            <DrawerItemContainer
              rightIcon={
                config.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.MyAppointment}

              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer()),
                  navigation.navigate(ScreenReferences.AppointmentTabStack)
              }}

              title={LanguageConfiguration.MyAppointments[config.language]}
              subtitle={LanguageConfiguration.MyAppointmentsSub[config.language]}

            />



            <View style={{ width: '92%', height: 1.5, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>


            <View style={{ paddingHorizontal: vs(19) }}>
              <Text
                style={{
                  color: Colors.Black,
                  fontFamily: Font.Medium,
                  fontSize: 14,
                  textAlign: config.textRotate,
                }}>
                {'Booking Preferences'}
              </Text>
            </View>

            <DrawerItemContainer
              rightIcon={
                config.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.ScheduleAvailability}

              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.AvailabilityScheduleTabStack)
              }}

              title={LanguageConfiguration.scheduleavailability_heading[config.language]}
              subtitle={LanguageConfiguration.scheduleavailabilitysub_heading[config.language]}

            />

            <DrawerItemContainer
              rightIcon={
                config.textalign == "right"
                  ? leftArrow : rightArrow
              }
              leftIcon={DrawerIcons.PriceList}

              onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer())
                navigation.navigate(ScreenReferences.PriceListTabStack)
              }}

              title={LanguageConfiguration.pricelist_heading[config.language]}
              subtitle={LanguageConfiguration.pricelistsub_heading[config.language]}

            />

            <DrawerItemContainer
              rightIcon={
                config.textalign == "right"
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
                  textAlign: config.textRotate,
                }}>
                {'Account & More'}
              </Text>
            </View>

            <DrawerItemContainer
              rightIcon={
                config.textalign == "right"
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
                config.textalign == "right"
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
                config.textalign == "right"
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
                config.textalign == "right"
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
                navigation.dispatch(DrawerActions.closeDrawer())
                setState({ modalVisible: false })
                confirm_click()
              }}
              title={LanguageConfiguration.Logout[config.language]}
              titleStyle={{
                color: 'grey'
              }}
            />

            <View style={{ width: '92%', height: 0, backgroundColor: 'lightgrey', marginVertical: vs(16), alignSelf: 'flex-end', opacity: 0.5 }}></View>


          </View>



          <Modal
            animationType="fade"
            transparent={true}
            visible={classStateData.modalVisible}
            onRequestClose={() => {
              setState({ modalVisible: false });
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                // setState({ modalVisible3: false })
              }}
              style={{
                backgroundColor: "#00000080",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 20,
                marginTop: -50,
              }}
            >

              <View
                style={{
                  borderRadius: 20,
                  width: (windowWidth * 90) / 100,
                  position: "absolute",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      width: "40%",
                      paddingBottom: (windowWidth * 5) / 100,
                      marginTop: (windowWidth * 9) / 100,
                      alignSelf: "flex-end",
                      right: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setState({ modalVisible: false }),
                          confirm_click();
                      }}
                      activeOpacity={0.8}
                      style={{
                        height: (windowWidth * 10) / 100,
                        width: (windowWidth * 40) / 100,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: (windowWidth * 4) / 100,
                          color: Colors.Blue,
                          alignSelf: "center",
                        }}
                      >
                        {LanguageConfiguration.Logout[config.language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

}
