import { ALL_USER_LOGIN_DATA, APP_STATE, CONNECTION, DEVICE_CONNECTION, FCM_DEVICE_TOKEN, NO_INTERNET, LAST_SCREEN, LOGGEDIN_USER_DATA, LOGGEDIN_USER_TYPE, LOGOUT, NOTIFICATIONS, NOTIFICATION_COUNT, PROFILE_COMPLETION_DATA, PROFILE_DATA, RATINGS, SCHEDULE_AVAILABILITY, SHOULD_AUTO_LOGIN, USER_REMEMBERED_EMAIL, USER_REMEMBERED_PASSWORD, VIDEO_CALL, VIDEO_CALL_DATA, VIDEO_CALL_STATUS } from "../Types";

const setUserLoginData = payload => ({
    type: LOGGEDIN_USER_DATA,
    payload
})

const setUserAllLoginData = payload => ({
    type: ALL_USER_LOGIN_DATA,
    payload
})

const setUserFCMToken = payload => ({
    type: FCM_DEVICE_TOKEN,
    payload
})

const setUserLoginType = payload => ({
    type: LOGGEDIN_USER_TYPE,
    payload
})

const setShouldAutoLogin = payload => ({
    type: SHOULD_AUTO_LOGIN,
    payload
})

const setRememberedEmail = payload => ({
    type: USER_REMEMBERED_EMAIL,
    payload
})

const setRememberedPassword = payload => ({
    type: USER_REMEMBERED_PASSWORD,
    payload
})

const setLastScreen = payload => ({
    type: LAST_SCREEN,
    payload
})

const setScheduleAvailabilityData = payload => ({
    type: SCHEDULE_AVAILABILITY,
    payload
})

const setProfileData = payload => ({
    type: PROFILE_DATA,
    payload
})

const setProfileCompletionData = payload => ({
    type: PROFILE_COMPLETION_DATA,
    payload
})


const setRatingsData = payload => ({
    type: RATINGS,
    payload
})

const setNotificationsData = payload => ({
    type: NOTIFICATIONS,
    payload
})

const setNotificationCount = payload => ({
    type: NOTIFICATION_COUNT,
    payload
})

const setAppState = payload => ({
    type: APP_STATE,
    payload
})

const onUserLogout = () => ({
    type: LOGOUT,
})

const setVideoCall = payload => ({
    type: VIDEO_CALL,
    payload
})

const setVideoCallData = payload => ({
    type: VIDEO_CALL_DATA,
    payload
})

const setVideoCallStatus = payload => ({
    type: VIDEO_CALL_STATUS,
    payload
})

const DeviceConnection = (payload) => ({
    type: DEVICE_CONNECTION,
    payload
})

const setNoInternet = payload => ({
    type: NO_INTERNET,
    payload
})

export {
    setUserLoginData,
    setUserAllLoginData,
    setUserFCMToken,
    setUserLoginType,
    setShouldAutoLogin,
    setRememberedEmail,
    setRememberedPassword,
    setLastScreen,
    setScheduleAvailabilityData,
    setProfileData,
    setProfileCompletionData,
    setRatingsData,
    setNotificationsData,
    setNotificationCount,
    setAppState,
    onUserLogout,
    setVideoCall,
    setVideoCallData,
    setVideoCallStatus,
    DeviceConnection,
    setNoInternet
}