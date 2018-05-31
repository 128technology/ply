import { expect } from 'chai';

import TestPresentationModel from './data/testPresentationModel';

describe('Page', () => {
  it('should determine if it is a list page', () => {
    const page = TestPresentationModel.getPage('peer');

    expect(page.isListPage()).to.equal(true);
  });

  it('should determine if it is not a list page', () => {
    const page = TestPresentationModel.getPage('edit-config-home');

    expect(page.isListPage()).to.equal(false);
  });

  it('should get key fields for list pages', () => {
    const page = TestPresentationModel.getPage('peer');

    expect(page.getKeyFields()).to.have.lengthOf(1);
    expect(page.getKeyFields()[0].model.name).to.equal('name');
  });
});
