import * as _ from 'lodash';
import { LeafListInstance, DataModelInstance, Path } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { LeafListField } from '../model';
import { LeafListPlugin } from './InstanceTypes';
import { Pluggable, Child } from './mixins';
import { PresentationModelInstance, SectionInstance } from './';

export default class LeafListFieldInstance implements Pluggable, Child {
  public instanceData: LeafListInstance;
  public model: LeafListField;
  public parent: SectionInstance;
  public path: Path;
  public plugins: LeafListPlugin[];

  public getDataInstance: () => DataModelInstance;
  public getPresentationInstance: () => PresentationModelInstance;
  public applyPlugins: (field: any) => any;

  constructor(model: LeafListField, parent: SectionInstance, instanceData: LeafListInstance, path: Path) {
    this.model = model;
    this.parent = parent;
    this.instanceData = instanceData;
    this.path = path;

    this.plugins = this.getPresentationInstance().leafListPlugins;
  }

  public get value() {
    return this.instanceData ? this.instanceData.values : [];
  }

  public serialize(readOnly?: boolean): any {
    return this.applyPlugins(
      Object.assign({}, this.model.serialize(), _.pickBy({ readOnly, value: this.value }, v => !_.isUndefined(v)))
    );
  }
}

applyMixins(LeafListFieldInstance, [Pluggable, Child]);
