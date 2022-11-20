import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";
import authSlice from "./reducers/authSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
  }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
