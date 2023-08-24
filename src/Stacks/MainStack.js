import React, { Component, useEffect, useMemo } from 'react';
import { Alert, AppState, Dimensions, Platform } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import BackgroundJob from 'react-native-background-actions';
import NetInfo from "@react-native-community/netinfo";

import Splash from '../Screens/Splash';
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import MyProfile from '../Screens/MyProfile';
import EditProfile from '../Screens/EditProfile';
import Home from '../Screens/Home';
import AppointmentsTabStack from './TabStacks/AppointmentsTabStack';
import AvailabilitySchedule from '../Screens/AvailabilitySchedule';
import PriceList from '../Screens/PriceList';
import LabPackageDetails from '../Screens/LabPackageDetails';
import Transaction from '../Screens/Transaction';
import Withdrawal from '../Screens/Withdrawal';
import SearchPlace from '../Screens/SearchPlace';
import AddBankInformation from '../Screens/AddBankInformation';
import ReviewRating from '../Screens/ReviewRating';
import More from '../Screens/More';

import TermsAndConditions from '../Screens/TermsAndConditions';
import ForgetPassword from '../Screens/ForgetPassword';
import Drawerscreen from '../Containers/Drawer';
import Notifications from '../Screens/Notifications';
import AppointmentsDetails from '../Screens/AppointmentsDetails';
import NeedSupport from '../Screens/NeedSupport';
import OTP from '../Screens/OTP';
import ServiceAddress from '../Screens/ServiceAddress';
import { ScreenReferences } from './ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { DeviceConnection, onUserLogout, setAppState, setLastScreen, setVideoCall, setVideoCallData, setVideoCallStatus } from '../Redux/Actions/UserActions';
import { NavigationContainer } from '@react-navigation/native';
import { useRef } from 'react';
import Chat from '../Screens/Chat';
import { FBPushNotifications } from '../Helpers/FirebasePushNotifications';
import { MessageFunctions } from '../Helpers/Message';
import { API } from '../Helpers/API';
import { Configurations } from '../Provider/configProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callRejectNotification, CheckSession, Network } from '../Helpers/APIFunctions';
import FileView from '../Screens/FileView';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// throw new Error("Sentry Testing - 13th February 2023 - RootScare Developers!");

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'exampleScheme://chat/jane',
  parameters: {
    delay: 1000,
  },
};

BackgroundJob.on('expiration', () => {
  console.log('iOS: I am being closed!');
});


const taskRandom = async (taskData) => {
  if (Platform.OS === 'ios') {
    console.warn(
      'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
      'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
    );
  }


  // For loop with a delay
  const { delay } = taskData;
  console.log(BackgroundJob.isRunning(), delay)
  for (let i = 0; BackgroundJob.isRunning(); i++) {
    console.log('Runned -> ', i);
    // await BackgroundJob.updateNotification({ taskDesc: 'Runned -> ' + i });
    await sleep(delay);
  }

};



function Mydrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: '100%' },
        drawerType: 'front',
      }}

      drawerContent={props => <Drawerscreen {...props} />}>
      <Drawer.Screen
        name={ScreenReferences.HomeDrawer}
        options={{

          headerShown: false,

        }}
        component={Home}
      />
    </Drawer.Navigator>
  );
}

