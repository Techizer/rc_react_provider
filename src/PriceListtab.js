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
import PriceList from './PriceList';
import LabPackageListing from './LabPackageListing';
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
  const [userType, setUserType] = React.useState('Price List');

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
          key: 'task', title: 'Task'
        },
        {
          id: 2,
          name: 'Pending',
          arbic_name: 'ممرضة  ',
          pass_status: 'nurse',
          status: false,
          key: 'hourly', title: 'Hourly'
        },

      ])
    } else if (user_type == "caregiver" || user_type == "babysitter") {
      setRoutes([
        // { key: 'first', title: 'First' },
        // { key: 'second', title: 'Second' },
        {
          id: 2,
          name: 'Pending',
          arbic_name: 'ممرضة  ',
          pass_status: 'nurse',
          status: false,
          key: 'hourly', title: 'Hourly'
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
          key: 'task', title: 'Task'
        }

      ])
    }
    else if (user_type == "doctor") {
      setRoutes([
        // { key: 'first', title: 'First' },
        // { key: 'second', title: 'Second' },
        {
          id: 1,
          name: 'Ongoing',
          arbic_name: 'الجميع ',
          pass_status: 'all',
          status: true,
          key: 'onlineconsultation', title: 'Online Consultation'
        },
        {
          id: 1,
          name: 'Ongoing',
          arbic_name: 'الجميع ',
          pass_status: 'all',
          status: true,
          key: 'homeconsultation', title: 'Home Consultation'
        }
      ])
    } else if (user_type == "lab") {
      setUserType('Manage Tests & Packages')
      setRoutes([
        // { key: 'first', title: 'First' },
        // { key: 'second', title: 'Second' },
        {
          id: 1,
          name: 'Ongoing',
          arbic_name: 'الجميع ',
          pass_status: 'all',
          status: true,
          key: 'tests', title: 'Tests'
        },
        {
          id: 1,
          name: 'Ongoing',
          arbic_name: 'الجميع ',
          pass_status: 'all',
          status: true,
          key: 'packages', title: 'Packages', user_id: user_id
        }
      ])
    }
  }

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'task':
        return <PriceList page={'task'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'hourly':
        return <PriceList page={'hourly'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'onlineconsultation':
        return <PriceList page={'onlineconsultation'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'homeconsultation':
        return <PriceList page={'homeconsultation'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'tests':
        return <PriceList page={'tests'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'packages':
        return <LabPackageListing providerId={route.user_id} page={'packages'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
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

                <Text style={Styles.headertext}>{userType}
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
