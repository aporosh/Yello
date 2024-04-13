import {configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import challengeSlice from "./challenge/challengeSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        challenge: challengeSlice
    },
    middleware: (getMiddleware) => getMiddleware().concat(apiSlice.middleware)
});