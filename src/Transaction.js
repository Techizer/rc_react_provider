import React, { Component } from 'react';
import { TextInput, Switch, Text, View, ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList } from 'react-native';
import HTMLView from 'react-native-htmlview';
import {
  Colors,
  Font,
  mobileH,
  Mapprovider,
  msgProvider,
  msgText,
  config,
  mobileW,
  localStorage,
  localimag,
  consolepro,
  handleback,
  Lang_chg,
  apifuntion,
  msgTitle,
} from './Provider/utilslib/Utils';

import Styles from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from './Footer';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { AuthInputBoxSec, DropDownboxSec, Button } from './components'
const taskArr = [
  {
    id: 1,
    value: 'Injection / Home IV therapy',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Post surgical care',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Bladder wash',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Enema',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Muscle Injection',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Ear Piercing',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Wound Care',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Enema',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Muscle Injection',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Ear Piercing',
    symbol: 'km',
    status: true,
  },
  {
    id: 1,
    value: 'Wound Care',
    symbol: 'km',
    status: true,
  },
]



export default class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: Lang_chg.MyAppointments[config.language],
      modalVisible: false,
      All: true,

      Nurse: false,
      Babysitter: false,
      Listenquiries: false,
      Physiotherapist: false,
      service_status: "",
      manageTab: 'All',
      appoinment_detetails: '',
      pass_status: 'all',
      time_take_data: '',
      rescdule_data: '',
      notification_count: '',
      date_array: '',
      send_id: '',
      message: '',
      api_status: 3,
      // tabheadings: tabheadings,
      task_details: "",
      isEnabled: false,
      isBottomBoxShow: true,
      transactionArr: [],
      colorArrStatus: {
        "Pending" : "#F9D800",
        "Paid" : "#4FB82A",
        "Accepted" : "#4FB82A",
        "Completed" : "#4FB82A",
        "Success" : "#4FB82A",
        "Cancelled" : "#FF4E00",
        "Rejected" : "#FF4E00",
        "Else" : "#515C6F",
      }
    };
  }
  componentDidMount() {
    this.get_Services()
  }

  get_Services = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log('this.props.pageName:: ', this.props.pageName);
    let currency_symbol = user_details['currency_symbol']

    this.setState({
      currency_symbol: currency_symbol
    })

    let apiname = "api-provider-transactions-history"


    let apishow = apiname //"api-provider-past-appointment-list" //"api-patient-all-appointment"

    let url = config.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    // data.append('lgoin_user_id', user_id)
    data.append('user_id', user_id)
    data.append('service_type', user_type)



    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      // this.setState({ appoinment_detetails: '' })
      if (obj.status == true) {
        this.setState({
          transactionArr: obj.result.paymentdetails,
          percentage: obj.result.percentage,
          content: obj.result.content,
          message: obj.message
        })
        console.log('obj.result', obj.result, obj.result.paymentdetails[0])



      } else {

        this.setState({
          transactionArr: obj.result.paymentdetails,
          percentage: obj.result.percentage,
          content: obj.result.content,
          message: obj.message
        })
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);

    });

  }

  render() {
    const { modalVisible } = this.state;
    var rescdule = this.state.rescdule_data

    return (
      <View style={{
        flex: 1,
        //  backgroundColor: 'white',
      }}>
        <View
          style={{
            flex: 1,
            // paddingBottom: (mobileW * 10) / 100
          }}

        >

          <View style={{
            flex: 1,
            backgroundColor: 'white',
            //  marginBottom: (mobileW * 10) / 100
          }}>


            <View style={{
              marginTop: 15,
              marginBottom: 15,
              paddingLeft: 15,
              paddingRight: 15
            }}>

              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  // marginTop: (mobileW * 3) / 100,
                  // marginBottom: (mobileW * 2.5 / 100),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    // backgroundColor: 'red'
                  }}>
                  <View style={{
                    width: '20%',
                    // backgroundColor: 'red'
                    // alignSelf: 'center', 
                    // flexDirection: 'row', 
                    // justifyContent: 'space-between'
                  }}>
                    <Text
                      style={{
                        // marginLeft: mobileW * 1.5 / 100,
                        textAlign: config.textRotate,
                        color: Colors.placeholder_text_color,
                        fontFamily: Font.Medium,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      Id
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '20%',
                      // backgroundColor: 'yellow'
                    }}>
                    <Text
                      style={{
                        textAlign: config.textRotate,
                        color: Colors.placeholder_text_color,
                        fontFamily: Font.Medium,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      Date
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '20%',
                      // backgroundColor: 'blue'
                    }}>
                    <Text
                      style={{
                        textAlign: config.textRotate,
                        color: Colors.placeholder_text_color,
                        fontFamily: Font.Medium,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      Provider
                    </Text>
                    <Text
                      style={{
                        textAlign: config.textRotate,
                        color: Colors.textblue,
                        fontFamily: Font.Regular,
                        fontSize: mobileW * 2.5 / 100,
                      }}>
                      Fee ({this.state.currency_symbol})
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '20%',
                      // backgroundColor: 'red'
                    }}>
                    <Text
                      style={{
                        textAlign: config.textRotate,
                        color: Colors.placeholder_text_color,
                        fontFamily: Font.Medium,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      Admin
                    </Text>
                    <Text
                      style={{
                        textAlign: config.textRotate,
                        color: Colors.textblue,
                        fontFamily: Font.Regular,
                        fontSize: mobileW * 2.5 / 100,
                      }}>
                      Fee ({this.state.currency_symbol})
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '20%',
                      // backgroundColor: 'yellow'
                    }}>
                    <Text
                      style={{
                        textAlign: config.textRotate,
                        color: Colors.placeholder_text_color,
                        fontFamily: Font.Medium,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      Status
                    </Text>
                  </View>

                </View>
              </View>

            </View>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.transactionArr}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <View>

                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        backgroundColor: '#FBFBFB', //Colors.tab_background_color, //'#E5E5E5',
                        // backgroundColor: (index == taskArr.length - 1) ? '#E5E5E5' : '#FBFBFB',
                        height: (mobileW * 12) / 100,
                        paddingLeft: 15,
                        paddingRight: 15,
                        marginBottom: 5
                      }}>

                        <View
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            // backgroundColor: 'red'
                          }}>
                          <View style={{
                            width: '20%',
                            // backgroundColor: 'red'
                            // alignSelf: 'center', 
                            // flexDirection: 'row', 
                            // justifyContent: 'space-between'
                          }}>
                            <Text
                              style={{
                                // marginLeft: mobileW * 1.5 / 100,
                                textAlign: config.textRotate,
                                color: Colors.textblue,
                                fontFamily: Font.Regular,
                                fontSize: mobileW * 3 / 100,
                              }}>
                              {item?.order_id}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: '20%',
                              // backgroundColor: 'yellow'
                            }}>
                            <Text
                              style={{
                                textAlign: config.textRotate,
                                color: Colors.placeholder_text_color,
                                fontFamily: Font.Regular,
                                fontSize: mobileW * 3 / 100,
                              }}>
                              {item?.date}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: '20%',
                              // backgroundColor: 'blue'
                            }}>

                            <Text
                              style={{
                                textAlign: config.textRotate,
                                color: Colors.placeholder_text_color,
                                fontFamily: Font.Regular,
                                fontSize: mobileW * 3 / 100,
                              }}>
                              {item?.price}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: '20%',
                              // backgroundColor: 'red'
                            }}>

                            <Text
                              style={{
                                textAlign: config.textRotate,
                                color: Colors.placeholder_text_color,
                                fontFamily: Font.Regular,
                                fontSize: mobileW * 3 / 100,
                              }}>
                              {item?.paymentType}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: '20%',
                              // backgroundColor: 'yellow'
                            }}>
                            <View style={{
                              backgroundColor: Colors[item?.paymentStatus], //'#4FB82A',
                              height: mobileW * 5 / 100,
                              width: mobileW * 15 / 100,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 3
                            }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color: Colors.white_color,
                                  fontFamily: Font.Medium,
                                  fontSize: mobileW * 2.3 / 100,

                                }}>
                                {item?.paymentStatus}
                              </Text>
                            </View>

                          </View>

                        </View>

                      </View>

                    </View>
                  </>
                )
              }}></FlatList>


            {/* <ScrollView
              style={{ backgroundColor: 'white', marginTop: 0 }}
              contentContainerStyle={{ paddingBottom: mobileW * 5 / 100 }}
              showsVerticalScrollIndicator={false}>

              {
                taskArr.map((item, index) => {
                  return (
                    <>
                      <View>

                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '100%',
                          backgroundColor: '#FBFBFB', //Colors.tab_background_color, //'#E5E5E5',
                          // backgroundColor: (index == taskArr.length - 1) ? '#E5E5E5' : '#FBFBFB',
                          height: (mobileW * 12) / 100,
                          paddingLeft: 15,
                          paddingRight: 15,
                          marginBottom: 5
                        }}>

                          <View
                            style={{
                              width: '100%',
                              alignSelf: 'center',
                              flexDirection: 'row',
                              // backgroundColor: 'red'
                            }}>
                            <View style={{
                              width: '20%',
                              // backgroundColor: 'red'
                              // alignSelf: 'center', 
                              // flexDirection: 'row', 
                              // justifyContent: 'space-between'
                            }}>
                              <Text
                                style={{
                                  // marginLeft: mobileW * 1.5 / 100,
                                  textAlign: config.textRotate,
                                  color: Colors.textblue,
                                  fontFamily: Font.Regular,
                                  fontSize: mobileW * 3 / 100,
                                }}>
                                ORD84059
                              </Text>
                            </View>

                            <View
                              style={{
                                width: '20%',
                                // backgroundColor: 'yellow'
                              }}>
                              <Text
                                style={{
                                  textAlign: config.textRotate,
                                  color: Colors.placeholder_text_color,
                                  fontFamily: Font.Regular,
                                  fontSize: mobileW * 3 / 100,
                                }}>
                                27/05/22
                              </Text>
                            </View>

                            <View
                              style={{
                                width: '20%',
                                // backgroundColor: 'blue'
                              }}>

                              <Text
                                style={{
                                  textAlign: config.textRotate,
                                  color: Colors.placeholder_text_color,
                                  fontFamily: Font.Regular,
                                  fontSize: mobileW * 3 / 100,
                                }}>
                                4862.00
                              </Text>
                            </View>

                            <View
                              style={{
                                width: '20%',
                                // backgroundColor: 'red'
                              }}>

                              <Text
                                style={{
                                  textAlign: config.textRotate,
                                  color: Colors.placeholder_text_color,
                                  fontFamily: Font.Regular,
                                  fontSize: mobileW * 3 / 100,
                                }}>
                                1623.6
                              </Text>
                            </View>

                            <View
                              style={{
                                width: '20%',
                                // backgroundColor: 'yellow'
                              }}>
                              <View style={{
                                backgroundColor: '#4FB82A',
                                height: mobileW * 5 / 100,
                                width: mobileW * 15 / 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 3
                              }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    color: Colors.white_color,
                                    fontFamily: Font.Medium,
                                    fontSize: mobileW * 2.3 / 100,

                                  }}>
                                  Cancelled
                                </Text>
                              </View>

                            </View>

                          </View>

                        </View>

                      </View>
                    </>
                  )
                })
              }



            </ScrollView> */}
          </View>

          {
            (this.state.isBottomBoxShow) &&
            <View style={{
              backgroundColor: '#C5EAFF61',
              // alignItems: 'center',
              // justifyContent: 'center',
              // marginBottom: 15,
              height: mobileW * 38 / 100
            }}>
              <View style={{
                marginTop: 15,
                paddingLeft: 15,
                paddingRight: 15
              }}>
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    // marginTop: (mobileW * 3) / 100,
                    // marginBottom: (mobileW * 2 / 100),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      // backgroundColor: 'red'
                    }}>
                    <View style={{ width: '50%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text
                        style={{
                          // marginLeft: mobileW * 1.5 / 100,
                          textAlign: config.textRotate,
                          color: Colors.textblue,
                          fontFamily: Font.Regular,
                          fontSize: mobileW * 3.6 / 100,
                        }}>
                        {this.state.content?.heading}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: '50%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        // justifyContent:'space-between'
                        // backgroundColor: 'red',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            isBottomBoxShow: false
                          })
                        }}
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={localimag.cross}
                          style={{
                            width: mobileW * 6 / 100,
                            height: mobileW * 6 / 100,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{
                marginTop: 15,
                paddingLeft: 15,
                paddingRight: 15
              }}>
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    // marginTop: (mobileW * 3) / 100,
                    // marginBottom: (mobileW * 2 / 100),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      // backgroundColor: 'red'
                    }}>
                    <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <HTMLView
                        value={this.state.content?.content}

                        //stylesheet={HTMLstyles}
                      />
                    </View>


                  </View>
                </View>
              </View>
            </View>
          }


        </View>
      </View>
    );
  }
}
