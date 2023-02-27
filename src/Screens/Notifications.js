import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, SafeAreaView, Image, Modal, TouchableOpacity, StatusBar, Dimensions, Platform } from 'react-native';
import { Colors, Font, Configurations, mobileW, LanguageConfiguration, API } from '../Helpers/Utils';
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences';
import { useDispatch, useSelector } from 'react-redux';
import { vs, s } from 'react-native-size-matters';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { setNotificationsData } from '../Redux/Actions/UserActions';

export default Notifications = ({ navigation, route }) => {
  const {
    loginUserData,
    notifications
  } = useSelector(state => state.Auth)

  const dispatch = useDispatch()

  const [classStateData, setClassStateData] = useState({
    isModalVisible: false,
    body: '',
    message: '',
    isLoading: false
  })

  const [isListRefreshing, setIsListRefreshing] = useState(false)

  const setState = payload => {
    setClassStateData(prev => ({
      ...prev,
      ...payload
    }))
  }

  useEffect(() => {
    getNotifications(true && notifications.length === 0)
  }, [])

  const getNotifications = async (loader = false) => {
    if (loader && !classStateData.isLoading) {
      setState({
        isLoading: true
      })
    }

    let url = Configurations.baseURL + "api-get-all-notification";

    var data = new FormData();
    data.append('id', loginUserData?.user_id)

    API.post(url, data, 1).then((obj) => {


      if (obj.status == true) {
        console.log({notis: obj?.result});
        dispatch(setNotificationsData(obj?.result))
        setState({ message: obj.message })
      } else {
        dispatch(setNotificationsData(obj?.result))
        setState({ message: obj.message })
        return false;
      }
    }).catch((error) => {
      console.log("-------- error getting notifications ------- ", error)

    }).finally(() => {
      setState({
        isLoading: false
      })
    });

  }

  const updateNotification = async (notificationID, isAlreadyRead = 1) => {

    let url = Configurations.baseURL + "api-update-notification";

    var data = new FormData();
    data.append('id', notificationID)
    data.append('read', isAlreadyRead)

    API.post(url, data, 1).then((obj) => {
      getNotifications(false);
      if (obj.status == true) {

      } else {
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
    });

  }

  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        alignSelf: 'center',
      }}>
      <SafeAreaView style={{ flex: 0 }}></SafeAreaView>

      <ScreenHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        leftIcon
        rightIcon={false}
        navigation={navigation}
        title={LanguageConfiguration.NotificationsList[Configurations.language]}
        style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={classStateData.isModalVisible}

        onRequestClose={() => { setState({ isModalVisible: false }) }}>
        <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
          <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
            networkActivityIndicatorVisible={true} />
          <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

            <View style={{ backgroundColor: '#fff', borderRadius: 2, width: "100%", paddingVertical: mobileW * 3 / 100 }}>

              <View style={{ alignSelf: 'flex-start', width: mobileW * 50 / 100, paddingBottom: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row' }}>
                <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100 }} source={Icons.Logo}></Image>
                <Text style={{ fontFamily: Font.Medium, color: '#000', fontSize: mobileW * 5 / 100, paddingLeft: mobileW * 4 / 100 }}>{LanguageConfiguration.Notification[Configurations.language]}</Text>
              </View>
              <View style={{ alignSelf: 'flex-start', paddingVertical: mobileW * 1 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row', alignItems: 'center' }}>

                <Text style={{ fontFamily: Font.Regular, color: '#000', fontSize: mobileW * 4 / 100, width: '90%' }}>{classStateData.body}</Text>
              </View>

              <TouchableOpacity onPress={() => { setState({ isModalVisible: false }) }}
                activeOpacity={0.8}
                style={{ width: mobileW * 20 / 100, justifyContent: 'flex-end', alignSelf: 'flex-end', marginTop: mobileW * 3 / 100 }}>
                <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.bordercolorblue, alignSelf: 'center' }}>{LanguageConfiguration.OK[Configurations.language]}</Text>
              </TouchableOpacity>


            </View>

          </View>
        </View>
      </Modal>
      {(notifications == null || notifications.length === 0) && !classStateData.isLoading && 
        <View>
          <Text style={{ textAlign: 'center', color: Colors.DarkGrey, fontFamily: Font.Medium, fontSize: mobileW * 3.5 / 100, marginTop: mobileW * 60 / 100 }}>{classStateData.message}</Text>
        </View>
      }

      <FlatList
        data={classStateData.isLoading ? ['', '', '', '', '', '', '', '', '', '', ''] : notifications}
        keyExtractor={(item, index) => {
          return "key-" + index.toString();
        }}
        contentContainerStyle={{ paddingBottom: mobileW * 10 / 100 }}
        renderItem={({ item, index }) => {
          if (classStateData.isLoading) {
            return (
              <View style={{
                // height: vs(100),
                width: windowWidth,
                backgroundColor: Colors.White,
                paddingHorizontal: s(11),
                paddingVertical: vs(9),
                marginTop: vs(7),
              }}>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    width: "100%",
                    alignSelf: "center",
                    borderBottomWidth: 1.5,
                    borderBottomColor: Colors.backgroundcolor,
                    paddingBottom: vs(5)
                  }} >
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 7) / 100} height={(windowWidth * 7) / 100} borderRadius={s(20)} />
                  </SkeletonPlaceholder>

                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 70) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} style={{ marginLeft: s(15) }} />
                  </SkeletonPlaceholder>
                </View>

                <View style={{
                  flexDirection: "row",
                  alignItems: 'center',
                  width: "100%",
                  alignSelf: "center",
                  marginTop: vs(7),
                }}>

                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item width={(windowWidth * 30) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                  </SkeletonPlaceholder>


                </View>
              </View>
            )
          }

          else return (
            <TouchableOpacity activeOpacity={0.9} onPress={async () => {
              setState({ body: item.body, isModalVisible: true })
              await updateNotification(item.id)
            }}
              style={{
                flexDirection: 'row',
                backgroundColor: Colors.white_color,
                marginTop: (mobileW * 2) / 100,
                backgroundColor: '#fff',
              }}>
              <View
                style={[{
                  width: (mobileW * 1.5) / 100,

                }, item.read == '1' ? { backgroundColor: '#515C6F' } : { backgroundColor: Colors.theme_color }]}></View>
              <View
                style={{
                  width: '15%',
                  paddingTop: (mobileW * 4) / 100,
                  paddingRight: (mobileW * 2) / 100,
                }}>
                <Image
                  source={item.read == '0' ? Icons.Rocket : Icons.RocketGrey}
                  style={{
                    alignSelf: 'center',
                    width: (mobileW * 8) / 100,
                    height: (mobileW * 8) / 100,

                  }}></Image>
              </View>
              <View
                style={{ width: '80%', paddingTop: (mobileW * 4) / 100 }}>
                <Text
                  style={{
                    fontFamily: Font.Regular,
                    fontSize: Font.sregulartext_size,
                    lineHeight: (mobileW * 4.2) / 100,
                    textAlign: Configurations.textRotate,
                    color: Colors.lightgraytext,
                    paddingBottom: (mobileW * 2.1) / 100,
                  }}>
                  {item.body}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderTopWidth: (mobileW * 0.3) / 100,
                    borderColor: Colors.gainsboro,
                    alignSelf: 'flex-start',
                    paddingVertical: (mobileW * 2) / 100,
                  }}>
                  <Text
                    style={{
                      fontFamily: Font.Regular,
                      fontSize: Font.sregulartext_size,
                      color: Colors.lightgraytext,
                    }}>
                    {item.datetime}{'  •  '}{item.date}

                  </Text>


                </View>
              </View>
            </TouchableOpacity>
          );
        }} 
        refreshing={isListRefreshing}
        onRefresh={()=>{
          if(!classStateData.isLoading){
            setIsListRefreshing(true)
            getNotifications(false).finally(()=>{
              setIsListRefreshing(false)
            })
          }
        }}/>

    </View>

  );

}
