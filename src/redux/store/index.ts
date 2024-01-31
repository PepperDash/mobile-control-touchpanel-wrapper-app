import { configureStore } from "@reduxjs/toolkit";
import  applyReduxPlugins  from "../plugins";
import controlSystemReducer from "../state/controlSystem";

const store = configureStore({
  reducer: {
    controlSystem: controlSystemReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default applyReduxPlugins(store);