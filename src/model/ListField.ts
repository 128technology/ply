import { List, Leaf, OrderedBy } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Field } from './mixins';
import { Page, LeafField, Section } from './';
import { IListField } from './FieldTypes';
import { IErrorReporter, IValidateOptions } from '../validate/ErrorReporter';
import { SectionType, ErrorLevel } from '../enum';

export default class ListField implements Field {
  public columns?: string[];
  public leaves: string[];
  public link: string;
  public model: List;
  public orderedBy: OrderedBy;

  public id: Field['id'];
  public label: Field['label'];
  public customComponent: Field['customComponent'];
  public parent: Field['parent'];
  public type: Field['type'];
  public default: Field['default'];
  public readOnly: Field['readOnly'];
  public required: Field['required'];
  public visibility: Field['visibility'];
  public choice: Field['choice'];
  public addChoice: Field['addChoice'];
  public addDefault: Field['addDefault'];
  public addFieldProps: Field['addFieldProps'];
  public addReadOnly: Field['addReadOnly'];
  public addRequired: Field['addRequired'];
  public addType: Field['addType'];
  public addVisibility: Field['addVisibility'];
  public baseSerialize: Field['baseSerialize'];
  public getDataModel: Field['getDataModel'];
  public getKeyNames: Field['getKeyNames'];
  public getLocation: Field['getLocation'];
  public getLocationDescriptor: Field['getLocationDescriptor'];
  public getPage: Field['getPage'];
  public getPresentationModel: Field['getPresentationModel'];
  public resolveModel: Field['resolveModel'];
  public translateType: Field['translateType'];
  public baseValidate: Field['baseValidate'];

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
      return model.pages.get(this.link)!;
    } else {
      throw new Error(
        `Field ${this.id} on page ${this.parent.parent.id} has a link to non-existant page ${this.link}.`
      );
    }
  }

  public get tableColumns() {
    let tableColumnFilterer;
    if (this.columns) {
      tableColumnFilterer = (leaf: string) => this.columns!.includes(leaf);
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

    try {
      this.resolveLink();
    } catch (e) {
      errorReporter(e.message, ErrorLevel.error, this.getLocation());
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
