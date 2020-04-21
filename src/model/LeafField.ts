import * as _ from 'lodash';
import { Leaf } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Field, WithOptions } from './mixins';
import { Section } from './';
import { IField } from './FieldTypes';
import { IErrorReporter, IValidateOptions } from '../validate/ErrorReporter';

export default class LeafField implements Field, WithOptions {
  public model: Leaf;

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

  public collectOptions: WithOptions['collectOptions'];
  public enumerations: WithOptions['enumerations'];
  public suggestionRefs: WithOptions['suggestionRefs'];

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
}

applyMixins(LeafField, [Field, WithOptions]);
