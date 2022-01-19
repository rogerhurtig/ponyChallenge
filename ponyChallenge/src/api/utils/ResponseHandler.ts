// Rxjs
import { Subject } from 'rxjs';
// Models
import { IResponseInfo } from '../models/ResponseInfo';
// Entities
import {
  Redirection,
  ClientError,
  ServerError
} from '../entities/StatusCode';
import { Severity } from '../entities/Severity';

export const responseHandler = async (call: () => Promise<Response>, feedbackSubject: Subject<IResponseInfo>): Promise<Response | null> => {
  try {
    const response = await call();
    if (response.status === 200)
      return response;

    feedbackSubject.next(getCustomStatusMessage(response.status));
  } catch (error) {
    // TODO: Log error
  }

  // Response not 200 or a fetch error occurred
  return null;
}

const getCustomStatusMessage = (status: number): IResponseInfo => {
  switch (status) {
    case ClientError.imATeapot:
      return {
        title: 'Client Error',
        text: 'I am a teapot',
        type: Severity.error
      };
    case ClientError.forbidden:
      return {
        title: 'Forbidden',
        text: 'You lack sufficient permissions',
        type: Severity.error
      };
    case ClientError.badRequest:
      return {
        title: 'Bad Request',
        text: 'The server cannot or will not process the request due to an apparent client error.',
        type: Severity.error
      };
    case ClientError.notFound:
      return {
        title: 'Not Found',
        text: 'The requested resource could not be found but may be available in the future.',
        type: Severity.error
      };
    case ClientError.methodNotAllowed:
      return {
        title: 'Method Not Allowed',
        text: 'The request method is not supported for the requested resource.',
        type: Severity.error
      };
    case ClientError.notAcceptable:
      return {
        title: 'Not Acceptable',
        text: 'The server cannot generate content according to the Accept headers sent in the request.',
        type: Severity.error
      };
    case ClientError.proxyAuthenticationRequired:
      return {
        title: 'Proxy Authentication Required',
        text: 'The client must first authenticate itself with the proxy.',
        type: Severity.error
      };
    case ClientError.requestTimeout:
      return {
        title: 'Requested Timeout',
        text: 'The server timed out waiting for the request.',
        type: Severity.error
      };
    case ServerError.internalServerError:
      return {
        title: 'Internal Server Error',
        text: 'Unexpected condition was encountered',
        type: Severity.error
      };
    case ServerError.notImplemented:
      return {
        title: 'Not Implemented',
        text: 'The server cannot recognize the request method, or it lacks the ability to fulfil the request.',
        type: Severity.error
      };
    case ServerError.badGateway:
      return {
        title: 'Bad Gateway',
        text: 'Invalid response from the upstream server.',
        type: Severity.error
      };
    case ServerError.serviceUnavailable:
      return {
        title: 'Service Unavailable',
        text: 'The server cannot handle the request.',
        type: Severity.error
      };
    case ServerError.gatewayTimeout:
      return {
        title: 'Gateway Timeout',
        text: 'Failed to receive a timely response from the upstream server.',
        type: Severity.error
      };
    case ServerError.httpVersionNotSupported:
      return {
        title: 'Http Version Not Supported',
        text: 'The server does not support the HTTP protocol version used in the request.',
        type: Severity.error
      };
    case Redirection.multipleChoices:
      return {
        title: 'Multiple Choices',
        text: 'Multiple options provided by the server.',
        type: Severity.error
      };
    case Redirection.movedPermanently:
      return {
        title: 'Moved Permanently',
        text: 'This and all future requests should be directed to the given URI.',
        type: Severity.error
      };
    default:
      return {
        title: 'Error',
        text: 'Error fetching data from the server',
        type: Severity.error
      };
  }
}