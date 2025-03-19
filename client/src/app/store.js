import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "@/features/api/authApi";
import rootRedcuer from "./rootRedcuer";

export const appStore = configureStore({
    reducer: rootRedcuer,
    middleware: (defaultMiddleware) =>
        defaultMiddleware().concat(authApi.middleware)
    });

const initializeApp = async () => {
        await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
 }
initializeApp();