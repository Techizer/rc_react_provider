import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, SafeAreaView, Image, Modal, TouchableOpacity, StatusBar, Dimensions, Platform } from 'react-native';
import { Colors, Font, Configurations, mobileW, LanguageConfiguration, API } from '../Helpers/Utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences';
import { useSelector } from 'react-redux';


export default ReviewRating = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    notificat_id: '',
    reviewratingdata: '',
    modalVisible3: false,
    body_name: '',
    fbtn: '',
    message: '',
    mabtn: true,
  })


  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  useEffect(() => {
    getNotifications(0)
  }, [])


  const {
    loginUserData
  } = useSelector(state => state.Auth)


  const getNotifications = async (page) => {
    let user_details = loginUserData
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let apishow = "api-all-provider-review"

    let url = Configurations.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    data.append('user_id', user_id)
    data.append('service_type', user_type)


    API.post(url, data, page).then((obj) => {


      if (obj.status == true) {
        setState({
          reviewratingdata: obj.result,
          message: obj.message
        })
        console.log('obj.result', obj.result)
      } else {

        setState({ reviewratingdata: obj.result, message: obj.message })
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
        title={'Rating & Review'}
        style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={classStateData.modalVisible3}

        onRequestClose={() => { setState({ modalVisible3: false }) }}>
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

                <Text style={{ fontFamily: Font.Regular, color: '#000', fontSize: mobileW * 4 / 100, width: '90%' }}>{classStateData.body_name}</Text>
              </View>






              <TouchableOpacity onPress={() => { setState({ modalVisible3: false }) }}
                activeOpacity={0.8}
                style={{ width: mobileW * 20 / 100, justifyContent: 'flex-end', alignSelf: 'flex-end', marginTop: mobileW * 3 / 100 }}>
                <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.bordercolorblue, alignSelf: 'center' }}>{LanguageConfiguration.OK[Configurations.language]}</Text>
              </TouchableOpacity>


            </View>

          </View>
        </View>
      </Modal>
      {classStateData.reviewratingdata == '' || classStateData.reviewratingdata == null &&

        <View>
          <Text style={{ textAlign: 'center', color: Colors.theme_color, fontFamily: Font.Medium, fontSize: mobileW * 3.5 / 100, marginTop: mobileW * 60 / 100 }}>{classStateData.message}</Text>
        </View>
      }

      {classStateData.reviewratingdata != '' && classStateData.reviewratingdata != null &&
        <FlatList
          data={classStateData.reviewratingdata}
          contentContainerStyle={{
            paddingBottom: mobileW * 10 / 100
          }}
          renderItem={({ item, index }) => {


            var reviewRating = parseInt(item?.rating);
            var ratings = [];
            for (let i = 0; i < 5; i++) {
              if (i < reviewRating) {
                ratings.push(
                  <AntDesign style={{ alignSelf: 'center' }}
                    name={"star"}
                    size={14}
                    color={'#FFA800'}></AntDesign>
                )
              } else {
                ratings.push(
                  <AntDesign style={{ alignSelf: 'center' }}
                    name={"star"}
                    size={14}
                    color={'#DFDFDF'}></AntDesign>
                )
              }

            }
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                }}
                style={{
                  backgroundColor: Colors.white_color,
                  marginTop: (mobileW * 2) / 100,
                  backgroundColor: '#fff',
                  shadowOpacity: 0.3,
                  shadowColor: '#000',
                  shadowOffset: { width: 1, height: 1 },
                  elevation: 5,
                }}>

                <View style={{
                  flexDirection: 'row',
                  width: '100%',
                }}>


                  <View style={{
                    width: '23%',
                    alignItems: 'center',
                    paddingTop: (mobileW * 4) / 100,
                  }}>
                    <Image
                      source={item.image == 'NA'
                        || item.image == null
                        || item.image == '' ?
                        Icons.AccountFilled :
                        {
                          uri: Configurations.img_url3 + item.image
                        }}

                      style={{
                        width: (mobileW * 15) / 100,
                        height: (mobileW * 15) / 100,
                        borderWidth: 1,
                        borderColor: Colors.theme_color,
                        borderRadius: (mobileW * 7.5) / 100,
                      }}></Image>
                  </View>


                  <View
                    style={{
                      width: '77%',
                      paddingTop: (mobileW * 4) / 100,
                    }}>
                    <View style={{
                      borderBottomWidth: (mobileW * 0.3) / 100,
                      borderColor: Colors.gainsboro,
                      marginRight: (mobileW * 2.5) / 100,
                      minHeight: (mobileW * 12) / 100,
                    }}>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.sregulartext_size,
                          lineHeight: (mobileW * 4.2) / 100,
                          textAlign: Configurations.textRotate,
                          color: Colors.lightgraytext,
                          paddingBottom: (mobileW * 2.1) / 100,
                        }}>{item?.review}</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                        width: '100%',
                        paddingVertical: (mobileW * 2) / 100,
                      }}>
                      <View style={{
                        width: '50%',
                      }}>
                        <View style={{
                          flexDirection: 'row',
                          width: '100%',
                        }}>
                          <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '25%',
                          }}>
                            <Text
                              style={{
                                fontFamily: Font.Regular,
                                fontSize: Font.sregulartext_size,
                                color: Colors.lightgraytext,
                              }}>
                              Rated
                            </Text>
                          </View>
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            marginLeft: 15,
                            width: '52%',
                          }}>
                            {ratings}
                          </View>
                        </View>
                      </View>

                      <View style={{
                        width: '50%',
                        paddingRight: (mobileW * 2.5) / 100,
                      }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.sregulartext_size,
                            color: Colors.textblue,
                            textAlign: 'right'
                          }}>
                          {item?.order_id}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}></FlatList>
      }
    </View>


  );

}
