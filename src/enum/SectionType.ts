import * as _ from 'lodash';

export function enumValueOf(value: string = 'leaf-section'): SectionType | null {
  const theType = _.camelCase(value);

  if (Object.keys(SectionType).indexOf(theType) !== -1) {
    return SectionType[theType as keyof typeof SectionType];
  } else {
    return null;
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
