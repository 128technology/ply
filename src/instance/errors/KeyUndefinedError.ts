export default class KeyUndefinedError extends Error {
  constructor(...args: any[]) {
    super(...args);
    Error.captureStackTrace(this, KeyUndefinedError);
  }
}