const MainStack = navigation => {
  const dispatch = useDispatch()
  const navRef = useRef()
  const routeNameRef = useRef();

  const {
    loginUserData,
    profileCompletion,
    appState
  } = useSelector(state => state.StorageReducer)


  const toggleBackground = async () => {
    let playing = BackgroundJob.isRunning();

    playing = !playing;
    if (playing) {
      try {
        console.log('Trying to start background service');
        await BackgroundJob.start(taskRandom, options);
        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundJob.stop();
    }
  };

  const Logout = async () => {
    let ID = await AsyncStorage.getItem('userId')
    const fcm_token = await FBPushNotifications.getFcmToken()
    let url = Configurations.baseURL + "api-logout";
    var data = new FormData();
    data.append('user_id', ID)
    data.append('fcm_token', fcm_token)

    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        routeNameRef?.current.reset({
          index: 0,
          routes: [{ name: ScreenReferences.Login }],
        });
      } else {
        setTimeout(() => {
          MessageFunctions.showError(obj.message)
        }, 700);
        return false;
      }
    }).catch((error) => {
    })

  }

  const configureNotifications = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        let data = (Platform.OS == "ios") ? JSON.parse(notification.data.notidata) : notification.data
        var videoDetails = {
          fromUserId: data.fromUserId,
          fromUserName: data.fromUserName,
          order_id: data.order_id,
          room_name: data.room_name,
          toUserId: data.toUserId,
          toUserName: data.toUserName,
          type: data.type,
          image: data.image,
          isPage: "accept",
        };
        dispatch(setVideoCallData(videoDetails))

        if (Platform.OS == 'ios') {
          if (notification.userInteraction) {
            if (notification.data?.type == "patient_to_doctor_video_call") {
              Alert.alert(
                "Incoming Video call",
                data.message,
                [
                  {
                    text: "Reject",
                    onPress: () => {
                      console.log("Cancel Pressed");
                      callRejectNotification(data)
                    },
                    style: "cancel",
                  },
                  {
                    text: "Accept",
                    onPress: () => {
                      console.log("Accept Pressed", data.image);
                      setTimeout(() => {
                        dispatch(setVideoCall(true))
                        dispatch(setVideoCallStatus(8))
                      }, 500);
                    },
                    style: "default",
                  },
                ],
                {
                  cancelable: true,
                }
              )
            }
          }
        } else {
          if (notification.action === 'Accept') {
            console.log('if pressed');
            if (notification.data?.type == "patient_to_doctor_video_call") {
              setTimeout(() => {
                dispatch(setVideoCall(true))
                dispatch(setVideoCallStatus(8))
              }, 1000);
            }
          } else if (notification.action === 'Reject') {
            callRejectNotification(data)
          } else {
            console.log('waiting...');
          }
        }




      },
    });

  }

  const onRemoteNotification = (notification) => {
    // const isClicked = notification.getData().userInteraction === 1;

    const result = PushNotificationIOS.FetchResult.NoData;
    notification.finish(result);
  };

  const showNotification = (remoteMessage) => {
    PushNotification.localNotification({
      channelId: "rootscares1",
      title: remoteMessage.data.title,
      message: remoteMessage.data.body,
      userInfo: remoteMessage.data,
      actions: remoteMessage.data?.type == "patient_to_doctor_video_call" ? '["Accept", "Reject"]' : [],
      playSound: true
    });

  };


  const messageListener = async () => {
    PushNotification.createChannel(
      {
        channelId: "rootscares1",
        channelName: "rootscare messasge",
        smallIcon: "app_icon",
        importance: 4,
        vibrate: true,
        ignoreInForeground: false,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    )
    // --------------------------------------

    messaging().onMessage(async (remoteMessage) => {
      console.log("Notification msg****", remoteMessage);
      if (remoteMessage) {
        if (Platform.OS === 'ios' && !remoteMessage.collapseKey) {
          if (remoteMessage.data?.type == "doctor_to_patient_video_call_reject") {
            dispatch(setVideoCallStatus(9))
          } else {
            showNotification(remoteMessage)
            if (remoteMessage.data?.type == "Logout") {
              Logout();
            }
          }

        } else {
          if (remoteMessage.data?.type == "doctor_to_patient_video_call_reject") {
            dispatch(setVideoCallStatus(9))
          } else {
            showNotification(remoteMessage)
            if (remoteMessage.data?.type == "Logout") {
              Logout();
            }
          }
        }
      }

    });


    // When the application is opened from a quit state.
    messaging().getInitialNotification()
      .then(async remoteMessage => {
        // console.log('getInitialNotification', remoteMessage);
      });

    // When the application is running, but in the background.
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('AppBackgroundNotification', remoteMessage);
    });
  }



  useEffect(() => {
    configureNotifications()
    messageListener()
    // toggleBackground()
  }, [])

  useEffect(() => {
    appStateSubscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        console.log("nextAppState", nextAppState);
        dispatch(setAppState(nextAppState))
        if (nextAppState == 'inactive' || nextAppState == 'background') {

        }
        if (nextAppState === "active") {
        }

      }
    );
    return () => appStateSubscription.remove()
  }, [])

  useEffect(() => {
    const type = 'notification';
    PushNotificationIOS.addEventListener(type, onRemoteNotification);
    return () => {
      PushNotificationIOS.removeEventListener(type);
    };
  }, []);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      dispatch(DeviceConnection(state.isConnected))
    });
    const checkConnectivity = NetInfo.addEventListener(state => {
      Network(state)
    });
    return () => {
      checkConnectivity()
    }
  }, [])

  // useMemo(() => {
  //   if (appState === 'active') {
  //     console.log('routeName', routeNameRef?.current?.getCurrentRoute()?.name);
  //     const currentRoute = (
  //       routeNameRef?.current?.getCurrentRoute()
  //       &&
  //       routeNameRef?.current?.getCurrentRoute()?.name != ScreenReferences.Splash
  //       &&
  //       routeNameRef?.current?.getCurrentRoute()?.name != ScreenReferences.Login
  //       &&
  //       routeNameRef?.current?.getCurrentRoute()?.name != ScreenReferences.Signup
  //       &&
  //       routeNameRef?.current?.getCurrentRoute()?.name != ScreenReferences.ForgotPassword
  //       &&
  //       routeNameRef?.current?.getCurrentRoute()?.name != ScreenReferences.TermsAndConditions
  //       &&
  //       routeNameRef?.current?.getCurrentRoute()?.name != ScreenReferences.OTP
  //     )
  //     CheckSession().then((authStatus) => {
  //       if (!authStatus) {
  //         if (currentRoute) {
  //           routeNameRef?.current.reset({
  //             index: 0,
  //             routes: [{ name: ScreenReferences.Login }],
  //           });
  //         }
  //       }
  //     }).catch((error) => {
  //       console.log(error);
  //     })
  //   }
  // }, [appState])



  return (
    <NavigationContainer onStateChange={(r) => {
      let sName = r.routes[r.index].name
      if (sName != ScreenReferences.VideoCall && sName != ScreenReferences.Home) {

        dispatch(setLastScreen(sName))
      }
    }}
      ref={routeNameRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        initialRouteName={ScreenReferences.Splash}>

        <Stack.Screen
          name={ScreenReferences.Splash}
          component={Splash}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenReferences.AppointmentDetails}
          component={AppointmentsDetails}
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
          name={ScreenReferences.AppointmentsTabStack}
          component={AppointmentsTabStack}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Stack.Screen
          name={ScreenReferences.ChatScreen}
          component={Chat}
          options={{ headerShown: false, gestureEnabled: true }}
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
          component={SearchPlace}
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

        <Stack.Screen
          name={ScreenReferences.FileView}
          component={FileView}
          options={{ headerShown: false, gestureEnabled: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MainStack;
