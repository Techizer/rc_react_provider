import React, { useEffect, useState } from 'react';
import { TextInput, Switch, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Colors,
  Font,
  MessageFunctions,
  Configurations,
  mobileW,
  API,
  windowWidth
} from '../Helpers/Utils';

import Styles from '../Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../Components'
import { useSelector } from 'react-redux';
import { s, vs } from 'react-native-size-matters';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import StickyButton from '../Components/StickyButton';

export default PriceList = ({ navigation, route, pageName, page }) => {
  const [classStateData, setClassStateData] = useState({
    message: '',
    taskArr: [],
    isLoading: true,
    isLoadingInPostButton: false
  })

  const setState = payload => {
    setClassStateData(prev => ({ ...prev, ...payload }))
  }

  useEffect(() => {
    getPriceList()
  }, [])

  const {
    loginUserData
  } = useSelector(state => state.StorageReducer)

  const getPriceList = async () => {
    let user_details = loginUserData
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    let currency_symbol = user_details['currency_symbol']
    setState({
      currency_symbol: currency_symbol,
      isLoading: true
    })

    let apiname = (page == "tests") ?
      "api-get-lab-task" :
      (page == "onlineconsultation" || page == "homeconsultation") ?
        "api-doctor-get-price" : "api-provider-get-price-list"

    let url = Configurations.baseURL + apiname;

    var data = new FormData();
    data.append('user_id', user_id)

    let task_type = ""
    if (page == "tests") {
      task_type = "task_base"
    }
    else if (page == "onlineconsultation") {
      task_type = "online"
    } else if (page == "homeconsultation") {
      task_type = "home_visit"
    } else if (page == "task") {
      task_type = "task_base"
    } else {
      task_type = "hour_base"
    }
    data.append('task_type', task_type)
    data.append('service_type', user_type)

    API.post(url, data, 1).then((obj) => {
      console.log("obj::: ", task_type, obj)
      if (obj.status == true) {
        setState({
          taskArr: (obj.result == null) ? [] : obj.result,
          message: obj.message,
          isLoading: false
        })
        console.log('obj.result', task_type, obj.result)
      } else {
        setState({
          taskArr: obj.result,
          message: obj.message,
          isLoading: false
        })
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)
      setState({
        isLoading: false
      })
    });

  }

  const submitPress = () => {
    if (classStateData.taskArr.length > 0) {
      var isError = false;
      var taskId = ''
      var taskPrice = ''
      var sep = ''
      const enabledTasksCount = classStateData.taskArr.filter(task => task?.isChecked === true).length
      console.log({ enabledTasksCount });

      if (enabledTasksCount <= 0) {
        MessageFunctions.showError("You must switch on at list 'One Item' to make yourself available for the booking.")
      } else {
        classStateData.taskArr.map((item, index) => {
          if (item?.isChecked) {
            let price = (item?.price != '') ? parseFloat(item?.price) : 0
            if (price <= 0) {
              isError = true
            } else {
              taskId = taskId + sep + item?.id
              taskPrice = taskPrice + sep + item?.price
              sep = ','
            }
          }
        })
        if (isError) {
          MessageFunctions.showError("Selected slot must have a valid price")
        } else {
          insertUpdatePriceList(taskId, taskPrice)
        }
      }
    }
  }

  const insertUpdatePriceList = async (taskId, taskPrice) => {
    let user_details = loginUserData
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']

    setState({
      isLoadingInPostButton: true
    })

    let apiname = (page == "tests") ?
      "api-add-lab-task_price" :
      (page == "onlineconsultation" || page == "homeconsultation") ?
        "api-doctor-insertupdate-price" : "api-provider-insert-update-price-list"

    let url = Configurations.baseURL + apiname;
    console.log("url", url)

    var data = new FormData();
    data.append('user_id', user_id)

    let task_type = ""
    if (page == "tests") {
      task_type = "task_base"
    } else if (page == "onlineconsultation") {
      task_type = "online"
    } else if (page == "homeconsultation") {
      task_type = "home_visit"
    } else if (page == "task") {
      task_type = "task_base"
    } else {
      task_type = "hour_base"
    }
    data.append('task_type', task_type)
    data.append('service_type', user_type)
    data.append('task_id', taskId)
    data.append('price', taskPrice)

    console.log('PriceListData is', data);

    API.post(url, data, 1).then((obj) => {
      if (obj.status == true) {
        MessageFunctions.showSuccess(obj.message)
        console.log('obj.result', obj.result)

      } else {
        MessageFunctions.showError(obj.message)
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)

    }).finally(() => {

      setState({
        isLoadingInPostButton: false
      })
    })

  }

  let text = ''

  if (page == "tests") {
    text = "Switch on the 'Tests' available for home collection service, enter the appropriate amount."
  } else if (page == "onlineconsultation") {
    text = "Switch on the 'Online Consultation' if you wish to provide service, enter the appropriate amount."
  } else if (page == "homeconsultation") {
    text = "Switch on the 'Home Visit' if you wish to provide service, enter the appropriate amount."
  } else if (page == "task") {
    text = "Switch on the 'Task' as you wish to provide service, enter the appropriate amount in each task."
  } else {
    text = "Switch on the 'Hours' as you wish to provide service, enter the appropriate amount for each hourly slot."
  }


  return (
    <View style={{
      flex: 1,
    }}>
      <View style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
        <View style={{
          marginTop: 10,
          paddingLeft: 15,
          paddingRight: 15,
        }}>
          <Text style={[Styles.textcontent, {
            marginTop: 6
          }]}>{text}</Text>
        </View>

        <View style={{
          marginTop: 12,
          marginLeft: 15,
          paddingRight: 15,
          borderBottomColor: Colors.field_border_color,
          borderBottomWidth: 1
        }} />

        <View style={{
          marginTop: 10,
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
              <View style={{ width: '60%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    textAlign: Configurations.textRotate,
                    color: Colors.placeholder_text,
                    fontFamily: Font.Regular,
                    fontSize: mobileW * 3.6 / 100,
                  }}>
                  {'Booking duration per service'}
                </Text>
              </View>

              <View
                style={{
                  width: '40%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{
                  width: '100%',
                  alignSelf: 'center',
                }}>
                  {
                    (page == "tests") ?
                      <TouchableOpacity onPress={() => { setState({ febtn: true, mabtn: false, gender: 'Female' }) }}
                        style={{
                          width: '100%',
                          alignSelf: 'center',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                        }}>
                        <Icon style={{ alignSelf: 'center' }}
                          name={(classStateData.febtn == false) ? "circle-thin" : "dot-circle-o"}
                          size={20}
                          color={(classStateData.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>
                        <Text
                          style={{
                            textAlign: Configurations.textRotate,
                            marginLeft: mobileW * 1.5 / 100,
                            color: Colors.placeholder_text,
                            fontFamily: Font.Regular,
                            fontSize: mobileW * 3.5 / 100,
                          }}>
                          45 Min Slots
                        </Text>
                      </TouchableOpacity> :
                      (page == "onlineconsultation") ?
                        <TouchableOpacity onPress={() => { setState({ febtn: true, mabtn: false, gender: 'Female' }) }}
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}>
                          <Icon style={{ alignSelf: 'center' }}
                            name={(classStateData.febtn == false) ? "circle-thin" : "dot-circle-o"}
                            size={20}
                            color={(classStateData.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>
                          <Text
                            style={{
                              textAlign: Configurations.textRotate,
                              marginLeft: mobileW * 1.5 / 100,
                              color: Colors.placeholder_text,
                              fontFamily: Font.Regular,
                              fontSize: mobileW * 3.5 / 100,
                              // alignSelf: 'center',
                            }}>
                            15 Min Slots
                          </Text>
                        </TouchableOpacity> :
                        (page == "homeconsultation") ?
                          <TouchableOpacity onPress={() => { setState({ febtn: true, mabtn: false, gender: 'Female' }) }}
                            style={{
                              width: '100%',
                              alignSelf: 'center',
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              alignItems: 'center',
                            }}>
                            <Icon style={{ alignSelf: 'center' }}
                              name={(classStateData.febtn == false) ? "circle-thin" : "dot-circle-o"}
                              size={20}
                              color={(classStateData.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>
                            <Text
                              style={{
                                textAlign: Configurations.textRotate,
                                marginLeft: mobileW * 1.5 / 100,
                                color: Colors.placeholder_text,
                                fontFamily: Font.Regular,
                                fontSize: mobileW * 3.5 / 100,
                                // alignSelf: 'center',
                              }}>
                              45 Min Slots
                            </Text>
                          </TouchableOpacity>
                          : (page == "task") ?
                            <TouchableOpacity onPress={() => { setState({ febtn: true, mabtn: false, gender: 'Female' }) }}
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                              }}>
                              <Icon style={{ alignSelf: 'center' }}
                                name={(classStateData.febtn == false) ? "circle-thin" : "dot-circle-o"}
                                size={20}
                                color={(classStateData.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>
                              <Text
                                style={{
                                  textAlign: Configurations.textRotate,
                                  marginLeft: mobileW * 1.5 / 100,
                                  color: Colors.placeholder_text,
                                  fontFamily: Font.Regular,
                                  fontSize: mobileW * 3.5 / 100,
                                  // alignSelf: 'center',
                                }}>
                                30 Min Slots
                              </Text>
                            </TouchableOpacity> :
                            <Text style={{
                              fontFamily: Font.Regular,
                              fontSize: Font.medium,
                              color: Colors.textblue,
                              textAlign: 'right'
                            }}>As Selected</Text>
                  }

                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={{
          marginTop: 10,
          marginLeft: 15,
          paddingRight: 15,
          borderBottomColor: Colors.field_border_color,
          borderBottomWidth: 1
        }} />

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
              <View style={{ width: '70%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: '70%', alignSelf: 'center' }}>
                    <Text
                      style={{
                        textAlign: Configurations.textRotate,
                        color: Colors.placeholder_text_color,
                        fontFamily: Font.Medium,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      {((page == "onlineconsultation") ?
                        'Online Consultation' : (page == "homeconsultation") ?
                          'Home Visit Consultation' : 'List of Tasks')}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: '30%',
                  flexDirection: 'row',
                }}>
                <View style={{
                  width: '100%',
                }}>
                  <View style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end'
                  }}>
                    <Text
                      style={{
                        textAlign: Configurations.textRotate,
                        color: Colors.placeholder_text_color,
                        fontFamily: Font.Medium,
                        fontSize: mobileW * 3.6 / 100,
                      }}>
                      Rate {(classStateData.currency_symbol) ? '(' + classStateData.currency_symbol + ')' : ''}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

        </View>

        {
          !classStateData.isLoading ?
          <KeyboardAwareScrollView
          extraScrollHeight={50}
          enableOnAndroid={true}
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{
              justifyContent: 'center',
              paddingBottom: windowWidth/3
          }}
          showsVerticalScrollIndicator={false}>

              {
                (classStateData.taskArr.length > 0) &&
                classStateData.taskArr.map((item, index) => {
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
                          <View style={{
                            width: '70%',
                            height: (mobileW * 10) / 100,
                          }}>
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: '100%',
                              height: (mobileW * 10) / 100,
                              justifyContent: 'flex-start'
                            }}>
                              <Switch
                                thumbColor={(item?.isChecked) ? Colors.white_color : "#767577"}
                                trackColor={{ false: "#767577", true: Colors.textblue }}
                                style={{
                                  transform: [{ scaleX: .6 }, { scaleY: .6 }],
                                  marginLeft: -10,
                                  marginRight: -10
                                }}
                                onValueChange={(value) => {
                                  console.log("valuevalue:: ", value);
                                  let arr = [...classStateData.taskArr]
                                  arr[index].isChecked = value
                                  setState({
                                    taskArr: arr
                                  })
                                }}
                                value={item?.isChecked}
                              />
                              <Text style={{
                                fontFamily: Font.Regular,
                                fontSize: mobileW * 3.6 / 100,
                                color: (item?.isChecked) ? Colors.textblue : Colors.placeholder_textcolorlight,
                                marginLeft: 10
                              }}>{item?.name}</Text>
                            </View>
                          </View>

                          <View style={{
                            width: '30%',
                            height: (mobileW * 10) / 100,
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                          }}>

                            <TextInput
                              style={{
                                width: (mobileW * 15) / 100,
                                height: (mobileW * 7.3) / 100,
                                color: Colors.textblack,
                                fontSize: Font.placeholdersize,
                                fontFamily: Font.placeholderfontfamily,
                                borderRadius: (mobileW * 1) / 100,
                                backgroundColor: '#E5E5E5',
                                textAlign: 'center',
                                padding: 0
                              }}
                              placeholder={'Price'}
                              editable={item?.isChecked}
                              onChangeText={(text) => {
                                console.log("texttext:: ", text);
                                let arr = [...classStateData.taskArr]
                                arr[index].price = text
                                setState({
                                  taskArr: arr
                                })
                              }}
                              value={item?.price}
                              keyboardType="number-pad"
                              returnKeyLabel="done"
                              returnKeyType="done"
                            />
                          </View>
                        </View>

                      </View>
                    </>
                  )
                })
              }
            </KeyboardAwareScrollView> :
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: mobileW * 5 / 100 }}
              data={[1, 2, 3, 4, 5, 6, 7]}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      width: '100%',
                      paddingHorizontal: s(11),
                    }}>
                    <SkeletonPlaceholder>
                      <View style={{
                        flexDirection: 'row'
                      }}>
                        <SkeletonPlaceholder.Item width='11%' height={s(28)} borderRadius={s(4)} />
                        <SkeletonPlaceholder.Item width='56%' height={s(28)} borderRadius={s(4)} marginLeft={'3%'} />
                        <SkeletonPlaceholder.Item width='16%' height={s(28)} borderRadius={s(4)} marginLeft={'14%'} />
                      </View>

                    </SkeletonPlaceholder>
                  </View>
                )

              }}
              ItemSeparatorComponent={() => (
                <View style={{
                  marginTop: vs(6)
                }} />
              )}
            />
        }


      </View>

      {!classStateData.isLoading &&

        <StickyButton
          text={'SUBMIT'}
          onLoading={classStateData.isLoadingInPostButton}
          customStyles={{ mainContainer: { marginTop: 0 } }}
          onPress={() => submitPress()}
          isDisabled={(classStateData.taskArr.length > 0) ? false : true}
        />
      }
    </View>
  );

}
