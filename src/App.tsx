import React, { FC } from 'react';
import Styles from './App.module.css';
import ElectronDragBar from './components/ElectronDragBar';
import Player from './components/Player/Player';

const App: FC = () => {
  return (
    <div className={Styles.App}>
      <ElectronDragBar />
      <Player />
    </div>
  );
};

export default App;
