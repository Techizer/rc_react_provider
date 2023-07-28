import { onUserLogout, setUserFCMToken, setUserLoginData } from '../Redux/Actions/UserActions';
import { store } from '../Redux/Store'

// Function to get the Redux state
const getReduxState = () => {
    const state = store.getState();
    return state.Auth; // This will return your entire Redux state object
};

const setUserData = (token, userData) => {

    store.dispatch(setUserFCMToken(token));
    store.dispatch(setUserLoginData(userData))
};

const setLogout = () => {

    store.dispatch(onUserLogout());
};


export {
    getReduxState,
    setUserData,
    setLogout
};
