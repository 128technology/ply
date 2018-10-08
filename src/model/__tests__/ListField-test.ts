import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('List Field Model', () => {
  it('serializes a basic list', () => {
    const field = TestPresentationModel.getFieldForID('authority.router');

    expect(field.serialize()).to.deep.equal({
      deprecated: false,
      description:
        'The router configuration element serves as a container for holding the nodes of a single deployed router, along with their policies.',
      id: 'authority.router',
      keys: [
        {
          deprecated: false,
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
        'reverse-flow-enforcement'
      ],
      link: 'router',
      name: 'router',
      orderedBy: 'system',
      readOnly: false,
      tableColumns: [
        {
          deprecated: false,
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
        },
        {
          deprecated: false,
          description: 'A descriptive location for this 128T router.',
          id: 'authority.router.location',
          isKey: false,
          kind: 'leaf',
          label: 'Location',
          name: 'location',
          readOnly: false,
          required: false,
          type: 'string',
          visibility: 'visible'
        },
        {
          deprecated: false,
          description: 'A human-readable string that allows administrators to describe this configuration.',
          id: 'authority.router.description',
          isKey: false,
          kind: 'leaf',
          label: 'Description',
          name: 'description',
          readOnly: false,
          required: false,
          type: 'string',
          visibility: 'visible'
        }
      ],
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
