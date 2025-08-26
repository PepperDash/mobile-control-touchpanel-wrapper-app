/* eslint-disable @typescript-eslint/no-explicit-any */
import { CrComLib } from '@pepperdash/ch5-crcomlib-lite';
import { getWebXPanel, runsInContainerApp } from '@crestron/ch5-webxpanel';
import { Store, UnknownAction } from 'redux';

const {
  WebXPanel,
  isActive,
  WebXPanelConfigParams,
  WebXPanelEvents,
  getVersion,
  getBuildDate,
  enableDebugging,
  setLogLevel,
  LogLevel,
} = getWebXPanel(!runsInContainerApp());

export type WebXPanelConfigParams = typeof WebXPanelConfigParams;

interface IWebXPanelOptions {
  config: Partial<WebXPanelConfigParams>;
  actions: {
    setWebXPanelOnline: (value: boolean) => UnknownAction;
    setWebXPanelConfig: (
      value: Partial<WebXPanelConfigParams>
    ) => UnknownAction;
    setWebXPanelVersion: (value: string) => UnknownAction;
    setWebXPanelBuildDate: (value: string) => UnknownAction;
    setWebXPanelIsActive: (value: boolean) => UnknownAction;
    setWebXPanelWsConnected: (value: boolean) => UnknownAction;
  };
}

export const setupWebXPanel = (
  store: Store,
  options: IWebXPanelOptions
): Store => {
  store.dispatch(options.actions.setWebXPanelVersion(getVersion()));
  store.dispatch(options.actions.setWebXPanelBuildDate(getBuildDate()));
  store.dispatch(options.actions.setWebXPanelIsActive(isActive));
  store.dispatch(options.actions.setWebXPanelConfig(options.config));

  if (!isActive) {
    return store;
  }

  enableDebugging();
  setLogLevel(LogLevel.DEBUG);

  window.CrComLib = CrComLib;

  WebXPanel.initialize(options.config);

  WebXPanel.addEventListener(WebXPanelEvents.CONNECT_WS, () => {
    store.dispatch(options.actions.setWebXPanelWsConnected(true));
  });

  WebXPanel.addEventListener(WebXPanelEvents.DISCONNECT_WS, () => {
    store.dispatch(options.actions.setWebXPanelWsConnected(false));
  });

  WebXPanel.addEventListener(WebXPanelEvents.ERROR_WS, () => {
    console.log('WebXPanel WebSocket Error');
  });

  WebXPanel.addEventListener(WebXPanelEvents.WEB_WORKER_FAILED, () => {
    console.log('WebXPanel Web Worker Failed');
  });

  WebXPanel.addEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, () => {
    console.log('WebXPanel Authentication Failed');
  });

  WebXPanel.addEventListener(WebXPanelEvents.AUTHENTICATION_REQUIRED, () => {
    console.log('WebXPanel Authentication Required');
  });

  WebXPanel.addEventListener(WebXPanelEvents.CONNECT_CIP, (event: any) => {
    const { url, ipId, roomId } = event.detail;
    console.log(
      `WebXPanel Connected to ${url}, 0x${ipId.toString(16)}, ${roomId}`
    );
  });

  WebXPanel.addEventListener(WebXPanelEvents.DISCONNECT_CIP, (event: any) => {
    console.log(
      `WebXpanel Disconnected from CIP. Reason: ${JSON.stringify(event, null, 2)}`
    );
  });

  WebXPanel.addEventListener(WebXPanelEvents.LICENSE_WS, (event: any) => {
    console.log('WebXPanel License Info...');
    console.log(event.detail);
  });

  WebXPanel.addEventListener(WebXPanelEvents.NOT_AUTHORIZED, () => {
    console.log('WebXPanel Not Authorized');
  });

  return store;
};

export default setupWebXPanel;
