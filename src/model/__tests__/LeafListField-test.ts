import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('Leaf List Field Model', () => {
  it('serializes a basic leaf list', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.group');

    expect(field.serialize()).to.deep.equal({
      columnLabels: [
        {
          id: 'name',
          label: 'Group Name'
        }
      ],
      description: 'An identifier that associates this router with an administrative group.',
      id: 'authority.router.group',
      kind: 'leaf-list',
      label: 'Groups',
      name: 'group',
      orderedBy: 'system',
      readOnly: false,
      type: 'string',
      validation: {
        maxElements: null,
        minElements: 0
      },
      visibility: 'visible'
    });
  });
});
