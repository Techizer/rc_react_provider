import React, { Component, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Splash from '../Screens/Splash';
import Login from '../Screens/Login';
import Signup from '../Signup';
import Optpage from '../Optpage';
import MyProfile from '../MyProfile';
import Editprofile from '../Editprofile';
import Home from '../Screens/Home';
import Appointment from '../Appointment';
import Appointmenttab from '../Appointmenttab';
import VideoCall from '../VideoCall';
import AvailabilityScheduletab from '../AvailabilityScheduletab';
import AvailabilitySchedule from '../AvailabilitySchedule';
import PriceListtab from '../PriceListtab';
import PriceList from '../PriceList';
import LabPackageListing from '../LabPackageListing';
import LabPackageDetails from '../LabPackageDetails';
import Transactiontab from '../Transactiontab';
import Transaction from '../Transaction';
import Withdrawal from '../Withdrawal';
import AddBank from '../AddBank';
import ReviewRating from '../ReviewRating';
import More from '../More';

import Tremsandcondition from '../Tremsandcondition';
import Forgotpage from '../Forgotpage';
import Drawerscreen from '../Drawerscreen';
import Notifications from '../Notifications';
import Appointmentdetails from '../Screens/Appointmentdetails';
import Needsupport from '../Needsupport';
import Otp_forget from '../Otp_forget';
import ServiceAddressF1 from '../Components/ServiceAddressF1';
import { SearchPlaceScreen } from '../Components';
import { apifuntion } from '../Provider/Apicallingprovider/apiProvider';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function Mydrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: '100%' },
        drawerType: 'front',
      }}

      drawerContent={props => <Drawerscreen {...props} />}>
      <Drawer.Screen
        name="Home"
        options={{

          headerShown: false,

        }}
        component={Home}
      />
    </Drawer.Navigator>
  );
}
const Stacknav = navigation => {
  useEffect(() => {

  }, [])
  return (
    <Stack.Navigator initialRouteName={'Splash'}>
      {/* 3 march radhekrishan */}

      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      
      <Stack.Screen
        name="Appointmentdetails"
        component={Appointmentdetails}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Needsupport"
        component={Needsupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="Forgotpage"
        component={Forgotpage}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Tremsandcondition"
        component={Tremsandcondition}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Optpage"
        component={Optpage}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Editprofile"
        component={Editprofile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Mydrawer}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="VideoCall"
        component={VideoCall}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Appointment"
        component={Appointment}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Appointmenttab"
        component={Appointmenttab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="AvailabilityScheduletab"
        component={AvailabilityScheduletab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="AvailabilitySchedule"
        component={AvailabilitySchedule}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="PriceListtab"
        component={PriceListtab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="PriceList"
        component={PriceList}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="ServiceAddressF1"
        component={ServiceAddressF1}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="SearchPlaceScreen"
        component={SearchPlaceScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="LabPackageListing"
        component={LabPackageListing}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      
      <Stack.Screen
        name="LabPackageDetails"
        component={LabPackageDetails}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Transactiontab"
        component={Transactiontab}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Transaction"
        component={Transaction}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="AddBank"
        component={AddBank}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="ReviewRating"
        component={ReviewRating}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="More"
        component={More}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name="Otp_forget"
        component={Otp_forget}
        options={{ headerShown: false, gestureEnabled: false }}
      />

    </Stack.Navigator>
  );
};
export default Stacknav;
