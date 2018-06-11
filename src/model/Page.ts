import * as _ from 'lodash';

import { PresentationModel, Section, LeafField } from './';
import { ISection } from './Section';
import { IErrorReporter, IErrorLocation, IValidateOptions } from '../validate/ErrorReporter';
import { ErrorLevel } from '../enum';

export interface IPage {
  id: string;
  title: string;
  sections: ISection[];
}

export interface IParentPage {
  id: string;
  title: string;
  parent: IParentPage | null;
}

export default class Page {
  public id: string;
  public title: string;
  public sections: Section[];
  public parent: PresentationModel;

  constructor(pageDef: IPage, parent: PresentationModel) {
    this.parent = parent;

    this.id = pageDef.id;
    this.title = pageDef.title;

    this.sections = Array.from(
      pageDef.sections
        .reduce((acc, section) => {
          if (acc.has(section.id)) {
            throw new Error(`Duplicate presentation section detected on page ${this.id} for section ${section.id}`);
          }

          return acc.set(section.id, new Section(section, this));
        }, new Map())
        .values()
    );
  }

  public get parentPage() {
    return this.getPresentationModel().getParentPage(this);
  }

  public getKeyFields(): LeafField[] {
    return _.flatMap(this.sections, section => section.fields).filter(
      (field): field is LeafField => field instanceof LeafField && field.model.isKey
    );
  }

  public isListPage() {
    return _.some(
      _.flatMap(this.sections, section => section.fields),
      field => field instanceof LeafField && field.model.isKey
    );
  }

  public getLocation(): IErrorLocation {
    return {
      page: this.id
    };
  }

  public getKeyNames() {
    const keyNames = new Set();

    this.sections.forEach(section => {
      section.fields.forEach(field => {
        for (const key of field.getKeyNames()) {
          keyNames.add(key);
        }
      });
    });

    return Array.from(keyNames);
  }

  public validate(errorReporter: IErrorReporter, options: IValidateOptions) {
    if (this.sections.length < 1) {
      errorReporter('Page must have at least one section.', ErrorLevel.error, this.getLocation());
    }

    if (!this.id || !this.title) {
      errorReporter('Page must have an id and title.', ErrorLevel.error, this.getLocation());
    }

    this.sections.forEach(section => section.validate(errorReporter, options));
  }

  public getParents(): IParentPage | null {
    const parentPage = this.parentPage;

    if (parentPage instanceof Page) {
      return {
        id: parentPage.id,
        parent: parentPage.getParents(),
        title: parentPage.title
      };
    } else {
      return parentPage;
    }
  }

  public serialize(withChildren: boolean = true): any {
    return _.pickBy(
      {
        id: this.id,
        parent: this.getParents(),
        sections: withChildren ? this.sections.map(section => section.serialize()) : undefined,
        title: this.title
      },
      v => !_.isNil(v)
    );
  }

  private getPresentationModel() {
    return this.parent;
  }
}
