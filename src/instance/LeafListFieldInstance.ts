import * as _ from 'lodash';
import { LeafListInstance, Path, LeafList, Types, Authorized } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { LeafListField } from '../model';
import { Pluggable, Child } from './mixins';
import { SectionInstance, LeafListPlugin } from './';
import { getInstanceReferences } from './util';
import { IEnumeration } from '../util/types';

const { LeafRefType, DerivedType } = Types;

export default class LeafListFieldInstance implements Pluggable, Child {
  public static async build(
    model: LeafListField,
    parent: SectionInstance,
    instanceData: LeafListInstance,
    path: Path,
    context?: unknown
  ) {
    let references;

    if (model.model instanceof LeafList && model.model.getResolvedType() instanceof LeafRefType) {
      references = await parent.getDataInstance().evaluateLeafRef(path, context);
    }

    let suggestions;
    if (model.model instanceof LeafList) {
      const type = model.model.type;

      if (type instanceof DerivedType && type.suggestionRefs && type.suggestionRefs.length > 0) {
        suggestions = await parent.getDataInstance().evaluateSuggestionRef(path, context);
      }
    }

    return new LeafListFieldInstance(model, parent, instanceData, path, references, suggestions);
  }

  public readonly plugins: LeafListPlugin[];

  public getDataInstance: Child['getDataInstance'];
  public getPresentationInstance: Child['getPresentationInstance'];
  public applyPlugins: Pluggable['applyPlugins'];

  constructor(
    public readonly model: LeafListField,
    public readonly parent: SectionInstance,
    public readonly instanceData: LeafListInstance,
    public readonly path: Path,
    private readonly references: string[] | undefined,
    private readonly suggestions: string[] | undefined
  ) {
    this.plugins = this.getPresentationInstance().leafListPlugins;
  }

  public getValue(authorized: Authorized) {
    return this.instanceData ? this.instanceData.getValues(authorized) : [];
  }

  public async serialize(authorized: Authorized, readOnly?: boolean): Promise<any> {
    const base = this.model.serialize();

    let enumerations: IEnumeration[] = [];
    if (base.enumerations) {
      enumerations = _.uniq(base.enumerations.concat(getInstanceReferences(this.references, this.suggestions)));
    } else if (this.suggestions || this.references) {
      enumerations = getInstanceReferences(this.references, this.suggestions);
    }

    return await this.applyPlugins(
      Object.assign(
        {},
        base,
        _.pickBy({ readOnly, value: this.getValue(authorized), enumerations }, v => !_.isUndefined(v))
      )
    );
  }
}

applyMixins(LeafListFieldInstance, [Pluggable, Child]);
