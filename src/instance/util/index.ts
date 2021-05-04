import * as _ from 'lodash';
import {
  Instance,
  ListInstance,
  LeafInstance,
  LeafListInstance,
  ContainerInstance,
  Path,
  DataModel,
  List,
  Choice
} from '@128technology/yinz';

import { Field, LeafField, ListField, ChoiceField, LeafListField, ContainerField } from '../../model';
import {
  ChoiceFieldInstance,
  ContainerFieldInstance,
  LeafFieldInstance,
  LeafListFieldInstance,
  ListFieldInstance,
  SectionInstance
} from '../';
import { IParams } from '../InstanceTypes';

export async function buildField(
  fieldModel: Field,
  parent: SectionInstance,
  instanceData: Instance,
  path: Path,
  context?: unknown
) {
  if (fieldModel instanceof ListField) {
    return await ListFieldInstance.build(fieldModel, parent, instanceData as ListInstance, path, context);
  } else if (fieldModel instanceof ChoiceField) {
    // In this case instanceData is actually the parent, if it exists.
    return ChoiceFieldInstance.build(fieldModel, parent, instanceData, path);
  } else if (fieldModel instanceof LeafField) {
    return await LeafFieldInstance.build(fieldModel, parent, instanceData as LeafInstance, path, context);
  } else if (fieldModel instanceof LeafListField) {
    return await LeafListFieldInstance.build(fieldModel, parent, instanceData as LeafListInstance, path, context);
  } else if (fieldModel instanceof ContainerField) {
    return ContainerFieldInstance.build(fieldModel, parent, instanceData as ContainerInstance, path);
  } else {
    throw new Error('Unrecognized field model type.');
  }
}

export function getInstanceReferences(references: string[] | undefined, suggestions: string[] | undefined) {
  return _.uniq(
    (references?.map(r => ({ name: r, description: '' })) || []).concat(
      suggestions?.map(s => ({ name: s, description: '' })) || []
    )
  );
}

export function getPath(id: string, params: IParams, model: DataModel): Path {
  const splitPath = id.split('.');
  const path = [];

  for (let i = 0, len = splitPath.length; i < len; i++) {
    const thisModel = model.getModelForPath(splitPath.slice(0, i + 1).join('.'));
    const segment = splitPath[i];

    if (thisModel instanceof List) {
      if (params[segment]) {
        const keyValues = params[segment].split(',');
        const keys = Array.from(thisModel.keys).map((key, keyIdx) => ({ key, value: keyValues[keyIdx] }));
        path.push({ name: segment, keys });
      } else if (i === splitPath.length - 1) {
        // Last segment doesn't need keys if targeting the whole list.
        path.push({ name: segment });
      } else {
        throw new Error(`Keys not provided for ${thisModel.name}.`);
      }
    } else if (!(thisModel instanceof Choice)) {
      path.push({ name: segment });
    }
  }
  return path;
}
