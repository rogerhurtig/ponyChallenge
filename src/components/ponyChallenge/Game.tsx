import * as React from 'react';
// Components
import GameSettings from './GameSettings';
import Maze from './map';
import { StoreContext, GameSettingActionType, MazeIdActionType } from '../store';
// Models
import { IPonyService } from '../../services/PonyApiService';
import { IStartGame } from '../../services/models/StartGame';
// Utils
import { delayAbortSignal } from '../../api/utils/DelayAbortSignal';
// Images
import PonyInMazeImg from '../../img/hero1.jpg';

type Props = {
  api: IPonyService;
}

const Game: React.FunctionComponent<Props> = ({ api }) => {
  const [store, dispatch] = React.useContext(StoreContext);

  React.useEffect(() => {
    return () => {
      // Delete game settings in global state after finished game
      if (dispatch)
        dispatch({type: GameSettingActionType.Delete});
    }
  }, [dispatch]);

  const onStartGame = async (gameSettings: IStartGame) => {
    const data = await api.startGame(gameSettings, delayAbortSignal(6000));
    if (data == null)
      return;

    if (dispatch)
      dispatch({type: MazeIdActionType.Add, value: data.maze_id});
  };

  const onGameOver = () => {
    if (dispatch) {
      dispatch({type: MazeIdActionType.Delete});
      dispatch({type: GameSettingActionType.Delete});
    }
  };

  const GameContent = () => {
    if (typeof store?.mazeId === 'string')
      return <Maze api={api} mazeId={store.mazeId} onGameOver={onGameOver} />;

    return (
      <React.Fragment>
        <img
          src={PonyInMazeImg as string}
          alt="My little pony in a maze"
          style={{width: '100vw', maxHeight: '20vh', maxWidth: '540px'}}
        />
        &nbsp;
        <GameSettings startGame={onStartGame} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <GameContent />
    </React.Fragment>
  );
};

export default Game;