import {
  LeafFieldInstance,
  ListFieldInstance,
  LeafListFieldInstance,
  ContainerFieldInstance,
  ChoiceFieldInstance,
  PageInstance,
  SectionInstance
} from './';

export type ContainerPlugin = (container: ContainerFieldInstance, serializedField: any) => any;
export type ListPlugin = (list: ListFieldInstance, serializedField: any) => any;
export type LeafPlugin = (leaf: LeafFieldInstance, serializedField: any) => any;
export type LeafListPlugin = (leafList: LeafListFieldInstance, serializedField: any) => any;
export type ChoicePlugin = (choice: ChoiceFieldInstance, serializedField: any) => any;
export type PagePlugin = (page: PageInstance, serializedPage: any) => any;
export type SectionPlugin = (section: SectionInstance, serializedSection: any) => any;
