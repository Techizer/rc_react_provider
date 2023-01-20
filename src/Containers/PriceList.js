import React, { Component, useEffect, useState } from 'react';
import {
  TextInput, Switch, Text, View,
  ScrollView, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, FlatList
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Colors,
  Font,
  mobileH,
  MessageFunctions,
  MessageTexts,
  Configurations,
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

export default PriceList = ({ navigation, route, pageName, page }) => {
  const [classStateData, setClassStateData] = useState({
    message: '',
    taskArr: []
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
    let currency_symbol = user_details['currency_symbol']

    console.log('pageName:: ', pageName);
    setState({
      currency_symbol: currency_symbol
    })

    let apiname = (page == "tests") ?
      "api-get-lab-task" :
      (page == "onlineconsultation" || page == "homeconsultation") ?
        "api-doctor-get-price" : "api-provider-get-price-list"

    let apishow = apiname //"api-provider-past-appointment-list" //"api-patient-all-appointment"

    let url = Configurations.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    // data.append('lgoin_user_id', user_id)
    // { service_type":"nurse","user_id":"39","task_type":"hour_base" }
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




    API.post(url, data).then((obj) => {
      console.log("obj::: ", task_type, obj)
      if (obj.status == true) {
        setState({
          taskArr: (obj.result == null) ? [] : obj.result,
          message: obj.message
        })
        console.log('obj.result', task_type, obj.result)

      } else {

        setState({
          taskArr: obj.result,
          message: obj.message
        })
        console.log('obj.result', obj.result)
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- ", error)

    });

  }

  const submitPress = () => {
    if (classStateData.taskArr.length > 0) {
      var isError = false;
      var taskId = ''
      var taskPrice = ''
      var sep = ''
      classStateData.taskArr.map((item, index) => {
        if (item?.isChecked) {
          let price = (item?.price != '') ? parseFloat(item?.price) : 0
          console.log("priceprice: ", price);
          if (price <= 0) {
            console.log(index, item?.isChecked, price);
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
        console.log("taskId:: ", taskId);
        console.log("taskPrice:: ", taskPrice);
        insertUpdatePriceList(taskId, taskPrice)
      }

    }
  }

  const insertUpdatePriceList = async (taskId, taskPrice) => {
    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']
    console.log('pageName:: ', pageName);


    let apiname = (page == "tests") ?
      "api-add-lab-task_price" :
      (page == "onlineconsultation" || page == "homeconsultation") ?
        "api-doctor-insertupdate-price" : "api-provider-insert-update-price-list"


    let apishow = apiname //"api-provider-past-appointment-list" //"api-patient-all-appointment"

    let url = Configurations.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();
    // data.append('lgoin_user_id', user_id)
    // { "user_id":"39","service_type":"nurse",
    // "task_type":"hour_base","task_id":"1,2,3,4,5","price":"100,200,300,400,600"}

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



    API.post(url, data).then((obj) => {
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
            marginTop: 10,
            paddingLeft: 15,
            paddingRight: 15,
          }}>
            <Text style={[Styles.textcontent, {
              marginTop: 6
            }]}>{(page == "tests") ?
              'Select the Tests you as wish to provide service.'
              : (page == "onlineconsultation" || page == "homeconsultation") ?
                'Switch on the task if you wish to provide service'
                : (page == "task") ?
                  'Select the Tasks you as wish to provide service.' :
                  'Select the Hours you as wish to provide service.'}</Text>
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
                  <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    {/* {classStateData.mabtn == false && */}
                    <View style={{ width: '70%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          // marginLeft: mobileW * 1.5 / 100,
                          textAlign: Configurations.textRotate,
                          color: Colors.placeholder_text,
                          fontFamily: Font.Regular,
                          fontSize: mobileW * 3.6 / 100,
                        }}>
                        Booking Duration
                      </Text>
                    </View>
                  </View>
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
                  <View style={{
                    width: '100%',
                    alignSelf: 'center',
                    // marginLeft: mobileW * 2 / 100
                  }}>
                    {/* {classStateData.fbtn == false && */}
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
                            size={22}
                            color={(classStateData.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>
                          <Text
                            style={{
                              textAlign: Configurations.textRotate,
                              marginLeft: mobileW * 1.5 / 100,
                              color: Colors.placeholder_text,
                              fontFamily: Font.Regular,
                              fontSize: mobileW * 3.6 / 100,
                              // alignSelf: 'center',
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
                              size={22}
                              color={(classStateData.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>
                            <Text
                              style={{
                                textAlign: Configurations.textRotate,
                                marginLeft: mobileW * 1.5 / 100,
                                color: Colors.placeholder_text,
                                fontFamily: Font.Regular,
                                fontSize: mobileW * 3.6 / 100,
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
                                size={22}
                                color={(classStateData.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>
                              <Text
                                style={{
                                  textAlign: Configurations.textRotate,
                                  marginLeft: mobileW * 1.5 / 100,
                                  color: Colors.placeholder_text,
                                  fontFamily: Font.Regular,
                                  fontSize: mobileW * 3.6 / 100,
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
                                  size={22}
                                  color={(classStateData.febtn == false) ? '#8F98A7' : '#0168B3'}></Icon>
                                <Text
                                  style={{
                                    textAlign: Configurations.textRotate,
                                    marginLeft: mobileW * 1.5 / 100,
                                    color: Colors.placeholder_text,
                                    fontFamily: Font.Regular,
                                    fontSize: mobileW * 3.6 / 100,
                                    // alignSelf: 'center',
                                  }}>
                                  30 Min Slots
                                </Text>
                              </TouchableOpacity> :
                              <Text style={{
                                fontFamily: Font.Regular,
                                fontSize: 14,
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
                <View style={{ width: '70%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    {/* {classStateData.mabtn == false && */}
                    <View style={{ width: '70%', alignSelf: 'center' }}>
                      <Text
                        style={{
                          // marginLeft: mobileW * 1.5 / 100,
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
                    {/* {classStateData.fbtn == false && */}
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


          <ScrollView
            style={{ backgroundColor: 'white', marginTop: 0 }}
            contentContainerStyle={{ paddingBottom: mobileW * 5 / 100 }}
            showsVerticalScrollIndicator={false}>
            <KeyboardAwareScrollView>
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
                          backgroundColor: '#FBFBFB', //Colors.tab_background_color, //'#E5E5E5',
                          // backgroundColor: (index == taskArr.length - 1) ? '#E5E5E5' : '#FBFBFB',
                          height: (mobileW * 12) / 100,
                          paddingLeft: 15,
                          paddingRight: 15,
                          marginBottom: 5
                        }}>
                          <View style={{
                            width: '70%',
                            height: (mobileW * 10) / 100,
                            // backgroundColor: 'blue',
                          }}>
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: '100%',
                              // backgroundColor: 'red',
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
                            // backgroundColor: 'green',
                          }}>

                            <TextInput
                              style={{
                                width: (mobileW * 15) / 100,
                                height: (mobileW * 7.3) / 100,
                                color: Colors.textblack,
                                fontSize: Font.placeholdersize,
                                //height: (mobileW * 12) / 100,
                                fontFamily: Font.placeholderfontfamily,
                                borderRadius: (mobileW * 1) / 100,
                                backgroundColor: '#E5E5E5', //Colors.tab_background_color,
                                textAlign: 'center',
                                padding: 0
                                // lineHeight: 48
                                // marginBottom: (mobileW * 4) / 100,
                                // borderColor: 'red', //Colors.placeholder_border
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
                            // onSubmitEditing={() => { Keyboard.dismiss() }}
                            />
                          </View>
                        </View>

                      </View>
                    </>
                  )
                })
              }


            </KeyboardAwareScrollView>
          </ScrollView>
        </View>


        <View style={{
          // backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 15,
          height: mobileW * 22 / 100,

        }}>
          <Button
            text={'SUBMIT'}
            // onLoading={classStateData.loading}
            customStyles={
              {
                mainContainer: {
                  marginTop: 0,
                  // opacity: 0.3
                }
              }
            }
            onPress={() => submitPress()}
            isDisabled={(classStateData.taskArr.length > 0) ? false : true}
          // isBlank={false}
          />
        </View>
      </View>
    </View>
  );

}
