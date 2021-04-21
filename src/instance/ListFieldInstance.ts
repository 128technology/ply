import * as _ from 'lodash';
import { ListInstance, LeafInstance, Leaf, Types, Path, Authorized } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { ListField, LeafField } from '../model';
import { Pluggable, Child } from './mixins';
import { SectionInstance, ListPlugin } from './';
import { getInstanceReferences } from './util';
import { IEnumeration } from '../util/types';

const { LeafRefType, DerivedType } = Types;

const FAKE_KEY = 'XXX_FAKE_KEY_VALUE_XXX';

type GenericObj = Record<string, string | null>;

export default class ListFieldInstance implements Pluggable, Child {
  public static async build(
    model: ListField,
    parent: SectionInstance,
    instanceData: ListInstance,
    path: Path,
    context?: unknown
  ) {
    const keys = await ListFieldInstance.getKeys(model, parent, path, context);

    return new ListFieldInstance(model, parent, instanceData, path, keys);
  }

  private static async getKeys(fieldModel: ListField, parent: SectionInstance, path: Path, context?: unknown) {
    // Eww eww eww eww eww
    const modelKeys = fieldModel.keys;

    return await Promise.all(
      modelKeys.map(async (modelKey: LeafField) => {
        const { model } = modelKey;
        const references: string[] = [];
        const suggestions: string[] = [];
        const fakePath = ListFieldInstance.getFakePath(model.name, fieldModel, path);
        let enumerations: IEnumeration[] | undefined;

        if (model instanceof Leaf && model.getResolvedType() instanceof LeafRefType) {
          enumerations = [];
          const leafRefs = await parent.getDataInstance().evaluateLeafRef(fakePath, context);
          Array.prototype.push.apply(references, leafRefs);
        }

        const type = model.type;
        if (
          model instanceof Leaf &&
          type instanceof DerivedType &&
          type.suggestionRefs &&
          type.suggestionRefs.length > 0
        ) {
          enumerations = [];
          // Suggestion-Refs can be self referential...
          const suggestionsRefs = await parent.getDataInstance().evaluateSuggestionRef(fakePath, context);
          Array.prototype.push.apply(suggestions, _.without(suggestionsRefs, FAKE_KEY));
        }

        const base = modelKey.serialize();

        if (base.enumerations) {
          enumerations = _.uniq(base.enumerations.concat(getInstanceReferences(references, suggestions)));
        } else if (suggestions.length > 0 || references.length > 0) {
          enumerations = getInstanceReferences(references, suggestions);
        }

        return Object.assign(
          {},
          base,
          _.pickBy({ enumerations }, v => !_.isUndefined(v))
        );
      })
    );
  }

  private static getFakePath(leafName: string, model: ListField, path: Path) {
    return [
      ...path.slice(0, -1),
      { name: path[path.length - 1].name, keys: ListFieldInstance.getFakeKeys(model) },
      { name: leafName }
    ];
  }

  private static getFakeKeys(model: ListField) {
    return Array.from(model.model.keys.values()).map(key => ({ key, value: FAKE_KEY }));
  }

  public readonly plugins: ListPlugin[];

  public getDataInstance: Child['getDataInstance'];
  public getPresentationInstance: Child['getPresentationInstance'];
  public applyPlugins: Pluggable['applyPlugins'];

  constructor(
    public readonly model: ListField,
    public readonly parent: SectionInstance,
    public readonly instanceData: ListInstance,
    public readonly path: Path,
    private readonly keys: any[]
  ) {
    this.plugins = this.getPresentationInstance().listPlugins;
  }

  public getValue(authorized: Authorized) {
    if (_.isNil(this.instanceData)) {
      return [];
    }

    const value: GenericObj[] = [];

    for (const [key, listItem] of this.instanceData.getChildren(authorized).entries()) {
      const item: GenericObj = {
        _key: key
      };

      for (const leaf of this.model.leaves) {
        const leafInstance = listItem.getInstance([{ name: leaf }], _.noop) as LeafInstance | undefined;
        item[leaf] = leafInstance ? leafInstance.getValue(authorized) : null;
      }

      value.push(item);
    }

    return value;
  }

  public async serialize(authorized: Authorized): Promise<any> {
    return await this.applyPlugins(
      Object.assign(
        {},
        this.model.serialize(),
        _.pickBy({ value: this.getValue(authorized), keys: this.keys }, v => !_.isUndefined(v))
      )
    );
  }
}

applyMixins(ListFieldInstance, [Pluggable, Child]);
