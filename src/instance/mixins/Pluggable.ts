import * as _ from 'lodash';
import { DataModelInstance } from '@128technology/yinz';

import { PresentationModelInstance } from '../';

export type IPlugin = (instance: any, serialized: any) => any;

export default class Pluggable {
  public plugins: IPlugin[];

  public applyPlugins(field: any) {
    return _.flow(this.plugins.map(plugin => _.partial(plugin, this)))(field);
  }
}
