

import React, { Component, useRef } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { ApplicationContainerWrapper, AppConsumer } from './src/Containers/ApplicationContainerWrapper';
import Stacknav from './src/Stacks/Routenavigation';
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
import { AppState } from 'react-native';
import { Settings } from 'react-native-fbsdk-next';
import analytics from '@react-native-firebase/analytics';

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

Settings.setAppID('255642823428638');
Settings.setAdvertiserTrackingEnabled(true)

Settings.initializeSDK()

const App = (props) => {
  useEffect(() => {
    global.deviceTimezone = moment.tz.guess()
    moment.tz.setDefault(global.deviceTimezone)
    FBPushNotifications.requestUserPermission();
    
  }, [])
  
  const routeNameRef = useNavigationContainerRef()

  console.log({routeNameRef});

  return (

    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer onStateChange={async (a) => {
          console.log({key: a});
          
          const previousRouteName = routeNameRef.current;
          const currentRouteName = a.routeNames[a.index]

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
              app: 'Provider',
              mode: __DEV__ ? 'Development': 'Production',
            });
          }
          routeNameRef.current = currentRouteName;
        }}>
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
