// Components
import PonyApiService, { IPonyService } from './PonyApiService';
import { cleanup } from '@testing-library/react';
// Utils
import { IStartGame } from './models/StartGame';
// Utils
import { delayAbortSignal } from '../api/utils/DelayAbortSignal';
import { MovePonyDirection } from './entities/MovePonyDirection';

describe('PonyApiService', () => {
  afterEach(() => {
    cleanup();
  });

  const mockedGameSettings: IStartGame = {
    difficulty: 1,
    'maze-width': 15,
    'maze-height': 15,
    'maze-player-name': 'Rarity'
  };

  const setup = (serverUrl = 'https://ponychallenge.trustpilot.com/pony-challenge'): IPonyService => {
    return new PonyApiService(serverUrl);

  };

  test('Response should be null when calling startgame method with invalid server url', async () => {
    const api = setup('non.existing.url');
    const mazeId = await api.startGame(mockedGameSettings, delayAbortSignal(1000));
    expect(mazeId).toBeNull();
  });

  test('A maze id should be received when calling "startgame" method', async () => {
    const api = setup();
    const mazeId = await api.startGame(mockedGameSettings, delayAbortSignal(6000));
    expect(typeof mazeId).toBe('object');
    if (mazeId == null)
      return;

    const { maze_id } = mazeId;
    expect(typeof maze_id).toBe('string');
  });

  test('Response should be null when calling "getMaze" method with faulty maze id', async () => {
    const api = setup();
    const abortController = new AbortController();
    const maze = await api.getMazeState('faulty-maze-id', abortController.signal);
    expect(maze).toBeNull();
  });

  test('The maze current state should be received when calling "getMaze" method with valid maze id', async () => {
    const api = setup();
    const mazeId = await api.startGame(mockedGameSettings, delayAbortSignal(6000));
    if (mazeId == null)
      return;

    const abortController = new AbortController();
    const maze = await api.getMazeState(mazeId.maze_id, abortController.signal);
    expect(typeof maze).toBe('object');
  });

  test('Response should be null when calling "movePony" method with faulty maze id', async () => {
    const api = setup();
    const mazeId = await api.startGame(mockedGameSettings, delayAbortSignal(6000));
    if (mazeId == null)
      return;

    const abortController = new AbortController();
    const gameState = await api.movePony('fault-maze-id', { direction: MovePonyDirection.north }, abortController.signal);
    expect(gameState).toBeNull();
  });

  test('The game state should be received when calling "movePony" method with valid maze id', async () => {
    const api = setup();
    const mazeId = await api.startGame(mockedGameSettings, delayAbortSignal(6000));
    if (mazeId == null)
      return;

    const abortController = new AbortController();
    const gameState = await api.movePony(mazeId.maze_id, { direction: MovePonyDirection.north }, abortController.signal);
    expect(typeof gameState).toBe('object');
  });
});