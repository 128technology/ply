import * as _ from 'lodash';
import { DataModel, List, DataModelInstance, Path } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import { Child, Pluggable } from './mixins';
import { FieldInstance, IParams } from './InstanceTypes';
import { PresentationModelInstance, PageInstance, SectionPlugin } from './';
import { Section, ChoiceField } from '../model';
import { buildField } from './util';

function getPath(id: string, params: IParams, model: DataModel): Path {
  const splitPath = id.split('.');

  return splitPath.map((segment, i) => {
    const thisModel = model.getModelForPath(splitPath.slice(0, i + 1).join('.'));

    if (thisModel instanceof List) {
      if (params[segment]) {
        const keyValues = params[segment].split(',');
        const keys = Array.from(thisModel.keys).map((key, keyIdx) => ({ key, value: keyValues[keyIdx] }));
        return { name: segment, keys };
      } else if (i === splitPath.length - 1) {
        // Last segment doesn't need keys if targeting the whole list.
        return { name: segment };
      } else {
        throw new Error(`Keys not provided for ${thisModel.name}.`);
      }
    } else {
      return { name: segment };
    }
  });
}

export default class SectionInstance implements Child, Pluggable {
  public fields: FieldInstance[];
  public model: Section;
  public plugins: SectionPlugin[];
  public parent: PageInstance;

  public applyPlugins: (section: any) => any;
  public getDataInstance: () => DataModelInstance;
  public getPresentationInstance: () => PresentationModelInstance;

  constructor(model: Section, parent: PageInstance, params: IParams) {
    this.model = model;
    this.parent = parent;

    this.plugins = this.getPresentationInstance().sectionPlugins;

    this.addFields(params);
  }

  public serialize(): any {
    return this.applyPlugins(
      Object.assign({}, this.model.serialize(false), {
        fields: this.fields.map(field => field.serialize())
      })
    );
  }

  private addFields(params: IParams) {
    const instance = this.getDataInstance();
    const model = instance.model;

    this.fields = this.model.fields
      .filter(field => field.visibility !== 'hidden')
      .map(field => ({ field, path: getPath(field.id, params, model) }))
      .filter(({ path }) => instance.evaluateWhenCondition(path))
      .map(({ field, path }) => {
        // Choices don't exist in the response, look for its parent
        const searchPath = field instanceof ChoiceField ? _.initial(path) : path;
        let instanceData = null;

        try {
          instanceData = instance.getInstance(searchPath);
        } catch (e) {
          // Field has no data in the instance, this is okay. Continue on.
        }

        return { field, path, instanceData };
      })
      .map(({ field, path, instanceData }) => buildField(field, this, instanceData, path));
  }
}

applyMixins(SectionInstance, [Child, Pluggable]);
