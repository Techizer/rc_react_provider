import React, { Component } from 'react';
import {
  TextInput, Switch, Text, View, ScrollView, Alert,
  StyleSheet, SafeAreaView, Image, TouchableOpacity,
  ImageBackground, Modal, FlatList
} from 'react-native';

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
  
  consolepro,
  handleback,
  Lang_chg,
  apifuntion,
  msgTitle,
} from './Provider/utilslib/Utils';

import Styles from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { AuthInputBoxSec, DropDownboxSec, Button } from './Components'
import { Icons } from './Assets/Icons/IReferences';
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



export default class Withdrawal extends Component {
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
      withdrawalArr: [],
    };
  }

  componentDidMount() {
    this.get_Services()
  }

  reloadList = () => {
    console.log('reloadListreloadListreloadListreloadList');
    this.get_Services()
  }

  get_Services = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log('this.props.pageName:: ', this.props.pageName);


    let apiname = "api-provider-withdrawal-history"


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
      consolepro.consolelog("obj withdrawal", obj.result.withdrawal[0])
      // this.setState({ appoinment_detetails: '' })
      if (obj.status == true) {
        this.setState({
          withdrawalArr: obj.result.withdrawal,
          abal: obj.result.abal,
          content: obj.result.content,
          bankdetails: obj.result.bankdetails,
          message: obj.message
        })
        console.log('obj.result', obj.result, obj.result.paymentdetails[0])



      } else {

        this.setState({
          withdrawalArr: obj.result.withdrawal,
          abal: obj.result.abal,
          content: obj.result.content,
          bankdetails: obj.result.bankdetails,
          message: obj.message
        })
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);

    });

  }

  showConfirmDialogDelete = () => {
    return Alert.alert(
      "Bank Detail",
      "Are you sure you want to delete this bank details?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            this.deleteBankDetails()
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  deleteBankDetails = async (acceptance_status) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let url = config.baseURL + "api-provider-delete-bank-details";
    console.log("url", url)
    // {id:126,service_type:nurse,'acceptance_status':Accept}
    var data = new FormData();
    data.append('user_id', user_id)

    consolepro.consolelog('data', data)
    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.status == true) {
        console.log('obj.result', obj.result)
        // let appoinment_detetails = [...this.state.appoinment_detetails];
        // appoinment_detetails[this.state.index] = { ...appoinment_detetails[this.state.index], key: obj.result[0] };
        this.setState({
          bankdetails: null
        });
        msgProvider.showSuccess(obj.message)
      } else {
        msgProvider.showError(obj.message)
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
                    width: '50%',
                    // backgroundColor: 'red'
                    // alignSelf: 'center', 
                    // flexDirection: 'row', 
                    // justifyContent: 'space-between'
                  }}>
                    <Text
                      style={{
                        // marginLeft: mobileW * 1.5 / 100,
                        textAlign: config.textRotate,
                        color: Colors.buttoncolorhgreen,
                        fontFamily: Font.Regular,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      Available Balance
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '50%',
                      // backgroundColor: 'yellow'
                    }}>
                    <Text
                      style={{
                        textAlign: 'right',
                        color: Colors.buttoncolorhgreen,
                        fontFamily: Font.Medium,
                        fontSize: mobileW * 5 / 100,
                      }}>
                      {this.state.abal}
                    </Text>
                  </View>

                </View>
              </View>

            </View>

            {
              (this.state.withdrawalArr.length > 0) ?
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.withdrawalArr}
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
                                width: '50%',
                                // backgroundColor: 'red'
                                // alignSelf: 'center', 
                                // flexDirection: 'row', 
                                // justifyContent: 'space-between'
                              }}>
                                <Text
                                  style={{
                                    // marginLeft: mobileW * 1.5 / 100,
                                    textAlign: config.textRotate,
                                    color: Colors.placeholdertextcolor,
                                    fontFamily: Font.Regular,
                                    fontSize: mobileW * 3.3 / 100,
                                  }}>
                                  {item?.text}
                                </Text>
                                <Text
                                  style={{
                                    // marginLeft: mobileW * 1.5 / 100,
                                    textAlign: config.textRotate,
                                    color: Colors.splashtextcolor,
                                    fontFamily: Font.Regular,
                                    fontSize: mobileW * 2.5 / 100,
                                  }}>
                                  {item?.date}
                                </Text>
                              </View>



                              <View
                                style={{
                                  width: '50%',
                                  // backgroundColor: 'yellow'
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'right',
                                    color: Colors.placeholdertextcolor,
                                    fontFamily: Font.Regular,
                                    fontSize: mobileW * 3.3 / 100,

                                  }}>
                                  {item?.amount}
                                </Text>

                              </View>

                            </View>

                          </View>

                        </View>
                      </>
                    )
                  }}></FlatList> :
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '90%'
                }}>
                  <Text style={{
                    fontFamily: Font.Regular,
                    fontSize: 16,
                    textTransform: 'capitalize'
                  }}>Withdrawal List Not Found.</Text>
                </View>
            }



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
                              width: '50%',
                              // backgroundColor: 'red'
                              // alignSelf: 'center', 
                              // flexDirection: 'row', 
                              // justifyContent: 'space-between'
                            }}>
                              <Text
                                style={{
                                  // marginLeft: mobileW * 1.5 / 100,
                                  textAlign: config.textRotate,
                                  color: Colors.placeholdertextcolor,
                                  fontFamily: Font.Regular,
                                  fontSize: mobileW * 3.3 / 100,
                                }}>
                                Bank Withdrawal
                              </Text>
                              <Text
                                style={{
                                  // marginLeft: mobileW * 1.5 / 100,
                                  textAlign: config.textRotate,
                                  color: Colors.splashtextcolor,
                                  fontFamily: Font.Regular,
                                  fontSize: mobileW * 2.5 / 100,
                                }}>
                                05-Jan-22
                              </Text>
                            </View>

                            

                            <View
                              style={{
                                width: '50%',
                                // backgroundColor: 'yellow'
                              }}>
                              <Text
                                  style={{
                                    textAlign: 'right',
                                    color: Colors.placeholdertextcolor,
                                    fontFamily: Font.Regular,
                                    fontSize: mobileW * 3.3 / 100,

                                  }}>
                                  -650 SAR
                                </Text>

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

          <View style={{
            backgroundColor: Colors.white_color,
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
                    <Text
                      style={{
                        // marginLeft: mobileW * 1.5 / 100,
                        textAlign: config.textRotate,
                        color: Colors.placeholder_border,
                        fontFamily: Font.Regular,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      {this.state.content?.content}
                    </Text>
                  </View>


                </View>
              </View>
            </View>
          </View>

          {
            (this.state.bankdetails != null) ?
              <View style={{
                backgroundColor: '#C5EAFF61',
                // alignItems: 'center',
                // justifyContent: 'center',
                // marginBottom: 15,
                height: mobileW * 50 / 100
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
                          Connected Bank Account
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
                            this.showConfirmDialogDelete()
                          }}
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={Icons.Cross}
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
                      <View style={{
                        width: '33%',
                        alignSelf: 'center',
                        // flexDirection: 'row', 
                        // justifyContent: 'space-between'
                      }}>
                        <Text
                          style={{
                            // marginLeft: mobileW * 1.5 / 100,
                            textAlign: config.textRotate,
                            color: Colors.textblue,
                            fontFamily: Font.Medium,
                            fontSize: mobileW * 2.5 / 100,
                          }}>Bank:</Text>
                        <Text
                          style={{
                            // marginLeft: mobileW * 1.5 / 100,
                            textAlign: config.textRotate,
                            color: Colors.placeholdertextcolor,
                            fontFamily: Font.Regular,
                            fontSize: mobileW * 3.3 / 100,
                          }}>
                          {this.state.bankdetails?.bank_name}
                        </Text>
                      </View>
                      <View style={{
                        width: '33%',
                        alignSelf: 'center',
                        // flexDirection: 'row', 
                        // justifyContent: 'space-between'
                      }}>
                        <Text
                          style={{
                            // marginLeft: mobileW * 1.5 / 100,
                            textAlign: config.textRotate,
                            color: Colors.textblue,
                            fontFamily: Font.Medium,
                            fontSize: mobileW * 2.5 / 100,
                          }}>A/C Name:</Text>
                        <Text
                          style={{
                            // marginLeft: mobileW * 1.5 / 100,
                            textAlign: config.textRotate,
                            color: Colors.placeholdertextcolor,
                            fontFamily: Font.Regular,
                            fontSize: mobileW * 3.3 / 100,
                          }}>
                          {this.state.bankdetails?.acname}
                        </Text>
                      </View>
                      <View style={{
                        width: '33%',
                        alignSelf: 'center',
                        // flexDirection: 'row', 
                        // justifyContent: 'space-between'
                      }}>
                        <Text
                          style={{
                            // marginLeft: mobileW * 1.5 / 100,
                            textAlign: config.textRotate,
                            color: Colors.textblue,
                            fontFamily: Font.Medium,
                            fontSize: mobileW * 2.5 / 100,
                          }}>A/C No:</Text>
                        <Text
                          style={{
                            // marginLeft: mobileW * 1.5 / 100,
                            textAlign: config.textRotate,
                            color: Colors.placeholdertextcolor,
                            fontFamily: Font.Regular,
                            fontSize: mobileW * 3.3 / 100,
                          }}>
                          {this.state.bankdetails?.account_no}
                        </Text>
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
                      <View style={{
                        width: '100%',
                        alignSelf: 'center',
                        // flexDirection: 'row', 
                        // justifyContent: 'space-between'
                      }}>
                        <Text
                          style={{
                            // marginLeft: mobileW * 1.5 / 100,
                            textAlign: config.textRotate,
                            color: Colors.textblue,
                            fontFamily: Font.Medium,
                            fontSize: mobileW * 2.5 / 100,
                          }}>Address:</Text>
                        <Text
                          style={{
                            // marginLeft: mobileW * 1.5 / 100,
                            textAlign: config.textRotate,
                            color: Colors.placeholder_border,
                            fontFamily: Font.Regular,
                            fontSize: mobileW * 3.6 / 100,
                          }}>
                          {this.state.bankdetails?.address}
                        </Text>
                      </View>


                    </View>
                  </View>
                </View>
              </View> :
              <View style={{
                // marginTop: 15,
                // marginBottom: 20,
                paddingLeft: 15,
                paddingRight: 15,
                paddingBottom: 40,
                backgroundColor: 'white'
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
                      width: '50%',
                      // backgroundColor: 'red'
                      // alignSelf: 'center', 
                      // flexDirection: 'row', 
                      // justifyContent: 'space-between'
                    }}>
                      <Text
                        style={{
                          // marginLeft: mobileW * 1.5 / 100,
                          textAlign: config.textRotate,
                          // color: Colors.buttoncolorhgreen,
                          fontFamily: Font.Regular,
                          fontSize: mobileW * 3.6 / 100,
                        }}>
                        Bank Account
                      </Text>
                    </View>

                    <View
                      style={{
                        width: '50%',
                        // backgroundColor: 'yellow'
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('AddBank',{
                            reloadList: this.reloadList.bind(this)
                          })
                        }}>
                        <Text
                          style={{
                            textAlign: 'right',
                            color: Colors.textblue,
                            fontFamily: Font.Medium,
                            fontSize: mobileW * 3.6 / 100,
                          }}>
                          Add bank
                        </Text>
                      </TouchableOpacity>
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
