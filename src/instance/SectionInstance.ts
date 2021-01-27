import * as _ from 'lodash';
import {
  DataModel,
  List,
  DataModelInstance,
  Path,
  Instance,
  LeafListChildInstance,
  Authorized
} from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import ContainingListDoesNotExist from './errors/ContainingListDoesNotExistError';
import { Child, Pluggable } from './mixins';
import { FieldInstance, IParams } from './InstanceTypes';
import { PageInstance, SectionPlugin } from './';
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
  public plugins: SectionPlugin[];

  public getDataInstance: Child['getDataInstance'];
  public getPresentationInstance: Child['getPresentationInstance'];
  public applyPlugins: Pluggable['applyPlugins'];

  constructor(public readonly model: Section, public readonly parent: PageInstance) {
    this.plugins = this.getPresentationInstance().sectionPlugins;
  }

  public async serialize(authorized: Authorized): Promise<any> {
    const fields = await Promise.all(this.fields.map(async field => await field.serialize(authorized)));
    return await this.applyPlugins(
      Object.assign({}, this.model.serialize(false), {
        fields
      })
    );
  }

  public async addFields(params: IParams) {
    const instance = this.getDataInstance();
    const model = instance.model;

    const fieldPromises = this.model.fields
      .filter(field => field.visibility !== 'hidden')
      .map(field => ({ field, path: getPath(field.id, params, model) }))
      .filter(async ({ path }) => await instance.evaluateWhenCondition(path))
      .map(({ field, path }) => {
        // Choices don't exist in the response, look for its parent
        const searchPath = field instanceof ChoiceField ? _.initial(path) : path;

        const noMatchHandler = (stopInstance: Instance, remaining: Path) => {
          if (_.find(remaining, 'keys')) {
            throw new ContainingListDoesNotExist(
              `Tried to find field ${field.id} but its containing list does not exist`
            );
          }
        };

        let instanceData: ReturnType<DataModelInstance['getInstance']>;
        try {
          instanceData = instance.getInstance(searchPath, noMatchHandler)!;
        } catch (e) {
          // Field has no data in the instance, this is okay. Continue on.
          // Unless the field is in a list instance that does not exist.
          if (e instanceof ContainingListDoesNotExist) {
            throw e;
          }
        }

        if (instanceData instanceof LeafListChildInstance) {
          throw new Error('Fields cannot reference leaf list children.');
        }

        return { field, path, instanceData: instanceData! };
      })
      .map(async ({ field, path, instanceData }) => await buildField(field, this, instanceData, path));

    this.fields = await Promise.all(fieldPromises);
  }
}

applyMixins(SectionInstance, [Child, Pluggable]);
