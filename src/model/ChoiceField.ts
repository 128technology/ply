import { Choice, Case } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Section } from './';
import { Field } from './mixins';
import { IField } from './FieldTypes';
import { IErrorReporter, IValidateOptions } from '../validate/ErrorReporter';

export interface IEmptyCases {
  [index: string]: string;
}

export default class ChoiceField implements Field {
  public model: Choice;
  public enumerations: string[];

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

  constructor(fieldDef: IField, parent: Section) {
    this.addFieldProps(fieldDef, parent);
    this.getPresentationModel().registerField(this);

    this.enumerations = this.model.cases
      .filter((theCase: Case) => !theCase.isObsolete && theCase.isVisible)
      .map((theCase: Case) => theCase.name);
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
