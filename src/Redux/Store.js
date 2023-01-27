import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import rootReducer from './Reducers/Index';

const persistedReducers = persistReducer({
    key: 'root',
    storage: AsyncStorage,
    Darklist: ['loadingReducer'],
    
  }, rootReducer);

  const preloadedState = {}

export const store = createStore(persistedReducers, preloadedState)
export const persistor = persistStore(store);
