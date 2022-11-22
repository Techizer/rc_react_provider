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
import Appointment from './Appointment';
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



export default function Appointmenttab({ navigation }) {
  const layout = useWindowDimensions();
  const [tabname, setTabname] = React.useState("");
  const [noticount, setNoticount] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    // { key: 'first', title: 'First' },
    // { key: 'second', title: 'Second' },
    {
      id: 1,
      name: 'Ongoing',
      arbic_name: 'الجميع ',
      pass_status: 'all',
      status: true,
      key: 'ongoing', title: 'Ongoing'
    },
    {
      id: 2,
      name: 'Pending',
      arbic_name: 'ممرضة  ',
      pass_status: 'nurse',
      status: false,
      key: 'pending', title: 'Pending'
    },
    {
      id: 3,
      name: 'Upcoming',
      arbic_name: 'مساعد ممرض   ',
      pass_status: 'caregiver',
      status: false,
      key: 'upcoming', title: 'Upcoming'
    },
    {
      id: 4,
      name: 'Past',
      arbic_name: 'جليسه اطفال  ',
      pass_status: 'babysitter',
      status: false,
      key: 'past', title: 'Past'
    }
  ]);

  useEffect(() => {
    get_all_count()
  }, []);

  const get_all_count = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']

    let url = config.baseURL + "api-notification-count";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)

    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data, 1).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        // this.setState({ notification_count: obj.result })
        setNoticount(obj.result)
        console.log('notification_count', obj.result)
      } else {
        return false;
      }
    }).catch((error) => {
      this.getProfile()
      console.log("-------- error ------- " + error);
    })

  }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: 'white',
        height: (mobileW * 1) / 100,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
      }}
      style={{ backgroundColor: Colors.theme_color }}
      labelStyle={{
        textTransform: 'capitalize',
        fontSize: (mobileW * 3) / 100,
        textAlign: 'center',
        fontFamily: Font.fontsemibold,
      }}
      onTabPress={({ route, preventDefault }) => {
        console.log('onTabPress', route.key);
        setTabname(route.key)

        if (route.key === 'ongoing') {
          this.child.tapOnTabNavigator(route.key)
          // preventDefault();

          // Do something else
        } else if (route.key === 'pending') {
          this.child1.tapOnTabNavigator(route.key)
        } else if (route.key === 'upcoming') {
          this.child2.tapOnTabNavigator(route.key)
        } else if (route.key === 'past') {
          this.child3.tapOnTabNavigator(route.key)
        }
      }}
    />
  );

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'ongoing':
        return <Appointment ref={child => { this.child = child }} pageName={"ongoing"} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'pending':
        return <Appointment ref={child1 => { this.child1 = child1 }} pageName={"pending"} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'upcoming':
        return <Appointment ref={child2 => { this.child2 = child2 }} pageName={"upcoming"} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'past':
        return <Appointment ref={child3 => { this.child3 = child3 }} pageName={"past"} jumpTo={jumpTo} {...props} {...{ navigation }} />;
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
                    navigation.navigate('Home');
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
                <Text style={Styles.headertext}>{Lang_chg.MyAppointments[config.language]}
                  {/* {this.state.title == 'undefined'
                    ? Lang_chg.MyAppointments[config.language]
                    : this.state.title} */}

                  {/* {Lang_chg.MyAppointments[config.language]} */}
                </Text>
              </View>
              <View
                style={{
                  width: '10%',
                  alignSelf: 'center',

                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Notifications');
                  }}>
                  <Image
                    // tintColor="#fff"
                    // source={this.state.notification_count > 0 ? localimag.notifications : localimag.notifications_sec}
                    source={noticount > 0 ? localimag.notifications : localimag.notifications_sec}
                    style={{
                      alignSelf: 'center',
                      resizeMode: 'contain',
                      width: (mobileW * 6) / 100,
                      height: (mobileW * 6) / 100,
                    }}></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* tabheadings */}

          <TabView
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
          />

        </View>
      </View>


    </View>
  );
}
