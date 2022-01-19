import { Subject } from 'rxjs';
import { Severity } from '../entities/Severity';
import { IResponseInfo } from '../models/ResponseInfo';

export const jsonParse = async (response: Response, feedbackSubject: Subject<IResponseInfo>): Promise<unknown | null> => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json'))
    return null;

  try {
    const data = await response.json() as unknown;
    return data;
  } catch (error) {
    feedbackSubject.next({
      title: 'Unexpected error',
      text: 'Oops something went wrong :(',
      type: Severity.error
    });
  }

  return null;
}