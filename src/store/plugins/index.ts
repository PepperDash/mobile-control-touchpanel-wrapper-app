import { Store } from '@reduxjs/toolkit';
import {
  setControlSystemOnline,
  setMcAppUrl,
  setPanelIpAddress,
  setWebXPanelBuildDate,
  setWebXPanelConfig,
  setWebXPanelIsActive,
  setWebXPanelOnline,
  setWebXPanelVersion,
  setWebXPanelWsConnected,
} from '../slices';
import setupTrilist from './trilist';
import setupWebXPanel from './webXPanel';

export const applyReduxPlugins = (store: Store) => {
  setupTrilist(store, {
    actions: { setControlSystemOnline, setMcAppUrl, setPanelIpAddress },
  });

  const qp = new URLSearchParams(window.location.search);

  const host = qp.get('host');
  const ipId = qp.get('ipId');
  const roomId = qp.get('roomId');
  const port = qp.get('port');
  const authToken = qp.get('authToken');

  console.log('host', host, 'ipId', ipId, 'roomId', roomId, 'port', port);

  setupWebXPanel(store, {
    config: {
      host: host ? host : undefined,
      ipId: ipId ? ipId : '5',
      roomId: roomId ? roomId : undefined,
      port: port ? parseInt(port) : undefined,
      authToken: authToken ? authToken : undefined,
    },
    actions: {
      setWebXPanelOnline,
      setWebXPanelConfig,
      setWebXPanelVersion,
      setWebXPanelBuildDate,
      setWebXPanelIsActive,
      setWebXPanelWsConnected,
    },
  });

  return store;
};

export default applyReduxPlugins;
