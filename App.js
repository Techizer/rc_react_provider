

import React, { Component, useRef } from 'react';
import { Text,TouchableOpacity, Linking, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

import PushNotification from 'react-native-push-notification';
import { displayNotification } from './src/Helpers/BackgroundTask';

import { ApplicationContainerWrapper, AppConsumer } from './src/Containers/ApplicationContainerWrapper';
import MainStack from './src/Stacks/MainStack';
import { FBPushNotifications } from './src/Helpers/FirebasePushNotifications';
import { Configurations } from './src/Helpers/Utils';
import FlashMessage from "react-native-flash-message";
import moment from 'moment-timezone';
import { ScreenReferences } from './src/Stacks/ScreenReferences';

import * as Sentry from '@sentry/react-native';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { store, persistor } from './src/Redux/Store'
// import { Settings } from 'react-native-fbsdk-next';
import analytics from '@react-native-firebase/analytics';
import { MessageRoom } from './src/Schemas/MessageRoom';

Sentry.init({
  dsn: "https://02c63dd1da9049678fe535486d33409f@o4504395052482560.ingest.sentry.io/4504563977224192",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

global.MapAddress = 'NA';
global.screens = ScreenReferences.Splash;
console.reportErrorsAsExceptions = false;

// Settings.setAppID('255642823428638');
// Settings.setAdvertiserTrackingEnabled(true)

// Settings.initializeSDK()






function handleOpenURL(evt) {
  console.log(evt.url);
  // do something with the url
}

Linking.addEventListener('url', handleOpenURL);

const App = (props) => {

  const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null;

  useEffect(() => {
    // global.deviceTimezone = moment.tz.guess()
    // moment.tz.setDefault(global.deviceTimezone)
    FBPushNotifications.requestUserPermission();

  }, [])

  return (

    <Provider store={store}>
      <PersistGate persistor={persistor}>

        <ApplicationContainerWrapper {...props}>
          <AppConsumer>
            {funcs => {
              global.props = { ...funcs };
              return <MainStack {...funcs} />;
            }}
          </AppConsumer>
          <FlashMessage
            // style={{
            //   marginTop: Platform.OS == "ios" ? 0 : StatusBar.currentHeight,
            // }}
            position="top"
            animated={true}

          // titleStyle={{
          //   fontFamily: Font.Regular,
          //   fontSize: 20
          // }}
          />
        </ApplicationContainerWrapper>
      </PersistGate>
    </Provider>

  );

}

console.log({ DEV: __DEV__ });


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'white',
  },
  footer: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default Sentry.wrap(App);
// export default App;
