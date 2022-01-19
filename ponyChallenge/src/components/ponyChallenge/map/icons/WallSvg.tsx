import * as React from 'react';
// Models
import { IWall } from '../../../../services/models/Wall';

const Wall = ({from, to, color}: IWall) => {
  if (from == null || to == null)
    return null;

  return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} />;
}

export default Wall;