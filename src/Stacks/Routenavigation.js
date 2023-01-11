import React, { Component, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Splash from '../Screens/Splash';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import MyProfile from '../Screens/MyProfile';
import EditProfile from '../Screens/EditProfile';
import Home from '../Screens/Home';
// import Appointment from '../Screens/Appointment';
import Appointmenttab from '../Appointmenttab';
import VideoCall from '../VideoCall';
import AvailabilityScheduletab from '../AvailabilityScheduletab';
// import AvailabilitySchedule from '../Screens/AvailabilitySchedule';
import PriceListtab from '../PriceListtab';
// import PriceList from '../PriceList';
// import LabPackageListing from '../LabPackageListing';
import LabPackageDetails from '../LabPackageDetails';
import Transactiontab from '../Transactiontab';
// import Transaction from '../Transaction';
import Withdrawal from '../Withdrawal';
import AddBank from '../AddBank';
import ReviewRating from '../ReviewRating';
import More from '../More';

import Tremsandcondition from '../Tremsandcondition';
import Forgotpage from '../Forgotpage';
import Drawerscreen from '../Drawerscreen';
import Notifications from '../Notifications';
import AppointmentDetails from '../Screens/AppointmentDetails';
import Needsupport from '../Needsupport';
import Otp_forget from '../Otp_forget';
import ServiceAddressF1 from '../Components/ServiceAddressF1';
import { SearchPlaceScreen } from '../Components';
import { apifuntion } from '../Provider/Apicallingprovider/apiProvider';
import { ScreenReferences } from './ScreenReferences';
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
        name={ScreenReferences.Home}
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
    <Stack.Navigator initialRouteName={ScreenReferences.Splash}>
      
      <Stack.Screen
        name={ScreenReferences.Splash}
        component={Splash}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      
      <Stack.Screen
        name={ScreenReferences.AppointmentDetails}
        component={AppointmentDetails}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.NeedSupport}
        component={Needsupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ScreenReferences.Notifications}
        component={Notifications}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name={ScreenReferences.ForgotPassword}
        component={Forgotpage}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.TermsAndConditions}
        component={Tremsandcondition}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name={ScreenReferences.Login}
        component={Login}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.Signup}
        component={Signup}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.ShowProfile}
        component={MyProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ScreenReferences.EditProfile}
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ScreenReferences.Home}
        component={Mydrawer}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.VideoCall}
        component={VideoCall}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.AppointmentTabStack}
        component={Appointmenttab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.AvailabilityScheduleTabStack}
        component={AvailabilityScheduletab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.PriceListTabStack}
        component={PriceListtab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.ServiceAddress}
        component={ServiceAddressF1}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.SearchPlace}
        component={SearchPlaceScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.LabPackageDetails}
        component={LabPackageDetails}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name={ScreenReferences.TransactionTabStack}
        component={Transactiontab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      
      <Stack.Screen
        name={ScreenReferences.Withdrawal}
        component={Withdrawal}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name={ScreenReferences.AddBank}
        component={AddBank}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name={ScreenReferences.ReviewRating}
        component={ReviewRating}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name={ScreenReferences.More}
        component={More}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name={ScreenReferences.OTP}
        component={Otp_forget}
        options={{ headerShown: false, gestureEnabled: false }}
      />

    </Stack.Navigator>
  );
};
export default Stacknav;
