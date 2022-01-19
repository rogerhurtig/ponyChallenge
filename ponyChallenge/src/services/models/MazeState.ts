import { WallDirection } from '../entities/WallDirection';
import { GameState, Result } from '../entities/GameState';

export interface IGameState {
  state: GameState;
  'state-result': Result;
}

export interface IMazeState {
  pony: number[];
  domokun: number[];
  'end-point': number[];
  size: number[];
  difficulty: number;
  data: [WallDirection[]];
  maze_id: string;
  'game-state': IGameState;
}