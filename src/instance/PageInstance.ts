import { DataModelInstance, Authorized } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { IParams } from './InstanceTypes';
import { Pluggable } from './mixins';
import { Page } from '../model';
import { SectionInstance, PresentationModelInstance, PagePlugin } from './';

export default class PageInstance implements Pluggable {
  public model: Page;
  public parent: PresentationModelInstance;
  public plugins: PagePlugin[];
  public sections: SectionInstance[];

  public applyPlugins: (page: any) => any;

  constructor(model: Page, parent: PresentationModelInstance, params: IParams) {
    this.model = model;
    this.parent = parent;

    this.plugins = this.getPresentationInstance().pagePlugins;

    this.sections = model.sections.map(section => new SectionInstance(section, this, params));
  }

  public serialize(authorized: Authorized): any {
    return this.applyPlugins(
      Object.assign({}, this.model.serialize(false), {
        sections: this.sections.map(section => section.serialize(authorized))
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
