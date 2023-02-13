import { ALL_USER_LOGIN_DATA, FCM_DEVICE_TOKEN, LAST_SCREEN, LOGGEDIN_USER_DATA, LOGGEDIN_USER_TYPE, LOGOUT, SHOULD_AUTO_LOGIN, USER_REMEMBERED_EMAIL, USER_REMEMBERED_PASSWORD } from "../Types";

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

export const onUserLogout = () => ({
    type: LOGOUT,
})