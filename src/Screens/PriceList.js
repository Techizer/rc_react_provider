import React, { useEffect } from 'react';
import { useWindowDimensions, Text, View, Dimensions, Platform, StatusBar } from 'react-native';
import {
  Colors,
  Font,
  mobileW,
} from '../Helpers/Utils';

import Styles from '../Styles';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import PriceListContainer from '../Containers/PriceList';
import LabPackageListing from './LabPackageListing';
import ScreenHeader from '../Components/ScreenHeader';
import { useSelector } from 'react-redux';


const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

export default PriceList = ({ navigation }) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes, setRoutes] = React.useState([]);
  const [userType, setUserType] = React.useState('Price List');


  const {
    loginUserData
  } = useSelector(state => state.StorageReducer)


  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    let user_details = loginUserData
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log("user_typeuser_type:: ", user_type);
    const isPartOfHospital = ((loginUserData?.hospital_id != '' ) && (loginUserData?.hospital_id != null ))
    
    
    if (user_type == "nurse") {
      setRoutes([
        {
          id: 1,
          key: 'task', 
          title: 'Task'
        },
        {
          id: 2,
          key: 'hourly', 
          title: 'Hourly'
        },

      ])
    } else if (user_type == "caregiver" || user_type == "babysitter") {
      setRoutes([
        {
          id: 1,
          key: 'hourly', 
          title: 'Hourly'
        },

      ])
    } else if (user_type == "physiotherapy") {
      setRoutes([
        {
          id: 1,
          key: 'task', 
          title: 'Task'
        }

      ])
    } else if (user_type == "doctor") {
      if (isPartOfHospital) {
        setRoutes([
          {
            id: 1,
            key: 'onlineconsultation', 
            title: 'Online Consultation'
          }
        ])
      } else {
        setRoutes([
          {
            id: 1,
            key: 'onlineconsultation', 
            title: 'Online Consultation'
          },
          {
            id: 2,
            key: 'homeconsultation', 
            title: 'Home Consultation'
          }
        ])
      }
      
    } else if (user_type == "lab") {
      setUserType('Manage Tests & Packages')
      if (isPartOfHospital) {
        setRoutes([
          {
            id: 1,
            key: 'tests', 
            title: 'Tests'
          },
          {
            id: 2,
            key: 'packages', 
            title: 'Packages', 
            user_id: user_id
          }
        ])
      } else {
        setRoutes([
          {
            id: 1,
            key: 'tests', 
            title: 'Tests'
          },
          {
            id: 2,
            key: 'packages', 
            title: 'Packages', 
            user_id: user_id
          }
        ])
      }
      
    }
  }

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'task':
        return <PriceListContainer page={'task'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'hourly':
        return <PriceListContainer page={'hourly'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'onlineconsultation':
        return <PriceListContainer page={'onlineconsultation'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'homeconsultation':
        return <PriceListContainer page={'homeconsultation'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'tests':
        return <PriceListContainer page={'tests'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'packages':
        return <LabPackageListing providerId={route.user_id} page={'packages'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
    }
  };


const renderTabBar = props => {
  const objStyle = (routes.length !== 1) ? {} : {
    height: 0
  }
  return (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: Colors.Theme,
      height: (routes.length !== 1) ? ((mobileW * 0.75) / 100): 0,
    }}
    activeColor={Colors.Theme}
    inactiveColor={'#354052'}
    style={{ backgroundColor: '#F1F2F4', ...objStyle }}
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
  )
  }


  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
        }}

      >
        <View style={{
          flex: 1,
        }}>

          <ScreenHeader
            onBackPress={() => {
              navigation.goBack();
            }}
            leftIcon
            rightIcon={false}
            navigation={navigation}
            title={(routes.length !== 1) ? 'Price List': routes[0]?.title + ' Price List'}
/>
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
