import { bridgeReceiveBooleanFromNative, bridgeReceiveIntegerFromNative, bridgeReceiveObjectFromNative, bridgeReceiveStringFromNative, isCrestronTouchscreen, subscribeState } from "@crestron/ch5-crcomlib";
import { Store, UnknownAction } from "@reduxjs/toolkit";

export interface IControlSystemOptions {
  actions: {
    setControlSystemOnline: (online: boolean) => UnknownAction;
    setMcAppAddress: (address: string) => UnknownAction;
  }
}

function setupControlSystem(
  store: Store,
  options: IControlSystemOptions
) {
  if (isCrestronTouchscreen()) {
    console.log('Control System detected');

    window.bridgeReceiveIntegerFromNative = bridgeReceiveIntegerFromNative;
    window.bridgeReceiveStringFromNative = bridgeReceiveStringFromNative;
    window.bridgeReceiveBooleanFromNative = bridgeReceiveBooleanFromNative;
    window.bridgeReceiveObjectFromNative = bridgeReceiveObjectFromNative;
  }

  subscribeState('b', 'Csig.All_Control_Systems_Online_fb', (value: boolean) => store.dispatch(options.actions.setControlSystemOnline(value)));

  subscribeState('s', '1', (value: string) => store.dispatch(options.actions.setMcAppAddress(value)));
  
  return store;
}

export default setupControlSystem;
