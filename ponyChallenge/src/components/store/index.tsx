import * as React from 'react';
// Models
import { IStartGame } from '../../services/models/StartGame';

enum GameSettingActionType {
  Add = 'setGameSettings',
  Delete = 'deleteGameSettings'
}

interface NewGameAction {
  type: GameSettingActionType.Add;
  value: IStartGame;
}

interface DeleteGameAction {
  type: GameSettingActionType.Delete;
}

enum MazeIdActionType {
  Add = 'setMazeId',
  Delete = 'deleteMazeId'
}

interface NewMazeIdAction {
  type: MazeIdActionType.Add;
  value: string;
}

interface DeleteMazeIdAction {
  type: MazeIdActionType.Delete;
}

interface Store {
  gameSettings: IStartGame | undefined;
  mazeId: string | undefined;
}

const initialStore: Store = {
  gameSettings: undefined,
  mazeId: undefined
};

const reducer: React.Reducer<Store, NewGameAction
  | DeleteGameAction
  | NewMazeIdAction
  | DeleteMazeIdAction> = (state, action) => {
  switch (action.type) {
    case GameSettingActionType.Add:
      return {
        ...state,
        gameSettings: action.value
      };
    case GameSettingActionType.Delete:
      return {
        ...state,
        gameSettings: undefined
      };
    case MazeIdActionType.Add:
      return {
        ...state,
        mazeId: action.value
      };
    case MazeIdActionType.Delete:
      return {
        ...state,
        mazeId: undefined
      };
    default: throw new Error('Unexpected action');
  }
};

const StoreContext = React.createContext<Partial<[Store, React.Dispatch<NewGameAction | DeleteGameAction | NewMazeIdAction | DeleteMazeIdAction>]>>([initialStore]);

interface IStoreProvider {
  children: React.ReactNode;
}

const StoreProvider = (props: IStoreProvider) => {
  const [state, dispatch] = React.useReducer<React.Reducer<Store, NewGameAction | DeleteGameAction | NewMazeIdAction | DeleteMazeIdAction>>(reducer, initialStore);
  const { children } = props;

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};

export {
  StoreContext, StoreProvider, GameSettingActionType, MazeIdActionType
};