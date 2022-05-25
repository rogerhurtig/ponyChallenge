import * as React from 'react';
// Icons
import WallSvg from './icons/WallSvg';
// Models
import { IWall } from '../../../services/models/Wall';

type Props = {
  a_walls: IWall[];
}

const Walls: React.FunctionComponent<Props> = ({a_walls}) => {
  const [walls] = React.useState<IWall[]>(a_walls);

  const cachedWalls = React.useMemo(() => {
    if (walls.length === 0)
      return null;

    return walls.map(wall => <WallSvg key={`${wall.id}-line`} {...wall} />);
  }, [walls]);

  return (
    <React.Fragment>
      {cachedWalls}
    </React.Fragment>
  );
};

export default Walls;