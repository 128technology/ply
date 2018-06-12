import { Choice, Model, DataModel } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Page, Section, PresentationModel } from './';
import { Field } from './mixins';
import { IField, IChoice } from './FieldTypes';
import { IErrorReporter, IErrorLocation, IValidateOptions } from '../validate/ErrorReporter';

export interface IEmptyCases {
  [index: string]: string;
}

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
  public getLocation: () => IErrorLocation;
  public getLocationDescriptor: () => string;
  public getPage: () => Page;
  public getPresentationModel: () => PresentationModel;
  public resolveModel: () => Model;
  public translateType: () => string;
  public baseValidate: (errorReporter: IErrorReporter, options: IValidateOptions) => void;

  constructor(fieldDef: IField, parent: Section) {
    this.addFieldProps(fieldDef, parent);
    this.getPresentationModel().registerField(this);

    this.enumerations = this.model.caseNames;
  }

  public get emptyCases() {
    return this.model.emptyCases.reduce((acc: IEmptyCases, theCase) => {
      acc[theCase.name] = Array.from(theCase.children.values())[0].name;
      return acc;
    }, {});
  }

  public validate(errorReporter: IErrorReporter, options: IValidateOptions) {
    this.baseValidate(errorReporter, options);
  }

  public serialize(): any {
    return Object.assign(this.baseSerialize(), { enumerations: this.enumerations, emptyCases: this.emptyCases });
  }
}

applyMixins(ChoiceField, [Field]);
