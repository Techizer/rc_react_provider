import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
class FirebasePushNotifications {
  requestUserPermission = async () => {

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.getFcmToken()
    }
  }
  getFcmToken = async () => {
    // const fcmToken = await messaging().getToken()
    // if (fcmToken) {
    //   return fcmToken;
    //   //fcmtoken= fcmToken
    // } else {
    //   this.showAlert('Failed', 'No token received');
    // }

    try{
      const isPermissable = await messaging().hasPermission();
    if (isPermissable) {
      const fcmToken = await messaging().getToken()
      console.log('FPN Token: ', {isPermissable, fcmToken});
      return fcmToken
    } else {
      messaging().requestPermission()
        .then(() => { console.log("+++ PERMISSION REQUESTED +++++") })
        .catch(error => { console.log(" +++++ ERROR RP ++++ " + error) })
    }
    } catch(e) {
      console.log('Error >>>>>>>>>>>> ', e);
      return null
    }

    

  }
}
export const FBPushNotifications = new FirebasePushNotifications();