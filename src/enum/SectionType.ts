import * as _ from 'lodash';

export function enumValueOf(value: string = 'leaf-section'): SectionType {
  const theType = _.camelCase(value);

  if (Object.keys(SectionType).indexOf(theType) !== -1) {
    return SectionType[theType as keyof typeof SectionType];
  } else {
    throw new Error(`Invalid section type: ${value}`);
  }
}

export enum SectionType {
  leafSection = 'leaf-section',
  choiceSection = 'choice-section',
  listSection = 'list-section',
  listTable = 'list-table',
  containerListSection = 'container-list-section'
}

export default SectionType;
