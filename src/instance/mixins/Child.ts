import { DataModelInstance } from '@128technology/yinz';

import { PresentationModelInstance } from '../';

export interface IParent {
  getPresentationInstance: () => PresentationModelInstance;
  getDataInstance: () => DataModelInstance;
}

export default class Child {
  public parent: IParent;

  public getDataInstance() {
    return this.parent.getDataInstance();
  }

  public getPresentationInstance() {
    return this.parent.getPresentationInstance();
  }
}
