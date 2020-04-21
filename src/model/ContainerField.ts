import { Container } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Field } from './mixins';
import { Page, Section } from './';
import { IContainerField } from './FieldTypes';
import { IErrorReporter, IValidateOptions } from '../validate/ErrorReporter';
import { ErrorLevel } from '../enum';

export default class ContainerField implements Field {
  public model: Container;
  public link: string;

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

  constructor(fieldDef: IContainerField, parent: Section) {
    this.addFieldProps(fieldDef, parent);
    this.getPresentationModel().registerField(this);

    this.link = fieldDef.link;
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

  public validate(errorReporter: IErrorReporter, options: IValidateOptions) {
    this.baseValidate(errorReporter, options);

    try {
      this.resolveLink();
    } catch (e) {
      errorReporter(e.message, ErrorLevel.error, this.getLocation());
    }
  }

  public serialize(): any {
    return Object.assign(this.baseSerialize(), { link: this.link });
  }
}

applyMixins(ContainerField, [Field]);
