import { ALL_USER_LOGIN_DATA, LOGGEDIN_USER_TYPE, SHOULD_AUTO_LOGIN } from '../Types';
import { LOGGEDIN_USER_DATA, LOGOUT, FCM_DEVICE_TOKEN } from '../Types';

const initialState = {
    loginUserData: null,
    fcmDeviceToken: null,
    userType: null,
    shouldAutoLogin: false,
    userEmail: '',
    userPassword: ''
};

const Authentication = (state = initialState, action = {}) => {
    switch (action.type) {
        case LOGOUT:
            if (state.shouldAutoLogin == true) {
                return {
                    ...initialState,
                    shouldAutoLogin: state.shouldAutoLogin,
                    userType: state.userType,
                    userEmail: state.userEmail,
                    userPassword: state.userPassword
                }
            }
            return initialState
        case ALL_USER_LOGIN_DATA:
            return {
                ...state,
                loginUserData: (action.payload.loginUserData) ? action.payload.loginUserData : state.loginUserData,
                fcmDeviceToken: (action.payload.fcmDeviceToken) ? action.payload.fcmDeviceToken : state.fcmDeviceToken,
                userType: (action.payload.userType) ? action.payload.userType : state.userType,
                shouldAutoLogin: (action.payload.shouldAutoLogin) ? action.payload.shouldAutoLogin : state.shouldAutoLogin,
            };
        case LOGGEDIN_USER_DATA:
            return {
                ...state,
                loginUserData: action.payload,
            };
        case LOGGEDIN_USER_TYPE:
            return {
                ...state,
                userType: action.payload,
            };
        case FCM_DEVICE_TOKEN:
            return {
                ...state,
                fcmDeviceToken: action.payload,
            };
        case SHOULD_AUTO_LOGIN:
            return {
                ...state,
                shouldAutoLogin: action.payload,
            };
        default:
            return state;
    }
}

export { Authentication }