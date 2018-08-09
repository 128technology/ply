import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('Choice Field Model', () => {
  it('serializes a basic choice', () => {
    const field = TestPresentationModel.getFieldForID('authority.dscp-map.prioritization-method');

    expect(field.serialize()).to.deep.equal({
      deprecated: false,
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

  it('serializes choice with an obsolete case', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.routing.static-route.next-hop-choice');

    expect(field.serialize()).to.deep.equal({
      deprecated: false,
      emptyCases: {
        blackhole: 'blackhole'
      },
      enumerations: ['next-hop', 'blackhole'],
      id: 'authority.router.routing.static-route.next-hop-choice',
      kind: 'choice',
      label: 'Next Hop Choice',
      name: 'next-hop-choice',
      readOnly: false,
      required: false,
      visibility: 'visible'
    });
  });

  it('serializes a choice with empty cases', () => {
    const field = TestPresentationModel.getFieldForID('authority.router.service-route.type');

    expect(field.serialize()).to.deep.equal({
      deprecated: false,
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
