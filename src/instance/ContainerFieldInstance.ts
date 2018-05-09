import * as _ from 'lodash';
import { ContainerInstance, DataModelInstance } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { PresentationModelInstance, SectionInstance } from './';
import { ContainerField } from '../model';
import { ContainerPlugin } from './InstanceTypes';
import { Pluggable, Child } from './mixins';

export default class ContainerFieldInstance implements Pluggable, Child {
  public model: ContainerField;
  public parent: SectionInstance;
  public plugins: ContainerPlugin[];

  public getDataInstance: () => DataModelInstance;
  public getPresentationInstance: () => PresentationModelInstance;
  public applyPlugins: (field: any) => any;

  constructor(model: ContainerField, parent: SectionInstance, instanceData: ContainerInstance) {
    this.model = model;
    this.parent = parent;

    this.plugins = this.getPresentationInstance().containerPlugins;
  }

  public serialize(readOnly?: boolean): any {
    return this.applyPlugins(Object.assign({}, this.model.serialize(), _.pickBy({ readOnly }, v => !_.isUndefined(v))));
  }
}

applyMixins(ContainerFieldInstance, [Pluggable, Child]);
