import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface ITouchPanel {
  online: boolean;
  mcAppUrl: string;
  panelIpAddress: string;
}

const initialState: ITouchPanel = {
  online: false,
  mcAppUrl: '',
  panelIpAddress: '',
};

export const touchPanelSlice = createSlice({
  name: 'controlSystem',
  initialState,
  reducers: {
    setControlSystemOnline: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
      console.log(`Control System ${state.online ? 'online' : 'offline'}`);
    },
    setMcAppUrl: (state, action: PayloadAction<string>) => {
      state.mcAppUrl = action.payload;
    },
    setPanelIpAddress: (state, action: PayloadAction<string>) => {
      state.panelIpAddress = action.payload;
    },
  },
});

export const { setControlSystemOnline, setMcAppUrl, setPanelIpAddress } =
  touchPanelSlice.actions;

export const selectControlSystem = (state: RootState) => state.touchPanel;
export const selectControlSystemOnline = (state: RootState) =>
  state.touchPanel.online;
export const selectMcAppUrl = (state: RootState) => state.touchPanel.mcAppUrl;

export default touchPanelSlice.reducer;
