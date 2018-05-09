export interface IChoice {
  case: string;
  path: string;
}

export interface IColumnLabel {
  id: string;
  label: string;
}

export interface IBaseField {
  id: string;
  label: string;
  customComponent?: string;
}

export interface IListField {
  id: string;
  label: string;
  customComponent?: string;
  columns?: string[];
  link: string;
}

export interface IContainerField {
  id: string;
  label: string;
  customComponent?: string;
  link: string;
}

export interface ILeafListField {
  id: string;
  label: string;
  customComponent?: string;
  columnLabels?: IColumnLabel[];
}

export type IField = IBaseField | IListField | IContainerField | ILeafListField;
