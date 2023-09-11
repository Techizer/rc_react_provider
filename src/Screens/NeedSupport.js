import { Text, View, Image, StatusBar, TouchableOpacity, Modal, FlatList, TextInput, ScrollView, Dimensions, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Colors, Font, MessageFunctions, MessageTexts, Configurations, mobileW, LanguageConfiguration, API, MessageHeadings } from '../Helpers/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icons } from '../Icons/IReferences';
import ScreenHeader from '../Components/ScreenHeader';
import { useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import { BottomSheetProps, BottomSheetStyles, BottomSheetViewStyles } from '../Styles/Sheet';
import { SvgXml } from 'react-native-svg';
import { _Cross } from '../Icons/SvgIcons/Index';
import { Button } from '../Components';
import { ActivityIndicator } from 'react-native-paper';
import StickyButton from '../Components/StickyButton';


const windowHeight = Math.round(Dimensions.get("window").height);
const windowWidth = Math.round(Dimensions.get("window").width);
const deviceHeight = Dimensions.get('screen').height;
const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
headerHeight += (Platform.OS === 'ios') ? 28 : -60

export default NeedSupport = ({ navigation, route }) => {

  const [isLoading, setIsLoading] = useState(true)
  const [isOnButtonLoading, setIsOnButtonLoading] = useState(false)
  const [issueTopics, setIssueTopics] = useState([])

  const [classStateData, setClassStateData] = useState({
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

  const topicSelectSheetRef = useRef()
  const issueRef = useRef()


  const {
    loginUserData
  } = useSelector(state => state.StorageReducer)


  const getData = async () => {
    let user_details = loginUserData
    console.log('user_details user_details', user_details)
    let user_id = user_details['user_id']

    let url = Configurations.baseURL + "api-patient-need-help-topic";
    console.log("url", url)
    var data = new FormData();
    data.append('login_user_id', user_id)


    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        setIssueTopics(obj.result)
      }
      else {
        MessageFunctions.alert(MessageHeadings.information[Configurations.language], obj.message[Configurations.language], false);

        return false;
      }
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const onSubmit = async () => {
    if (classStateData.select.length <= 0) {
      MessageFunctions.showError(MessageTexts.emptySelecttopic[Configurations.language])
      return false;
    }
    let url = Configurations.baseURL + "api-insert-need-help";
    console.log("url", url)
    var data = new FormData();
    setIsOnButtonLoading(true)
    data.append('user_id', loginUserData?.user_id)
    data.append('issue_topic', classStateData.select)
    data.append('message', classStateData.message)
    data.append('service_type', loginUserData?.user_type)

    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {
        setTimeout(() => {
          setIsOnButtonLoading(false)
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


      <ScreenHeader
        onBackPress={() => {
          navigation.pop();
        }}
        leftIcon
        rightIcon={false}
        navigation={navigation}
        title={LanguageConfiguration.supporttext[Configurations.language]}
      />

      <KeyboardAwareScrollView>
        <View style={{ width: '100%', backgroundColor: Colors.tab_background_color, paddingBottom: mobileW * 2 / 100 }}>
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
        }}>
          {!isLoading ?
            <TouchableOpacity onPress={() => {
              topicSelectSheetRef.current.open()
            }}
              style={{ width: '100%', backgroundColor: Colors.backgroundcolor, borderColor: Colors.bordercolor, borderWidth: 1, borderRadius: mobileW * 1 / 100 }}>

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
            </TouchableOpacity> :
            <ActivityIndicator color={Colors.textblue} />
          }
        </View>
        <TouchableOpacity style={{
          width: '90%', alignSelf: 'center', marginTop: mobileW * 6 / 100,
          borderColor: classStateData.selectissuefocus == true ? '#0057A5' : Colors.bordercolor, borderWidth: mobileW * 0.3 / 100, borderRadius: mobileW * 2 / 100, height: mobileW * 40 / 100
        }} onPress={() => {
          issueRef.current.focus()
        }} activeOpacity={1}>
          <View style={{ width: '95%', alignSelf: 'center', }}>
            <TextInput
              style={{ marginTop: mobileW * 2 / 100, backgroundColor: '#fff', width: '100%', color: Colors.textblack, fontSize: Font.placeholdersize, textAlign: Configurations.textalign, fontFamily: Font.placeholderfontfamily, paddingVertical: mobileW * 3 / 100 }}
              maxLength={250}
              multiline={true}
              placeholder={classStateData.selectissuefocus != true ? LanguageConfiguration.text_input_topic[Configurations.language] : null}
              placeholderTextColor={Colors.placeholder_text}
              onChangeText={(txt) => { setState({ message: txt }) }}
              ref={issueRef}
              keyboardType='default'
              returnKeyLabel='done'
            />
          </View>
          {classStateData.selectissuefocus == true && <View style={{ position: 'absolute', backgroundColor: 'white', left: mobileW * 4 / 100, top: -mobileW * 2 / 100, paddingHorizontal: mobileW * 1 / 100 }}>
            <Text style={{ color: '#0057A5', textAlign: Configurations.textalign }}>{LanguageConfiguration.text_input_topic[Configurations.language]}</Text>
          </View>}
        </TouchableOpacity>



      </KeyboardAwareScrollView>


      <RBSheet
        ref={topicSelectSheetRef}
        {...BottomSheetProps}
        customStyles={BottomSheetStyles} >
        <View style={BottomSheetViewStyles.MainView}>
          <View style={BottomSheetViewStyles.ButtonContainer}>
            <TouchableOpacity style={BottomSheetViewStyles.Button} onPress={() => {
              topicSelectSheetRef.current.close()
            }}>
              <SvgXml xml={_Cross}
                width={windowHeight / 26}
                height={windowHeight / 26}
              />
            </TouchableOpacity>
          </View>

          <View style={BottomSheetViewStyles.Body}>

            <View style={BottomSheetViewStyles.TitleBar}>
              <Text style={BottomSheetViewStyles.Title}>{LanguageConfiguration.select_topic_text[Configurations.language]}</Text>
            </View>


            <FlatList
              contentContainerStyle={BottomSheetViewStyles.FlatListChild}
              data={issueTopics}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setState({
                        select: item.name,
                      });
                      topicSelectSheetRef.current.close()
                    }}
                  >
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
                  </TouchableOpacity>
                );
              }} />


            <FlatList
              data={classStateData.Countryarr}
              contentContainerStyle={BottomSheetViewStyles.FlatListChild}
              renderItem={({ item, index }) => {
                if (classStateData.Countryarr != '' || classStateData.Countryarr != null) {
                  return (
                    <TouchableOpacity style={{
                      width: '100%',
                    }}
                      onPress={() => {
                        setState({ country_code: item.country_code, country_name: item.name, country_short_code: item.country_short_code });
                        countrySheetRef.current.close()
                      }}
                    >
                      <View style={{
                        width: (Platform.OS == "ios") ? '95%' : '94.5%',
                        marginLeft: 15,
                        borderBottomColor: Colors.gray6,
                        borderBottomWidth: (index == (classStateData.Countryarr.length - 1)) ? 0 : 1,
                      }}>
                        <Text style={{
                          color: '#041A27',
                          fontSize: 15,
                          fontFamily: Font.headingfontfamily,
                          paddingTop: 15,
                          paddingBottom: 15,
                          width: '94.5%',
                        }}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                }
              }}
              keyExtractor={(item, index) => index.toString()}>


            </FlatList>
          </View>
        </View>

      </RBSheet>

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
                source={require('../Icons/ryt_opp.png')}></Image>
            }
            <Text style={{ fontSize: mobileW * 8 / 100, marginTop: mobileW * 5 / 100, fontFamily: Font.Medium, textAlign: Configurations.textalign, }}>{LanguageConfiguration.thank[Configurations.language]}</Text>
            <Text style={{ fontSize: mobileW * 3.5 / 100, marginTop: mobileW * 5 / 100, fontFamily: Font.Medium, textAlign: Configurations.textalign }}>{'Support ticket posted'}</Text>
            <Text style={{ fontSize: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, fontFamily: Font.Medium, textAlign: Configurations.textalign, color: Colors.textgray }}>{'Your support ticket is under review by Rootscare resolution team. You will soon receive notification on the status.'}</Text>

            <TouchableOpacity onPress={() => {
              setState({ successmodal: false }), navigation.goBack();
            }}

              style={{ width: '15%', alignSelf: 'center', borderColor: Colors.bordercolorblue, borderWidth: 1, paddingVertical: mobileW * 2 / 100, marginTop: mobileW * 5 / 100, borderRadius: mobileW * 3 / 100 }}>
              <Text style={{ fontSize: mobileW * 3 / 100, alignSelf: 'center', fontFamily: Font.Medium, textAlign: Configurations.textalign, alignSelf: 'center', color: Colors.terms_text_color_blue, }}>{LanguageConfiguration.close_txt[Configurations.language]}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <StickyButton
        onLoading={isOnButtonLoading}
        onPress={onSubmit}
        text={LanguageConfiguration.submitbtntext[Configurations.language]}
      />
    </View>
  )
}