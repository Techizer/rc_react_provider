import { ALL_USER_LOGIN_DATA, APP_STATE, FCM_DEVICE_TOKEN, LAST_SCREEN, LOGGEDIN_USER_DATA, LOGGEDIN_USER_TYPE, LOGOUT, NOTIFICATIONS, NOTIFICATION_COUNT, PROFILE_COMPLETION_DATA, PROFILE_DATA, RATINGS, SCHEDULE_AVAILABILITY, SHOULD_AUTO_LOGIN, USER_REMEMBERED_EMAIL, USER_REMEMBERED_PASSWORD, VIDEO_CALL, VIDEO_CALL_DATA } from "../Types";

export const setUserLoginData = payload => ({
    type: LOGGEDIN_USER_DATA,
    payload
})

export const setUserAllLoginData = payload => ({
    type: ALL_USER_LOGIN_DATA,
    payload
})

export const setUserFCMToken = payload => ({
    type: FCM_DEVICE_TOKEN,
    payload
})

export const setUserLoginType = payload => ({
    type: LOGGEDIN_USER_TYPE,
    payload
})

export const setShouldAutoLogin = payload => ({
    type: SHOULD_AUTO_LOGIN,
    payload
})

export const setRememberedEmail = payload => ({
    type: USER_REMEMBERED_EMAIL,
    payload
})

export const setRememberedPassword = payload => ({
    type: USER_REMEMBERED_PASSWORD,
    payload
})

export const setLastScreen = payload => ({
    type: LAST_SCREEN,
    payload
})

export const setScheduleAvailabilityData = payload => ({
    type: SCHEDULE_AVAILABILITY,
    payload
})

export const setProfileData = payload => ({
    type: PROFILE_DATA,
    payload
})

export const setProfileCompletionData = payload => ({
    type: PROFILE_COMPLETION_DATA,
    payload
})


export const setRatingsData = payload => ({
    type: RATINGS,
    payload
})

export const setNotificationsData = payload => ({
    type: NOTIFICATIONS,
    payload
})

export const setNotificationCount = payload => ({
    type: NOTIFICATION_COUNT,
    payload
})

export const setAppState = payload => ({
    type: APP_STATE,
    payload
})
 
export const onUserLogout = () => ({
    type: LOGOUT,
})

export const setVideoCall = payload => ({
    type: VIDEO_CALL,
    payload
})

export const setVideoCallData = payload => ({
    type: VIDEO_CALL_DATA,
    payload
})