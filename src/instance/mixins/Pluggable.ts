import * as _ from 'lodash';

export type IPlugin = (instance: any, serialized: any) => Promise<any>;

export default class Pluggable {
  public plugins: IPlugin[];

  public async applyPlugins(field: any) {
    const boundPlugins = this.plugins.map(plugin => _.partial(plugin, this));
    let mappedField = _.cloneDeep(field);

    for (const plugin of boundPlugins) {
      mappedField = await plugin(mappedField);
    }

    return mappedField;
  }
}
