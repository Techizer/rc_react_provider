import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, SafeAreaView, Image, Modal, TouchableOpacity, StatusBar, Dimensions, Platform } from 'react-native';
import { Colors, Font, Configurations, mobileW, LanguageConfiguration, API } from '../Helpers/Utils';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScreenHeader from '../Components/ScreenHeader';
import { Icons } from '../Assets/Icons/IReferences';
import { useDispatch, useSelector } from 'react-redux';
import { setRatingsData } from '../Redux/Actions/UserActions';
import { vs } from 'react-native-size-matters';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


export default ReviewRating = ({ navigation, route }) => {

  const {
    loginUserData,
    ratings
  } = useSelector(state => state.StorageReducer)
  
  const [isLoading, setIsLoading] = useState(!ratings ? true : false)

  useEffect(() => {
    getRatings()
  }, [])

  const dispatch = useDispatch()

  const getRatings = async () => {
    let apishow = "api-all-provider-review"
    let url = Configurations.baseURL + apishow;
    var data = new FormData();
    data.append('user_id', loginUserData?.user_id)
    data.append('service_type', loginUserData?.user_type)

    API.post(url, data, 1).then(obj => {
      if (obj.status == true) {
        dispatch(setRatingsData(obj?.result))
      } else {
        dispatch(setRatingsData(obj?.result))
        return false;
      }
    }).catch((error) => {
      console.log("-------- error getting ratings------- ", error)
    }).finally(() => {
      setIsLoading(false)
    })

  }

  const windowHeight = Math.round(Dimensions.get("window").height);
  const windowWidth = Math.round(Dimensions.get("window").width);
  const deviceHeight = Dimensions.get('screen').height;
  const StatusbarHeight = (Platform.OS === 'ios' ? windowHeight * 0.03695 : StatusBar.currentHeight)
  let headerHeight = deviceHeight - windowHeight + StatusbarHeight;
  headerHeight += (Platform.OS === 'ios') ? 28 : -60

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        alignSelf: 'center',
      }}>
      <SafeAreaView style={{ flex: 0 }}></SafeAreaView>

      <ScreenHeader
        onBackPress={() => {
          navigation.goBack();
        }}
        leftIcon
        rightIcon={false}
        navigation={navigation}
        title={'Rating & Review'}
        style={{ paddingTop: (Platform.OS === 'ios') ? -StatusbarHeight : 0, height: (Platform.OS === 'ios') ? headerHeight : headerHeight + StatusbarHeight }} />

      <FlatList
        data={(isLoading && !ratings) ? [1, 2, 3, 4, 5, 6, 7] : ratings}
        contentContainerStyle={{
          paddingBottom: mobileW * 10 / 100
        }}
        ListEmptyComponent={() => (
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '90%',
            marginTop: vs(40)
          }}>
            <Text style={{
              fontFamily: Font.Regular,
              fontSize: 16,
              textTransform: 'capitalize'
            }}>{'No Reviews Found'}</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          if (!isLoading) {
            var reviewRating = parseInt(item?.rating);
            var ratingStars = [];
            for (let i = 0; i < 5; i++) {
              if (i < reviewRating) {
                ratingStars.push(
                  <AntDesign style={{ alignSelf: 'center' }}
                    name={"star"}
                    size={14}
                    color={'#FFA800'}></AntDesign>
                )
              } else {
                ratingStars.push(
                  <AntDesign style={{ alignSelf: 'center' }}
                    name={"star"}
                    size={14}
                    color={'#DFDFDF'}></AntDesign>
                )
              }

            }
            return (
              <View style={{
                flexDirection: 'row',
                width: '100%',
                backgroundColor: Colors.White
              }}>
                <View style={{
                  width: '23%',
                  alignItems: 'center',
                  paddingTop: (mobileW * 4) / 100,
                }}>
                  <Image
                    source={item.image == 'NA'
                      || item.image == null
                      || item.image == '' ?
                      Icons.AccountFilled :
                      {
                        uri: Configurations.img_url3 + item.image
                      }}

                    style={{
                      width: (mobileW * 15) / 100,
                      height: (mobileW * 15) / 100,
                      borderWidth: 1,
                      borderColor: Colors.theme_color,
                      borderRadius: (mobileW * 7.5) / 100,
                    }}></Image>
                </View>
                <View
                  style={{
                    width: '77%',
                    paddingTop: (mobileW * 4) / 100,
                  }}>
                  <View style={{
                    borderBottomWidth: (mobileW * 0.3) / 100,
                    borderColor: Colors.gainsboro,
                    marginRight: (mobileW * 2.5) / 100,
                    minHeight: (mobileW * 12) / 100,
                  }}>
                    <Text
                      style={{
                        fontFamily: Font.Regular,
                        fontSize: Font.sregulartext_size,
                        lineHeight: (mobileW * 4.2) / 100,
                        textAlign: Configurations.textRotate,
                        color: Colors.lightgraytext,
                        paddingBottom: (mobileW * 2.1) / 100,
                      }}>{item?.review}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'flex-end',
                      width: '100%',
                      paddingVertical: (mobileW * 2) / 100,
                    }}>
                    <View style={{
                      flexDirection: 'row',
                      width: '50%',
                    }}>
                      <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25%',
                      }}>
                        <Text
                          style={{
                            fontFamily: Font.Regular,
                            fontSize: Font.sregulartext_size,
                            color: Colors.lightgraytext,
                          }}>
                          Rated
                        </Text>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        marginLeft: 15,
                        width: '52%',
                      }}>
                        {ratingStars}
                      </View>
                    </View>
                    <View style={{
                      width: '50%',
                      paddingRight: (mobileW * 2.5) / 100,
                    }}>
                      <Text
                        style={{
                          fontFamily: Font.Regular,
                          fontSize: Font.sregulartext_size,
                          color: Colors.textblue,
                          textAlign: 'right'
                        }}>
                        {item?.order_id}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }

          return (
            <View style={{
              flexDirection: 'row',
              width: '100%',
              backgroundColor: Colors.White
            }}>
              <View style={{
                width: '23%',
                alignItems: 'center',
                paddingTop: (mobileW * 4) / 100,
              }}>
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item
                    width={(mobileW * 15) / 100}
                    height={(mobileW * 15) / 100}
                    borderRadius={(mobileW * 15) / 100}
                    borderWidth={1}
                    borderColor={Colors.theme_color} />
                </SkeletonPlaceholder>
              </View>
              <View
                style={{
                  width: '77%',
                  paddingTop: (mobileW * 4) / 100,

                }}>
                <View style={{
                  borderBottomWidth: (mobileW * 0.3) / 100,
                  borderColor: Colors.gainsboro,
                  marginRight: (mobileW * 2.5) / 100,
                  minHeight: (mobileW * 12) / 100,
                }}>
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item
                      width={'70%'}
                      height={(mobileW * 4.2) / 100}
                      borderRadius={(mobileW * 15) / 100}
                      borderWidth={1}
                      borderColor={Colors.theme_color} />
                  </SkeletonPlaceholder>
                </View>


                <SkeletonPlaceholder>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      paddingVertical: (mobileW * 2) / 100,

                    }}>

                    <SkeletonPlaceholder.Item
                      width={'45%'}
                      height={vs(16)}
                      borderRadius={(mobileW * 15) / 100}
                      borderWidth={1}
                      borderColor={Colors.theme_color} />
                    <SkeletonPlaceholder.Item
                      width={'40%'}
                      marginLeft={'10%'}
                      height={vs(16)}
                      borderRadius={(mobileW * 15) / 100}
                      borderWidth={1}
                      borderColor={Colors.theme_color} />


                  </View>
                </SkeletonPlaceholder>
              </View>
            </View>
          );


        }}
        ItemSeparatorComponent={() => (
          <View style={{
            marginVertical: (mobileW * 1) / 100
          }} />
        )} 
        keyExtractor={(i, _i) => ('rr'+_i)}/>
    </View>


  );

}
