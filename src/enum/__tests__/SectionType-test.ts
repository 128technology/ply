import { expect } from 'chai';

import SectionType, { enumValueOf } from '../SectionType';

describe('Section Types', () => {
  it('should get enum value of a section type', () => {
    const val = enumValueOf('leaf-section');

    expect(val).to.equal(SectionType.leafSection);
  });

  it('should get enum value null for no match', () => {
    const val = enumValueOf('moo');

    expect(val).to.equal(null);
  });
});
