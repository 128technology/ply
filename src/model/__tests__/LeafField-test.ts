import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('Leaf Field Model', () => {
  it('serializes a basic leaf', () => {
    const field = TestPresentationModel.getFieldForID('authority.name');

    expect(field.serialize()).to.deep.equal({
      deprecated: false,
      description: 'The identifier for the Authority.',
      id: 'authority.name',
      isKey: false,
      kind: 'leaf',
      label: 'Name',
      name: 'name',
      readOnly: false,
      required: false,
      type: 'string',
      visibility: 'visible'
    });
  });

  it('serializes a field with enumerations', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.node.device-interface.type');

    expect(field.serialize()).to.deep.equal({
      default: 'ethernet',
      deprecated: false,
      description: 'Type of interface.',
      enumerations: ['ethernet', 'kni', 'pppoe', 'host', 'bridged', 'lte', 't1'],
      id: 'authority.router.node.device-interface.type',
      isKey: false,
      kind: 'leaf',
      label: 'Device Interface Type',
      name: 'type',
      readOnly: false,
      required: false,
      type: 'enumeration',
      visibility: 'visible'
    });
  });

  it('serializes a field with units', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.bfd.desired-tx-interval');

    expect(field.serialize().units).to.equal('milliseconds');
  });
});
