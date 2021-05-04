import * as _ from 'lodash';
import { DataModelInstance, Path, Instance, LeafListChildInstance, Authorized } from '@128technology/yinz';

import applyMixins from '../util/applyMixins';
import ContainingListDoesNotExist from './errors/ContainingListDoesNotExistError';
import { Child, Pluggable } from './mixins';
import { FieldInstance, IParams } from './InstanceTypes';
import { PageInstance, SectionPlugin } from './';
import { Section, ChoiceField } from '../model';
import { buildField, getPath } from './util';

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

    const fields = this.model.fields
      .filter(field => field.visibility !== 'hidden')
      .map(field => ({ field, path: getPath(field.id, params, model) }));

    const fieldsThatPassWhenEvaluation = [];
    for (const field of fields) {
      const whenResult = await instance.evaluateWhenCondition(field.path, this.getPresentationInstance().context);

      if (whenResult) {
        fieldsThatPassWhenEvaluation.push(field);
      }
    }

    const fieldBuilderPromises = fieldsThatPassWhenEvaluation
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
      .map(
        async ({ field, path, instanceData }) =>
          await buildField(field, this, instanceData, path, this.getPresentationInstance().context)
      );

    this.fields = await Promise.all(fieldBuilderPromises);
  }
}

applyMixins(SectionInstance, [Child, Pluggable]);
