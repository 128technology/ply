import {
  LeafFieldInstance,
  ListFieldInstance,
  LeafListFieldInstance,
  ContainerFieldInstance,
  ChoiceFieldInstance,
  PageInstance,
  SectionInstance
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

export type ContainerPlugin = (container: ContainerFieldInstance) => any;
export type ListPlugin = (list: ListFieldInstance) => any;
export type LeafPlugin = (leaf: LeafFieldInstance) => any;
export type LeafListPlugin = (leafList: LeafListFieldInstance) => any;
export type ChoicePlugin = (choice: ChoiceFieldInstance) => any;
export type PagePlugin = (page: PageInstance) => any;
export type SectionPlugin = (section: SectionInstance) => any;
