import * as React from 'react';
// Models
import { ISquare } from '../../../../services/models/Square';
// Material UI Icons
import ExitIcon from '@mui/icons-material/ExitToApp';

const Exit = ({width, x, y}: ISquare) => {
  const scale = () => {
    switch(width) {
      case 15: return 500;
      case 20: return 600;
      default: return 700;
    }
  };

  return (
    <ExitIcon
      x={x}
      y={y}
      viewBox={`0 0 ${scale()} ${scale()}`}
      style={{color: 'var(--myLittlePony-lightBlue)'}}
    />
  );
}

export default Exit;