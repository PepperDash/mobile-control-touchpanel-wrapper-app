import { CrComLib } from '@pepperdash/ch5-crcomlib-lite';
import { Store, UnknownAction } from '@reduxjs/toolkit';

export interface IControlSystemActions {
  actions: {
    setControlSystemOnline: (online: boolean) => UnknownAction;
    setMcAppUrl: (address: string) => UnknownAction;
    setPanelIpAddress: (address: string) => UnknownAction;
  };
}

function setupTrilist(store: Store, options: IControlSystemActions) {
  console.log(CrComLib);
  CrComLib.subscribeState(
    'b',
    'Csig.All_Control_Systems_Online_fb',
    (value: boolean) =>
      store.dispatch(options.actions.setControlSystemOnline(value))
  );
  CrComLib.subscribeState('s', 'Csig.Ip_Address_fb', (value: string) =>
    store.dispatch(options.actions.setPanelIpAddress(value))
  );

  CrComLib.subscribeState('s', '1', (value: string) =>
    store.dispatch(options.actions.setMcAppUrl(value))
  );

  return store;
}

export default setupTrilist;
