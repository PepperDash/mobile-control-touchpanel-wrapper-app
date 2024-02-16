/* eslint-disable @typescript-eslint/no-explicit-any */
import { CrComLib } from '@crestron/ch5-crcomlib';
declare global {
  interface Window {
    bridgeReceiveIntegerFromNative: (signalName: string, value: number) => void;
    bridgeReceiveStringFromNative: (signalName: string, value: string) => void;
    bridgeReceiveBooleanFromNative: (
      signalName: string,
      value: boolean
    ) => void;
    bridgeReceiveObjectFromNative: (signalName: string, value: any) => void;
    CrComLib: typeof CrComLib;
  }
}

export {};
