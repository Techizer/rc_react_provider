import React, { useEffect, useState } from "react";
import { FlatList, TextInput, Image, Text, TouchableOpacity, ScrollView, Dimensions, Platform, StatusBar } from "react-native";
import { View } from "react-native-animatable";
import HTMLView from "react-native-htmlview";
import { Configurations } from "../Provider/configProvider";
import { Button } from '../Components'
import ScreenHeader from '../Components/ScreenHeader';
import {
  API,
  Colors,
  Font,
  LanguageConfiguration,
  mobileW,
  MessageFunctions,
} from "../Helpers/Utils";
import Styles from "../Styles";
import { Icons } from "../Icons/IReferences";
import { useSelector } from "react-redux";
import { vs } from "react-native-size-matters";

const LabPackageDetails = ({ navigation, route }) => {
  const { packageId, providerId } = route.params;
  const [labDetailsData, setLabDetailsData] = useState();
  const [showTaskDetails, isShowTaskDetails] = useState(false);
  const [currencyData, setCurrency] = useState();
  const [priceData, setPrice] = useState("");

  const {
    loginUserData
  } = useSelector(state => state.StorageReducer)

  useEffect(() => {
    getPackageList();
  }, []);

  const getPackageList = async () => {
    let user_details = loginUserData;
    let user_id = user_details["user_id"];
    let currency_symbol = user_details['currency_symbol']
    setCurrency(currency_symbol)
    let url = Configurations.baseURL + "api-get-lab-package-details";
    console.log("url", url);

    var data = new FormData();
    data.append("user_id", user_id);
    data.append("provider_id", providerId);
    data.append("package_id", packageId);


    API
      .post(url, data, 0)
      .then((obj) => {


        if (obj.status == true) {
          setLabDetailsData(obj.result);
          setPrice(obj.result.price)
          // labDetailsData.price
        } else {
          MessageFunctions.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- ", error)
      });
  };

  const submitPress = () => {
    if (priceData == "") {
      MessageFunctions.showError("Selected slot must have a valid price")
    } else if (parseFloat(priceData) < parseFloat(labDetailsData.minrp)) {
      MessageFunctions.showError("Price must be within " + labDetailsData.display_rp)
    } else if (parseFloat(priceData) > parseFloat(labDetailsData.maxrp)) {
      MessageFunctions.showError("Price must be within " + labDetailsData.display_rp)
    } else {
      console.log("taskId:: ", labDetailsData.pid);
      console.log("priceData:: ", priceData);
      insertUpdatePriceList(labDetailsData.pid, priceData)
    }
  }

  const insertUpdatePriceList = async (taskId, taskPrice) => {
    let user_details = loginUserData;
    let user_id = user_details['user_id']
    let user_type = user_details['user_type']

    let apiname = "api-add-lab-task_price"


    let apishow = apiname

    let url = Configurations.baseURL + apishow;
    console.log("url", url)

    var data = new FormData();

    data.append('user_id', user_id)

    let task_type = "package_base"

    data.append('task_type', task_type)
    data.append('service_type', user_type)
    data.append('task_id', labDetailsData.pid)
    data.append('price', priceData)



    API.post(url, data).then((obj) => {
      if (obj.status == true) {
        console.log({UpdatedLabPackage: obj});
        MessageFunctions.showSuccess(obj.message)
      } else {
        MessageFunctions.showError(obj.message)
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

    <View style={{ backgroundColor: "#f1f2f4", flex: 1 }}>

      <ScreenHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        leftIcon
        rightIcon={false}
        navigation={navigation}
        title={LanguageConfiguration.PackageDetails[Configurations.language]}
        style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

      <ScrollView>
        <>
          {labDetailsData != null && labDetailsData != "" && (
            <>
              <View>
                <View
                  style={{
                    backgroundColor: "#fff",
                  }}
                >
                  <Text
                    style={{
                      width: "100%",
                      marginTop: (mobileW * 3) / 100,
                      paddingHorizontal: (mobileW * 4) / 100,
                      color: "#000",
                      fontFamily: Font.Medium,
                      fontSize: (mobileW * 4.5) / 100,
                      textAlign: "left",
                    }}
                  >
                    {labDetailsData.name}
                  </Text>
                  <Text
                    style={{
                      paddingVertical: (mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 4) / 100,
                      fontFamily: Font.Regular,
                      textAlign: "left",
                      color: Colors.theme_color,
                      fontSize: Font.sregulartext_size,
                    }}
                  >
                    {labDetailsData.task_count}
                  </Text>


                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>

                      <TextInput
                        style={{
                          width: (mobileW * 18) / 100,
                          height: (mobileW * 7.3) / 100,
                          color: Colors.textblack,
                          fontSize: Font.placeholdersize,
                          //height: (mobileW * 12) / 100,
                          fontFamily: Font.placeholderfontfamily,
                          borderRadius: (mobileW * 1) / 100,
                          backgroundColor: '#E5E5E5', //Colors.tab_background_color,
                          textAlign: 'center',
                          marginLeft: (mobileW * 4) / 100,
                          padding: 0
                          // marginBottom: (mobileW * 4) / 100,
                          // borderColor: 'red', //Colors.placeholder_border
                        }}
                        placeholder={'Price'}
                        // editable={item?.isChecked}
                        onChangeText={(text) => {
                          console.log("texttext:: ", text);
                          setPrice(text)
                        }}
                        value={priceData}
                        keyboardType="number-pad"
                        returnKeyLabel="done"
                        returnKeyType="done"
                      // onSubmitEditing={() => { Keyboard.dismiss() }}
                      />
                      <Text
                        style={{
                          paddingVertical: (mobileW * 2) / 100,
                          paddingHorizontal: (mobileW * 2) / 100,
                          textAlign: Configurations.textalign,
                          fontFamily: Font.Medium,
                          fontSize: (mobileW * 3.5) / 100,
                          color: Colors.tablightcolo,
                        }}
                      >
                        {currencyData}
                      </Text>

                    </View>

                    <View>
                      <Text
                        style={{
                          paddingHorizontal: (mobileW * 2) / 100,
                          fontFamily: Font.Regular,
                          textAlign: "left",
                          fontSize: Font.sregulartext_size,
                          marginTop: (mobileW * 3) / 100,
                          color: Colors.tablightcolo,
                          // textDecorationLine: "line-through",
                          // textDecorationStyle: "solid",
                        }}
                      >
                        Recommended Price
                      </Text>
                      <View
                        style={{
                          paddingVertical: (mobileW * 2) / 100,
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          paddingHorizontal: (mobileW * 2) / 100,
                          alignItem: "center",
                        }}
                      >
                        <Text
                          style={{
                            textAlign: Configurations.textalign,
                            fontFamily: Font.Medium,
                            fontSize: (mobileW * 4) / 100,
                          }}
                        >
                          {labDetailsData.display_rp}
                        </Text>


                      </View>
                    </View>
                  </View>


                  <View
                    style={{
                      width: "100%",
                      paddingHorizontal: (mobileW * 4) / 100,
                      alignSelf: "center",
                      borderColor: Colors.bordercolor,
                      borderBottomWidth: (mobileW * 0.2) / 100,
                      marginTop: (mobileW * 1) / 100,
                    }}
                  />
                  {labDetailsData.task_content != null && (
                    <View style={{
                      marginVertical: vs(16)
                    }}>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          marginTop: (mobileW * 2) / 100,
                          paddingHorizontal: (mobileW * 4) / 100,
                          fontSize: Font.buttontext_size,
                          textAlign: Configurations.textRotate,
                          color: Colors.lightgraytext,
                        }}
                      >
                        {labDetailsData.task_heading}
                      </Text>
                      <HTMLView
                        value={labDetailsData.task_content}
                        stylesheet={{
                          p: {
                            fontSize: Font.subtext,
                            paddingHorizontal: (mobileW * 4) / 100,
                            color: Colors.lightgraytext,
                            marginTop: (mobileW * 2) / 100,
                            fontFamily: Font.Regular,
                          },
                        }}
                      />
                    </View>
                  )}
                  {labDetailsData.task_sub_content != null && (
                    <View
                    style={{
                      width: "100%",
                      alignSelf: "flex-start",
                      backgroundColor: "#FFF2D9",
                    }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.headingfont_booking,
                          color: Colors.precautionText,
                          paddingHorizontal: (mobileW * 4) / 100,
                          marginTop: (mobileW * 2) / 100,
                          textAlign: Configurations.textRotate,
                          paddingVertical: vs(4),
                        }}
                      >
                        {labDetailsData.task_sub_heading}
                      </Text>
                      <HTMLView
                        value={labDetailsData.task_sub_content}
                        stylesheet={{
                          p: {
                            fontSize: Font.subtext,
                            paddingHorizontal: (mobileW * 4) / 100,
                            color: Colors.lightgraytext,
                            marginTop: (mobileW * 2) / 100,
                            fontFamily: Font.Regular,
                            paddingBottom: vs(16)
                          },
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  width: (mobileW * 100) / 100,
                  backgroundColor: "#fff",
                  alignSelf: "center",
                  alignItems: "flex-start",
                  marginTop: (mobileW * 2) / 100,
                }}
              >
                <Text
                  style={{
                    width: "100%",
                    marginTop: (mobileW * 3) / 100,
                    paddingHorizontal: (mobileW * 2) / 100,
                    color: "#000",
                    fontFamily: Font.Regular,
                    fontSize: (mobileW * 4) / 100,
                    textAlign: "left",
                  }}
                >
                  {LanguageConfiguration.TestsIncluded[Configurations.language]}
                </Text>
                <FlatList
                  data={labDetailsData.task_name}
                  contentContainerStyle={{
                    paddingBottom: (mobileW * 10) / 100,
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item, index }) => {
                    if (
                      labDetailsData.task_name != "" &&
                      labDetailsData.task_name != null &&
                      labDetailsData.task_name.length !== 0
                    ) {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (item.subtask !== "" && item.subtask !== null) {
                              isShowTaskDetails(!showTaskDetails);
                            }
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              flexDirection: "row",
                              justifyContent: "flex-start",
                              // paddingVertical: (mobileW * 1) / 100,
                              marginTop: (mobileW * 3) / 100,
                              paddingHorizontal: (mobileW * 2) / 100,
                            }}
                          >
                            <Text
                              style={{
                                width: "90%",
                                fontSize: Font.subtext,
                                color: Colors.theme_color,
                                fontFamily: Font.Medium,
                                textAlign: "left",
                              }}
                            >
                              {item.name}
                            </Text>
                            {item.subtask !== "" && item.subtask !== null && (
                              <View
                                style={{
                                  width: "10%",
                                }}
                              >
                                <Image
                                  style={{
                                    height: (mobileW * 4.5) / 100,
                                    width: (mobileW * 4.5) / 100,
                                  }}
                                  source={
                                    showTaskDetails
                                      ? Icons.UpArrow
                                      : Icons.DownArrow
                                  }
                                />
                              </View>
                            )}
                          </View>
                          {showTaskDetails && (
                            <Text
                              style={{
                                paddingTop: (mobileW * 2) / 100,
                                paddingHorizontal: (mobileW * 4) / 100,
                                fontFamily: Font.Regular,
                                textAlign: "left",
                                color: Colors.subTaskColor,
                                fontSize: Font.sregulartext_size,
                              }}
                            >
                              {item.subtask}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    }
                  }}
                />
              </View>
              <View style={{
                // backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15,
                height: mobileW * 22 / 100,

              }}>
                <Button
                  text={'SAVE PACKAGE'}
                  // onLoading={workAreastate.loading}
                  customStyles={
                    {
                      mainContainer: {
                        marginTop: 0,
                        // opacity: 0.3
                      }
                    }
                  }
                  onPress={() => submitPress()}
                // isDisabled={(workAreastate.taskArr.length > 0) ? false : true}
                // isBlank={false}
                />
              </View>
            </>
          )}
        </>
      </ScrollView>
    </View>
  );
};

export default LabPackageDetails;
