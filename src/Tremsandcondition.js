import React, { Component } from 'react'
import { Text, View, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity, Dimensions, StatusBar, SafeAreaView, Platform } from 'react-native'
import { color } from 'react-native-reanimated';
import { WebView } from 'react-native-webview';
import { Colors,  Font, mobileH, mobileW, config, Lang_chg } from './Provider/utilslib/Utils'
import ScreenHeader from './Components/ScreenHeader';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const content_arr = [
  { content_type: 0, content: config.about_url_eng, content_ar: config.about_url_ar },
  { content_type: 1, content: config.privacy_url_eng, content_ar: config.privacy_url_ar },
  { content_type: 2, content: config.term_url_eng, content_ar: config.term_url_ar }


]
export default class Tremsandcondition extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pagename: this.props.route.params.contantpage,
      content_ar: this.props.route.params.content_ar,
      content: this.props.route.params.content
    }

  }

  componentDidMount = () => {
    // this.getAllContent()    
    console.log(this.state.pagename)
  }




  render() {
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
            this.props.navigation.goBack();
          }}
          leftIcon
          rightIcon={false}
          navigation={this.props.navigation}
          title={(() => {
            if (this.state.pagename == 0) return Lang_chg.AboutRootscare[config.language]
            if (this.state.pagename == 2) return Lang_chg.TermsandConditions[config.language]
            if (this.state.pagename == 1) return Lang_chg.PrivacyPolicy[config.language]
          })()}
          style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

        {config.language == 1 ?
          <WebView
            style={styles.webview}
            source={{ uri: this.state.content_ar }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            scalesPageToFit={true} /> :
          <WebView
            style={styles.webview}
            source={{ uri: this.state.content }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            scalesPageToFit={true} />
        }





      </View>
    );
  }
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