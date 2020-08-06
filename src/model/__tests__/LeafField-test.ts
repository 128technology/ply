import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('Leaf Field Model', () => {
  it('serializes a basic leaf', () => {
    const field = TestPresentationModel.getFieldForID('authority.name')!;

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
    const field = TestPresentationModel.getFieldForID('authority.router.node.device-interface.type')!;

    expect(field.serialize()).to.deep.equal({
      default: 'ethernet',
      deprecated: false,
      description: 'Type of interface.',
      enumerations: [
        { name: 'ethernet', description: 'A physical ethernet interface.' },
        { name: 'kni', description: 'A logical interface to VM, host process, or container instance.' },
        { name: 'pppoe', description: 'An interface using the Point-to-Point Protocol over Ethernet (PPPoE).' },
        { name: 'host', description: 'A logical interface to the host system.' },
        { name: 'bridged', description: 'A logical interface bridged to a target interface.' },
        { name: 'lte', description: 'An interface using LTE.' },
        { name: 't1', description: 'An interface using a T1 card.' }
      ],
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

  it('serializes a union field with enumerations and a boolean', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.system.remote-login.enabled')!;

    expect(field.serialize()).to.deep.equal({
      default: 'use-authority-setting',
      deprecated: false,
      description: 'Enable remote login from a Conductor to assets on this Router.',
      enumerations: [
        { name: 'use-authority-setting', description: 'Use the authority wide remote-login state.' },
        { name: 'true', description: '' },
        { name: 'false', description: '' }
      ],
      id: 'authority.router.system.remote-login.enabled',
      isKey: false,
      kind: 'leaf',
      label: 'Remote Login State',
      name: 'enabled',
      readOnly: false,
      required: false,
      type: 'union',
      visibility: 'visible'
    });
  });

  it('serializes a field with units', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.bfd.desired-tx-interval')!;

    expect(field.serialize().units).to.equal('milliseconds');
  });
});
