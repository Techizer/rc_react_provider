import { Text, Modal, Alert, View, Image, StatusBar, TouchableOpacity, Dimensions, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Font, MessageFunctions, Configurations, mobileW, localStorage, LanguageConfiguration, API, MessageHeadings } from '../Helpers/Utils';
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences'
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { onUserLogout } from '../Redux/Actions/UserActions';

export default More = ({ navigation, route }) => {

  const {
    loginUserData
  } = useSelector(state => state.Auth)

  const dispatch = useDispatch()

  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60
  return (
    <View style={{
      width: '100%', alignSelf: 'center', flex: 1,
      backgroundColor: Colors.white_color
    }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.statusbarcolor}
        hidden={false}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />

      <ScreenHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        leftIcon
        rightIcon={false}
        navigation={navigation}
        title={LanguageConfiguration.supporttext[Configurations.language]}
        style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />


      <View style={{ width: '55%', alignSelf: 'center', marginRight: mobileW * 2 / 100, marginTop: mobileW * 10 / 100 }}>
        <Image style={{ height: mobileW * 30 / 100, width: mobileW * 45 / 100, resizeMode: 'contain', alignSelf: 'center', alignItems: 'center', }}
          source={Icons.LogoWithText}>
        </Image>
      </View>


      <View style={{ width: '45%', alignSelf: 'center', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, }}>


      </View>

      <View style={{ width: '45%', alignSelf: 'center', marginTop: mobileW * 3 / 100 }}>
        <View style={{ width: '100%' }}>
          <Text style={{ fontSize: mobileW * 4.2 / 100, color: Colors.splashtextcolor, fontFamily: Font.Regular, alignSelf: 'center', textAlign: 'center', marginTop: mobileW * 0.5 / 100 }}>{LanguageConfiguration.the_best_company[Configurations.language]} </Text>
          <Text style={{ fontSize: mobileW * 4.2 / 100, color: Colors.splashtextcolor, fontFamily: Font.Regular, alignSelf: 'center', textAlign: 'center', marginTop: mobileW * 0.5 / 100 }}>{LanguageConfiguration.for_mediical[Configurations.language]} </Text>
          <Text style={{ fontSize: mobileW * 4.2 / 100, color: Colors.splashtextcolor, fontFamily: Font.Regular, alignSelf: 'center', textAlign: 'center', marginTop: mobileW * 0.5 / 100 }}>{LanguageConfiguration.home_helth[Configurations.language]} </Text>
        </View>

      </View>

      <View style={{ width: '45%', alignSelf: 'center', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, marginTop: mobileW * 5 / 100 }}>
      </View>

      <View style={{
        width: '95%', alignSelf: 'flex-end',
        marginTop: mobileW * 5 / 100
      }}>
      </View>


      <TouchableOpacity onPress={() => {
        navigation.navigate(ScreenReferences.TermsAndConditions, {
          contantpage: 2, content: Configurations.term_url_eng,
          content_ar: Configurations.term_url_ar
        })
      }}
        style={{ width: '90%', justifyContent: 'space-between', alignSelf: 'center', marginTop: mobileW * 5 / 100, flexDirection: 'row' }}>
        <Text style={{ textAlign: Configurations.textalign, fontSize: mobileW * 3.8 / 100, color: Colors.textblack_new, fontFamily: Font.ques_fontfamily, }}>
          {LanguageConfiguration.termtxt[Configurations.language]} </Text>

        <View style={{ width: '5%', alignSelf: 'center', }}>
          <View style={{ width: '100%', alignSelf: 'center' }}>
            <Image style={{ width: mobileW * 3.5 / 100, height: mobileW * 3.5 / 100, alignSelf: 'center', resizeMode: 'contain', tintColor: Colors.textblack_new }}
              source={Configurations.textalign == 'right' ? Icons.NextRTL : Icons.RightArrow}></Image>
          </View>
        </View>
      </TouchableOpacity>


      <View style={{ width: '95%', alignSelf: 'flex-end', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, marginTop: mobileW * 5 / 100 }}>
      </View>

      <TouchableOpacity onPress={() => { navigation.navigate(ScreenReferences.TermsAndConditions, { contantpage: 0, content: Configurations.about_url_eng, content_ar: Configurations.about_url_ar }) }}
        style={{ width: '90%', alignSelf: 'center', marginTop: mobileW * 5 / 100, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ textAlign: Configurations.textalign, fontSize: mobileW * 3.8 / 100, color: Colors.textblack_new, fontFamily: Font.ques_fontfamily, }}>{LanguageConfiguration.aboutrootcare[Configurations.language]} </Text>
        <View style={{ width: '5%', alignSelf: 'center', }}>
          <Image style={{ width: mobileW * 3.5 / 100, height: mobileW * 3.5 / 100, alignSelf: 'center', resizeMode: 'contain', tintColor: Colors.textblack_new }}
            source={Configurations.textalign == 'right' ? Icons.NextRTL : Icons.RightArrow}></Image>
        </View>
      </TouchableOpacity>

      <View style={{ width: '95%', alignSelf: 'flex-end', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, marginTop: mobileW * 5 / 100 }}>
      </View>

      <TouchableOpacity onPress={() => { navigation.navigate(ScreenReferences.TermsAndConditions, { contantpage: 1, content: Configurations.privacy_url_eng, content_ar: Configurations.privacy_url_ar }) }}
        style={{ width: '90%', alignSelf: 'center', marginTop: mobileW * 5 / 100, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ textAlign: Configurations.textalign, fontSize: mobileW * 3.8 / 100, color: Colors.textblack_new, fontFamily: Font.ques_fontfamily, }}>{LanguageConfiguration.privacy[Configurations.language]} </Text>
        <View style={{ width: '5%', alignSelf: 'center', }}>
          <View style={{ width: '100%', alignSelf: 'center' }}>
            <Image style={{ width: mobileW * 3.5 / 100, height: mobileW * 3.5 / 100, alignSelf: 'center', resizeMode: 'contain', tintColor: Colors.textblack_new }}
              source={Configurations.textalign == 'right' ? Icons.NextRTL : Icons.RightArrow}></Image>
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ width: '95%', alignSelf: 'flex-end', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, marginTop: mobileW * 5 / 100 }}>
      </View>

      <TouchableOpacity
        onPress={() => { navigation.navigate(ScreenReferences.NeedSupport) }}
        style={{ justifyContent: 'space-between', width: '90%', alignSelf: 'center', marginTop: mobileW * 5 / 100, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: '8%', alignSelf: 'center', marginRight: mobileW * 3 / 100 }}>
            <Image style={{ width: 20, height: 20, resizeMode: 'contain' }}
              source={Icons.NeedSupoort}>
            </Image>
          </View>
          <Text style={{ textAlign: Configurations.textalign, fontSize: mobileW * 4 / 100, color: Colors.textblack, fontFamily: Font.SemiBold, }}>{LanguageConfiguration.NeedSupport[Configurations.language]} </Text>
        </View>
        <View style={{ width: '12%', alignSelf: 'center' }}>
          <Image style={{ width: mobileW * 3.5 / 100, height: mobileW * 3.5 / 100, alignSelf: 'flex-end', resizeMode: 'contain', tintColor: Colors.textblack_new }}
            source={Configurations.textalign == 'right' ? Icons.NextRTL : Icons.RightArrow}></Image>
        </View>
      </TouchableOpacity>

      <View style={{ width: '95%', alignSelf: 'flex-end', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, marginTop: mobileW * 5 / 100 }}>
      </View>

    </View>
  )

}