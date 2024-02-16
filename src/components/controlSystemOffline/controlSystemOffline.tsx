import classes from './controlSystemOffline.module.scss';
import logoUrl from '../../assets/mobile-control-pdt-logo.svg';

function ControlSystemDisconnected() {
  return (
    <div>
      <img src={logoUrl} className={`${classes.logo}`}></img>
      <h1>Control System Offline</h1>
    </div>
  );
}

export default ControlSystemDisconnected;
