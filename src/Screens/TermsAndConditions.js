import React from 'react'
import { View, StyleSheet, Dimensions, StatusBar, Platform } from 'react-native'
import { WebView } from 'react-native-webview';
import { Colors, mobileW, Configurations, LanguageConfiguration } from '../Helpers/Utils'
import ScreenHeader from '../Components/ScreenHeader';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default TermsAndConditions = ({ navigation, route }) => {

  const {pageName, contentArray, content} = route?.params

  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScreenHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        leftIcon
        rightIcon={false}
        navigation={navigation}
        title={(() => {
          if (pageName == 0) return LanguageConfiguration.AboutRootscare[Configurations.language]
          if (pageName == 2) return LanguageConfiguration.TermsandConditions[Configurations.language]
          if (pageName == 1) return LanguageConfiguration.PrivacyPolicy[Configurations.language]
        })()}
        style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

      {Configurations.language == 1 ?
        <WebView
          style={styles.webview}
          source={{ uri: contentArray }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true} /> :
        <WebView
          style={styles.webview}
          source={{ uri: content }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true} />
      }
    </View>
  );

}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#fff',
    width: deviceWidth,
    height: deviceHeight,
  },
  header_view: {
    backgroundColor: '#fff',
    paddingVertical: mobileW * 3 / 100,
    borderBottomColor: Colors.LIGHT_CLIENT_BORDER,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: mobileW * 1 / 100


  },
  backarrow: {
    width: '15%'
  },
  headerText: {
    width: '70%',
  },




});