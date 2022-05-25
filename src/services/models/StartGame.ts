export interface IStartGame {
  'maze-width': number;
  'maze-height': number;
  'maze-player-name': string;
  difficulty: number;
}

export interface IStartGameResponseBody {
  maze_id: string;
}