import * as _ from 'lodash';
import { Instance, DataModelInstance } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { ChoiceField } from '../model';
import { ChoicePlugin } from './InstanceTypes';
import { Pluggable, Child } from './mixins';
import { PresentationModelInstance, SectionInstance } from './';

export default class ChoiceFieldInstance implements Pluggable, Child {
  public model: ChoiceField;
  public parent: SectionInstance;
  public parentInstanceData: Instance;
  public plugins: ChoicePlugin[];

  public getDataInstance: () => DataModelInstance;
  public getPresentationInstance: () => PresentationModelInstance;
  public applyPlugins: (field: any) => any;

  constructor(model: ChoiceField, parent: SectionInstance, parentInstanceData: Instance) {
    this.model = model;
    this.parent = parent;
    this.parentInstanceData = parentInstanceData;

    this.plugins = this.getPresentationInstance().choicePlugins;
  }

  public get value() {
    if (this.parentInstanceData && 'activeChoices' in this.parentInstanceData) {
      return this.parentInstanceData.activeChoices.get(this.model.model.name);
    } else {
      return null;
    }
  }

  public serialize(readOnly?: boolean): any {
    return this.applyPlugins(
      Object.assign({}, this.model.serialize(), _.pickBy({ readOnly, value: this.value }, v => !_.isUndefined(v)))
    );
  }
}

applyMixins(ChoiceFieldInstance, [Pluggable, Child]);
