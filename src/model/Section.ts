import * as _ from 'lodash';

import { Page, Field } from './';
import { IField } from './FieldTypes';
import { buildField } from './util';
import SectionType, { enumValueOf } from '../enum/SectionType';
import { IErrorReporter } from '../validate/ErrorReporter';

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

  public getLocation() {
    return Object.assign(this.parent.getLocation(), {
      section: this.id
    });
  }

  public validate(errorReporter: IErrorReporter) {
    const report = _.partial(errorReporter, this.getLocation());

    if (this.type === SectionType.listSection) {
      if (this.fields.length !== 1) {
        report('List sections can only have one field.');
      }
    }

    this.fields.forEach(field => field.validate(errorReporter));
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
