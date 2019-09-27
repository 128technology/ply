import { expect } from 'chai';

import SectionType, { enumValueOf } from '../SectionType';

describe('Section Types', () => {
  it('should get enum value of a section type', () => {
    const val = enumValueOf('leaf-section');

    expect(val).to.equal(SectionType.leafSection);
  });

  it('should throw for no match', () => {
    const shouldThrow = () => enumValueOf('moo');

    expect(shouldThrow).to.throw();
  });
});
