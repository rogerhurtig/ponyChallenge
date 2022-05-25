/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestInitWithSignal } from './models/RequireSignal';

export const get = async (path: RequestInfo, init: RequestInitWithSignal): Promise<Response> => {
  return await fetch(new Request(path, {
    method: 'get',
    ...init
  }));
}

export const post = async (path: RequestInfo, payload: Record<string, any>, init: RequestInitWithSignal): Promise<Response> => {
  return await fetch(new Request(path, {
    method: 'post',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
    ...init
  }));
}