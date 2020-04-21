import * as _ from 'lodash';
import { Leaf, Model, DataModel } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Field } from './mixins';
import { Section, Page, PresentationModel } from './';
import { IField, IChoice } from './FieldTypes';
import { IErrorReporter, IErrorLocation, IValidateOptions } from '../validate/ErrorReporter';

export default class LeafField implements Field {
  public model: Leaf;
  public enumerations: string[];
  public suggestionRefs: string[];
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

    this.collectOptions();
  }

  public validate(errorReporter: IErrorReporter, options: IValidateOptions) {
    this.baseValidate(errorReporter, options);
  }

  public serialize(): any {
    return Object.assign(
      this.baseSerialize(),
      _.pickBy({ enumerations: this.enumerations, units: this.model.units }, (v) => !_.isNil(v))
    );
  }

  private collectOptions() {
    this.enumerations = [];
    this.suggestionRefs = [];
  }
}

applyMixins(LeafField, [Field]);
