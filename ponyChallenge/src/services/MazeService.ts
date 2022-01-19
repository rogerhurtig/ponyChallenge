// Components
import { Subject } from 'rxjs';
// Models
import { IGameState, IMazeState } from './models/MazeState';
import { IPonyService } from './PonyApiService';
import { ISquare } from './models/Square';
import { IWall } from './models/Wall';
// Entities
import { WallDirection } from './entities/WallDirection';
import { MovePonyDirection } from './entities/MovePonyDirection';
import { Severity } from '../api/entities/Severity';
import { Result } from './entities/GameState';
// Utils
import { delay } from '../utils/Timers';

interface IMaze {
  squares: ISquare[];
  walls: IWall[];
}

export interface IMazeService {
  movePony(direction: MovePonyDirection, mazeId: string, onGameOver: () => void): Promise<void>;
  getMaze(mazeId: string, signal: AbortSignal): Promise<IMaze | null>;
  squareSubject: Subject<ISquare>;
}

class MazeService implements IMazeService {
  protected _api: IPonyService;
  protected _squareSubject: Subject<ISquare>;
  private _squares: ISquare[] = [];
  private _abortController: AbortController | undefined = undefined;
  private _ignoreUserInput = false;

  constructor(api: IPonyService) {
    this._api = api;
    this._squareSubject = new Subject<ISquare>();
  }

  public async movePony(direction: MovePonyDirection, mazeId: string, onGameOver: () => void): Promise<void> {
    if (this._ignoreUserInput)
      return;

    const gameState = await this._api.movePony(mazeId, { direction }, this.initAbortController().signal);
    this._abortController = undefined;

    if (gameState == null)
      return;

    this.actionFeedback(gameState);

    await this.updateSquares(mazeId, this.initAbortController().signal, onGameOver);
    this._abortController = undefined;
  }

  public async getMaze(mazeId: string, signal: AbortSignal): Promise<IMaze | null> {
    if (typeof mazeId !== 'string')
      return null;

    const data = await this._api.getMazeState(mazeId, signal);
    if (data == null)
      return null;

    const maze = this.createMaze(data);
    // Hold squares locally => update pony and domokun position
    this._squares = maze.squares;

    return maze;
  }

  private createMaze(mazeState: IMazeState): IMaze {
    const width = mazeState.size[0];
    const height = mazeState.size[1];
    const lastPointOnEachRowIds: number[] = [];
    const allPointOnLastRowIds: number[] = [];

    // Width and height is proportional => there will be as many endpoints as width * rows (height)
    for (let w = 1; w <= width; w++) {
      lastPointOnEachRowIds.push(width * w);
    }

    for (let h = height * width - width + 1; h <= height * width; h++) {
      allPointOnLastRowIds.push(h);
    }

    const components = mazeState.data.map((point, index) => {
      const id = index + 1;
      const color = this.getRandomMyLittlePonyColor();
      const walls: IWall[] = [];
      const square: ISquare = {
        id,
        width,
        height,
        x: this.getX(id, width),
        y: this.getY(id, height),
        hasPony: index === mazeState.pony[0],
        hasDomokun: index === mazeState.domokun[0],
        isEndPoint: index === mazeState['end-point'][0]
      }

      if (point.includes(WallDirection.west)) {
        const point: IWall = {
          id: `${id}-west`,
          color,
          from: { x: square.x, y: square.y },
          to: { x: square.x, y: square.y + height }
        };
        walls.push(point);
      }

      if (point.includes(WallDirection.north)) {
        const point: IWall = {
          id: `${id}-north`,
          color,
          from: { x: square.x, y: square.y },
          to: { x: square.x + width, y: square.y }
        };
        walls.push(point);
      }

      // Add wall to the east if the point is the last on the row.
      if (lastPointOnEachRowIds.includes(id)) {
        const point: IWall = {
          id: `${id}-east`,
          color,
          from: { x: square.x + width, y: square.y },
          to: { x: square.x + width, y: square.y + height }
        };
        walls.push(point);
      }

      // Add wall to the south if the point is on the last row.
      if (allPointOnLastRowIds.includes(id)) {
        const point: IWall = {
          id: `${id}-south`,
          color,
          from: { x: square.x, y: square.y + height },
          to: { x: square.x + width, y: square.y + height }
        };
        walls.push(point);
      }

      return { square, walls };
    });

    const squares = components.map(component => component.square).sort((a, b) => a.id - b.id);
    const walls = components.map(component => component.walls).flat();

    return {
      squares,
      walls
    }
  }

