import * as _ from 'lodash';
import { Types, Type, Leaf, LeafList } from '@128technology/yinz';
import { IEnumeration } from '../../util/types';

const { EnumerationType, IdentityRefType, DerivedType, BooleanType } = Types;

export default class WithOptions {
  public model: Leaf | LeafList;
  public enumerations: IEnumeration[];
  public suggestionRefs: string[];
  public type: string;

  public collectOptions() {
    const enumerations: IEnumeration[] = [];
    const suggestionRefs: string[] = [];
    let containsBoolean = false;

    const visitType = (aType: Type) => {
      if (aType instanceof IdentityRefType) {
        Array.prototype.push.apply(
          enumerations,
          aType.options.map(x => ({ name: x, description: '' }))
        );
      } else if (aType instanceof EnumerationType) {
        Array.prototype.push.apply(
          enumerations,
          Array.from(aType.members).map(x => ({ name: x[0], description: x[1].description }))
        );
      } else if (aType instanceof DerivedType) {
        if (aType.suggestionRefs) {
          Array.prototype.push.apply(suggestionRefs, aType.suggestionRefs);
        }

        if (aType.type === 't128ext:qsn') {
          this.type = 'qsn';
        }
      } else if (aType instanceof BooleanType) {
        containsBoolean = true;
      }
    };

    if ('traverse' in this.model.type) {
      this.model.type.traverse(visitType);
    } else {
      visitType(this.model.type);
    }

    if (enumerations.length > 0) {
      this.enumerations = containsBoolean
        ? [...enumerations, { name: 'true', description: '' }, { name: 'false', description: '' }]
        : enumerations;
    }

    if (suggestionRefs.length > 0) {
      this.suggestionRefs = suggestionRefs;
    }
  }
}
