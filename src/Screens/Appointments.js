import React, { Component, useEffect } from 'react';
import { useWindowDimensions, View, Dimensions, Platform, StatusBar } from 'react-native';
import {
  Colors,
  Font,
  Configurations,
  mobileW,
  LanguageConfiguration,
  API,
} from '../Helpers/Utils';

import { TabView, TabBar } from 'react-native-tab-view';
import AppointmentContainer from '../Containers/Appointment';
import ScreenHeader from '../Components/ScreenHeader';
import { useSelector } from 'react-redux';

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

export default Appointments = ({ navigation }) => {
  const layout = useWindowDimensions();
  const [tabname, setTabname] = React.useState("");
  const [noticount, setNoticount] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    // { key: 'first', title: 'First' },
    // { key: 'second', title: 'Second' },
    {
      id: 3,
      name: 'Upcoming',
      arbic_name: 'مساعد ممرض   ',
      pass_status: 'caregiver',
      status: false,
      key: 'upcoming', title: 'Upcoming'
    },
    {
      id: 1,
      name: 'Ongoing',
      arbic_name: 'الجميع ',
      pass_status: 'all',
      status: true,
      key: 'ongoing', title: 'Ongoing'
    },
    // {
    //   id: 2,
    //   name: 'Pending',
    //   arbic_name: 'ممرضة  ',
    //   pass_status: 'nurse',
    //   status: false,
    //   key: 'pending', title: 'Pending'
    // },
    
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

  
  const {
    loginUserData
  } = useSelector(state => state.Auth)


  const get_all_count = async () => {
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
      this.getProfile()
      console.log("-------- error ------- " + error);
    })

  }

  const renderTabBar = (props) => {
    console.log({props});
    console.log({navstate: props.navigationState});
    return (
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
      />
    );
  }

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'ongoing':
        return <AppointmentContainer pageName={"ongoing"} jumpTo={jumpTo} {...{ navigation }} />;
      // case 'pending':
      //   return <AppointmentContainer ref={child1 => { this.child1 = child1 }} pageName={"pending"} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'upcoming':
        return <AppointmentContainer pageName={"upcoming"} jumpTo={jumpTo} {...{ navigation }} />;
      case 'past':
        return <AppointmentContainer pageName={"past"} jumpTo={jumpTo} {...{ navigation }} />;
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
