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
import Appointments from '../Screens/Appointments';
import VideoCall from '../Screens/VideoCall';
import AvailabilitySchedule from '../Screens/AvailabilitySchedule';
// import AvailabilitySchedule from '../Screens/AvailabilitySchedule';
import PriceList from '../Screens/PriceList';
// import PriceList from '../PriceList';
// import LabPackageListing from '../LabPackageListing';
import LabPackageDetails from '../Screens/LabPackageDetails';
import Transaction from '../Screens/Transaction';
// import Transaction from '../Transaction';
import Withdrawal from '../Screens/Withdrawal';
import AddBankInformation from '../Screens/AddBankInformation';
import ReviewRating from '../Screens/ReviewRating';
import More from '../Screens/More';

import TermsAndConditions from '../Screens/TermsAndConditions';
import ForgetPassword from '../Screens/ForgetPassword';
import Drawerscreen from '../Containers/Drawer';
import Notifications from '../Screens/Notifications';
import AppointmentDetails from '../Screens/AppointmentDetails';
import NeedSupport from '../Screens/NeedSupport';
import OTP from '../Screens/OTP';
import ServiceAddress from '../Screens/ServiceAddress';
import { SearchPlaceScreen } from '../Components';
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
        component={NeedSupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ScreenReferences.Notifications}
        component={Notifications}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name={ScreenReferences.ForgotPassword}
        component={ForgetPassword}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.TermsAndConditions}
        component={TermsAndConditions}
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
        component={Appointments}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.AvailabilityScheduleTabStack}
        component={AvailabilitySchedule}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.PriceListTabStack}
        component={PriceList}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name={ScreenReferences.ServiceAddress}
        component={ServiceAddress}
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
        component={Transaction}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      
      <Stack.Screen
        name={ScreenReferences.Withdrawal}
        component={Withdrawal}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      <Stack.Screen
        name={ScreenReferences.AddBankInformation}
        component={AddBankInformation}
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
        component={OTP}
        options={{ headerShown: false, gestureEnabled: false }}
      />

    </Stack.Navigator>
  );
};
export default Stacknav;
