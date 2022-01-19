interface Coordinates {
  x: number;
  y: number;
}

export interface IWall {
  id: string;
  from: Coordinates | null;
  to: Coordinates | null;
  color: string;
}