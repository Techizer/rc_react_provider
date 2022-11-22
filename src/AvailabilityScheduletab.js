import React, { Component, useEffect } from 'react';
import { useWindowDimensions, Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList } from 'react-native';
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

import Styles from './Styles';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AvailabilitySchedule from './AvailabilitySchedule';
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

// const FirstRoute = props => (
//   <Appointment {...props} />
// );

// const SecondRoute = props => (
//   <Appointment {...props} />
// );



// const renderScene = SceneMap({
//   ongoing: FirstRoute,
//   pending: SecondRoute,
//   upcoming: FirstRoute,
//   past: SecondRoute,
// });

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: Colors.textblue,
      height: (mobileW * 1) / 100,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    }}
    style={{ backgroundColor: '#EDEEF1' }}
    labelStyle={{
      textTransform: 'capitalize',
      fontSize: (mobileW * 3.5) / 100,
      textAlign: 'center',
      fontFamily: Font.fontsemibold,
      // color: Colors.textblue,
    }}
    renderLabel={({ focused, route }) => {
      return (
        <Text
          // size={20}
          // category="Medium"
          // color={focused ? 'BLACK' : 'GRAY3'}
          style={{
            color: (focused) ? Colors.textblue : Colors.splashtextcolor,
            textTransform: 'capitalize',
            fontSize: (mobileW * 3.5) / 100,
            textAlign: 'center',
            fontFamily: Font.fontsemibold,
          }}
        >
          {route.title}
        </Text>
      );
    }}
  />
);

export default function Appointmenttab({ navigation }) {
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

  return (
    <View style={{ flex: 1 }}>
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
          {/* <Text>Home</Text> */}

          {/* header */}
          <View style={{ backgroundColor: 'white' }}>
            <View
              style={{
                flexDirection: 'row',
                width: '98%',
                alignSelf: 'center',
                paddingVertical: (mobileW * 3) / 100,
                backgroundColor: Colors.white_color,
                alignItems: 'center'
                // backgroundColor: 'red',
              }}>
              <View
                style={{
                  width: '10%',
                  // backgroundColor: 'pink',
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    // navigation.navigate('Home');
                    navigation.goBack();
                  }}>
                  {config.language == 0 ?
                    <Image
                      source={localimag.leftarrow}
                      style={{
                        resizeMode: 'contain',
                        width: (mobileW * 9) / 100,
                        alignSelf: 'center',
                        height: (mobileW * 9) / 100,
                      }}></Image> :
                    <Image
                      source={localimag.arabic_back}
                      style={{
                        resizeMode: 'contain',
                        width: (mobileW * 9) / 100,
                        alignSelf: 'center',
                        height: (mobileW * 9) / 100,
                      }}></Image>}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  // backgroundColor: 'yellow',
                  width: '80%',
                }}>

                <Text style={Styles.headertext}>{Lang_chg.scheduleavailability_heading[config.language]}
                  {/* {this.state.title == 'undefined'
                    ? Lang_chg.MyAppointments[config.language]
                    : this.state.title} */}

                  {/* {Lang_chg.MyAppointments[config.language]} */}
                </Text>
              </View>

            </View>
          </View>

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
