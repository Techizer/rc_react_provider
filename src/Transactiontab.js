import React, { Component } from 'react';
import { useWindowDimensions, Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList, Dimensions, StatusBar } from 'react-native';
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
import Transaction from './Transaction';
import Withdrawal from './Withdrawal';
import ScreenHeader from './components/ScreenHeader';
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
      fontFamily: Font.SemiBold,
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
            fontFamily: Font.SemiBold,
          }}
        >
          {route.title}
        </Text>
      );
    }}
  />
);

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

export default function Transactiontab({ navigation }) {
  const layout = useWindowDimensions();

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
      key: 'transaction', title: 'Transaction'
    },
    {
      id: 2,
      name: 'Pending',
      arbic_name: 'ممرضة  ',
      pass_status: 'nurse',
      status: false,
      key: 'withdrawal', title: 'Withdrawal'
    },

  ]);

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'transaction':
        return <Transaction page={'task'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'withdrawal':
        return <Withdrawal page={'hourly'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
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
            rightIcon={false}
            navigation={navigation}
            title={'Transaction & More'}
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
          />

        </View>
      </View>


    </View>
  );
}
