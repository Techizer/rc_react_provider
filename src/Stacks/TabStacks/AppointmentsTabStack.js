import React, { Component, useEffect } from 'react';
import { useWindowDimensions, View, Dimensions, Platform, StatusBar } from 'react-native';
import {
  Colors,
  Font,
  Configurations,
  mobileW,
  LanguageConfiguration,
  API,
} from '../../Helpers/Utils';

import ScreenHeader from '../../Components/ScreenHeader';
import { useSelector } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import UpcomingAppointments from '../../Screens/Appointments/UpcomingAppointments'
import OngoingAppointments from '../../Screens/Appointments/OngoingAppointments'
import PastAppointments from '../../Screens/Appointments/PastAppointments'

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

const Tab = createMaterialTopTabNavigator();

export default AppointmentsTabStack = ({ navigation }) => {
  const [noticount, setNoticount] = React.useState("");

  useEffect(() => {
    getNotificationsCount()
  }, []);


  const {
    loginUserData
  } = useSelector(state => state.Auth)


  const getNotificationsCount = async () => {
    let user_id = loginUserData['user_id']

    let url = Configurations.baseURL + "api-notification-count";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)


    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        // this.setState({ notification_count: obj.result })
        setNoticount(obj.result)
        console.log('notification_count', obj.result)
      } else {
        return false;
      }
    }).catch((error) => {
      // this.getProfile()
      console.log("-------- error ------- " + error);
    })

  }

  // const renderTabBar = (props) => {
  //   console.log({ props });
  //   console.log({ navstate: props.navigationState });
  //   return (
  //     <TabBar
  //       {...props}
  //       indicatorStyle={{
  //         backgroundColor: Colors.Theme,
  //         height: (mobileW * 0.75) / 100,
  //         // borderTopRightRadius: 10,
  //         // borderTopLeftRadius: 10
  //       }}
  //       activeColor={Colors.Theme}
  //       inactiveColor={'#354052'}
  //       style={{ backgroundColor: '#F1F2F4' }}
  //       labelStyle={{
  //         textTransform: 'capitalize',
  //         fontSize: (mobileW * 3.25) / 100,
  //         textAlign: 'center',
  //         fontFamily: Font.Medium,
  //       }}
  //     />
  //   );
  // }

  // const renderScene = ({ route }) => {
  //   switch (route.key) {
  //     case 'ongoing':
  //       return <AppointmentContainer pageName={"ongoing"} {...{ navigation }} />;
  //     // case 'pending':
  //     //   return <AppointmentContainer ref={child1 => { this.child1 = child1 }} pageName={"pending"} jumpTo={jumpTo} {...props} {...{ navigation }} />;
  //     case 'upcoming':
  //       return <AppointmentContainer pageName={"upcoming"} {...{ navigation }} />;
  //     case 'past':
  //       return <AppointmentContainer pageName={"past"} {...{ navigation }} />;
  //   }
  // };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        leftIcon
        rightIcon={true}
        notiCount={noticount}
        navigation={navigation}
        title={LanguageConfiguration.MyAppointments[Configurations.language]}
        style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

      {/* tabheadings */}

      {/* <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{
              width: layout.width,
              height: layout.height
            }}
            renderTabBar={renderTabBar}
            onTabPress={() => {
              console.log('tabpressed');
            }}
          /> */}

      <Tab.Navigator

        screenOptions={{
          tabBarStyle: { width: '100%', backgroundColor: Colors.backgroundcolor, borderWidth: 0, },
          tabBarItemStyle: { width: windowWidth / 3, },
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: Colors.Theme,
          tabBarInactiveTintColor: Colors.lightGrey,
          tabBarIndicatorContainerStyle: {
            height: '100%',
            borderWidth: 0
            // marginTop:vs(7)
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors.Theme,
            height: (mobileW * 0.75) / 100
          },
          tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: Font.medium,
            fontFamily: Font.Medium
          }
        }} initialRouteName='Upcoming' >
        <Tab.Screen
          name='Upcoming'
          component={UpcomingAppointments} />
        <Tab.Screen
          name='Ongoing'
          component={OngoingAppointments} />
        <Tab.Screen
          name='Past'
          component={PastAppointments} />
      </Tab.Navigator>


    </View >
  );
}
