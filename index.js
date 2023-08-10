/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import App from './App';
import { name as appName } from './app.json';
import PushNotification from 'react-native-push-notification';
import VideoCall from './src/Components/VideoCall';
import { useSelector } from 'react-redux';
LogBox.ignoreAllLogs(true)

// AppRegistry.registerHeadlessTask('SomeTaskName', () =>
//   require('SomeTaskName'),
// );

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
    PushNotification.localNotification({
        channelId: "rootscares1",
        title: remoteMessage.data.title,
        message: remoteMessage.data.body,
        userInfo: remoteMessage.data,
        actions: remoteMessage.data?.type == "patient_to_doctor_video_call" ? '["Accept", "Reject"]' : [],
    });

});


AppRegistry.registerComponent(appName, () => App);