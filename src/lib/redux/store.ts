// Configure Redux Store
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '~/store/root.reducer'

// Configure Redux-Persist
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

import { boardApi } from '~/queries/boards'
import { columnApi } from '~/queries/columns'
import { cardApi } from '~/queries/cards'

// Persist configuration
const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: []
  // blacklist: [],
}

const persistedReducers = persistReducer(rootPersistConfig, rootReducer)

const apiMiddlewares = [boardApi.middleware, columnApi.middleware, cardApi.middleware]

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(apiMiddlewares),
  devTools: process.env.NODE_ENV !== 'production'
})

export const persistor = persistStore(store)

// export const makeStore = () => store

// Infer the type of makeStore
// export type AppStore = ReturnType<typeof makeStore>

// Infer the type of the store
export type AppStore = typeof store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
