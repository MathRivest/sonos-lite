import React, { FC } from 'react';
import Styles from './AlbumArt.module.css';

const AlbumArt: FC<{ URI: string; name: string }> = ({ URI, name }) => {
  return <img className={Styles.AlbumArt} src={URI} alt={name} />;
};

export default AlbumArt;
