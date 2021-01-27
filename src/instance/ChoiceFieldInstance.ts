import * as _ from 'lodash';
import { Instance, Path } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { ChoiceField } from '../model';
import { Pluggable, Child } from './mixins';
import { SectionInstance, ChoicePlugin } from './';

export default class ChoiceFieldInstance implements Pluggable, Child {
  public static build(model: ChoiceField, parent: SectionInstance, parentInstanceData: Instance, path: Path) {
    return new ChoiceFieldInstance(model, parent, parentInstanceData, path);
  }

  public readonly plugins: ChoicePlugin[];

  public getDataInstance: Child['getDataInstance'];
  public getPresentationInstance: Child['getPresentationInstance'];
  public applyPlugins: Pluggable['applyPlugins'];

  constructor(
    public readonly model: ChoiceField,
    public readonly parent: SectionInstance,
    public readonly parentInstanceData: Instance,
    public readonly path: Path
  ) {
    this.plugins = this.getPresentationInstance().choicePlugins;
  }

  public get value() {
    if (this.parentInstanceData && 'activeChoices' in this.parentInstanceData) {
      return this.parentInstanceData.activeChoices.get(this.model.model.name);
    } else {
      return null;
    }
  }

  public async serialize(): Promise<any> {
    return await this.applyPlugins(
      Object.assign(
        {},
        this.model.serialize(),
        _.pickBy({ value: this.value }, v => !_.isUndefined(v))
      )
    );
  }
}

applyMixins(ChoiceFieldInstance, [Pluggable, Child]);
