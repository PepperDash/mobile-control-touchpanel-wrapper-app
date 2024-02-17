import { configureStore } from '@reduxjs/toolkit';
import applyReduxPlugins from '../plugins';
import touchPanelReducer from '../slices/touchPanel';
import webXPanelReducer from '../slices/webXpanel';

const store = configureStore({
  reducer: {
    touchPanel: touchPanelReducer,
    webXPanel: webXPanelReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default applyReduxPlugins(store);
