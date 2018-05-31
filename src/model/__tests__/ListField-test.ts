import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('List Field Model', () => {
  it('serializes a basic list', () => {
    const field = TestPresentationModel.getFieldForID('authority.router');

    expect(field.serialize()).to.deep.equal({
      description:
        'The router configuration element serves as a container for holding the nodes of a single deployed router, along with their policies.',
      id: 'authority.router',
      keys: [
        {
          description: 'An identifier for the router.',
          id: 'authority.router.name',
          isKey: true,
          kind: 'leaf',
          label: 'Name',
          name: 'name',
          readOnly: false,
          required: true,
          type: 'string',
          visibility: 'visible'
        }
      ],
      kind: 'list',
      label: 'Routers',
      leaves: [
        'id',
        'name',
        'location',
        'location-coordinates',
        'description',
        'maintenance-mode',
        'inter-node-security',
        'reverse-flow-enforcement',
        'software-access-proxy'
      ],
      link: 'router',
      name: 'router',
      orderedBy: 'system',
      readOnly: false,
      tableColumns: ['name', 'location', 'description'],
      validation: {
        maxElements: null,
        minElements: 0
      },
      visibility: 'visible'
    });
  });

  it('serializes a user ordered list', () => {
    const field = TestPresentationModel.getFieldForID(
      'authority.router.node.device-interface.network-interface.neighborhood'
    );

    expect(field.serialize().orderedBy).to.equal('user');
  });
});
