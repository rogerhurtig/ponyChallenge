import * as React from 'react';
import { Subject } from 'rxjs';
// Icons
import Domokun from './icons/Domokun';
import Pony from './icons/Pony';
import Exit from './icons/ExitSvg';
// Models
import { ISquare } from '../../../services/models/Square';
import { MovePonyDirection } from '../../../services/entities/MovePonyDirection';

type Props = {
  a_squares: ISquare[];
  squareSubject: Subject<ISquare>;
  movePony: (direction: MovePonyDirection) => Promise<void>;
}

const Walls: React.FunctionComponent<Props> = ({a_squares, squareSubject, movePony}) => {
  const [squares] = React.useState<ISquare[]>(a_squares);

  if (squares.length === 0)
    return null;

  return (
    <React.Fragment>
    {
      squares.map(square => {
        return (
          <React.Fragment key={`${square.id}-square`}>
            <Domokun key={`${square.id}-domokun`} a_square={square} squareSubject={squareSubject} />
            <Pony key={`${square.id}-pony`} a_square={square} squareSubject={squareSubject} movePony={movePony} />
            {(square.isEndPoint && <Exit {...square} />)}
          </React.Fragment>
        )
      })
    }
    </React.Fragment>
  );
};

export default Walls;