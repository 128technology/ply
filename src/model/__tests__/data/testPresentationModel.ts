import * as fs from 'fs';
import * as path from 'path';
import { DataModel } from '@128technology/yinz';

import dataModel from './testDataModel';
import { PresentationModel } from '../../';

export function parsePresentationModel(dirname: string, configModel: DataModel) {
  const dirPath = path.join(__dirname, dirname);
  const models: any[] = [];

  const files = fs.readdirSync(dirPath);

  files.forEach(filename => {
    const content = fs.readFileSync(path.join(dirPath, filename), 'utf-8');
    models.push(JSON.parse(content));
  });

  return new PresentationModel(models, configModel);
}

const presentationModel = parsePresentationModel('testModel', dataModel);

export default presentationModel;
