import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { Colors, Font, Configurations, mobileW, localStorage, API } from '../Helpers/Utils';

import { Icons } from '../Assets/Icons/IReferences';

export default Transaction = ({ navigation, route, page, pageName }) => {

  const [classStateData, setClassStateData] = useState({
    message: '',
    isBottomBoxShow: true,
    transactionArr: [],
  })

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  useEffect(() => {
    getServices()
  }, [])

  const getServices = async () => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log('pageName:: ', pageName);
    let currency_symbol = user_details['currency_symbol']

    setState({
      currency_symbol: currency_symbol
    })

    let apiname = "api-provider-transactions-history"


    let apishow = apiname

    let url = Configurations.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    data.append('user_id', user_id)
    data.append('service_type', user_type)

    API.post(url, data).then((obj) => {
      if (obj.status == true) {
        setState({
          transactionArr: obj.result.paymentdetails,
          percentage: obj.result.percentage,
          content: obj.result.content,
          message: obj.message
        })
      } else {

        setState({
          transactionArr: obj.result.paymentdetails,
          percentage: obj.result.percentage,
          content: obj.result.content,
          message: obj.message
        })
        console.log('obj.result', obj.result)
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
                  width: '27%',
                }}>
                  <Text
                    style={{
                      textAlign: Configurations.textRotate,
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
                  }}>
                  <Text
                    style={{
                      textAlign: Configurations.textRotate,
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
                    paddingRight: '4%',
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      textAlign: Configurations.textRotate,
                      color: Colors.placeholder_text_color,
                      fontFamily: Font.Medium,
                      fontSize: mobileW * 3.6 / 100,
                    }}>
                    Provider
                  </Text>
                  <Text
                    style={{
                      textAlign: Configurations.textRotate,
                      color: Colors.textblue,
                      fontFamily: Font.Regular,
                      fontSize: mobileW * 2.5 / 100,
                    }}>
                    Fee ({classStateData.currency_symbol})
                  </Text>
                </View>

                <View
                  style={{
                    width: '18%',
                    paddingRight: '4%',
                    alignItems: 'center'
                  }}>
                  <Text
                    style={{
                      textAlign: Configurations.textRotate,
                      color: Colors.placeholder_text_color,
                      fontFamily: Font.Medium,
                      fontSize: mobileW * 3.6 / 100,
                    }}>
                    Admin
                  </Text>
                  <Text
                    style={{
                      textAlign: Configurations.textRotate,
                      color: Colors.textblue,
                      fontFamily: Font.Regular,
                      fontSize: mobileW * 2.5 / 100,
                    }}>
                    Fee ({classStateData.currency_symbol})
                  </Text>
                </View>

                <View
                  style={{
                    width: '15%',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
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
            data={classStateData.transactionArr}
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
                          width: '27%',
                        }}>
                          <Text
                            style={{
                              textAlign: Configurations.textRotate,
                              color: Colors.textblue,
                              fontFamily: Font.Regular,
                              fontSize: mobileW * 2.5 / 100,
                            }}>
                            {item?.order_id}
                          </Text>
                        </View>

                        <View
                          style={{
                            width: '20%',
                          }}>
                          <Text
                            style={{
                              textAlign: Configurations.textRotate,
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
                            paddingRight: '4%'
                          }}>

                          <Text
                            style={{
                              textAlign: 'right',
                              color: Colors.placeholder_text_color,
                              fontFamily: Font.Regular,
                              fontSize: mobileW * 3 / 100,
                            }}>
                            {item?.price}
                          </Text>
                        </View>

                        <View
                          style={{
                            width: '18%',
                            paddingRight: '4%'
                          }}>

                          <Text
                            style={{
                              textAlign: 'right',
                              color: Colors.placeholder_text_color,
                              fontFamily: Font.Regular,
                              fontSize: mobileW * 3 / 100,
                            }}>
                            {item?.paymentType}
                          </Text>
                        </View>

                        <View
                          style={{
                            width: '15%',
                          }}>
                          <Text
                              style={{
                                color: Colors[item?.paymentStatus],
                                fontFamily: Font.Medium,
                                fontSize: mobileW * 2.3 / 100,
                                textAlign: 'center'

                              }}>
                              {item?.paymentStatus}
                            </Text>

                        </View>

                      </View>

                    </View>

                  </View>
                </>
              )
            }}/>

        </View>

        {
          (classStateData.isBottomBoxShow) &&
          <View style={{
            backgroundColor: '#C5EAFF61',
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
                  }}>
                  <View style={{ width: '50%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text
                      style={{
                        textAlign: Configurations.textRotate,
                        color: Colors.textblue,
                        fontFamily: Font.Regular,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      {classStateData.content?.heading}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: '50%',
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setState({
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
                  <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <HTMLView
                      value={classStateData.content?.content}
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
