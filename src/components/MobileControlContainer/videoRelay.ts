import { CrComLib } from '@pepperdash/ch5-crcomlib-lite';

/**
 * Passes video requests from the app in the iframe on to the panel, and the
 * panel's responses back to the app.
 *
 * The app's `VideoWindow` component (mobile-control-react-app-core) cannot do
 * this itself from inside an iframe:
 *
 *   - the panel only delivers video responses to the top-level page (this one)
 *   - the app reports where the video goes relative to the iframe, and the
 *     panel needs the position on screen
 *   - the panel draws the video underneath the page, so this page's own
 *     background has to be see-through while a video is running
 *
 * The message types below are shared with mobile-control-react-app-core
 * (src/lib/shared/VideoWindow/videoTransport.ts) and must match it.
 */
const VIDEO_REQUEST = 'Csig.video.request';
const VIDEO_RESPONSE = 'Csig.video.response';

const RELAY_HELLO = 'pd-mc-video-hello';
const RELAY_READY = 'pd-mc-video-ready';
const RELAY_REQUEST = 'pd-mc-video-request';
const RELAY_RESPONSE = 'pd-mc-video-response';
const RELAY_RESET = 'pd-mc-video-reset';

interface VideoRequest {
  action: string;
  id: number;
  alphablend?: boolean;
  location?: { top: number; left: number; width: number; height: number };
}

const isVideoRequest = (value: unknown): value is VideoRequest => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const { action, id, location } = value as VideoRequest;

  return (
    typeof action === 'string' &&
    typeof id === 'number' &&
    (location === undefined ||
      (!!location &&
        Number.isFinite(location.top) &&
        Number.isFinite(location.left)))
  );
};

const SEE_THROUGH_ATTRIBUTE = 'data-video-see-through';

/**
 * Makes the element's background transparent and returns a function that
 * undoes it. Done with an attribute and a style rule, so that any background
 * set on the element itself is left as it was.
 */
const makeTransparent = (element: HTMLElement) => {
  if (!document.getElementById(SEE_THROUGH_ATTRIBUTE)) {
    const rule = document.createElement('style');
    rule.id = SEE_THROUGH_ATTRIBUTE;
    rule.textContent = `[${SEE_THROUGH_ATTRIBUTE}]{background:transparent !important}`;
    document.head.appendChild(rule);
  }
  element.setAttribute(SEE_THROUGH_ATTRIBUTE, '');

  return () => element.removeAttribute(SEE_THROUGH_ATTRIBUTE);
};

// A page loaded from a file has the origin "null", which cannot be used as a
// target, so the wildcard is the only option there.
const targetOrigin = (origin: string) => (origin === 'null' ? '*' : origin);

/**
 * Starts relaying video messages for the app loaded in `iframe`. Returns a
 * function that stops the relay, along with any video it started.
 */
export const startVideoRelay = (iframe: HTMLIFrameElement) => {
  // Origin of the app, known once it has sent a message
  let appOrigin: string | undefined;
  // Videos the panel has been asked to start and not yet to stop
  const runningIds = new Set<number>();
  // The running videos that are drawn underneath the page
  const seeThroughIds = new Set<number>();
  let restoreBackgrounds: (() => void)[] = [];

  const updateBackgrounds = () => {
    if (seeThroughIds.size > 0 && restoreBackgrounds.length === 0) {
      // The iframe and everything it sits in, up to <html>
      for (
        let element: HTMLElement | null = iframe;
        element;
        element = element.parentElement
      ) {
        restoreBackgrounds.push(makeTransparent(element));
      }
    } else if (seeThroughIds.size === 0) {
      restoreBackgrounds.forEach((restore) => restore());
      restoreBackgrounds = [];
    }
  };

  const forwardRequest = (request: VideoRequest) => {
    if (request.action === 'stop') {
      runningIds.delete(request.id);
      seeThroughIds.delete(request.id);
    } else {
      runningIds.add(request.id);
      if (request.alphablend === false) {
        seeThroughIds.delete(request.id);
      } else {
        seeThroughIds.add(request.id);
      }
    }
    updateBackgrounds();

    if (!request.location) {
      CrComLib.publishEvent('o', VIDEO_REQUEST, request);
      return;
    }

    // The app measures from the top left of the iframe's content. The panel
    // needs whole numbers measured from the top left of the screen.
    const frame = iframe.getBoundingClientRect();
    CrComLib.publishEvent('o', VIDEO_REQUEST, {
      ...request,
      location: {
        ...request.location,
        top: Math.ceil(request.location.top + frame.top + iframe.clientTop),
        left: Math.ceil(request.location.left + frame.left + iframe.clientLeft),
      },
    });
  };

  const stopAll = () => {
    runningIds.forEach((id) =>
      CrComLib.publishEvent('o', VIDEO_REQUEST, { action: 'stop', id })
    );
    runningIds.clear();
    seeThroughIds.clear();
    updateBackgrounds();
  };

  const handleMessage = (event: MessageEvent) => {
    // Only the app in the iframe may use the relay
    if (!iframe.contentWindow || event.source !== iframe.contentWindow) {
      return;
    }

    const data = event.data;
    if (!data || typeof data !== 'object') {
      return;
    }

    if (data.type === RELAY_HELLO) {
      // A page sends this once, before its first request. Anything still
      // running was started by a page that has since been replaced without
      // getting the chance to stop its video.
      stopAll();
      appOrigin = event.origin;
      iframe.contentWindow.postMessage(
        { type: RELAY_READY },
        targetOrigin(event.origin)
      );
      return;
    }

    if (data.type === RELAY_REQUEST && isVideoRequest(data.request)) {
      appOrigin = event.origin;
      forwardRequest(data.request);
    }
  };

  // A new page has finished loading in the iframe. The page it replaced may
  // not have been able to stop its video, and the new page may have no video
  // on it, so everything is stopped here. In case the new page was quick
  // enough to start a video before it finished loading, it is told about the
  // stop so that it can start that video again.
  const handleLoad = () => {
    stopAll();
    if (appOrigin !== undefined) {
      iframe.contentWindow?.postMessage(
        { type: RELAY_RESET },
        targetOrigin(appOrigin)
      );
    }
  };

  const subscriptionId = CrComLib.subscribeState(
    'o',
    VIDEO_RESPONSE,
    (response: object) => {
      if (appOrigin === undefined) {
        return;
      }
      iframe.contentWindow?.postMessage(
        { type: RELAY_RESPONSE, response },
        targetOrigin(appOrigin)
      );
    }
  );

  window.addEventListener('message', handleMessage);
  iframe.addEventListener('load', handleLoad);

  return () => {
    window.removeEventListener('message', handleMessage);
    iframe.removeEventListener('load', handleLoad);
    CrComLib.unsubscribeState('o', VIDEO_RESPONSE, subscriptionId);
    stopAll();
  };
};
