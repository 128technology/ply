import * as _ from 'lodash';
import { DataModel, Types, Model, Choice, Leaf, List, LeafList } from '@128technology/yinz';

import { Section, Page, PresentationModel } from '../';
import { IField, IChoice } from '../FieldTypes';
import { IErrorReporter, IErrorLocation, IValidateOptions } from '../../validate/ErrorReporter';
import { ErrorLevel } from '../../enum';

const { DerivedType } = Types;

function isLetter(character: string) {
  return character.toLowerCase() !== character.toUpperCase();
}

function isUpperCase(character: string) {
  return character === character.toUpperCase();
}

export default class Field {
  public id: string;
  public label: string;
  public customComponent?: string;
  public parent: Section;
  public type: string;
  public default: string;
  public readOnly: boolean;
  public required: boolean;
  public visibility: string;
  public choice: IChoice;
  public model: Model | Choice;

  public addFieldProps(fieldDef: IField, parent: Section) {
    const { id, label, customComponent } = fieldDef;

    this.parent = parent;

    this.id = id;
    this.label = label;
    this.customComponent = customComponent;

    this.model = this.resolveModel();
    this.addType();
    this.addDefault();
    this.addChoice();
    this.addReadOnly();
    this.addRequired();
    this.addVisibility();
  }

  public getLocation(): IErrorLocation {
    return Object.assign(this.parent.getLocation(), {
      field: this.id
    });
  }

  public getLocationDescriptor() {
    const { field, page, section } = this.getLocation();
    return `${page} —> ${section} —> ${field}`;
  }

  public translateType() {
    if (_.includes(this.type, 'int')) {
      return 'integer';
    } else if (this.type === 'identityref') {
      return 'enumeration';
    } else {
      return this.type;
    }
  }

  public getKeyNames() {
    const keyNames = new Set<string>();

    let currModel = this.model;
    while (currModel.parentModel) {
      currModel = currModel.parentModel;

      if (currModel instanceof List) {
        keyNames.add(currModel.getName());
      }
    }

    return Array.from(keyNames.values());
  }

  public baseValidate(errorReporter: IErrorReporter, options: IValidateOptions) {
    if (options.checkStartCase) {
      const labelWords = this.label.split(' ');
      const isNotStartCase = _.some(labelWords, word => isLetter(word.charAt(0)) && !isUpperCase(word.charAt(0)));

      if (isNotStartCase) {
        errorReporter(`Label "${this.label}" should be Start Case`, ErrorLevel.warning, this.getLocation());
      }
    }
  }

  public baseSerialize(): any {
    return _.pickBy(
      {
        choice: this.choice,
        customComponent: this.customComponent,
        default: this.default,
        deprecated: this.model.isDeprecated,
        description: this.model.description,
        id: this.id,
        isKey: this.model instanceof Leaf ? this.model.isKey : undefined,
        kind: _.kebabCase(this.model.modelType),
        label: this.label,
        name: this.model.getName(),
        readOnly: this.readOnly,
        required: this.required,
        secure: this.model.otherProps.get('secure'),
        type: this.translateType(),
        visibility: this.visibility
      },
      v => !_.isNil(v)
    );
  }

  public getPresentationModel(): PresentationModel {
    return this.parent.parent.parent;
  }

  public getPage(): Page {
    return this.parent.parent;
  }

  public addVisibility() {
    this.visibility = this.model.visibility || 'visible';
  }

  public addReadOnly() {
    this.readOnly = this.model.otherProps.get('accessMode') === 'read-only';
  }

  public addDefault() {
    if (this.model instanceof Leaf) {
      if (_.isString(this.model.default)) {
        this.default = this.model.default;
      } else if (this.model.type instanceof DerivedType && _.isString(this.model.type.default)) {
        this.default = this.model.type.default;
      }
    }
  }

  public addType() {
    if (this.model instanceof Leaf || this.model instanceof LeafList) {
      if (this.model.type instanceof DerivedType) {
        this.type = this.model.type.builtInType.type;
      } else {
        this.type = this.model.type.type;
      }
    }
  }

  public addChoice() {
    if (!(this.model instanceof Choice)) {
      let currModel: Model | null = this.model;

      while (currModel) {
        if (currModel.choiceCase) {
          const {
            name,
            parentChoice: { path }
          } = currModel.choiceCase;

          this.choice = { case: name, path };
          break;
        } else {
          currModel = currModel.parentModel;
        }
      }
    }
  }

  public addRequired() {
    if (this.model instanceof Leaf || this.model instanceof Choice) {
      if (this.model instanceof Leaf && this.model.isKey) {
        this.required = true;
      } else {
        this.required = this.model.mandatory;
      }
    }
  }

  public resolveModel(): Model | Choice {
    try {
      return this.getDataModel().getModelForPath(this.id);
    } catch (e) {
      throw new Error(`Could not find data model field at ${this.getLocationDescriptor()}}`);
    }
  }

  public getDataModel(): DataModel {
    return this.getPresentationModel().dataModel;
  }
}
