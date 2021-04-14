import * as _ from 'lodash';
import { Instance, ListInstance, LeafInstance, LeafListInstance, ContainerInstance, Path } from '@128technology/yinz';

import { Field, LeafField, ListField, ChoiceField, LeafListField, ContainerField } from '../../model';
import {
  ChoiceFieldInstance,
  ContainerFieldInstance,
  LeafFieldInstance,
  LeafListFieldInstance,
  ListFieldInstance,
  SectionInstance
} from '../';

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
