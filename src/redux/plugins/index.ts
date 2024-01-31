import { Store } from "@reduxjs/toolkit";
import setupControlSystem from "./controlSystem";
import { setControlSystemOnline, setMcAppAddress } from "../state";

export const applyReduxPlugins = (store:Store) => {
  setupControlSystem(store, {
    actions: { setControlSystemOnline, setMcAppAddress }
  })

  return store;
}

export default applyReduxPlugins;