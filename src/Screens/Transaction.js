import React from 'react';
import { useWindowDimensions, Text, View, Dimensions, StatusBar } from 'react-native';
import { Colors, Font, mobileW } from '../Helpers/Utils';
import { TabView, TabBar } from 'react-native-tab-view';
import TransactionContainer from '../Containers/Transaction';
import Withdrawal from './Withdrawal';
import ScreenHeader from '../Components/ScreenHeader';

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

const routes = [
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

]

const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

export default Transaction = ({ navigation }) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'transaction':
        return <TransactionContainer page={'task'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
      case 'withdrawal':
        return <Withdrawal page={'hourly'} jumpTo={jumpTo} {...props} {...{ navigation }} />;
    }
  };

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
            title={'Transaction & More'}
            style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />



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