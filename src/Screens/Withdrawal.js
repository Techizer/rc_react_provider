import React, { useEffect, useState } from 'react';
import { Text, View, Alert, Image, TouchableOpacity, FlatList } from 'react-native';
import { Colors, Font, MessageFunctions, Configurations, mobileW, API, windowHeight } from '../Helpers/Utils';
import { Icons } from '../Assets/Icons/IReferences';
import { ScreenReferences } from '../Stacks/ScreenReferences';
import { useDispatch, useSelector } from 'react-redux';
import { s } from 'react-native-size-matters';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { setLastScreen } from '../Redux/Actions/UserActions';

export default Withdrawal = ({ navigation, route }) => {

  const [classStateData, setClassStateData] = useState({
    abal: '',
    content: null,
    bankdetails: null,
    message: '',
    withdrawalArr: [],
    isLoading: true
  })

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }


  const {
    loginUserData
  } = useSelector(state => state.StorageReducer)

  const isPartOfHospital = ((loginUserData?.hospital_id != '' ) && (loginUserData?.hospital_id != null ))


  useEffect(() => {
    getWithdrawalList()
  }, [])

  const reloadList = () => {
    getWithdrawalList()
  }

  const getWithdrawalList = async () => {
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

    API.post(url, data, 1).then((obj) => {

      if (obj.status == true) {
        console.log('Bank details', obj?.result?.bankdetails)
        setState({
          withdrawalArr: obj.result.withdrawal,
          abal: obj.result.abal,
          content: obj.result.content,
          bankdetails: obj.result.bankdetails,
          message: obj.message,
          isLoading: false
        })
      } else {

        setState({
          withdrawalArr: obj.result.withdrawal,
          abal: obj.result.abal,
          content: obj.result.content,
          bankdetails: obj.result.bankdetails,
          message: obj.message,
          isLoading: false
        })
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      if (!classStateData.isLoading) {
        setState({ isLoading: false })
      }
    }).finally(() => {

      setState({ isLoading: false })
    })

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
      backgroundColor: 'white',
    }}>
      {
        (!classStateData.isLoading) ?
          <FlatList
            showsVerticalScrollIndicator={false}
            data={classStateData.withdrawalArr}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            ListHeaderComponent={() => (
              <View
                style={{
                  width: '100%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  marginTop: 15,
                  marginBottom: 15,
                  paddingLeft: 15,
                  paddingRight: 15
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
            )}
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
            }}
            ListEmptyComponent={() => (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
                marginTop: windowHeight / 5.5
              }}>
                <Text style={{
                  fontFamily: Font.Regular,
                  fontSize: 16,
                  textTransform: 'capitalize'
                }}>No Withdrawals Found</Text>
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View style={{ marginVertical: s(1) }} />
            )}
            refreshing={classStateData.isLoading}
            onRefresh={reloadList} /> :

          <FlatList
            showsVerticalScrollIndicator={false}
            data={[1, 2, 3]}
            nestedScrollEnabled={true}
            ListHeaderComponent={() => (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item height={(mobileW * 13) / 100} paddingLeft={15} paddingRight={15} marginVertical={15} />
              </SkeletonPlaceholder>
            )}
            renderItem={({ item, index }) => (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item height={(mobileW * 12) / 100} paddingLeft={15} paddingRight={15} marginBottom={5} />
              </SkeletonPlaceholder>
            )
            }
            ItemSeparatorComponent={() => (
              <View style={{ marginVertical: s(1) }} />
            )}/>

      }
      {!classStateData.isLoading &&
        <>
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
            !isPartOfHospital &&
            <>
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
                                fontSize: mobileW * 3.2 / 100,
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
                                fontSize: mobileW * 3.2 / 100,
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
                                fontSize: mobileW * 3.2 / 100,
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
                            width: '33%',
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
                                fontSize: mobileW * 3.2 / 100,
                              }}>
                              {classStateData.bankdetails?.address}
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
                              }}>IBAN No:</Text>
                            <Text
                              style={{
                                textAlign: Configurations.textRotate,
                                color: Colors.placeholder_border,
                                fontFamily: Font.Regular,
                                fontSize: mobileW * 3.2 / 100,
                              }}>
                              {classStateData.bankdetails?.iban_no}
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
                              }}>Swift Code:</Text>
                            <Text
                              style={{
                                textAlign: Configurations.textRotate,
                                color: Colors.placeholder_border,
                                fontFamily: Font.Regular,
                                fontSize: mobileW * 3.2 / 100,
                              }}>
                              {classStateData.bankdetails?.swift_no}
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

            </>
          }

        </>
      }
    </View>
  );

}
