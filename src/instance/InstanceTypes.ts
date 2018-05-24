import {
  LeafFieldInstance,
  ListFieldInstance,
  LeafListFieldInstance,
  ContainerFieldInstance,
  ChoiceFieldInstance
} from './';

export type FieldInstance =
  | LeafFieldInstance
  | ListFieldInstance
  | LeafListFieldInstance
  | ContainerFieldInstance
  | ChoiceFieldInstance;

export interface IParams {
  [index: string]: string;
}
