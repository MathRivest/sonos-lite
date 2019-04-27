import React, { CSSProperties } from 'react';

const ElectronDragBar: React.FC = () => {
  const style = {
    WebkitAppRegion: 'drag',
    height: 24,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  } as CSSProperties;
  return <div style={style} />;
};

export default ElectronDragBar;
