import { useEffect, useRef } from 'react';
import { startVideoRelay } from './videoRelay';

function MobileControlContainer({ appUrl }: IMobileControlContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }
    return startVideoRelay(iframeRef.current);
  }, []);

  return (
    <>
      <iframe ref={iframeRef} src={appUrl} className="mobile-control"></iframe>
    </>
  );
}

export default MobileControlContainer;

interface IMobileControlContainerProps {
  appUrl: string;
}
