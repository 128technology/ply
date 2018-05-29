import * as _ from 'lodash';
import { LeafList, Model, DataModel, OrderedBy } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Field } from './mixins';
import { Section, Page, PresentationModel } from './';
import { IField, IChoice, ILeafListField, IColumnLabel } from './FieldTypes';
import { IErrorReporter } from '../validate/ErrorReporter';

export default class LeafListField implements Field {
  public model: LeafList;
  public columnLabels: IColumnLabel[];
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
  public getLocation: () => any;
  public getLocationDescriptor: () => string;
  public getPage: () => Page;
  public getPresentationModel: () => PresentationModel;
  public resolveModel: () => Model;
  public translateType: () => string;
  public validate: (errorReporter: IErrorReporter) => void;

  constructor(fieldDef: ILeafListField, parent: Section) {
    this.addFieldProps(fieldDef, parent);
    this.getPresentationModel().registerField(this);

    this.columnLabels = fieldDef.columnLabels;
    this.orderedBy = this.model.orderedBy;
  }

  public get validation() {
    return {
      maxElements: this.model.maxElements,
      minElements: this.model.minElements
    };
  }

  public serialize(): any {
    return Object.assign(
      this.baseSerialize(),
      _.pickBy(
        { orderedBy: this.orderedBy, columnLabels: this.columnLabels, validation: this.validation },
        v => !_.isNil(v)
      )
    );
  }
}

applyMixins(LeafListField, [Field]);
