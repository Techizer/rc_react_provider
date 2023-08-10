import { ALL_USER_LOGIN_DATA, APP_STATE, DEVICE_CONNECTION, NO_INTERNET, LAST_SCREEN, LOGGEDIN_USER_TYPE, NOTIFICATIONS, NOTIFICATION_COUNT, PROFILE_COMPLETION_DATA, PROFILE_DATA, RATINGS, SCHEDULE_AVAILABILITY, SHOULD_AUTO_LOGIN, USER_REMEMBERED_EMAIL, USER_REMEMBERED_PASSWORD, VIDEO_CALL, VIDEO_CALL_DATA, VIDEO_CALL_STATUS } from '../Types';
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
    profileData: null,
    profileCompletion: null,
    ratings: null,
    lastScreen: ScreenReferences.Splash,
    notifications: [],
    notificationCount: 0,
    appState: '',
    isVideoCall: false,
    videoDetails: null,
    callStatus: 0,
    deviceConnection: null,
    noInternet: false
};

const ReducerCases = (state = initialState, action = {}) => {
    switch (action.type) {
        case LOGOUT:
            if (state.shouldAutoLogin == true) {
                return {
                    ...initialState,
                    shouldAutoLogin: state.shouldAutoLogin,
                    userType: state.userType,
                    userEmail: state.userEmail,
                    userPassword: state.userPassword,
                    profileData: state.profileData,
                    // loginUserData: state.loginUserData
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
        case PROFILE_DATA:
            return {
                ...state,
                profileData: action.payload,
            };
        case PROFILE_COMPLETION_DATA:
            return {
                ...state,
                profileCompletion: action.payload,
            };
        case RATINGS:
            return {
                ...state,
                ratings: action.payload,
            };
        case NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload,
            };
        case NOTIFICATION_COUNT:
            return {
                ...state,
                notificationCount: action.payload,
            };
        case APP_STATE:
            return {
                ...state,
                appState: action.payload,
            };

        case VIDEO_CALL:
            return {
                ...state,
                isVideoCall: action.payload,
            };
        case VIDEO_CALL_DATA:
            return {
                ...state,
                videoDetails: action.payload,
            };
        case VIDEO_CALL_STATUS:
            return {
                ...state,
                callStatus: action.payload,
            };

        case DEVICE_CONNECTION:
            return {
                ...state,
                deviceConnection: action.payload,
            };
        case NO_INTERNET:
            return {
                ...state,
                noInternet: action.payload,
            };

        default:
            return state;
    }
}

export { ReducerCases }