import * as _ from 'lodash';
import { Instance, DataModelInstance, Path } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { ChoiceField } from '../model';
import { Pluggable, Child } from './mixins';
import { PresentationModelInstance, SectionInstance, ChoicePlugin } from './';

export default class ChoiceFieldInstance implements Pluggable, Child {
  public model: ChoiceField;
  public parent: SectionInstance;
  public path: Path;
  public parentInstanceData: Instance;
  public plugins: ChoicePlugin[];

  public getDataInstance: () => DataModelInstance;
  public getPresentationInstance: () => PresentationModelInstance;
  public applyPlugins: (field: any) => any;

  constructor(model: ChoiceField, parent: SectionInstance, parentInstanceData: Instance, path: Path) {
    this.model = model;
    this.parent = parent;
    this.parentInstanceData = parentInstanceData;
    this.path = path;

    this.plugins = this.getPresentationInstance().choicePlugins;
  }

  public get value() {
    if (this.parentInstanceData && 'activeChoices' in this.parentInstanceData) {
      return this.parentInstanceData.activeChoices.get(this.model.model.name);
    } else {
      return null;
    }
  }

  public serialize(): any {
    return this.applyPlugins(
      Object.assign({}, this.model.serialize(), _.pickBy({ value: this.value }, v => !_.isUndefined(v)))
    );
  }
}

applyMixins(ChoiceFieldInstance, [Pluggable, Child]);
