import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('Choice Field Model', () => {
  it('serializes a basic choice', () => {
    const field = TestPresentationModel.getFieldForID('authority.dscp-map.prioritization-method');

    expect(field.serialize()).to.deep.equal({
      emptyCases: {},
      enumerations: ['priority', 'traffic-class'],
      id: 'authority.dscp-map.prioritization-method',
      kind: 'choice',
      label: 'DSCP Prioritization Method',
      name: 'prioritization-method',
      readOnly: false,
      required: true,
      visibility: 'visible'
    });
  });

  it('serializes a choice with empty cases', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.service-route.type');

    expect(field.serialize()).to.deep.equal({
      emptyCases: {
        'to-routing-agent': 'to-routing-agent',
        'use-learned-routes': 'use-learned-routes'
      },
      enumerations: [
        'service-agent',
        'peer-service-route',
        'next-peer-service-route',
        'use-learned-routes',
        'to-routing-agent'
      ],
      id: 'authority.router.service-route.type',
      kind: 'choice',
      label: 'Type',
      name: 'type',
      readOnly: false,
      required: false,
      visibility: 'visible'
    });
  });
});
