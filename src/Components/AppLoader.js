import React, { Component } from "react"
import {
    View, Dimensions,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Platform
} from "react-native"
import Spinner from 'react-native-spinkit';

export default AppLoader = ({ loading }) => {
    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={loading}>

            <TouchableOpacity
                activeOpacity={1}
                style={styles.container}>

                <Spinner isVisible={loading}
                    size={60} 
                    type={(Platform.OS == "ios") ? 'Arc' : 'Circle'}
                    color={'#0168B3'}
                    style={{
                        justifyContent: 'center',
                        alignSelf: 'center'
                    }}
                />

            </TouchableOpacity>

        </Modal>
    )

}
const styles = StyleSheet.create({
    container: {
        position: "absolute",
        justifyContent: "center",
        backgroundColor: '#00000040',
        top: 0, left: 0, bottom: 0, right: 0
    },

    activityIndicatorWrapper: {
        height: 80,
        width: 80,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0168B3', 
        borderRadius: 6,
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
    }
})
