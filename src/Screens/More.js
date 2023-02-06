import { Text, Modal, Alert, View, Image, StatusBar, TouchableOpacity, Dimensions, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Font, MessageFunctions, Configurations, mobileW, localStorage, LanguageConfiguration, API, MessageHeadings } from '../Helpers/Utils';
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences'
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { onUserLogout } from '../Redux/Actions/UserActions';

export default More = ({ navigation, route }) => {
  const [classStateData, setClassStateData] = useState({
    engbtn: true,
    modalVisible3: false,
    langaugeme: 0,
    device_lang: 'AR'
  })

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }


  const {
    loginUserData
  } = useSelector(state => state.Auth)

  const dispatch = useDispatch()


  const launguage_setbtn = (language) => {
    console.log('Welcome')
    LanguageConfiguration.language_set(language)
    setTimeout(() => {
      submit_click()
    }, 700);
    setState({
      engbtn: !classStateData.engbtn,
    })

  }

  const submit_click = async () => {
    let user_details = loginUserData
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']

    let url = Configurations.baseURL + "api-language-update";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)
    data.append('device_lang', classStateData.device_lang)


    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        console.log('result', obj.result)
        let result = obj.result


      }
      else {
        MessageFunctions.alert(MessageHeadings.information[Configurations.language], obj.message[Configurations.language], false);

        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setState({ loading: false });
    });
  }
  const confireClick = (title, message, callbackOk, callbackCancel) => {

    Alert.alert(
      LanguageConfiguration.Delete_account[Configurations.language],
      LanguageConfiguration.Are_you_sure[Configurations.language],
      // "Do you want to logout ?",
      [
        {
          text: LanguageConfiguration.no_txt[Configurations.language],
        },
        {
          text: LanguageConfiguration.yes_txt[Configurations.language],
          onPress: () => delete_click(),
        },
      ],
      { cancelable: false },
    );
  }
  const delete_click = async () => {
    let url = Configurations.baseURL + "api-delete-user";
    var data = new FormData();
    data.append('user_id', loginUserData?.user_id)

    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {
        dispatch(onUserLogout())
        navigation.reset({
          index: 0,
          routes: [{ name: ScreenReferences.Login }],
        });
      }
      else {
        MessageFunctions.alert(MessageHeadings.information[Configurations.language], obj.message[Configurations.language], false);
        return false;
      }
    }).catch((error) => {
      setState({ loading: false });
    });
  }


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

      <Modal
        animationType="slide"
        transparent={true}
        visible={classStateData.modalVisible3}
        onRequestClose={() => { setState({ modalVisible3: false }) }}>
        <TouchableOpacity onPress={() => { setState({ modalVisible3: false }) }} style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
          <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
            networkActivityIndicatorVisible={true} />
          <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

            <View style={{ backgroundColor: '#fff', borderRadius: 2, width: "100%", }}>

              <View style={{ alignSelf: 'flex-start', width: mobileW * 60 / 100, paddingVertical: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row' }}>
                <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100 }} source={Icons.Logo}></Image>
                <Text style={{ fontFamily: Font.Medium, color: '#000', fontSize: mobileW * 5 / 100, paddingLeft: mobileW * 3 / 100 }}>{LanguageConfiguration.Lang_change[Configurations.language]}</Text>
              </View>

              <View style={{ alignSelf: 'flex-start', paddingVertical: mobileW * 1 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ paddingVertical: mobileW * 1 / 100, paddingLeft: mobileW * 4 / 100, fontFamily: Font.Regular, color: '#000', fontSize: mobileW * 4 / 100, width: '90%' }}>{LanguageConfiguration.Lang_change_msg[Configurations.language]}</Text>
              </View>

              <View style={{
                flexDirection: 'row', justifyContent: 'space-around', width: '40%', paddingBottom: mobileW * 5 / 100, marginTop: mobileW * 7 / 100,
                alignSelf: 'flex-end', right: 10
              }}>
                <TouchableOpacity onPress={() => { setState({ modalVisible3: false }) }}
                  style={{ width: mobileW * 15 / 100, flexDirection: 'row', alignSelf: 'center', }}>
                  <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.bordercolorblue, alignSelf: 'center' }}>{LanguageConfiguration.no_txt[Configurations.language]}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  setState({ modalVisible3: false });
                  if (classStateData.langaugeme == 1) {
                    launguage_setbtn(0)
                  }
                  else {
                    launguage_setbtn(1)
                  }
                }}
                  activeOpacity={0.8}
                  style={{ width: mobileW * 20 / 100, justifyContent: 'center' }}>
                  <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.bordercolorblue, alignSelf: 'center' }}>{LanguageConfiguration.Restart[Configurations.language]}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )

}