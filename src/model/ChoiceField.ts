import { Choice, Model, DataModel } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Page, Section, PresentationModel } from './';
import { Field } from './mixins';
import { IField, IChoice } from './FieldTypes';
import { IErrorReporter } from '../validate/ErrorReporter';

export default class ChoiceField implements Field {
  public model: Choice;
  public enumerations: string[];
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

  constructor(fieldDef: IField, parent: Section) {
    this.addFieldProps(fieldDef, parent);
    this.getPresentationModel().registerField(this);

    this.enumerations = this.model.caseNames;
  }

  public serialize(): any {
    return Object.assign(this.baseSerialize(), { enumerations: this.enumerations });
  }
}

applyMixins(ChoiceField, [Field]);
