import messaging from '@react-native-firebase/messaging';
import { FBPushNotifications } from './FirebasePushNotifications';
import { getReduxState, setConnection, setLogout, setUserData } from './ReduxStates';
import { API, Configurations } from './Utils';
import NetInfo from "@react-native-community/netinfo";
import { UserTypes } from './Constants';
import { store } from '../Redux/Store';
import { setNotificationCount, setNotificationsData } from '../Redux/Actions/UserActions';

const Network = (state) => {
  setConnection(state.isConnected)
}


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

const callRejectNotification = async (details) => {

  let apiName = "api-video-call-reject-notification";
  let url = Configurations.baseURL + apiName;
  var data = new FormData();
  data.append("fromUserId", details?.fromUserId);
  data.append("fromUserName", details.fromUserName);
  data.append("order_id", details.order_id);
  data.append("room_name", details.room_name);
  data.append("toUserId", details.toUserId);
  data.append("toUserName", details.toUserName);
  data.append("type", "patient_to_doctor_video_call_reject");
  data.append('callStatus', 'reject')

  API.post(url, data, 1)
    .then((obj) => {
      if (obj.status == true) {
      } else {
        return false;
      }
    }).catch((error) => {
      console.log("callRejectNotification-error ------- " + error);
    });
};

const getSpecialities = async (i) => {
  try {
    const url = Configurations.baseURL + "api-provider-get-speciality";
    const data = new FormData();
    data.append('service_type', UserTypes[i].value)

    const obj = await API.post(url, data, 1);

    if (obj.status == true) {
      // console.log('specialities...', obj);
      const modifiedResult = obj.result.map(item => ({ title: item.name, value: item.name }));
      return modifiedResult;
    } else {
      return false;
    }
  } catch (error) {
    console.log("getSpecialities-error ------- " + error);
    return false;
  }

}

const getServiceCountries = async () => {
  try {
    const url = Configurations.baseURL + "api-medical-service-area";

    const obj = await API.get(url, 1)
    if (obj.status == true) {
      // console.log('countries...', obj.result);
      const modifiedResult = obj.result.map(item => ({ title: item.country_short_code, value: item.country_code, name: item.name }));
      return modifiedResult
    } else {
      return false;
    }

  } catch (error) {
    console.log("getServiceCountries-error ------- " + error);
  }
}

const getNotifications = async (loader = false) => {

  let url = Configurations.baseURL + "api-get-all-notification";

  const loginUserData = getReduxState().loginUserData;

  var data = new FormData();
  data.append('id', loginUserData?.user_id)

  API.post(url, data, 1).then((obj) => {

    if (obj.status == true) {
      // console.log({ notis: obj?.result });
      if (obj.result && obj.result.length > 0) {
        store.dispatch(setNotificationCount(obj?.result))
      } else {
        store.dispatch(setNotificationCount(0))
      }
    } else {
      store.dispatch(setNotificationCount(0))
      return false;
    }
  }).catch((error) => {
    store.dispatch(setNotificationCount(0))
    console.log("-------- error getting notifications ------- ", error)
  })
}



export {
  Network,
  CheckSession,
  callRejectNotification,
  getSpecialities,
  getServiceCountries,
  getNotifications
}