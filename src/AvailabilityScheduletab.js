import React, { Component, useEffect } from 'react';
import { useWindowDimensions, Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList, Dimensions, StatusBar } from 'react-native';
import {
  Colors,
  Font,
  mobileH,
  msgProvider,
  msgText,
  config,
  mobileW,
  localStorage,
  
  
  handleback,
  Lang_chg,
  apifuntion,
  msgTitle,
} from './Provider/utilslib/Utils';

import Styles from './Styles';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AvailabilitySchedule from './Screens/AvailabilitySchedule';
import ScreenHeader from './Components/ScreenHeader';
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
  }]

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: Colors.Theme,
      height: (mobileW * 0.75) / 100,
      // borderTopRightRadius: 10,
      // borderTopLeftRadius: 10
    }}
    activeColor={Colors.Theme}
    inactiveColor={'#354052'}
    style={{ backgroundColor: '#F1F2F4' }}
    labelStyle={{
      textTransform: 'capitalize',
      fontSize: (mobileW * 3.25) / 100,
      textAlign: 'center',
      fontFamily: Font.Medium,
    }}
    renderLabel={({ focused, route }) => {
      return (
        <Text
          style={{
            color: (focused) ? Colors.textblue : Colors.splashtextcolor,
            textTransform: 'capitalize',
            fontSize: (mobileW * 3.5) / 100,
            textAlign: 'center',
            fontFamily: Font.SemiBold,
          }}
        >
          {route.title}
        </Text>
      );
    }}
  />
);

export default function AvailabilityScheduletab({ navigation }) {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);

  useEffect(() => {
    // Update the document title using the browser API
    getUserData();
  }, []);

  const getUserData = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log("user_typeuser_type:: ", user_type);
    if (user_type == "nurse") {
      setRoutes([
        // { key: 'first', title: 'First' },
        // { key: 'second', title: 'Second' },
        {
          id: 1,
          name: 'Ongoing',
          arbic_name: 'الجميع ',
          pass_status: 'all',
          status: true,
          key: 'taskschedule', title: 'Task Schedule'
        },
        {
          id: 2,
          name: 'Pending',
          arbic_name: 'ممرضة  ',
          pass_status: 'nurse',
          status: false,
          key: 'hourlyschedule', title: 'Hourly Schedule'
        },

      ])
    } else if (user_type == "caregiver" || user_type == "babysitter") {
      setRoutes([
        {
          id: 2,
          name: 'Pending',
          arbic_name: 'ممرضة  ',
          pass_status: 'nurse',
          status: false,
          key: 'hourlyschedule', title: 'Hourly Schedule'
        },

      ])
    } else if (user_type == "physiotherapy") {
      setRoutes([
        // { key: 'first', title: 'First' },
        // { key: 'second', title: 'Second' },
        {
          id: 1,
          name: 'Ongoing',
          arbic_name: 'الجميع ',
          pass_status: 'all',
          status: true,
          key: 'taskschedule', title: 'Task Schedule'
        }

      ])
    } else if (user_type == "doctor") {
      setRoutes([
        {
          id: 1,
          name: 'Ongoing',
          arbic_name: 'الجميع ',
          pass_status: 'all',
          status: true,
          key: 'onlinehomeschedule', title: 'Online & Home Visit Consultation'
        }

      ])
    } else if (user_type == "lab") {
      setRoutes([
        {
          id: 1,
          name: 'Ongoing',
          arbic_name: 'الجميع ',
          pass_status: 'all',
          status: true,
          key: 'labschedule', title: 'LAB Schedule'
        }

      ])
    }
  }

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'taskschedule':
        return <AvailabilitySchedule page={'taskschedule'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'hourlyschedule':
        return <AvailabilitySchedule page={'hourlyschedule'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'onlinehomeschedule':
        return <AvailabilitySchedule page={'onlinehomeschedule'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'labschedule':
        return <AvailabilitySchedule page={'labschedule'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
    }
  };


  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader onBackPress={() => {
        navigation.goBack();
      }} leftIcon navigation={navigation} title={Lang_chg.scheduleavailability_heading[config.language]} 
      style={{paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight}}/>
      <View
        style={{
          flex: 1,
          // paddingBottom: (mobileW * 2) / 100 
        }}

      >
        <View style={{
          flex: 1,
          // marginBottom: (mobileW * 2) / 100 
        }}>
          
          {/* tabheadings */}
          {
            (routes.length > 0) &&
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{
                width: layout.width,
                height: layout.height
              }}
              renderTabBar={renderTabBar}
            />
          }

        </View>
      </View>


    </View>
  );
}
