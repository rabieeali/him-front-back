import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice"
import authReducer from '../features/auth/authSlice'
import storage from "redux-persist/lib/storage"
import { persistReducer } from "redux-persist"


// const persisitConfiguration = {
//     key: "root",
//     version: 1,
//     storage
// }

// const reducer = combineReducers({
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     auth: authReducer
// })

// const persistedReducer = persistReducer(persisitConfiguration, reducer)

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})