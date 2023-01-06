import React, { Component } from 'react';
import { Text, View, FlatList, ScrollView, StyleSheet, SafeAreaView, Image, Modal, TouchableOpacity, ImageBackground, TextInput, StatusBar, Dimensions, Platform } from 'react-native';
import { Colors, Font, mobileH, Mapprovider, msgProvider, msgText, config, mobileW, localStorage, localimag, consolepro, handleback, Lang_chg, apifuntion, msgTitle, } from './Provider/utilslib/Utils';
import { Appbtn3, AppHeader2, AppHeader4 } from './Allcomponents';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScreenHeader from './Components/ScreenHeader';


export default class ReviewRating extends Component {
  constructor(props) {
    super(props);
    this.state = {

      notificat_id: '',
      reviewratingdata: '',
      modalVisible3: false,
      body_name: '',
      fbtn: '',
      message: '',
      mabtn: true,
    };
  }
  componentDidMount() {

    this.get_notification(0)

  }
  get_notification = async (page) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let apishow = "api-all-provider-review"

    let url = config.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    data.append('user_id', user_id)
    data.append('service_type', user_type)

    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data, page).then((obj) => {
      consolepro.consolelog("obj", obj)

      if (obj.status == true) {
        this.setState({
          reviewratingdata: obj.result,
          message: obj.message
        })
        console.log('obj.result', obj.result)
      } else {

        this.setState({ reviewratingdata: obj.result, message: obj.message })
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);

    });

  }
  update_notification = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let apishow = "api-update-notification"

    let url = config.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    data.append('id', this.state.notificat_id)
    data.append('read', 1)
    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data, 1).then((obj) => {
      consolepro.consolelog("obj", obj)

      this.get_notification(1);
      if (obj.status == true) {
        // setTimeout(() => {

        //  },100);

      } else {

        this.setState({ appoinment_detetails: obj.result, message: obj.message })
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);

    });

  }

  render() {
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
              this.props.navigation.goBack();
            }}
            leftIcon
            rightIcon={false}
            navigation={this.props.navigation}
            title={'Rating & Review'}
            style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible3}

          onRequestClose={() => { this.setState({ modalVisible3: false }) }}>
          <View style={{ backgroundColor: "#00000080", flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, marginTop: -50 }}>
            <StatusBar backgroundColor={'#fff'} barStyle='default' hidden={false} translucent={false}
              networkActivityIndicatorVisible={true} />
            <View style={{ borderRadius: 20, width: mobileW * 90 / 100, position: 'absolute', alignSelf: 'center' }}>

              <View style={{ backgroundColor: '#fff', borderRadius: 2, width: "100%", paddingVertical: mobileW * 3 / 100 }}>

                <View style={{ alignSelf: 'flex-start', width: mobileW * 50 / 100, paddingBottom: mobileW * 3 / 100, marginTop: mobileW * 2 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row' }}>
                  <Image style={{ width: mobileW * 6 / 100, height: mobileW * 6 / 100 }} source={require('./icons/logo.png')}></Image>
                  <Text style={{ fontFamily: Font.Medium, color: '#000', fontSize: mobileW * 5 / 100, paddingLeft: mobileW * 4 / 100 }}>{Lang_chg.Notification[config.language]}</Text>
                </View>
                <View style={{ alignSelf: 'flex-start', paddingVertical: mobileW * 1 / 100, paddingLeft: mobileW * 4 / 100, flexDirection: 'row', alignItems: 'center' }}>

                  <Text style={{ fontFamily: Font.Regular, color: '#000', fontSize: mobileW * 4 / 100, width: '90%' }}>{this.state.body_name}</Text>
                </View>






                <TouchableOpacity onPress={() => { this.setState({ modalVisible3: false }) }}
                  activeOpacity={0.8}
                  style={{ width: mobileW * 20 / 100, justifyContent: 'flex-end', alignSelf: 'flex-end', marginTop: mobileW * 3 / 100 }}>
                  <Text style={{ fontFamily: Font.Regular, fontSize: mobileW * 4 / 100, color: Colors.bordercolorblue, alignSelf: 'center' }}>{Lang_chg.OK[config.language]}</Text>
                </TouchableOpacity>


              </View>

            </View>
          </View>
        </Modal>
        {this.state.reviewratingdata == '' || this.state.reviewratingdata == null &&

          <View>
            <Text style={{ textAlign: 'center', color: Colors.theme_color, fontFamily: Font.Medium, fontSize: mobileW * 3.5 / 100, marginTop: mobileW * 60 / 100 }}>{this.state.message}</Text>
          </View>
        }

        {this.state.reviewratingdata != '' && this.state.reviewratingdata != null &&
          <FlatList
            data={this.state.reviewratingdata}
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
                    // this.update_notification(), 
                    // this.setState({ body_name: item.body, 
                    //   notificat_id: item.id, modalVisible3: true })
                  }}
                  style={{
                    backgroundColor: Colors.white_color,
                    marginTop: (mobileW * 2) / 100,
                    backgroundColor: '#fff',
                    shadowOpacity: 0.3,
                    shadowColor: '#000',
                    shadowOffset: { width: 1, height: 1 },
                    elevation: 5,
                    //   paddingtop: (mobileW * 3) / 100,
                  }}>

                  {/* <View
                      style={{
                        width: '15%',
                        paddingTop: (mobileW * 4) / 100,
                        paddingRight: (mobileW * 2) / 100,
                      }}>
                      <Image
                        source={item.read == '0' ? Icons.rocketicon : Icons.rocket_gray}
                        style={{
                          alignSelf: 'center',
                          width: (mobileW * 8) / 100,
                          height: (mobileW * 8) / 100,

                        }}></Image>
                    </View> */}

                  <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    // backgroundColor: 'red'
                    //   paddingtop: (mobileW * 3) / 100,
                  }}>


                    <View style={{
                      width: '23%',
                      alignItems: 'center',
                      // backgroundColor: 'yellow',
                      paddingTop: (mobileW * 4) / 100,
                      // paddingBottom: (mobileW * 4) / 100,
                    }}>
                      <Image
                        source={item.image == 'NA'
                          || item.image == null
                          || item.image == '' ?
                          Icons.AccountFilled :
                          {
                            uri: config.img_url3 + item.image
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
                        // backgroundColor: 'blue'
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
                            textAlign: config.textRotate,
                            color: Colors.lightgraytext,
                            paddingBottom: (mobileW * 2.1) / 100,
                          }}>{item?.review}</Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          // backgroundColor: 'red',
                          alignSelf: 'flex-end',
                          width: '100%',
                          paddingVertical: (mobileW * 2) / 100,
                        }}>
                        <View style={{
                          // flexDirection: 'row',
                          width: '50%',
                          // backgroundColor: 'red'
                        }}>
                          <View style={{
                          flexDirection: 'row',
                          width: '100%',
                          // backgroundColor: 'red'
                        }}>
                          <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '25%',
                            // backgroundColor: 'yellow'
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
                            // backgroundColor: 'blue',
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
}
