import { ALL_USER_LOGIN_DATA, LAST_SCREEN, LOGGEDIN_USER_TYPE, SCHEDULE_AVAILABILITY, SHOULD_AUTO_LOGIN, USER_REMEMBERED_EMAIL, USER_REMEMBERED_PASSWORD } from '../Types';
import { LOGGEDIN_USER_DATA, LOGOUT, FCM_DEVICE_TOKEN } from '../Types';
import { ScreenReferences } from '../../Stacks/ScreenReferences'

const initialState = {
    loginUserData: null,
    fcmDeviceToken: null,
    userType: null,
    shouldAutoLogin: false,
    userEmail: '',
    userPassword: '',
    scheduleAvailability: null,
    lastScreen: ScreenReferences.Splash
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
        case USER_REMEMBERED_EMAIL:
            return {
                ...state,
                userEmail: action.payload,
            };
        case USER_REMEMBERED_PASSWORD:
            return {
                ...state,
                userPassword: action.payload,
            };
        case SHOULD_AUTO_LOGIN:
            return {
                ...state,
                shouldAutoLogin: action.payload,
            };
        case LAST_SCREEN:
            return {
                ...state,
                lastScreen: action.payload,
            };

        case SCHEDULE_AVAILABILITY:
            return {
                ...state,
                scheduleAvailability: action.payload,
            };
        default:
            return state;
    }
}

export { Authentication }