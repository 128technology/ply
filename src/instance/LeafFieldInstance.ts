import * as _ from 'lodash';
import { Leaf, LeafInstance, Types, Path, DataModelInstance } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import KeyUndefinedError from './errors/KeyUndefinedError';
import { LeafField } from '../model';
import { Pluggable, Child } from './mixins';
import { PresentationModelInstance, SectionInstance, LeafPlugin } from './';

const { LeafRefType, DerivedType } = Types;

export default class LeafFieldInstance implements Pluggable, Child {
  public instanceData: LeafInstance;
  public model: LeafField;
  public parent: SectionInstance;
  public path: Path;
  public plugins: LeafPlugin[];
  public references: string[] = [];
  public suggestions: string[] = [];

  public getDataInstance: () => DataModelInstance;
  public getPresentationInstance: () => PresentationModelInstance;
  public applyPlugins: (field: any) => any;

  constructor(model: LeafField, parent: SectionInstance, instanceData: LeafInstance, path: Path) {
    this.model = model;
    this.parent = parent;
    this.instanceData = instanceData;
    this.path = path;

    this.plugins = this.getPresentationInstance().leafPlugins;

    if (_.isNil(this.value) && this.model.model.isKey) {
      throw new KeyUndefinedError(`Key for ${this.model.id} not present in instance.`);
    }

    if (this.model.model instanceof Leaf && this.model.model.getResolvedType() instanceof LeafRefType) {
      this.references = this.getDataInstance().evaluateLeafRef(path);
    }

    if (this.model.model instanceof Leaf) {
      const type = this.model.model.type;

      if (type instanceof DerivedType && type.suggestionRefs && type.suggestionRefs.length > 0) {
        this.suggestions = this.getDataInstance().evaluateSuggestionRef(path);
      }
    }
  }

  public get value() {
    return this.instanceData ? this.instanceData.value : null;
  }

  public getInstanceReferences() {
    return _.uniq(this.references.concat(this.suggestions));
  }

  public serialize(): any {
    const base = this.model.serialize();

    let enumerations;
    if (base.enumerations) {
      enumerations = _.uniq(base.enumerations.concat(this.getInstanceReferences()));
    } else if (this.suggestions.length > 0 || this.references.length > 0) {
      enumerations = this.getInstanceReferences();
    }

    return this.applyPlugins(
      Object.assign({}, base, _.pickBy({ value: this.value, enumerations }, v => !_.isUndefined(v)))
    );
  }
}

applyMixins(LeafFieldInstance, [Pluggable, Child]);
