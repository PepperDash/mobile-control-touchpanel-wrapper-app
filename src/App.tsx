import './App.css';
import MobileControlContainer from './components/MobileControlContainer/MobileControlContainer';
import ControlSystemDisconnected from './components/controlSystemOffline/controlSystemOffline';
import { useAppSelector } from './store/hooks';
import { selectControlSystemOnline, selectMcAppUrl } from './store/slices';

function App() {
  const controlSystemOnline = useAppSelector(selectControlSystemOnline);
  const appUrl = useAppSelector(selectMcAppUrl);

  console.log(appUrl);
  return (
    <>
      {!controlSystemOnline && <ControlSystemDisconnected />}
      {controlSystemOnline && !appUrl && <h1>No App URL configured</h1>}
      {controlSystemOnline && appUrl && (
        <MobileControlContainer appUrl={appUrl} />
      )}
    </>
  );
}

export default App;
