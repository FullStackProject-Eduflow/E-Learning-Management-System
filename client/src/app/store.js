import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"; // ✅ Ensure correct path
import authApi from "../features/api/authApi"; // ✅ Ensure authApi is correctly imported

const appStore = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer, // ✅ Ensure authApi is added
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware), // ✅ Ensure middleware is added
});

// ✅ Fix export
export default appStore;