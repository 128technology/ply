import { List, Leaf, Model, DataModel, OrderedBy } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Field } from './mixins';
import { Page, LeafField, Section, PresentationModel } from './';
import { IField, IChoice, IListField } from './FieldTypes';
import { IErrorReporter, IErrorLocation, IValidateOptions } from '../validate/ErrorReporter';
import { SectionType, ErrorLevel } from '../enum';

export default class ListField implements Field {
  public columns: string[];
  public leaves: string[];
  public link: string;
  public model: List;
  public id: string;
  public label: string;
  public customComponent: string;
  public parent: Section;
  public type: string;
  public default: string;
  public readOnly: boolean;
  public required: boolean;
  public visibility: string;
  public choice: IChoice;
  public orderedBy: OrderedBy;

  public addChoice: () => void;
  public addDefault: () => void;
  public addFieldProps: (fieldDef: IField, parent: Section) => void;
  public addReadOnly: () => void;
  public addRequired: () => void;
  public addType: () => void;
  public addVisibility: () => void;
  public baseSerialize: () => any;
  public getDataModel: () => DataModel;
  public getKeyNames: () => string[];
  public getLocation: () => IErrorLocation;
  public getLocationDescriptor: () => string;
  public getPage: () => Page;
  public getPresentationModel: () => PresentationModel;
  public resolveModel: () => Model;
  public translateType: () => string;
  public baseValidate: (errorReporter: IErrorReporter, options: IValidateOptions) => void;

  constructor(fieldDef: IListField, parent: Section) {
    this.addFieldProps(fieldDef, parent);
    this.getPresentationModel().registerField(this);

    this.leaves = Array.from(this.model.getChildren().values())
      .filter(child => child instanceof Leaf)
      .map(leaf => leaf.getName());

    this.link = fieldDef.link;
    this.columns = fieldDef.columns;
    this.orderedBy = this.model.orderedBy;
    this.getPresentationModel().registerLink(fieldDef.link, this.getPage());
  }

  public resolveLink(): Page {
    const model = this.parent.parent.parent;
    if (model.pages.has(this.link)) {
      return model.pages.get(this.link);
    } else {
      throw new Error(
        `Field ${this.id} on page ${this.parent.parent.id} has a link to non-existant page ${this.link}.`
      );
    }
  }

  public get tableColumns() {
    let tableColumnFilterer;
    if (this.columns) {
      tableColumnFilterer = (leaf: string) => this.columns.includes(leaf);
    } else {
      tableColumnFilterer = (leaf: string) => this.model.keys.has(leaf);
    }

    return this.leaves
      .filter(tableColumnFilterer)
      .map(leaf => this.model.getChild(leaf))
      .filter(x => x instanceof Leaf)
      .map(keyNode => this.getPresentationModel().getFieldForModel(keyNode) as LeafField);
  }

  public get keys(): LeafField[] {
    return Array.from(this.model.getKeyNodes()).map(
      keyNode => this.getPresentationModel().getFieldForModel(keyNode) as LeafField
    );
  }

  public get validation() {
    return {
      maxElements: this.model.maxElements,
      minElements: this.model.minElements
    };
  }

  public validate(errorReporter: IErrorReporter, options: IValidateOptions) {
    this.baseValidate(errorReporter, options);

    if (this.parent.type !== SectionType.listSection) {
      errorReporter(`List field ${this.id} must be in a list section.`, ErrorLevel.error, this.getLocation());
    }
  }

  public serialize(): any {
    return Object.assign(this.baseSerialize(), {
      keys: this.keys.map(key => key.serialize()),
      leaves: this.leaves,
      link: this.link,
      orderedBy: this.orderedBy,
      tableColumns: this.tableColumns.map(x => x.serialize()),
      validation: this.validation
    });
  }
}

applyMixins(ListField, [Field]);
