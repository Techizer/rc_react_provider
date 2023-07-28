import messaging from '@react-native-firebase/messaging';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { FBPushNotifications } from './FirebasePushNotifications';
import { getReduxState, setLogout, setUserData } from './ReduxStates';
import { API, Configurations } from './Utils';

const logout = async () => {
  const fcm_token = await FBPushNotifications.getFcmToken()
  const loginUserData = getReduxState().loginUserData;
  let url = Configurations.baseURL + "api-logout";
  var data = new FormData();
  data.append('user_id', loginUserData?.user_id)
  data.append('fcm_token', fcm_token)

  API.post(url, data, 1).finally(() => {
    setLogout()
  })

};

const CheckSession = async () => {
  let authStatus = false;
  const loginUserData = getReduxState().loginUserData;
  const userEmail = getReduxState().userEmail;
  const userPassword = getReduxState().userPassword;

  const fcmToken = await FBPushNotifications.getFcmToken()
  const credentials = userEmail && userPassword && userEmail != '' && userPassword != ''

  if (loginUserData !== null) {
    let url = Configurations.baseURL + "api-check-login";
    var data = new FormData();
    data.append("user_id", loginUserData?.user_id);
    data.append("fcm_token", fcmToken);

    await API.post(url, data, 1)
      .then((obj) => {
        if (obj.result == true) {
          authStatus = true;

          var device_lang
          if (Configurations.language == 0) {
            device_lang = 'ENG'
          }
          else {
            device_lang = 'AR'
          }

          // if (credentials) {

          //   let url = Configurations.baseURL + "api-service-provider-login";
          //   var data = new FormData();

          //   data.append('email', userEmail)
          //   data.append('password', userPassword)
          //   data.append('device_type', Configurations.device_type)
          //   data.append('device_lang', device_lang)
          //   data.append('fcm_token', fcmToken)
          //   data.append('user_type', loginUserData?.user_type)

          //   API.post(url, data, 1).then((obj) => {
          //     if (obj.status == true) {
          //       setUserData(fcmToken, obj.result)
          //       authStatus = true;

          //     }
          //     else {
          //       authStatus = false;
          //       logout()
          //     }
          //   }).catch((error) => {
          //     console.log('catch');
          //     authStatus = false;
          //     console.log("-------- error relogin ------- " + error);
          //   });

          // } else {
          //   console.log('second else');
          //   authStatus = false;
          //   logout()
          // }

        } else {
          console.log('last else');
          authStatus = false;
          logout()
        }
      })
      .catch((error) => {
        console.log("-------- error check login ------- " + error);
      });

  }
  else {

  }
  return authStatus;
}

export {
  CheckSession
}