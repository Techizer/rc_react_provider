import React, { Component, useEffect, useState } from 'react';
import {
  TextInput, Switch, Text, View, ScrollView, Alert,
  StyleSheet, SafeAreaView, Image, TouchableOpacity,
  ImageBackground, Modal, FlatList
} from 'react-native';

import {
  Colors,
  Font,
  mobileH,
  MessageFunctions,
  MessageTexts,
  config,
  mobileW,
  localStorage,


  handleback,
  LanguageConfiguration,
  API,
  MessageHeadings,
} from '../Helpers/Utils';

import Styles from '../Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { AuthInputBoxSec, DropDownboxSec, Button } from '../Components'
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';

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

export default Withdrawal = ({ navigation, route }) => {
  const [classStateData, setClassStateData] = useState({
    abal: '',
    content: null,
    bankdetails: null,
    message: '',
    withdrawalArr: [],
  })

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  useEffect(() => {
    getServices()
  }, [])

  const reloadList = () => {
    console.log('reloadListreloadListreloadListreloadList');
    getServices()
  }

  const getServices = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']


    let apiname = "api-provider-withdrawal-history"


    let apishow = apiname

    let url = config.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    data.append('user_id', user_id)
    data.append('service_type', user_type)
    
    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        setState({
          withdrawalArr: obj.result.withdrawal,
          abal: obj.result.abal,
          content: obj.result.content,
          bankdetails: obj.result.bankdetails,
          message: obj.message
        })
        console.log('obj.result', obj.result, obj.result.paymentdetails[0])



      } else {

        setState({
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
      console.log("-------- error ------- ", error)

    });

  }

  const showConfirmDialogDelete = () => {
    return Alert.alert(
      "Bank Detail",
      "Are you sure you want to delete this bank details?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            deleteBankDetails()
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  const deleteBankDetails = async (acceptance_status) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let url = config.baseURL + "api-provider-delete-bank-details";
    console.log("url", url)
    var data = new FormData();
    data.append('user_id', user_id)


    API.post(url, data).then((obj) => {

      if (obj.status == true) {
        console.log('obj.result', obj.result)
        setState({
          bankdetails: null
        });
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
    });

  }

  return (
    <View style={{
      flex: 1,
    }}>
      <View
        style={{
          flex: 1,
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
                    {classStateData.abal}
                  </Text>
                </View>

              </View>
            </View>

          </View>

          {
            (classStateData.withdrawalArr.length > 0) ?
              <FlatList
                showsVerticalScrollIndicator={false}
                data={classStateData.withdrawalArr}
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

        </View>

        <View style={{
          backgroundColor: Colors.white_color,
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
                    {classStateData.content?.heading}
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
                    {classStateData.content?.content}
                  </Text>
                </View>


              </View>
            </View>
          </View>
        </View>

        {
          (classStateData.bankdetails != null) ?
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
                          showConfirmDialogDelete()
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
                        {classStateData.bankdetails?.bank_name}
                      </Text>
                    </View>
                    <View style={{
                      width: '33%',
                      alignSelf: 'center',
                    }}>
                      <Text
                        style={{
                          textAlign: config.textRotate,
                          color: Colors.textblue,
                          fontFamily: Font.Medium,
                          fontSize: mobileW * 2.5 / 100,
                        }}>A/C Name:</Text>
                      <Text
                        style={{
                          textAlign: config.textRotate,
                          color: Colors.placeholdertextcolor,
                          fontFamily: Font.Regular,
                          fontSize: mobileW * 3.3 / 100,
                        }}>
                        {classStateData.bankdetails?.acname}
                      </Text>
                    </View>
                    <View style={{
                      width: '33%',
                      alignSelf: 'center',
                    }}>
                      <Text
                        style={{
                          textAlign: config.textRotate,
                          color: Colors.textblue,
                          fontFamily: Font.Medium,
                          fontSize: mobileW * 2.5 / 100,
                        }}>A/C No:</Text>
                      <Text
                        style={{
                          textAlign: config.textRotate,
                          color: Colors.placeholdertextcolor,
                          fontFamily: Font.Regular,
                          fontSize: mobileW * 3.3 / 100,
                        }}>
                        {classStateData.bankdetails?.account_no}
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
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{
                      width: '100%',
                      alignSelf: 'center',
                    }}>
                      <Text
                        style={{
                          textAlign: config.textRotate,
                          color: Colors.textblue,
                          fontFamily: Font.Medium,
                          fontSize: mobileW * 2.5 / 100,
                        }}>Address:</Text>
                      <Text
                        style={{
                          textAlign: config.textRotate,
                          color: Colors.placeholder_border,
                          fontFamily: Font.Regular,
                          fontSize: mobileW * 3.6 / 100,
                        }}>
                        {classStateData.bankdetails?.address}
                      </Text>
                    </View>


                  </View>
                </View>
              </View>
            </View> :
            <View style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingBottom: 40,
              backgroundColor: 'white'
            }}>

              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}>
                  <View style={{
                    width: '50%',
                  }}>
                    <Text
                      style={{
                        textAlign: config.textRotate,
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
                        navigation.navigate(ScreenReferences.AddBankInformation, {
                          reloadList: reloadList
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
