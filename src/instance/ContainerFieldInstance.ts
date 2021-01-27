import { ContainerInstance, Path } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { SectionInstance, ContainerPlugin } from './';
import { ContainerField } from '../model';
import { Pluggable, Child } from './mixins';

export default class ContainerFieldInstance implements Pluggable, Child {
  public static build(model: ContainerField, parent: SectionInstance, instanceData: ContainerInstance, path: Path) {
    return new ContainerFieldInstance(model, parent, instanceData, path);
  }

  public readonly plugins: ContainerPlugin[];

  public getDataInstance: Child['getDataInstance'];
  public getPresentationInstance: Child['getPresentationInstance'];
  public applyPlugins: Pluggable['applyPlugins'];

  constructor(
    public readonly model: ContainerField,
    public readonly parent: SectionInstance,
    public readonly instanceData: ContainerInstance,
    public readonly path: Path
  ) {
    this.plugins = this.getPresentationInstance().containerPlugins;
  }

  public async serialize(): Promise<any> {
    return await this.applyPlugins(Object.assign({}, this.model.serialize()));
  }
}

applyMixins(ContainerFieldInstance, [Pluggable, Child]);
