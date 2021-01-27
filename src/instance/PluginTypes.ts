import {
  LeafFieldInstance,
  ListFieldInstance,
  LeafListFieldInstance,
  ContainerFieldInstance,
  ChoiceFieldInstance,
  PageInstance,
  SectionInstance
} from './';

export type ContainerPlugin = (container: ContainerFieldInstance, serializedField: any) => Promise<any>;
export type ListPlugin = (list: ListFieldInstance, serializedField: any) => Promise<any>;
export type LeafPlugin = (leaf: LeafFieldInstance, serializedField: any) => Promise<any>;
export type LeafListPlugin = (leafList: LeafListFieldInstance, serializedField: any) => Promise<any>;
export type ChoicePlugin = (choice: ChoiceFieldInstance, serializedField: any) => Promise<any>;
export type PagePlugin = (page: PageInstance, serializedPage: any) => Promise<any>;
export type SectionPlugin = (section: SectionInstance, serializedSection: any) => Promise<any>;
