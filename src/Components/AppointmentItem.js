import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import React from "react";
import moment from "moment-timezone";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { s, vs } from "react-native-size-matters";
import { Colors, Font } from "../Provider/Colorsfont";
import { LanguageConfiguration } from "../Helpers/LanguageProvider";
import { Configurations } from "../Provider/configProvider";
import { mobileW, windowHeight, windowWidth } from "../Helpers/Utils";
import { VideoCall } from "../Assets/Icons/SvgIcons/Index";
import { SvgXml } from "react-native-svg";
import StarRating from "react-native-star-rating";
import { Icons } from "../Assets/Icons/IReferences";

const AppointmentItem = ({
    item,
    Index,
    navigation,
    isLoading,
    onPressViewDetails, onPressAccept, onPressReject, onPressVideoCall,
}) => {

    const aDate = new Date(item?.appointment_date)
    var VideoCallBtn = false
    var appointmentDate = moment(item?.app_date).format(
        "YYYY-MM-DD"
    );
    var CurrentDate = moment().unix(); //Wed, 19 Oct 2022
    var MyDate = moment(appointmentDate + " " + item?.app_time, 'YYYY-MM-DD hh:mm A').unix();
    var MyEndDate = moment(appointmentDate + " 11:59 PM", 'YYYY-MM-DD hh:mm A').unix();

    if (CurrentDate < MyDate) {
        let diff = (MyDate - CurrentDate) / 60
        if (diff <= 10) {
            VideoCallBtn = true
        }
    }
    else if (CurrentDate > MyDate) {
        VideoCallBtn = true
    }
    if (CurrentDate > MyEndDate) {
        VideoCallBtn = false

    }

    return (

        isLoading ?
            <View style={{
                // height: vs(160),
                width: windowWidth,
                backgroundColor: Colors.White,
                paddingHorizontal: s(11),
                paddingVertical: vs(9)
            }}>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: "100%",
                        alignSelf: "center",
                        borderBottomWidth: 1.5,
                        borderBottomColor: Colors.backgroundcolor,
                        paddingBottom: vs(5)
                    }} >
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 25) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                    </SkeletonPlaceholder>

                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 25) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                    </SkeletonPlaceholder>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    width: "100%",
                    alignSelf: "center",
                    borderBottomWidth: 1.5,
                    borderBottomColor: Colors.backgroundcolor,
                    marginTop: vs(7),
                    paddingBottom: vs(7)
                }}>
                    <View style={{ flex: 1.2, }}>

                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 30) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 25) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 25) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ flex: 1, }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 23) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 18) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ flex: 1, }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 23) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={(windowWidth * 18) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                        </SkeletonPlaceholder>
                    </View>
                </View>


                <View style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: "100%",
                    alignSelf: "center",
                    marginTop: vs(7),
                }}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 20) / 100} height={(windowWidth * 4) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                    </SkeletonPlaceholder>

                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item width={(windowWidth * 16) / 100} height={(windowWidth * 6) / 100} borderRadius={s(4)} marginTop={vs(4)} />
                    </SkeletonPlaceholder>
                </View>
            </View>
            :

            <>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onPressViewDetails}
                    style={{
                        backgroundColor: Colors.White,
                        width: '100%',
                        paddingHorizontal: s(11),
                        paddingVertical: vs(9),
                        marginBottom: 7
                    }}>
                    {/* --------------------------- */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            width: "100%",
                            alignSelf: "center",
                            borderBottomWidth: 1.5,
                            borderBottomColor: Colors.backgroundcolor,
                            paddingBottom: vs(5)
                        }}>
                        <Text
                            style={{
                                fontSize: Font.medium,
                                fontFamily: Font.Medium,
                                color: Colors.Theme
                            }}
                        >{item?.order_id}</Text>

                        <Text
                            style={{
                                fontSize: Font.small,
                                fontFamily: Font.Medium,
                                color: item?.acceptance_status === 'Pending' ? Colors.Yellow : (item?.acceptance_status === 'Completed' || item?.acceptance_status === 'Accepted') ? Colors.Green : Colors.Red,
                                // textTransform: 'uppercase'

                            }}
                        >{item?.acceptance_status}</Text>
                    </View>
                    {/* --------------------------- */}

                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignSelf: "center",
                        borderBottomWidth: 1.5,
                        borderBottomColor: Colors.backgroundcolor,
                        marginTop: vs(7),
                        paddingBottom: vs(7)
                    }}>
                        <View style={{ flex: 1.3 }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start'
                                }}
                            >{item?.service_type}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{item?.provider_name}</Text>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{item?.speciality}</Text>
                        </View>

                        <View style={{ flex: 1, }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{LanguageConfiguration.Patient[Configurations.language]}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{item?.patient_name}</Text>
                        </View>

                        <View style={{ flex: 1, }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{LanguageConfiguration.Booked[Configurations.language]}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{item?.booking_date}</Text>
                        </View>

                    </View>

                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        alignSelf: "center",
                        borderBottomWidth: 1.5,
                        borderBottomColor: Colors.backgroundcolor,
                        marginTop: vs(7),
                        paddingBottom: vs(7)
                    }}>
                        <View style={{ flex: 1.3 }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{LanguageConfiguration.AppointmentDate[Configurations.language]}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{appointmentDate}</Text>
                        </View>

                        <View style={{ flex: 1, }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{LanguageConfiguration.Time[Configurations.language]}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{item?.app_time}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: Font.small,
                                    fontFamily: Font.Medium,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                }}
                            >{'Type'}</Text>
                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Regular,
                                    color: Colors.detailTitles,
                                    alignSelf: 'flex-start',
                                    marginTop: vs(3)
                                }}
                            >{item?.appointment_type}</Text>
                        </View>

                    </View>

                    <View style={{
                        flexDirection: "row",
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: "100%",
                        alignSelf: "center",
                        marginTop: vs(7),
                    }}>

                        <View
                            style={{
                                alignItems: 'center',
                                flexDirection: 'row',
                                width: '35%',
                            }}>

                            <Text
                                style={{
                                    fontSize: Font.medium,
                                    fontFamily: Font.Medium,
                                    color: Colors.Theme
                                }}
                            >{item?.price}</Text>

                        </View>

                        <View
                            style={{
                                alignItems: 'center',
                                flexDirection: 'row',

                                width: '65%',
                                justifyContent: 'flex-end',
                                paddingVertical: (mobileW * 1.5) / 100,

                            }}>

                            {((item?.acceptance_status == 'Accepted' &&
                                item?.service_type == "Doctor" &&
                                item?.appointment_type === "Online" && VideoCallBtn == true) &&
                                item?.booking_type === 'online_task') &&

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={onPressVideoCall}
                                    style={{
                                        paddingHorizontal: s(8),
                                        paddingVertical: vs(4),
                                        backgroundColor: Colors.Green,
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }} >
                                    <SvgXml xml={VideoCall} />
                                    <Text
                                        style={{
                                            fontSize: Font.small,
                                            fontFamily: Font.SemiBold,
                                            color: Colors.White,
                                            marginLeft: s(7)
                                        }}
                                    >VIDEO CALL</Text>
                                </TouchableOpacity>

                            }

                            {item?.acceptance_status == 'Pending' ?
                                <TouchableOpacity
                                    // onPress={() => { this.rescdule_click(), this.get_day(), this.setState({ order_id: item?.id, service_status: item?.provider_type, send_id: item?.provider_id, time_take_data: '', }) }}
                                    onPress={onPressAccept}
                                    style={{
                                        backgroundColor: Colors.buttoncolorhgreen,
                                        width: '40%',
                                        borderRadius: (mobileW * 1) / 100,
                                        justifyContent: 'center',
                                        paddingVertical: mobileW * 2 / 100,
                                        marginRight: 10
                                    }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: Colors.white_color,
                                            textTransform: 'uppercase',
                                            fontFamily: Font.Medium,
                                            fontSize: mobileW * 3 / 100,
                                        }}>Accept</Text>
                                </TouchableOpacity> :
                                (item?.acceptance_status == 'Accepted' &&
                                    item?.service_type == "Doctor" && item?.appointment_type == "Online") ? null :
                                    <View style={{ width: '28%' }}>
                                    </View>
                            }

                            {item?.acceptance_status == 'Pending' &&
                                <TouchableOpacity
                                    onPress={onPressReject}
                                    style={{
                                        backgroundColor: '#FF4500',
                                        width: '40%',
                                        borderRadius: (mobileW * 1) / 100,
                                        justifyContent: 'center',
                                        paddingVertical: mobileW * 2 / 100,
                                    }}>
                                    <Text
                                        style={{
                                            alignSelf: 'center',
                                            textAlign: 'center',
                                            color: Colors.white_color,
                                            //  paddingHorizontal: (mobileW * 2) / 100,
                                            fontFamily: Font.Medium,
                                            fontSize: mobileW * 3 / 100,
                                        }}>{'Reject'}

                                    </Text>
                                </TouchableOpacity>
                            }

                            {(
                                (item?.acceptance_status == 'Completed') &&
                                (VideoCallBtn == false)) &&
                                <View
                                    style={{
                                        width: '40%',
                                        justifyContent: 'center',
                                        paddingVertical: mobileW * 0.25 / 100,
                                    }}>
                                    {(item?.avg_rating !== '' && item?.avg_rating !== 0 && item?.avg_rating != null) ?
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-evenly'
                                        }}>

                                            {/* <Text
                                                style={{
                                                    alignSelf: 'center',
                                                    textAlign: 'center',
                                                    color: Colors.DarkGrey,
                                                    fontFamily: Font.Regular,
                                                    fontSize: mobileW * 3 / 100,
                                                    paddingRight: vs(8)
                                                }}>{'Rated'}

                                            </Text> */}


                                            <StarRating
                                                disabled={false}
                                                fullStar={Icons.YellowStar}
                                                emptyStar={Icons.UnfilledStar}
                                                maxStars={5}
                                                starSize={15}
                                                rating={item?.avg_rating}


                                            />

                                        </View>
                                        : <Text
                                            style={{
                                                alignSelf: 'center',
                                                textAlign: 'center',
                                                color: Colors.DarkGrey,
                                                fontFamily: Font.MediumItalic,
                                                fontSize: mobileW * 3 / 100,
                                            }}>{'Not rated yet'}

                                        </Text>

                                    }
                                </View>
                            }

                        </View>
                    </View>
                </TouchableOpacity>

            </>

    );
}

const styles = StyleSheet.create({

    modalContainer: {
        width: windowWidth,
        height: windowHeight - 250,
        backgroundColor: Colors.White,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: s(13),
        position: 'absolute',
        bottom: 0,
        zIndex: 999,
    },
    closeContainer: {
        height: s(35),
        width: s(35),
        borderRadius: s(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: vs(20),
        right: 0,
        zIndex: 999
    },
    Title: {
        fontSize: 20,
        fontFamily: Font.Regular,
        color: Colors.Black,
    },
    Desc: {
        fontSize: 16,
        fontFamily: Font.Regular,
        color: Colors.Secondary,
    },
});

export default AppointmentItem;