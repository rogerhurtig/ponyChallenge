import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
// Components
import SvgMap from './SvgMap';
import { ErrorFallback, logError } from '../../FallBackComponent';
import Walls from './Walls';
import Squares from './Squares';
import Loader from '../../loader';
// Styled Elements
import { MapContainer } from '../../styledElements/index';
// Models
import MazeService, { IMazeService } from '../../../services/MazeService';
import { IPonyService } from '../../../services/PonyApiService';
import { ISquare } from '../../../services/models/Square';
import { IWall } from '../../../services/models/Wall';
// Entities
import { MovePonyDirection } from '../../../services/entities/MovePonyDirection';

type Props = {
  api: IPonyService;
  mazeId: string;
  onGameOver: () => void;
}

const Maze: React.FunctionComponent<Props> = ({api, mazeId, onGameOver}) => {
  const [mazeService] = React.useState<IMazeService>(new MazeService(api));
  const [squares, setSquares] = React.useState<ISquare[]>([]);
  const [walls, setWalls] = React.useState<IWall[]>([]);

  React.useLayoutEffect(() => {
    let abortController: AbortController | undefined;

    const getMazeState = async () => {
      if (typeof mazeId != 'string')
        return;

      // Abort pending fetch
      if (abortController) {
        abortController.abort();
        abortController = undefined;
      }

      abortController = new AbortController();
      const maze = await mazeService.getMaze(mazeId, abortController.signal);
      if (maze == null)
        return;

      setSquares(maze.squares);
      setWalls(maze.walls);
    };

    void getMazeState();

    return () => {
      // Abort pending fetch
      if (abortController) {
        abortController.abort();
        abortController = undefined;
      }
    }
  }, [mazeService, mazeId]);

  const movePony = React.useCallback(async (direction: MovePonyDirection) => {
    await mazeService.movePony(direction, mazeId, onGameOver);
  }, [mazeService, mazeId, onGameOver]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Ignoring keydown during IME composition
      if (event.isComposing || event.keyCode === 229)
        return;

      switch(event.key) {
        case 'ArrowUp': {
          void movePony(MovePonyDirection.north);
          break;
        }
        case 'ArrowDown': {
          void movePony(MovePonyDirection.south);
          break;
        }
        case 'ArrowLeft': {
          void movePony(MovePonyDirection.west);
          break;
        }
        case 'ArrowRight': {
          void movePony(MovePonyDirection.east);
          break;
        }
        case 'Enter': {
          void movePony(MovePonyDirection.stay);
          break;
        }
        default: // Ignore key press
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [movePony]);

  if (squares.length === 0 || walls.length === 0)
    return <Loader />;

  return (
    <MapContainer>
      <SvgMap>
        <Walls a_walls={walls} />
        <Squares a_squares={squares} squareSubject={mazeService.squareSubject} movePony={movePony} />
      </SvgMap>
    </MapContainer>
  );
};

const MazeMapWithErrorBoundary = withErrorBoundary(Maze, {
  FallbackComponent: ErrorFallback,
  onError(error, componentStack) {
    logError(error, componentStack);
  }
});

export default MazeMapWithErrorBoundary;
