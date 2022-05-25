// 1xx informational response
export enum InformationalResponse {
  continue = 100,
  switchingProtocols = 101,
  processing = 102,
  earlyHints = 103
}

// 2xx success
export enum Success {
  ok = 200,
  created = 201,
  accepted = 202,
  nonAuthoritativeInformation = 203,
  noContent = 204,
  resetContent = 205,
  partialContent = 206,
  multiStatus = 207,
  alreadyReported = 208,
  imUsed = 226
}

// 3xx redirection
export enum Redirection {
  multipleChoices = 300,
  movedPermanently = 301
}

// 4xx client errors
export enum ClientError {
  badRequest = 400,
  unauthorized = 401,
  paymentRequired = 402,
  forbidden = 403,
  notFound = 404,
  methodNotAllowed = 405,
  notAcceptable = 406,
  proxyAuthenticationRequired = 407,
  requestTimeout = 408,
  conflict = 409,
  imATeapot = 418,
  toManyRequests = 429
}

// 5xx server errors
export enum ServerError {
  internalServerError = 500,
  notImplemented = 501,
  badGateway = 502,
  serviceUnavailable = 503,
  gatewayTimeout = 504,
  httpVersionNotSupported = 505
}