import * as _ from 'lodash';

import { Page, Field } from './';
import { IField } from './FieldTypes';
import { buildField } from './util';
import SectionType, { enumValueOf } from '../enum/SectionType';
import { IErrorReporter, IErrorLocation, IValidateOptions } from '../validate/ErrorReporter';
import { ErrorLevel } from '../enum';

export interface ISection {
  id: string;
  title: string;
  type?: string;
  fields: IField[];
}

export default class Section {
  public id: string;
  public title: string;
  public type: SectionType;
  public fields: Field[];
  public parent: Page;

  constructor(sectionDef: ISection, parent: Page) {
    this.parent = parent;

    this.id = sectionDef.id;
    this.title = sectionDef.title;
    this.type = enumValueOf(sectionDef.type);

    this.fields = sectionDef.fields.map(field => buildField(field, this, this.getDataModel()));
  }

  public getLocation(): IErrorLocation {
    return Object.assign(this.parent.getLocation(), {
      section: this.id
    });
  }

  public validate(errorReporter: IErrorReporter, options: IValidateOptions) {
    if (this.type === SectionType.listSection || this.type === SectionType.listTable) {
      if (this.fields.length !== 1) {
        errorReporter('List sections can only have one field.', ErrorLevel.error, this.getLocation());
      }
    }

    this.fields.forEach(field => field.validate(errorReporter, options));
  }

  public serialize(withChildren: boolean = true): any {
    return _.pickBy(
      {
        fields: withChildren ? this.fields.map(field => field.serialize()) : undefined,
        id: this.id,
        title: this.title,
        type: this.type
      },
      v => !_.isNil(v)
    );
  }

  private getDataModel() {
    return this.parent.parent.dataModel;
  }
}
