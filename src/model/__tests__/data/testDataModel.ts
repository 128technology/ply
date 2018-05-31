import * as fs from 'fs';
import * as path from 'path';
import * as xml from 'libxmljs';

import { DataModel } from '@128technology/yinz';

const modelXml = fs.readFileSync(path.join(__dirname, './/consolidatedT128Model.xml'), 'utf8');

const dataModel = new DataModel({
  modelElement: xml.parseXmlString(modelXml).root(),
  rootPath: '//yin:container[@name="authority"]'
});

export default dataModel;
