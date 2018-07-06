import { ContainerInstance, DataModelInstance, Path } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { PresentationModelInstance, SectionInstance, ContainerPlugin } from './';
import { ContainerField } from '../model';
import { Pluggable, Child } from './mixins';

export default class ContainerFieldInstance implements Pluggable, Child {
  public model: ContainerField;
  public parent: SectionInstance;
  public plugins: ContainerPlugin[];
  public path: Path;

  public getDataInstance: () => DataModelInstance;
  public getPresentationInstance: () => PresentationModelInstance;
  public applyPlugins: (field: any) => any;

  constructor(model: ContainerField, parent: SectionInstance, instanceData: ContainerInstance, path: Path) {
    this.model = model;
    this.parent = parent;
    this.path = path;

    this.plugins = this.getPresentationInstance().containerPlugins;
  }

  public serialize(): any {
    return this.applyPlugins(Object.assign({}, this.model.serialize()));
  }
}

applyMixins(ContainerFieldInstance, [Pluggable, Child]);
