import { Severity } from '../entities/Severity';

export interface IResponseInfo {
  title: string;
  text: string;
  type: Severity;
  duration?: number;
}