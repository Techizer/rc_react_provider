import React, { useEffect } from 'react';
import { useWindowDimensions, Text, View, Dimensions, StatusBar } from 'react-native';
import { Colors, Font, Configurations, mobileW, LanguageConfiguration } from '../Helpers/Utils';
import { TabView, TabBar } from 'react-native-tab-view';
import AvailabilityScheduleContainer from '../Containers/AvailabilitySchedule';
import ScreenHeader from '../Components/ScreenHeader';
import { useSelector } from 'react-redux';

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: Colors.Theme,
      height: 0
    }}
    activeColor={Colors.Theme}
    inactiveColor={'#354052'}
    style={{ backgroundColor: '#F1F2F4', height: 0 }}
    labelStyle={{
      textTransform: 'capitalize',
      fontSize: (mobileW * 3.25) / 100,
      textAlign: 'center',
      fontFamily: Font.Regular,
    }}
    renderLabel={({ focused, route }) => {
      return (
        <Text
          style={{
            color: (focused) ? Colors.textblue : Colors.splashtextcolor,
            textTransform: 'capitalize',
            fontSize: (mobileW * 3.5) / 100,
            textAlign: 'center',
            fontFamily: Font.Regular,
          }}
        >
          {route.title}
        </Text>
      );
    }}
  />
);

export default AvailabilitySchedule = ({ navigation }) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);

  useEffect(() => {
    // Update the document title using the browser API
    getUserData();
  }, []);


  const {
    loginUserData
  } = useSelector(state => state.StorageReducer)


  const getUserData = async () => {
    let user_id = loginUserData['user_id']
    let user_type = loginUserData['user_type']
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
          key: 'taskschedule', title: 'Time Schedule'
        },
        // {
        //   id: 2,
        //   name: 'Pending',
        //   arbic_name: 'ممرضة  ',
        //   pass_status: 'nurse',
        //   status: false,
        //   key: 'hourlyschedule', title: 'Hourly Schedule'
        // },

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
        return <AvailabilityScheduleContainer page={'taskschedule'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'hourlyschedule':
        return <AvailabilityScheduleContainer page={'hourlyschedule'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'onlinehomeschedule':
        return <AvailabilityScheduleContainer page={'onlinehomeschedule'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'labschedule':
        return <AvailabilityScheduleContainer page={'labschedule'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
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
      }} leftIcon navigation={navigation} title={LanguageConfiguration.scheduleavailability_heading[Configurations.language]} 
      />
      <View
        style={{
          flex: 1,
        }}

      >
        <View style={{
          flex: 1,
        }}>
          
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
