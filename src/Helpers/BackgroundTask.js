import PushNotification from 'react-native-push-notification';

module.exports = async taskData => {
    const notificationOptions = {
        title: 'Background Task',
        message:  'This is a notification from the background task.',
      };
    
      PushNotification.localNotification(notificationOptions);
  };

