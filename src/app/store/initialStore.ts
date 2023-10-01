import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { ProfileReducer } from '@shared/store/profile'
import { UsersSlice } from '@shared/store/users'


import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
  persistStore,
} from 'redux-persist'

import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [],
};

export const rootReducer = combineReducers({
  ProfileReducer,
  UsersSlice,
});


const _persistedReducer = persistReducer(persistConfig, rootReducer);

export const setupStore = () => {
  return configureStore({
    reducer: _persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: {
          /* ignore persistance actions */
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],

          serializableCheck: false,
        },
      }),
  });
};

const store = setupStore();
const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof rootReducer>;

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];