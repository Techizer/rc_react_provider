import React, { useEffect, useState, useRef } from "react";
import { Switch, FlatList, Image, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import { Configurations } from "../Provider/configProvider";
import {
  API,
  Colors,
  Font,
  mobileW,
  MessageFunctions,
} from "../Helpers/Utils";
import Styles from "../Styles";
import {ScreenReferences} from '../Stacks/ScreenReferences'
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

const LabPackageListing = (props) => {
  const { navigation } = props;
  console.log("propsprops ", props);
  console.log("propsprops navigation ", props.navigation);
  console.log("props.providerId ", props.providerId);
  const { providerId } = props;
  const [labData, setLabData] = useState([]);
  console.log("providerId ", providerId);

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      getPackageList();
    }
  }, [isFocused]);


  const {
    loginUserData
  } = useSelector(state => state.StorageReducer)


  const reloadPackList = () => {
    getPackageList();
  }

  const getPackageList = async () => {
    let user_details = loginUserData
    let user_id = user_details["user_id"];
    let user_type = user_details['user_type']
    let url = Configurations.baseURL + "api-get-lab-task";
    console.log("url", url);

    var data = new FormData();
    data.append("user_id", user_id);
    // data.append("provider_id", user_id);
    data.append('task_type', "package_base")
    data.append('service_type', user_type)

    
    API
      .post(url, data, 0)
      .then((obj) => {
        

        if (obj.status == true) {
          console.log({LabPackages: obj?.result});
          setLabData(obj.result);
        } else {
          MessageFunctions.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- ", error)
      });
  };

  const apiLabPackageDisable = async (item, index) => {
    let user_details = loginUserData
    let user_id = user_details["user_id"];
    let user_type = user_details['user_type']
    let url = Configurations.baseURL + "api-lab-package-disable";
    console.log("url", url);

    var data = new FormData();
    data.append("user_id", user_id);
    // data.append("provider_id", user_id);
    data.append('package_id', item.id)
    data.append('service_type', user_type)

    
    API
      .post(url, data, 1)
      .then((obj) => {
        

        if (obj.status == true) {
          // setLabData(obj.result);
          var array = [...labData];
          array[index].isChecked = false
          setLabData(array);
        } else {
          MessageFunctions.showError(obj.message);
          return false;
        }
      })
      .catch((error) => {
        console.log("-------- error ------- ", error)
      });
  };

  return (
    <View style={Styles.container1}>
      <View style={{ backgroundColor: "#f1f2f4", flex: 1 }}>
        <View>
          <View
            style={{
              backgroundColor: "#fff",
              padding: (mobileW * 3) / 100,
              // paddingHorizontal: (mobileW * 4) / 100,
            }}
          >
            <Text
              style={{
                // width: "80%",
                // marginTop: (mobileW * 4) / 100,
                paddingHorizontal: (mobileW * 2) / 100,
                color: "#000",
                fontFamily: Font.Medium,
                fontSize: (mobileW * 4.5) / 100,
                textAlign: "left",
              }}
            >
              Packages
            </Text>
            <View style={{
              marginTop: 10,
              paddingHorizontal: (mobileW * 2) / 100,
              // paddingRight: 15,
            }}>
              <Text style={[Styles.textcontent, {
                marginTop: 6,
                marginBottom: 6
              }]}>Only Administrator can create
                Tests & Test Packages under their account
                as many as they want, each package will
                contain group of tests included with a price
                range suggestion.</Text>
            </View>
          </View>
        </View>
        {/* </View> */}
        <FlatList
          data={labData}
          contentContainerStyle={{
            paddingBottom: (mobileW * 25) / 100,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            // if (
            //   labData != "" &&
            //   labData != null &&
            //   labData.length !== 0
            // ) {
            return (
              <View
                style={{
                  width: (mobileW * 100) / 100,
                  backgroundColor: "#fff",
                  alignSelf: "center",
                  alignItems: "flex-start",
                  marginTop: (mobileW * 3) / 100,
                  padding: (mobileW * 3) / 100,
                  // paddingTop: (mobileW * 3) / 100,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(ScreenReferences.LabPackageDetails, {
                      packageId: item.id,
                      providerId: providerId,
                      reloadPackList: reloadPackList.bind(this)
                    });
                  }}
                >
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // backgroundColor: 'red',
                    // marginTop: (mobileW * 3) / 100,
                    width: '100%',
                    alignItems: 'center',
                    paddingRight: (mobileW * 2) / 100,
                  }}>
                    <Text
                      style={{
                        // width: "80%",
                        // marginTop: (mobileW * 3) / 100,
                        paddingHorizontal: (mobileW * 2) / 100,
                        color: "#000",
                        fontFamily: Font.Medium,
                        fontSize: (mobileW * 4.5) / 100,
                        textAlign: "left",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Switch
                      thumbColor={(item?.isChecked) ? Colors.white_color : "#767577"}
                      trackColor={{ false: "#767577", true: Colors.textblue }}
                      // thumbColor={this.state.isEnabled ? "#f5dd4b" : "#f4f3f4"}
                      // ios_backgroundColor={Colors.textblue}
                      style={{
                        transform: [{ scaleX: .7 }, { scaleY: .7 }],
                        marginLeft: -8.5,
                        marginRight: -8.5,
                      }}
                      onValueChange={(value) => {
                        console.log("valuevalue:: ", value);
                        if (!value) {
                          apiLabPackageDisable(item, index)
                        } else {
                          navigation.navigate(ScreenReferences.LabPackageDetails, {
                            packageId: item.id,
                            providerId: providerId,
                          });
                        }
                        // let arr = [...this.state.slotArr]
                        // arr[index].slot_day_enable = (value) ? "1" : "0"
                        // this.setState({
                        //   slotArr: arr
                        // })
                      }}
                      value={item?.isChecked}
                    />
                  </View>


                  <Text
                    style={{
                      paddingVertical: (mobileW * 2) / 100,
                      paddingHorizontal: (mobileW * 2) / 100,
                      fontFamily: Font.Regular,
                      textAlign: "left",
                      color: Colors.tablightcolo,
                      fontSize: Font.sregulartext_size,
                    }}
                  >
                    {item.task_count}
                  </Text>
                  <Text
                    style={{
                      paddingVertical: (mobileW * 1.5) / 100,
                      paddingHorizontal: (mobileW * 2) / 100,
                      fontFamily: Font.Regular,
                      fontSize: Font.sregulartext_size,
                      color: Colors.theme_color,
                      textAlign: Configurations.textRotate,
                    }}
                  >
                    {item.task_details}
                  </Text>

                  {
                    (item?.isChecked) ?
                      <>
                        <Text
                          style={{
                            paddingHorizontal: (mobileW * 2) / 100,
                            fontFamily: Font.Regular,
                            textAlign: "left",
                            fontSize: Font.sregulartext_size,
                            marginTop: (mobileW * 3) / 100,
                            color: Colors.tablightcolo,
                            textDecorationLine: "line-through",
                            textDecorationStyle: "solid",
                          }}
                        >
                          {item.maxrp}
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
                            {item.price}
                          </Text>

                          <View
                            style={{
                              paddingVertical: (mobileW * 0.5) / 100,
                              paddingHorizontal: (mobileW * 3) / 100,
                              marginHorizontal: (mobileW * 4) / 100,
                              borderColor: Colors.buttoncolorhgreen,
                              color: Colors.buttoncolorhgreen,
                              borderRadius: 5,
                              borderStyle: "dotted",
                              borderWidth: 1,
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: Font.Regular,
                                textAlign: "left",
                                color: Colors.textGreenColor,
                                fontSize: Font.sregulartext_size,
                              }}
                            >
                              {item.dis_off}
                            </Text>
                          </View>
                        </View>
                      </> :
                      <>
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
                            {item.display_rp}
                          </Text>

                          {/* <View
                      style={{
                        paddingVertical: (mobileW * 0.5) / 100,
                        paddingHorizontal: (mobileW * 3) / 100,
                        marginHorizontal: (mobileW * 4) / 100,
                        borderColor: Colors.buttoncolorhgreen,
                        color: Colors.buttoncolorhgreen,
                        borderRadius: 5,
                        borderStyle: "dotted",
                        borderWidth: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          textAlign: "left",
                          color: Colors.textGreenColor,
                          fontSize: Font.sregulartext_size,
                        }}
                      >
                        {item.dis_off}
                      </Text>
                    </View> */}
                        </View>
                      </>
                  }


                </TouchableOpacity>
              </View>
            );
            // }
          }}
        />
      </View>
    </View>
  );
};

export default LabPackageListing;
