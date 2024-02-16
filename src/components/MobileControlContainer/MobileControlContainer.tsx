function MobileControlContainer({ appUrl }: IMobileControlContainerProps) {
  return (
    <>
      <iframe src={appUrl} className="mobile-control"></iframe>
    </>
  );
}

export default MobileControlContainer;

interface IMobileControlContainerProps {
  appUrl: string;
}
