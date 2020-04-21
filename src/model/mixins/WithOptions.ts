import * as _ from 'lodash';
import { Types, Type, Leaf, LeafList } from '@128technology/yinz';

const { EnumerationType, IdentityRefType, DerivedType, BooleanType } = Types;

export default class WithOptions {
  public model: Leaf | LeafList;
  public enumerations: string[];
  public suggestionRefs: string[];
  public type: string;

  public collectOptions() {
    const enumerations: string[] = [];
    const suggestionRefs: string[] = [];
    let containsBoolean = false;

    const visitType = (aType: Type) => {
      if (aType instanceof IdentityRefType || aType instanceof EnumerationType) {
        Array.prototype.push.apply(enumerations, aType.options);
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
      this.enumerations = containsBoolean ? [...enumerations, 'true', 'false'] : enumerations;
    }

    if (suggestionRefs.length > 0) {
      this.suggestionRefs = suggestionRefs;
    }
  }
}
