export interface IErrorLocation {
  page?: string;
  section?: string;
  field?: string;
}

export type IErrorReporter = (location: IErrorLocation, errorMessage: string) => void;
