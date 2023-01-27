

import React, { Component } from 'react';
import { I18nManager, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationContainerWrapper, AppConsumer } from './src/Containers/ApplicationContainerWrapper';
import Stacknav from './src/Stacks/Routenavigation';
import { FBPushNotifications } from './src/Helpers/FirebasePushNotifications';
import { Colors, Font, mobileH, MessageFunctions, MessageTexts, Configurations, mobileW, localStorage } from './src/Helpers/Utils';
import FlashMessage from "react-native-flash-message";
import RNRestart from 'react-native-restart';
import moment from 'moment-timezone';
import { ScreenReferences } from './src/Stacks/ScreenReferences';

import * as Sentry from '@sentry/react-native';
import { useEffect } from 'react';
import { persistor, store } from './src/Redux/Store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

Sentry.init({
  dsn: 'https://02c63dd1da9049678fe535486d33409f@o4504395052482560.ingest.sentry.io/4504563977224192',
  enableNative: false,
  integrations: [
    new Sentry.ReactNativeTracing({
      tracingOrigins: ["localhost", Configurations.baseURL, /^\//],
    }),
  ],
});

global.MapAddress = 'NA';
global.screens = ScreenReferences.Splash;
global.fcmtoken = '123456'
console.reportErrorsAsExceptions = false;

const App = (props) => {
  useEffect(() => {
    global.deviceTimezone = moment.tz.guess()
    moment.tz.setDefault(global.deviceTimezone)
    FBPushNotifications.requestUserPermission();
  }, [])

  return (

    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <ApplicationContainerWrapper {...props}>
            <AppConsumer>
              {funcs => {
                global.props = { ...funcs };
                return <Stacknav {...funcs} />;
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
        </NavigationContainer>
      </PersistGate>
    </Provider>

  );

}

console.log({ DEV: __DEV__ });

export default Sentry.wrap(App);
