import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('Leaf List Field Model', () => {
  it('serializes a basic leaf list', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.administrative-group')!;

    expect(field.serialize()).to.deep.equal({
      columnLabels: [
        {
          id: 'name',
          label: 'Group Name'
        }
      ],
      deprecated: false,
      description: 'An identifier that associates this router with an administrative group.',
      id: 'authority.router.administrative-group',
      kind: 'leaf-list',
      label: 'Groups',
      name: 'administrative-group',
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

  it('serializes a leaf list with enumerations', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.application-identification.mode')!;

    expect(field.serialize()).to.deep.equal({
      columnLabels: [
        {
          id: 'name',
          label: 'Application Learning Mode'
        }
      ],
      deprecated: false,
      description: 'Application learning modes.',
      enumerations: [
        { name: 'module', description: 'Learn application via modules.' },
        { name: 'tls', description: 'Learn application via TLS certificate parsing.' }
      ],
      id: 'authority.router.application-identification.mode',
      kind: 'leaf-list',
      label: 'Application Identification',
      name: 'mode',
      orderedBy: 'system',
      readOnly: false,
      type: 'enumeration',
      validation: {
        maxElements: null,
        minElements: 0
      },
      visibility: 'visible'
    });
  });
});
