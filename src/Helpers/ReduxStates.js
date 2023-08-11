import { DeviceConnection, onUserLogout, setNoInternet, setUserFCMToken, setUserLoginData, setVideoCall, setVideoCallStatus } from '../Redux/Actions/UserActions';
import { store } from '../Redux/Store'

// Function to get the Redux state
const getReduxState = () => {
    const state = store.getState();
    return state.StorageReducer; // This will return your entire Redux state object
};

const setUserData = (token, userData) => {

    store.dispatch(setUserFCMToken(token));
    store.dispatch(setUserLoginData(userData))
};

const setLogout = () => {
    store.dispatch(onUserLogout());
};

const setConnection = (isConnected) => {
    const { callStatus, isVideoCall } = getReduxState();

    store.dispatch(DeviceConnection(isConnected));

    if (!isConnected && isVideoCall && (callStatus == 7 || callStatus == 2)) {
        setTimeout(() => {
            store.dispatch(setVideoCallStatus(10))
        }, 1000);

    } else if (!isConnected && isVideoCall && (callStatus == 0 || callStatus == 1 || callStatus == 8)) {
        store.dispatch(setVideoCallStatus(0))
        setTimeout(() => {
            store.dispatch(setVideoCall(false))
        }, 2000);
    } else if (!isConnected && isVideoCall && (callStatus == 4 || callStatus == 5 || callStatus == 9)) {
        store.dispatch(setVideoCallStatus(callStatus))
    }
};


export {
    getReduxState,
    setUserData,
    setLogout,
    setConnection
};
