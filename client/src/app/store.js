import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "@/features/api/authApi";
import rootRedcuer from "./rootRedcuer";

export const appStore = configureStore({
    reducer: rootRedcuer,
    middleware: (defaultMiddleware) =>
        defaultMiddleware().concat(authApi.middleware)
    });