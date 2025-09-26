import { CrComLib } from '@pepperdash/ch5-crcomlib-lite';
import { Store, UnknownAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

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

  CrComLib.subscribeState('b', '1', (value: boolean) => {
    //pulsed from control system. Triggering on falling edge
    if (value) {
      return;
    }
    // Get current mcAppUrl from store
    const currentState = store.getState() as RootState;
    const currentUrl = currentState.touchPanel.mcAppUrl;

    if (currentUrl) {
      // Generate a random value
      const randomValue = Math.random().toString(36).substring(2, 15);

      // Parse the URL to add/update the random query parameter
      try {
        const url = new URL(currentUrl);
        url.searchParams.set('_t', randomValue);
        const updatedUrl = url.toString();

        // Update the store with the new URL
        store.dispatch(options.actions.setMcAppUrl(updatedUrl));
      } catch (error) {
        // If URL parsing fails, handle the parameter manually
        let updatedUrl = currentUrl;

        // Remove existing '_t' parameter if it exists
        updatedUrl = updatedUrl.replace(/[?&]_t=[^&]*/g, '');

        // Add the new '_t' parameter
        const separator = updatedUrl.includes('?') ? '&' : '?';
        updatedUrl = `${updatedUrl}${separator}_t=${randomValue}`;

        store.dispatch(options.actions.setMcAppUrl(updatedUrl));
      }
    }
  });

  CrComLib.subscribeState('s', '1', (value: string) =>
    store.dispatch(options.actions.setMcAppUrl(value))
  );

  return store;
}

export default setupTrilist;
