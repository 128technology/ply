import { DataModel, Model } from '@128technology/yinz';

import { Page, Field } from './';
import { IErrorReporter } from '../validate/ErrorReporter';

interface IPresentationObject {
  [index: string]: any;
}

export type Link = string;

export default class PresentationModel {
  public models: any[];
  public pages: Map<string, Page>;
  public fieldRegistry: Map<string, Field> = new Map();
  public linkRegistry: Map<Link, Page> = new Map();
  public dataModel: DataModel;

  constructor(models: any[], dataModel: DataModel) {
    this.dataModel = dataModel;

    this.pages = models.map(model => new Page(model, this)).reduce((acc, page) => acc.set(page.id, page), new Map());
  }

  public getPage(id: string) {
    if (this.pages.has(id)) {
      return this.pages.get(id);
    } else {
      throw new Error(
        `Page ${id} not found. Did you mean one of the following: ${Array.from(this.pages.keys()).join(', ')}?`
      );
    }
  }

  public validate(errorReporter: IErrorReporter) {
    [...this.pages.values()].forEach(page => page.validate(errorReporter));
  }

  public serialize() {
    return Array.from(this.pages.entries()).reduce((acc: IPresentationObject, [k, v]) => {
      acc[k] = v.serialize();
      return acc;
    }, {});
  }

  public registerField(field: Field) {
    this.fieldRegistry.set(field.id, field);
  }

  public registerLink(link: string, containingPage: Page) {
    this.linkRegistry.set(link, containingPage);
  }

  public getFieldForModel(model: Model) {
    const { path } = model;
    return this.getFieldForID(path);
  }

  public getFieldForID(id: string) {
    if (this.fieldRegistry.has(id)) {
      return this.fieldRegistry.get(id);
    } else {
      throw new Error(`Field for ${id} not found.`);
    }
  }

  public getParentPage(page: Page) {
    const { id } = page;

    if (this.linkRegistry.has(id)) {
      return this.linkRegistry.get(id);
    } else {
      return null;
    }
  }
}
