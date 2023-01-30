import React, { Component, useState } from "react"
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Font, Media, MessageFunctions, MessageTexts, Configurations } from '../Helpers/Utils';
import AppLoader from '../Components/AppLoader'
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';
import { ScreenReferences } from "../Stacks/ScreenReferences";

const AppContext = React.createContext({})
export const AppConsumer = AppContext.Consumer

export const ApplicationContainerWrapper = ({ navigation, route, children }) => {

  const [classStateData, setClassStateData] = useState({
    loading: false,
    isConnected: false,
    backonline: false,
  })


  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  const showProgress = () => setState({ loading: true })
  const hideProgress = () => setState({ loading: false })

  const checkconnection = () => {

    const mytimer = setInterval(() => {
      checkconnection2(mytimer)
    }, 800);

  }

  const checkconnection2 = (mytimer) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        clearInterval(mytimer);
        setState({ backonline: true })
      }
    })
  }

  const selectcamerimage = async () => {
    await Media.launchCamera().then((res) => {
      setState({ mediaopen: false });
      return Mediaresult = res;
    }).catch((error) => {
      Mediaresult = error
    });
  }

  const funcs = {
    showLoader: showProgress,
    hideLoader: hideProgress,

  }

  return (
    <AppContext.Provider
      value={{ ...funcs }}
    >
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <SafeAreaView style={{ flex: 0, backgroundColor: Colors.statusbarcolor }} />
        <StatusBar
          hidden={false}
          StatusBarStyle='light-content'
          backgroundColor={Colors.statusbarcolor}
          translucent={false}
          networkActivityIndicatorVisible={true}
        >
        </StatusBar>

        {children}

        <AppLoader loading={classStateData.loading} />
        {screens != ScreenReferences.Splash &&
          <View>
            {!classStateData.isConnected && <View style={{ position: 'absolute', bottom: 5, width: '100%' }}>
              <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: 14, color: Colors.internettextcolor }} onPress={MessageFunctions.toast(MessageTexts.NoInternet[Configurations.language], 'bottom')}></Text>
            </View>}
          </View>}
      </View>
    </AppContext.Provider>
  )

}