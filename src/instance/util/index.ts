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

export function buildField(fieldModel: Field, parent: SectionInstance, instanceData: Instance, path: Path) {
  if (fieldModel instanceof ListField) {
    return new ListFieldInstance(fieldModel, parent, instanceData as ListInstance, path);
  } else if (fieldModel instanceof ChoiceField) {
    // In this case instanceData is actually the parent, if it exists.
    return new ChoiceFieldInstance(fieldModel, parent, instanceData, path);
  } else if (fieldModel instanceof LeafField) {
    return new LeafFieldInstance(fieldModel, parent, instanceData as LeafInstance, path);
  } else if (fieldModel instanceof LeafListField) {
    return new LeafListFieldInstance(fieldModel, parent, instanceData as LeafListInstance, path);
  } else if (fieldModel instanceof ContainerField) {
    return new ContainerFieldInstance(fieldModel, parent, instanceData as ContainerInstance, path);
  } else {
    throw new Error('Unrecognized field model type.');
  }
}
