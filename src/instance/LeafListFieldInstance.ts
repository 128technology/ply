import * as _ from 'lodash';
import { LeafListInstance, DataModelInstance, Path, LeafList, Types, Authorized } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { LeafListField } from '../model';
import { Pluggable, Child } from './mixins';
import { PresentationModelInstance, SectionInstance, LeafListPlugin } from './';
import { getInstanceReferences } from './util';
import { IEnumeration } from '../util/types';

const { LeafRefType, DerivedType } = Types;

export default class LeafListFieldInstance implements Pluggable, Child {
  public readonly instanceData: LeafListInstance;
  public readonly model: LeafListField;
  public readonly parent: SectionInstance;
  public readonly path: Path;
  public readonly plugins: LeafListPlugin[];

  public readonly getDataInstance: () => DataModelInstance;
  public readonly getPresentationInstance: () => PresentationModelInstance;
  public readonly applyPlugins: (field: any) => any;

  private readonly references?: string[] | undefined;
  private readonly suggestions?: string[];

  constructor(model: LeafListField, parent: SectionInstance, instanceData: LeafListInstance, path: Path) {
    this.model = model;
    this.parent = parent;
    this.instanceData = instanceData;
    this.path = path;

    this.plugins = this.getPresentationInstance().leafListPlugins;

    if (this.model.model instanceof LeafList && this.model.model.getResolvedType() instanceof LeafRefType) {
      this.references = this.getDataInstance().evaluateLeafRef(path);
    }

    if (this.model.model instanceof LeafList) {
      const type = this.model.model.type;

      if (type instanceof DerivedType && type.suggestionRefs && type.suggestionRefs.length > 0) {
        this.suggestions = this.getDataInstance().evaluateSuggestionRef(path);
      }
    }
  }

  public getValue(authorized: Authorized) {
    return this.instanceData ? this.instanceData.getValues(authorized) : [];
  }

  public serialize(authorized: Authorized, readOnly?: boolean): any {
    const base = this.model.serialize();

    let enumerations: IEnumeration[] = [];
    if (base.enumerations) {
      enumerations = _.uniq(base.enumerations.concat(getInstanceReferences(this.references, this.suggestions)));
    } else if (this.suggestions || this.references) {
      enumerations = getInstanceReferences(this.references, this.suggestions);
    }

    return this.applyPlugins(
      Object.assign(
        {},
        base,
        _.pickBy({ readOnly, value: this.getValue(authorized), enumerations }, v => !_.isUndefined(v))
      )
    );
  }
}

applyMixins(LeafListFieldInstance, [Pluggable, Child]);
