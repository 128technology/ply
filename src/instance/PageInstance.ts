import { DataModelInstance, Authorized } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { IParams } from './InstanceTypes';
import { Pluggable } from './mixins';
import { Page } from '../model';
import { SectionInstance, PresentationModelInstance, PagePlugin } from './';

export default class PageInstance implements Pluggable {
  public plugins: PagePlugin[];
  public sections: SectionInstance[];

  public applyPlugins: Pluggable['applyPlugins'];

  constructor(public readonly model: Page, public readonly parent: PresentationModelInstance) {
    this.plugins = this.getPresentationInstance().pagePlugins;
  }

  public async addSections(params: IParams) {
    this.sections = await Promise.all(
      this.model.sections.map(async section => {
        const instance = new SectionInstance(section, this);
        await instance.addFields(params);
        return instance;
      })
    );
  }

  public async serialize(authorized: Authorized): Promise<any> {
    const sections = await Promise.all(this.sections.map(async section => await section.serialize(authorized)));
    return await this.applyPlugins(
      Object.assign({}, this.model.serialize(false), {
        sections
      })
    );
  }

  public getDataInstance(): DataModelInstance {
    return this.parent.instance;
  }

  public getPresentationInstance() {
    return this.parent;
  }
}

applyMixins(PageInstance, [Pluggable]);