  private getX(id: number, width: number) {
    let rowX = 0;

    for (let x = 0; x <= width; x++) {
      rowX = id * width - width * x;
      const totalWidth = width * width;

      do {
        // The loop starts off without evaluating the condition
        if (rowX > totalWidth)
          rowX -= totalWidth;
      } while (rowX > totalWidth);

      break;
    }

    return rowX;
  }

  private getY(id: number, height: number) {
    return (Math.ceil(id / height) - 1) * height;
  }

  private initAbortController(): AbortController {
    // Abort pending fetch before fetching again
    if (this._abortController) {
      this._abortController.abort();
      this._abortController = undefined;
    }
    this._abortController = new AbortController();
    return this._abortController;
  }

  private isGameOver(mazeState: IMazeState): boolean {
    const ponyPosition = mazeState.pony[0];
    if (ponyPosition === mazeState['end-point'][0])
      return true;
    if (ponyPosition === mazeState.domokun[0])
      return true;

    return false;
  }

  private async updateSquares(mazeId: string, signal: AbortSignal, onGameOver: () => void): Promise<void> {
    if (typeof mazeId !== 'string')
      return;

    const currentMazeState = await this._api.getMazeState(mazeId, signal);
    if (currentMazeState == null)
      return;

    await this.updateDomokunPonyPosition(currentMazeState, onGameOver);
  }

  private async updateDomokunPonyPosition(currentMazeState: IMazeState, onGameOver: () => void): Promise<void> {
    const domokunPosition = currentMazeState.domokun[0];
    const ponyPosition = currentMazeState.pony[0];

    const updatedSquares = this._squares.filter(square => {
      const index = square.id - 1;
      if (square.hasDomokun && index !== domokunPosition) {
        square.hasDomokun = false;
        return square;
      }

      if (index === domokunPosition) {
        square.hasDomokun = true;
        return square;
      }

      if (square.hasPony && index !== ponyPosition) {
        square.hasPony = false;
        return square;
      }

      if (index === ponyPosition) {
        square.hasPony = true;
        return square;
      }
    }) || [];

    // Replace updated squares in the this._squares.
    updatedSquares.forEach(updatedSquare => {
      const index = this._squares.findIndex(square => square.id === updatedSquare.id)
      if (typeof index === 'number' && index > -1)
        this._squares[index] = updatedSquare;

      // Broadcast the updated squares
      this._squareSubject.next(updatedSquare);
    });

    if (this.isGameOver(currentMazeState)) {
      // Do not handle any more user inputs
      this._ignoreUserInput = true;
      // Display outcome for 8 seconds
      await delay(8000)
      // Reset the game
      onGameOver();
    }
  }

  private actionFeedback(gameState: IGameState): void {
    switch (gameState['state-result']) {
      case Result.notAccepted:
        this._api.feedbackSubject.next({ type: Severity.warning, title: gameState.state, text: gameState['state-result'], duration: 1000 });
        break;
      case Result.moveAccepted:
        this._api.feedbackSubject.next({ type: Severity.info, title: gameState.state, text: gameState['state-result'], duration: 300 });
        break;
      case Result.wonGameEnded:
        this._api.feedbackSubject.next({ type: Severity.success, title: gameState.state, text: gameState['state-result'], duration: 7000 });
        break;
      default:
        this._api.feedbackSubject.next({ type: Severity.error, title: gameState.state, text: gameState['state-result'], duration: 7000 });
    }
  }

  private getRandomMyLittlePonyColor(): string {
    const myLittlePonyColors = ['#351858', '#822B99', '#EC058E', '#F140A9', '#37B0C9'];
    return myLittlePonyColors[Math.floor(Math.random() * (myLittlePonyColors.length - 1))];
  }

  get squareSubject(): Subject<ISquare> {
    return this._squareSubject;
  }
}

export default MazeService;