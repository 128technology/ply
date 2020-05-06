import * as _ from 'lodash';
import { Leaf, LeafInstance, Types, Path, DataModelInstance, Authorized, allow } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import KeyUndefinedError from './errors/KeyUndefinedError';
import { LeafField } from '../model';
import { Pluggable, Child } from './mixins';
import { PresentationModelInstance, SectionInstance, LeafPlugin } from './';

const { LeafRefType, DerivedType } = Types;

export default class LeafFieldInstance implements Pluggable, Child {
  public readonly instanceData: LeafInstance;
  public readonly model: LeafField;
  public readonly parent: SectionInstance;
  public readonly path: Path;
  public readonly plugins: LeafPlugin[];

  public readonly getDataInstance: () => DataModelInstance;
  public readonly getPresentationInstance: () => PresentationModelInstance;
  public readonly applyPlugins: (field: any) => any;

  private readonly references?: string[];
  private readonly suggestions?: string[];

  constructor(model: LeafField, parent: SectionInstance, instanceData: LeafInstance, path: Path) {
    this.model = model;
    this.parent = parent;
    this.instanceData = instanceData;
    this.path = path;

    this.plugins = this.getPresentationInstance().leafPlugins;

    if (_.isNil(this.getValue(allow)) && this.model.model.isKey) {
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

  public getValue(authorized: Authorized) {
    return this.instanceData ? this.instanceData.getValue(authorized) : null;
  }

  public serialize(authorized: Authorized): any {
    const base = this.model.serialize();

    let enumerations;
    if (base.enumerations) {
      enumerations = _.uniq(base.enumerations.concat(this.getInstanceReferences()));
    } else if (this.suggestions || this.references) {
      enumerations = this.getInstanceReferences();
    }

    return this.applyPlugins(
      Object.assign(
        {},
        base,
        _.pickBy({ value: this.getValue(authorized), enumerations }, v => !_.isUndefined(v))
      )
    );
  }

  private getInstanceReferences() {
    return _.uniq((this.references || []).concat(this.suggestions || []));
  }
}

applyMixins(LeafFieldInstance, [Pluggable, Child]);
