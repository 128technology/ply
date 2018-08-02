import { expect } from 'chai';

import { ContainerField } from '../';
import TestPresentationModel from './data/testPresentationModel';

describe('Container/Link Field Model', () => {
  it('serializes a basic container/link', () => {
    const field = TestPresentationModel.getFieldForID('authority');

    expect(field.serialize()).to.deep.equal({
      deprecated: false,
      description: 'Authority configuration is the top-most level in the 128T router configuration hierarchy.',
      id: 'authority',
      kind: 'container',
      label: 'Authority',
      link: 'authority',
      name: 'authority',
      readOnly: false,
      visibility: 'visible'
    });
  });

  it('resolve a container link', () => {
    const field = TestPresentationModel.getFieldForID('authority') as ContainerField;

    const page = field.resolveLink();

    expect(page.title).to.equal('Authority Settings');
  });
});
