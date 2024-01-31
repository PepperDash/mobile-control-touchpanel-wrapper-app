import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IControlSystem {
  online: boolean;
  mcAppAddress: string;
}

const initialState: IControlSystem = {
  online: false,
  mcAppAddress: '',
};

export const controlSystemSlice = createSlice({
  name: 'controlSystem',
  initialState,
  reducers: {
    setControlSystemOnline: (state, action:PayloadAction<boolean>) => {
      state.online = action.payload;
      console.log(`Control System ${state.online ? 'online' : 'offline'}`);
    },
    setMcAppAddress: (state, action:PayloadAction<string>) => {
      state.mcAppAddress = action.payload;
    },
  },
});

export const { setControlSystemOnline, setMcAppAddress } = controlSystemSlice.actions;

export const selectControlSystem = (state:RootState) => state.controlSystem;
export const selectControlSystemOnline = (state:RootState) => state.controlSystem.online;
export const selectMcAppAddress = (state:RootState) => state.controlSystem.mcAppAddress;

export default controlSystemSlice.reducer;
