import { expect } from 'chai';
import { Model, Choice, DataModel } from '@128technology/yinz';
import * as xml from 'libxmljs';

import Field from '../Field';
import applyMixins from '../../../util/applyMixins';

describe('Field Mixin', () => {
  class Test implements Field {
    public id: Field['id'];
    public label: Field['label'];
    public customComponent: Field['customComponent'];
    public parent: Field['parent'];
    public type: Field['type'];
    public default: Field['default'];
    public readOnly: Field['readOnly'];
    public required: Field['required'];
    public visibility: Field['visibility'];
    public choice: Field['choice'];
    public addChoice: Field['addChoice'];
    public addDefault: Field['addDefault'];
    public addFieldProps: Field['addFieldProps'];
    public addReadOnly: Field['addReadOnly'];
    public addRequired: Field['addRequired'];
    public addType: Field['addType'];
    public addVisibility: Field['addVisibility'];
    public baseSerialize: Field['baseSerialize'];
    public getDataModel: Field['getDataModel'];
    public getKeyNames: Field['getKeyNames'];
    public getLocation: Field['getLocation'];
    public getLocationDescriptor: Field['getLocationDescriptor'];
    public getPage: Field['getPage'];
    public getPresentationModel: Field['getPresentationModel'];
    public resolveModel: Field['resolveModel'];
    public translateType: Field['translateType'];
    public baseValidate: Field['baseValidate'];
    public model: Model | Choice;
  }

  applyMixins(Test, [Field]);

  const modelXML = `
    <yin:container name="root" xmlns:yin="urn:ietf:params:xml:ns:yang:yin:1" xmlns:t128="http://128technology.com/t128" module-prefix="t128" module-name="t128">
        <yin:choice name="foo">
            <yin:case name="notNested">
                <yin:leaf name="bar">
                    <yin:type name="string"/>
                </yin:leaf>
            </yin:case>
            <yin:case name="nested">
                <yin:container name="wrapper">
                    <yin:leaf name="bar">
                        <yin:type name="string"/>
                    </yin:leaf>
                </yin:container>
            </yin:case>
        </yin:choice>
    </yin:container>
  `;

  const dataModel = new DataModel({
    modelElement: xml.parseXmlString(modelXML).root()!,
    rootPath: '//yin:container[@name="root"]'
  });

  it('adds a nested choice', () => {
    const testField = new Field();
    testField.model = dataModel.getModelForPath('root.wrapper.bar');

    testField.addChoice();

    expect(testField.choice).to.deep.equal({ case: 'nested', path: 'root.foo' });
  });

  it('adds a not nested choice', () => {
    const testField = new Field();
    testField.model = dataModel.getModelForPath('root.bar');

    testField.addChoice();

    expect(testField.choice).to.deep.equal({ case: 'notNested', path: 'root.foo' });
  });
});
