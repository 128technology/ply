import { DataModelInstance } from '@128technology/yinz';

import { IParams } from './InstanceTypes';
import {
  PageInstance,
  ContainerPlugin,
  LeafListPlugin,
  LeafPlugin,
  ListPlugin,
  ChoicePlugin,
  PagePlugin,
  SectionPlugin
} from './';
import { PresentationModel } from '../model';

export default class PresentationModelInstance {
  public choicePlugins: ChoicePlugin[] = [];
  public containerPlugins: ContainerPlugin[] = [];
  public instance: DataModelInstance;
  public leafListPlugins: LeafListPlugin[] = [];
  public leafPlugins: LeafPlugin[] = [];
  public listPlugins: ListPlugin[] = [];
  public pagePlugins: PagePlugin[] = [];
  public sectionPlugins: SectionPlugin[] = [];
  public presentationModel: PresentationModel;

  constructor(presentationModel: PresentationModel, instance: DataModelInstance) {
    this.presentationModel = presentationModel;
    this.instance = instance;
  }

  public getPresentationForPage(page: string, params: IParams, readOnly: boolean) {
    const pageModel = this.presentationModel.getPage(page);
    const instance = new PageInstance(pageModel, this, params);

    return instance.serialize(readOnly);
  }

  public registerContainerPlugin(plugin: ContainerPlugin) {
    this.containerPlugins.push(plugin);
  }

  public registerListPlugin(plugin: ListPlugin) {
    this.listPlugins.push(plugin);
  }

  public registerLeafPlugin(plugin: LeafPlugin) {
    this.leafPlugins.push(plugin);
  }

  public registerLeafListPlugin(plugin: LeafListPlugin) {
    this.leafListPlugins.push(plugin);
  }

  public registerChoicePlugin(plugin: ChoicePlugin) {
    this.choicePlugins.push(plugin);
  }

  public registerPagePlugin(plugin: PagePlugin) {
    this.pagePlugins.push(plugin);
  }

  public registerSectionPlugin(plugin: SectionPlugin) {
    this.sectionPlugins.push(plugin);
  }
}
