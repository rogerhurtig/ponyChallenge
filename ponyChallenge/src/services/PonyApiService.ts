// Components
import { get, post } from '../api/RestApi';
import { Subject } from 'rxjs';
// Models
import { IResponseInfo } from '../api/models/ResponseInfo';
import { IStartGame, IStartGameResponseBody } from './models/StartGame';
import { IGameState, IMazeState } from './models/MazeState';
import { IMovePony } from './models/MovePony';
// Utils
import { responseHandler } from '../api/utils/ResponseHandler';
import { jsonParse } from '../api/utils/JsonParser';

export interface IPonyService {
  startGame(payload: IStartGame, signal: AbortSignal): Promise<IStartGameResponseBody | null>;
  getMazeState(mazeId: string, signal: AbortSignal): Promise<IMazeState | null>;
  movePony(mazeId: string, payload: IMovePony, signal: AbortSignal): Promise<IGameState | null>;
  feedbackSubject: Subject<IResponseInfo>;
}

class PonyApiService implements IPonyService {
  protected _feedbackSubject: Subject<IResponseInfo>;
  protected _ponyChallengeBasicUrl: string;

  constructor(ponyChallengeBasicUrl: string) {
    this._feedbackSubject = new Subject<IResponseInfo>();
    this._ponyChallengeBasicUrl = ponyChallengeBasicUrl;
  }

  public async startGame(payload: IStartGame, signal: AbortSignal): Promise<IStartGameResponseBody | null> {
    const response = await responseHandler(
      () => post(this._ponyChallengeBasicUrl, payload, { signal }),
      this._feedbackSubject
    );
    if (response == null)
      return null;

    const jsonData = await jsonParse(response, this._feedbackSubject);
    if (jsonData == null)
      return null;

    return jsonData as IStartGameResponseBody;
  }

  public async getMazeState(mazeId: string, signal: AbortSignal): Promise<IMazeState | null> {
    const response = await responseHandler(
      () => get(`${this._ponyChallengeBasicUrl}/${mazeId}`, { signal }),
      this._feedbackSubject
    );
    if (response == null)
      return null;

    const jsonData = await jsonParse(response, this._feedbackSubject);
    if (jsonData == null)
      return null;

    return jsonData as IMazeState;
  }

  public async movePony(mazeId: string, payload: IMovePony, signal: AbortSignal): Promise<IGameState | null> {
    const response = await responseHandler(
      () => post(`${this._ponyChallengeBasicUrl}/${mazeId}`, payload, { signal }),
      this._feedbackSubject
    );
    if (response == null)
      return null;

    const jsonData = await jsonParse(response, this._feedbackSubject);
    if (jsonData == null)
      return null;

    return jsonData as IGameState;
  }

  get feedbackSubject(): Subject<IResponseInfo> {
    return this._feedbackSubject;
  }
}

export default PonyApiService;
