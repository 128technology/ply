import { ErrorLevel } from '../enum';

export interface IValidateOptions {
  checkStartCase: boolean;
}

export interface IErrorLocation {
  page?: string;
  section?: string;
  field?: string;
}

export type IErrorReporter = (errorMessage: string, level: ErrorLevel, location?: IErrorLocation) => void;
