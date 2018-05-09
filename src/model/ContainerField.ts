import { Leaf, Model, DataModel } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Field } from './mixins';
import { Page, Section, PresentationModel } from './';
import { IField, IChoice, IContainerField } from './FieldTypes';
import { IErrorReporter } from '../validate/ErrorReporter';

export default class ContainerField implements Field {
  public model: Leaf;
  public link: string;
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
  public getLocation: () => any;
  public getLocationDescriptor: () => string;
  public getPage: () => Page;
  public getPresentationModel: () => PresentationModel;
  public resolveModel: () => Model;
  public translateType: () => string;
  public validate: (errorReporter: IErrorReporter) => void;

  constructor(fieldDef: IContainerField, parent: Section) {
    this.addFieldProps(fieldDef, parent);
    this.getPresentationModel().registerField(this);

    this.link = fieldDef.link;
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

  public serialize(): any {
    return Object.assign(this.baseSerialize(), { link: this.link });
  }
}

applyMixins(ContainerField, [Field]);
