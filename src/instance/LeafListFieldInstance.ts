import * as _ from 'lodash';
import { LeafListInstance, DataModelInstance, Path, LeafList, Types } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { LeafListField } from '../model';
import { Pluggable, Child } from './mixins';
import { PresentationModelInstance, SectionInstance, LeafListPlugin } from './';

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

  public get value() {
    return this.instanceData ? this.instanceData.values : [];
  }

  public serialize(readOnly?: boolean): any {
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
        _.pickBy({ readOnly, value: this.value, enumerations }, v => !_.isUndefined(v))
      )
    );
  }

  private getInstanceReferences() {
    return _.uniq((this.references || []).concat(this.suggestions || []));
  }
}

applyMixins(LeafListFieldInstance, [Pluggable, Child]);
