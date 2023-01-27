

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

Sentry.init({ 
  dsn: 'https://02c63dd1da9049678fe535486d33409f@o4504395052482560.ingest.sentry.io/4504563977224192', 
  enableNative: true,
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
class App extends Component {
  constructor(props) {
    super(props)
    this.language_set()
    global.deviceTimezone = moment.tz.guess()
    moment.tz.setDefault(global.deviceTimezone)
  }
  componentDidMount() {


    FBPushNotifications.requestUserPermission();
    // FBPushNotifications.NotificationsListener();



  }
  language_set = async () => {
    let languagecathc = await localStorage.getItemObject('languagecathc');
    let languagesetenglish = await localStorage.getItemObject('languagesetenglish');
    console.log('languagecathc languagesetenglish:: ', languagecathc, languagesetenglish);
    if (languagecathc == 0) {
      if (languagesetenglish == 3) {
        if (I18nManager.isRTL) {
          console.log('HI Vikas')
          I18nManager.forceRTL(false);
          I18nManager.allowRTL(false);

        }
        else {
          I18nManager.forceRTL(false);
          I18nManager.allowRTL(false);
        }


        localStorage.removeItem('languagecathc');
        localStorage.setItemObject('language', 0)
        localStorage.removeItem('languagesetenglish');
        RNRestart.Restart()
      }

      // I18nManager.forceRTL(false);
      // I18nManager.allowRTL(false);
      localStorage.setItemObject('languagesetenglish', 3);

    }else{
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      localStorage.setItemObject('languagesetenglish', 3);
    }
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    localStorage.setItemObject('languagesetenglish', 3);


    //// I18nManager.forceRTL(false);
    // Configurations.language = value;

  }
  render() {
    return (
      <NavigationContainer>
        <ApplicationContainerWrapper {...this.props}>
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
    );
  }
}

console.log({DEV: __DEV__});

export default Sentry.wrap(App);
