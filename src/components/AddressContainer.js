import React from "react";
import { Text, View, TouchableHighlight } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { SvgXml } from "react-native-svg";
import { s, vs } from "react-native-size-matters";
import { Colors, Font } from "../Provider/Colorsfont";
import { windowWidth, Configurations } from "../Helpers/Utils";
import { Address, Edit, roundCheck } from "../../src/Assets/Icons/SvgIcons/Index";

const AddressContainer = ({ index, addressDetails, selectedAddress, showModal = () => { }, isLoading, defaultAdd }) => {

    return (
        <>
            {isLoading ?

                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignSelf: 'center',
                    paddingTop: (index === 0) ? 0 : vs(18),
                    backgroundColor: Colors.White
                }}>

                    <View style={{ width: '9%', }}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item width={s(20)} height={s(20)} borderRadius={s(20)} />
                        </SkeletonPlaceholder>
                    </View>

                    <View style={{ width: '91%', paddingBottom: vs(12) }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>

                            <View style={{ width: '100%' }}>
                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={s(70)} height={s(15)} borderRadius={s(5)} />
                                </SkeletonPlaceholder>
                            </View>

                        </View>

                        <View style={{ width: '100%', }}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={windowWidth - 100} height={s(15)} borderRadius={s(5)} style={{ marginTop: vs(7) }} />
                            </SkeletonPlaceholder>
                        </View>
                    </View>
                </View>
                :
                <View
                    style={{ flexDirection: 'row', width: '100%', alignSelf: 'center', paddingTop: (index === 0 && defaultAdd == addressDetails?.id) ? 18 : (index === 0) ? 0 : vs(18), backgroundColor: defaultAdd == addressDetails?.id ? Colors.appointmentdetaillightblue : 'transparent' }}>

                    <View style={{ width: '100%', paddingBottom: vs(12) }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                            <View style={{ width: '9%', }}>
                                <SvgXml xml={Address} />
                            </View>

                            <View style={{ maxWidth: '38%' }}>
                                <Text numberOfLines={1} style={{ textAlign: Configurations.textRotate, fontSize: Font.medium, fontFamily: Font.Regular, color: Colors.darkText }}>{addressDetails.title ? addressDetails.title : 'Unnamed'}</Text>
                            </View>

                            <View style={{ width: '42%', marginLeft: '3%' }}>
                                {
                                    (addressDetails.default === '0') &&
                                    (
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: vs(2) }}>
                                            <SvgXml xml={roundCheck} />
                                            <Text style={{ textAlign: Configurations.textRotate, fontSize: Font.xsmall, fontFamily: Font.Medium, color: Colors.theme_color, marginLeft: vs(4) }}>{'Default'}</Text>
                                        </View>
                                    )
                                }
                            </View>

                            <View style={{ flex: 1, alignItems: 'flex-end'}}>
                                <TouchableHighlight
                                    onPress={() => {
                                        showModal(true)
                                        selectedAddress(index)
                                    }}
                                    underlayColor={Colors.Highlight}
                                    style={{ minWidth: '35%', height: vs(22), borderRadius: 4, alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <SvgXml xml={Edit} style={{
                                        height: vs(17),
                                        width: vs(17)
                                    }} height={vs(17)} width={vs(17)} />
                                </TouchableHighlight>
                            </View>

                        </View>

                        <View style={{ width: '100%', flexDirection: 'row', marginTop: 4 }}>
                            <View style={{ width: '9%', }}>
                            </View>
                            <Text style={{ textAlign: Configurations.textRotate, fontSize: (windowWidth * 3.2) / 100, fontFamily: Font.Regular, color: '#6D737E', marginTop: vs(4), width: '85%' }}>{addressDetails.service_address ? addressDetails?.service_address : '-'}</Text>
                        </View>
                    </View>
                </View>
            }
        </>
    )
}

export default AddressContainer;