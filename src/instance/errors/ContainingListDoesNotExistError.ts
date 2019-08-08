export default class ContainingListDoesNotExistError extends Error {
  constructor(...args: any[]) {
    super(...args);
    Error.captureStackTrace(this, ContainingListDoesNotExistError);
  }
}
