import React, { useEffect, useState } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, FlatList } from 'react-native';
import { Colors, Font, MessageFunctions, Configurations, mobileW, API } from '../Helpers/Utils';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useSelector } from 'react-redux';

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


  const {
    loginUserData
  } = useSelector(state => state.Auth)


  useEffect(() => {
    getServices()
  }, [])

  const reloadList = () => {
    console.log('reloadListreloadListreloadListreloadList');
    getServices()
  }

  const getServices = async () => {
    let user_details = loginUserData
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']


    let apiname = "api-provider-withdrawal-history"


    let apishow = apiname

    let url = Configurations.baseURL + apishow;
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
    let user_details = loginUserData
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let url = Configurations.baseURL + "api-provider-delete-bank-details";
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
                      textAlign: Configurations.textRotate,
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
                          backgroundColor: '#FBFBFB', 
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
                            }}>
                            <View style={{
                              width: '50%',
                            }}>
                              <Text
                                style={{
                                  textAlign: Configurations.textRotate,
                                  color: Colors.placeholdertextcolor,
                                  fontFamily: Font.Regular,
                                  fontSize: mobileW * 3.3 / 100,
                                }}>
                                {item?.text}
                              </Text>
                              <Text
                                style={{
                                  textAlign: Configurations.textRotate,
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
                      textAlign: Configurations.textRotate,
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
                      textAlign: Configurations.textRotate,
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
                          textAlign: Configurations.textRotate,
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
                          textAlign: Configurations.textRotate,
                          color: Colors.textblue,
                          fontFamily: Font.Medium,
                          fontSize: mobileW * 2.5 / 100,
                        }}>Bank:</Text>
                      <Text
                        style={{
                          // marginLeft: mobileW * 1.5 / 100,
                          textAlign: Configurations.textRotate,
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
                          textAlign: Configurations.textRotate,
                          color: Colors.textblue,
                          fontFamily: Font.Medium,
                          fontSize: mobileW * 2.5 / 100,
                        }}>A/C Name:</Text>
                      <Text
                        style={{
                          textAlign: Configurations.textRotate,
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
                          textAlign: Configurations.textRotate,
                          color: Colors.textblue,
                          fontFamily: Font.Medium,
                          fontSize: mobileW * 2.5 / 100,
                        }}>A/C No:</Text>
                      <Text
                        style={{
                          textAlign: Configurations.textRotate,
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
                          textAlign: Configurations.textRotate,
                          color: Colors.textblue,
                          fontFamily: Font.Medium,
                          fontSize: mobileW * 2.5 / 100,
                        }}>Address:</Text>
                      <Text
                        style={{
                          textAlign: Configurations.textRotate,
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
                        textAlign: Configurations.textRotate,
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
