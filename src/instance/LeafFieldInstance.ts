import * as _ from 'lodash';
import { Leaf, LeafInstance, Types, Path, Authorized, allow } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import KeyUndefinedError from './errors/KeyUndefinedError';
import { LeafField } from '../model';
import { Pluggable, Child } from './mixins';
import { SectionInstance, LeafPlugin } from './';
import { getInstanceReferences } from './util';

const { LeafRefType, DerivedType } = Types;

export default class LeafFieldInstance implements Pluggable, Child {
  public static async build(
    model: LeafField,
    parent: SectionInstance,
    instanceData: LeafInstance,
    path: Path,
    context?: unknown
  ) {
    let references;
    if (model.model instanceof Leaf && model.model.getResolvedType() instanceof LeafRefType) {
      references = await parent.getDataInstance().evaluateLeafRef(path, context);
    }

    let suggestions;
    if (model.model instanceof Leaf) {
      const type = model.model.type;

      if (type instanceof DerivedType && type.suggestionRefs && type.suggestionRefs.length > 0) {
        suggestions = await parent.getDataInstance().evaluateSuggestionRef(path, context);
      }
    }

    return new LeafFieldInstance(model, parent, instanceData, path, references, suggestions);
  }

  public readonly plugins: LeafPlugin[];

  public getDataInstance: Child['getDataInstance'];
  public getPresentationInstance: Child['getPresentationInstance'];
  public applyPlugins: Pluggable['applyPlugins'];

  constructor(
    public readonly model: LeafField,
    public readonly parent: SectionInstance,
    public readonly instanceData: LeafInstance,
    public readonly path: Path,
    private readonly references: string[] | undefined,
    private readonly suggestions: string[] | undefined
  ) {
    this.plugins = this.getPresentationInstance().leafPlugins;

    if (_.isNil(this.getValue(allow)) && this.model.model.isKey) {
      throw new KeyUndefinedError(`Key for ${this.model.id} not present in instance.`);
    }
  }

  public getValue(authorized: Authorized) {
    return this.instanceData ? this.instanceData.getValue(authorized) : null;
  }

  public async serialize(authorized: Authorized): Promise<any> {
    const base = this.model.serialize();

    let enumerations;
    if (base.enumerations) {
      enumerations = _.uniq(base.enumerations.concat(getInstanceReferences(this.references, this.suggestions)));
    } else if (this.suggestions || this.references) {
      enumerations = getInstanceReferences(this.references, this.suggestions);
    }

    return await this.applyPlugins(
      Object.assign(
        {},
        base,
        _.pickBy({ value: this.getValue(authorized), enumerations }, v => !_.isUndefined(v))
      )
    );
  }
}

applyMixins(LeafFieldInstance, [Pluggable, Child]);
