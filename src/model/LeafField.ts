import * as _ from 'lodash';
import { Types, Type, Leaf, Model, DataModel } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Field } from './mixins';
import { Section, Page, PresentationModel } from './';
import { IField, IChoice } from './FieldTypes';
import { IErrorReporter, IErrorLocation, IValidateOptions } from '../validate/ErrorReporter';

const { EnumerationType, IdentityRefType, DerivedType } = Types;

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
      _.pickBy({ enumerations: this.enumerations, units: this.model.units }, v => !_.isNil(v))
    );
  }

  /**
   * Walks the model's type tree and builds an enumeration of options
   *
   * @param {Object} model field model
   * @param {Object} newField output parameter; will be mutated
   */
  private collectOptions() {
    const enumerations: string[] = [];
    const suggestionRefs: string[] = [];

    const visitType = (aType: Type) => {
      if (aType instanceof IdentityRefType || aType instanceof EnumerationType) {
        Array.prototype.push.apply(enumerations, aType.options);
      } else if (aType instanceof DerivedType) {
        if (aType.suggestionRefs) {
          Array.prototype.push.apply(suggestionRefs, aType.suggestionRefs);
        }

        if (aType.type === 't128ext:qsn') {
          this.type = 'qsn';
        }
      }
    };

    if ('traverse' in this.model.type) {
      this.model.type.traverse(visitType);
    } else {
      visitType(this.model.type);
    }

    if (enumerations.length > 0) {
      this.enumerations = enumerations;
    }

    if (suggestionRefs.length > 0) {
      this.suggestionRefs = suggestionRefs;
    }
  }
}

applyMixins(LeafField, [Field]);
