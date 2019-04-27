import React, { FC } from 'react';
import Styles from './App.module.css';
import ElectronDragBar from './components/ElectronDragBar';
import Player from './components/Player/Player';

const App: FC = () => {
  return (
    <div className={Styles.App}>
      <ElectronDragBar />
      <Player />
      <div>Currently Playing:</div>
      <div>Up next:</div>
    </div>
  );
};

export default App;
