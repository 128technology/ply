import * as _ from 'lodash';
import { LeafList, OrderedBy } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Field, WithOptions } from './mixins';
import { Section } from './';
import { ILeafListField, IColumnLabel } from './FieldTypes';
import { IErrorReporter, IValidateOptions } from '../validate/ErrorReporter';
import { SectionType, ErrorLevel } from '../enum';

export default class LeafListField implements Field, WithOptions {
  public model: LeafList;
  public columnLabels?: IColumnLabel[];
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

  public collectOptions: WithOptions['collectOptions'];
  public enumerations: WithOptions['enumerations'];
  public suggestionRefs: WithOptions['suggestionRefs'];

  constructor(fieldDef: ILeafListField, parent: Section) {
    this.addFieldProps(fieldDef, parent);
    this.getPresentationModel().registerField(this);

    this.columnLabels = fieldDef.columnLabels;
    this.orderedBy = this.model.orderedBy;
    this.collectOptions();
  }

  public get validation() {
    return {
      maxElements: this.model.maxElements,
      minElements: this.model.minElements
    };
  }

  public validate(errorReporter: IErrorReporter, options: IValidateOptions) {
    this.baseValidate(errorReporter, options);

    if (this.parent.type !== SectionType.listTable) {
      errorReporter(
        `Leaf list field ${this.id} must be in a list-table section.`,
        ErrorLevel.error,
        this.getLocation()
      );
    }
  }

  public serialize(): any {
    return Object.assign(
      this.baseSerialize(),
      _.pickBy(
        {
          enumerations: this.enumerations,
          columnLabels: this.columnLabels,
          orderedBy: this.orderedBy,
          units: this.model.units,
          validation: this.validation
        },
        v => !_.isNil(v)
      )
    );
  }
}

applyMixins(LeafListField, [Field, WithOptions]);
