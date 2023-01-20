import { Text, View, Image, StatusBar, TouchableOpacity, Modal, FlatList, TextInput, ScrollView, Dimensions, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Font, MessageFunctions, MessageTexts, Configurations, mobileW, localStorage, LanguageConfiguration, API, MessageHeadings } from '../Helpers/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icons } from '../Assets/Icons/IReferences';
import ScreenHeader from '../Components/ScreenHeader';


const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

export default NeedSupport = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    Select_arr: 'NA',
    selectmodal: false,
    message: '',
    selectissuefocus: false,
    select: '',
    selectissue: '',
    successmodal: false
  })

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  useEffect(() => {
    navigation.addListener('focus', () => {
      getData()
    });
  }, [])

  const getData = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']

    let url = Configurations.baseURL + "api-patient-need-help-topic";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('result', obj.result)
        let result = obj.result
        setState({ Select_arr: obj.result })
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

  const onSubmit = async () => {
    let user_details = await localStorage.getItemObject('user_arr')
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    if (classStateData.select.length <= 0) {
      MessageFunctions.showError(MessageTexts.emptySelecttopic[Configurations.language])
      return false;
    }
    let url = Configurations.baseURL + "api-insert-need-help";
    console.log("url", url)
    var data = new FormData();
    data.append('user_id', user_id)
    data.append('issue_topic', classStateData.select)
    data.append('message', classStateData.message)
    data.append('service_type', user_type)

    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('result', obj.result)
        let result = obj.result
        setTimeout(() => {
          setState({ successmodal: true });
        }, 700);

      }
      else {
        MessageFunctions.showError(obj.message[Configurations.language]);

        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setState({ loading: false });
    });
  }

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

      <Modal
        animationType="fade"
        transparent={true}
        visible={classStateData.selectmodal}
        onRequestClose={() => { }}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => { setState({ selectmodal: false }) }}
          style={{
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: '#00000080',
            width: '100%',
            marginTop: (mobileW * 3) / 100,
            paddingBottom: (mobileW * 8) / 100,
          }}>
          <View
            style={{
              width: '70%',
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor: Colors.backgroundcolorblue,
              }}>
              <View
                style={{ width: '45%', paddingVertical: (mobileW * 3) / 100 }}>
                <Text
                  style={{
                    textAlign: Configurations.textalign,
                    fontFamily: Font.Regular,
                    fontSize: (mobileW * 4) / 100,
                    alignSelf: 'center',
                    color: Colors.textwhite,
                  }}>
                  {LanguageConfiguration.select_topic_text[Configurations.language]}
                </Text>
              </View>
            </View>
            <View style={{ width: '100%' }}>
              <FlatList

                data={classStateData.Select_arr}
                renderItem={({ item, index }) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          setState({
                            selectmodal: false,
                            select: item.name,

                          });
                        }}
                      >
                        <View style={{ width: '100%', backgroundColor: '#fff', alignSelf: 'center', justifyContent: 'flex-end' }}>
                          <View style={{ width: '95%', borderBottomColor: '#0000001F', borderBottomWidth: 1, paddingVertical: mobileW * 2.5 / 100, marginLeft: mobileW * 5 / 100 }}>
                            <Text
                              style={{
                                color: Colors.textblack,
                                textAlign: Configurations.textRotate,
                                fontSize: (mobileW * 4) / 100,
                                paddingLeft: mobileW * 2 / 100,

                              }}>
                              {item.name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}></FlatList>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={classStateData.successmodal}
        onRequestClose={() => { }}>

        <TouchableOpacity activeOpacity={0.9} onPress={() => { setState({ successmodel: false }) }} style={{ flex: 1, alignSelf: 'center', justifyContent: 'center', backgroundColor: '#00000080', width: '100%', }}>
          <View style={{ width: '100%', backgroundColor: 'white', borderRadius: mobileW * 4 / 100, position: 'absolute', bottom: 0, alignItems: 'center', justifyContent: 'center', paddingBottom: mobileW * 5 / 100, alignSelf: 'center' }}>
            {Configurations.language == 0 ?
              <Image style={{ width: mobileW * 17 / 100, height: mobileW * 17 / 100, alignSelf: 'center', marginTop: mobileW * -7 / 100, resizeMode: 'contain' }}
                source={Icons.GreenTick}></Image>
              :
              <Image style={{ width: mobileW * 17 / 100, height: mobileW * 17 / 100, alignSelf: 'center', marginTop: mobileW * -7 / 100, resizeMode: 'contain' }}
                source={require('../Assets/Icons/ryt_opp.png')}></Image>
            }
            <Text style={{ fontSize: mobileW * 8 / 100, marginTop: mobileW * 5 / 100, fontFamily: Font.Medium, textAlign: Configurations.textalign, }}>{LanguageConfiguration.thank[Configurations.language]}</Text>
            <Text style={{ fontSize: mobileW * 3.5 / 100, marginTop: mobileW * 5 / 100, fontFamily: Font.Medium, textAlign: Configurations.textalign }}>{LanguageConfiguration.success[Configurations.language]}</Text>
            <Text style={{ fontSize: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, fontFamily: Font.Medium, textAlign: Configurations.textalign, color: Colors.textgray }}>{LanguageConfiguration.text_of_modal[Configurations.language]}</Text>

            <TouchableOpacity onPress={() => {
              setState({ successmodal: false }), navigation.goBack();
            }}

              style={{ width: '15%', alignSelf: 'center', borderColor: Colors.bordercolorblue, borderWidth: 1, paddingVertical: mobileW * 2 / 100, marginTop: mobileW * 5 / 100, borderRadius: mobileW * 3 / 100 }}>
              <Text style={{ fontSize: mobileW * 3 / 100, alignSelf: 'center', fontFamily: Font.Medium, textAlign: Configurations.textalign, alignSelf: 'center', color: Colors.terms_text_color_blue, }}>{LanguageConfiguration.close_txt[Configurations.language]}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScreenHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        leftIcon
        rightIcon={false}
        navigation={navigation}
        title={LanguageConfiguration.supporttext[Configurations.language]}
        style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

      <ScrollView style={{
        width: '100%', alignSelf: 'center', flex: 1,
        backgroundColor: Colors.white_color
      }}>
        <KeyboardAwareScrollView>
          <View style={{ width: '100%', backgroundColor: Colors.tab_background_color, paddingVertical: mobileW * 2 / 100 }}>
          </View>

          <View style={{ alignItems: 'center', width: '90%', alignSelf: 'center', flexDirection: 'row', marginTop: mobileW * 3 / 100 }}>
            <View style={{ width: '8%', alignSelf: 'center' }}>
              <Image style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, resizeMode: 'contain' }}
                source={Icons.NeedSupoort}>
              </Image>
            </View>
            <Text style={{ textAlign: Configurations.textalign, fontSize: mobileW * 3.7 / 100, color: Colors.textblack, fontFamily: Font.buttonfontfamily, }}>{LanguageConfiguration.NeedSupport[Configurations.language]} </Text>
          </View>

          <View style={{ width: '90%', alignSelf: 'center', borderColor: Colors.bordercolor, borderBottomWidth: mobileW * 0.3 / 100, marginTop: mobileW * 3 / 100 }} />

          <View style={{ width: '90%', alignSelf: 'center', marginTop: mobileW * 2 / 100 }}>
            <Text style={{ textAlign: Configurations.textRotate, fontSize: mobileW * 3.5 / 100, color: '#707070', fontFamily: Font.Regular, }}>{LanguageConfiguration.need_text[Configurations.language]} </Text>
          </View>


          <View style={{ width: '90%', alignSelf: 'center', marginTop: mobileW * 4 / 100 }}>
            <Text style={{ textAlign: Configurations.textRotate, fontSize: mobileW * 3.7 / 100, color: Colors.textblack, fontFamily: Font.buttonfontfamily, }}>{LanguageConfiguration.select_topic_text[Configurations.language]} </Text>
          </View>

          <View style={{
            width: '90%', alignSelf: 'center', marginTop: mobileW * 3 / 100, flexDirection: 'row',
            borderColor: Colors.bordercolor, borderWidth: 1, borderRadius: mobileW * 1 / 100
          }}>
            <TouchableOpacity onPress={() => {
              setState({ selectmodal: true });
            }}
              style={{ width: '100%', backgroundColor: Colors.backgroundcolor, borderRadius: mobileW * 1 / 100 }}>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '95%', alignSelf: 'center' }}>
                <Text
                  style={{ alignSelf: 'center', color: Colors.textblack, fontSize: Font.placeholdersize, textAlign: Configurations.textRotate, paddingVertical: mobileW * 4 / 100, fontFamily: Font.placeholderfontfamily }}

                >{classStateData.select.length <= 0 ? LanguageConfiguration.select_issues_text[Configurations.language] : classStateData.select}</Text>
                <View style={{ width: '10%', alignSelf: 'center' }}>
                  <Image
                    source={Icons.DownArrow}
                    style={{ height: mobileW * 4 / 100, width: mobileW * 4 / 100, alignSelf: 'flex-end' }}>
                  </Image>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{
            width: '90%', alignSelf: 'center', marginTop: mobileW * 6 / 100,
            borderColor: classStateData.selectissuefocus == true ? '#0057A5' : Colors.bordercolor, borderWidth: mobileW * 0.3 / 100, borderRadius: mobileW * 2 / 100, height: mobileW * 40 / 100
          }}>
            <View style={{ width: '95%', alignSelf: 'center', }}>
              <TextInput
                style={{ marginTop: mobileW * 2 / 100, backgroundColor: '#fff', width: '100%', color: Colors.textblack, fontSize: Font.placeholdersize, textAlign: Configurations.textalign, fontFamily: Font.placeholderfontfamily, paddingVertical: mobileW * 3 / 100 }}
                maxLength={250}
                multiline={true}
                placeholder={classStateData.selectissuefocus != true ? LanguageConfiguration.text_input_topic[Configurations.language] : null}
                placeholderTextColor={Colors.placeholder_text}
                onChangeText={(txt) => { setState({ message: txt }) }}
                onFocus={() => { setState({ selectissuefocus: true }) }}
                onBlur={() => { setState({ selectissuefocus: classStateData.message.length > 0 ? true : false }) }}
                keyboardType='default'
                returnKeyLabel='done'
              />
            </View>
            {classStateData.selectissuefocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
              <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.text_input_topic[Configurations.language]}</Text>
            </View>}
          </View>

          <TouchableOpacity
            onPress={() => {
              onSubmit()
            }}

            style={{
              width: '90%',
              alignSelf: 'center',
              borderRadius: (mobileW * 2) / 100,
              backgroundColor: Colors.buttoncolorblue,
              paddingVertical: (mobileW * 4) / 100,
              marginTop: (mobileW * 45) / 100,
            }}>
            <Text
              style={{
                color: Colors.textwhite,
                fontFamily: Font.Medium,
                fontSize: Font.buttontextsize,
                alignSelf: 'flex-end',
                textAlign: Configurations.textalign,
                alignSelf: 'center',
              }}>
              {LanguageConfiguration.submitbtntext[Configurations.language]}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </ScrollView>

    </View>
  )
}