export interface RequestInitWithSignal extends RequestInit {
  signal: AbortSignal;
}