import React, { FC } from 'react';
import logo from './logo.svg';
import style from './App.module.css';
import ElectronDragBar from './components/ElectronDragBar';

const App: FC = () => {
  return (
    <div className={style.App}>
      <ElectronDragBar />
      <header className={style.AppHeader}>
        <img src={logo} className={style.AppLogo} alt="logo" />
      </header>
    </div>
  );
};

export default App;
