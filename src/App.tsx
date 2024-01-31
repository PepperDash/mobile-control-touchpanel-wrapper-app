import React from 'react';
import logo from './logo.svg';
import './App.css';

import ControlSystemDisconnected from './components/controlSystemDisconnected';
import { useAppSelector } from './redux/hooks';
import { selectControlSystemOnline } from './redux/state';

function App() {
  const controlSystemOnline = useAppSelector(selectControlSystemOnline);
  return (
    <>
      {!controlSystemOnline && <ControlSystemDisconnected />}
    </>
  );
}

export default App;
