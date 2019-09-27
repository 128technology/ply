import * as _ from 'lodash';
import { DataModel, List, Choice, Leaf, LeafList, Container } from '@128technology/yinz';

import { LeafField, ListField, ChoiceField, LeafListField, ContainerField, Section } from '../';

export function buildField(fieldDef: any, parent: Section, dataModel: DataModel) {
  const { id } = fieldDef;

  const model = dataModel.getModelForPath(id);

  if (model instanceof List) {
    return new ListField(fieldDef, parent);
  } else if (model instanceof Choice) {
    return new ChoiceField(fieldDef, parent);
  } else if (model instanceof Leaf) {
    return new LeafField(fieldDef, parent);
  } else if (model instanceof LeafList) {
    return new LeafListField(fieldDef, parent);
  } else if (model instanceof Container) {
    return new ContainerField(fieldDef, parent);
  } else {
    throw new Error(`Unrecognized field type for presentation field ${id}.`);
  }
}
