import { FieldInstance, PageInstance } from '../instance';

export function makeReadOnly(field: FieldInstance, serializedField: any) {
  return Object.assign({}, serializedField, { readOnly: true });
}

export function removeEmptySections(page: PageInstance, serializedPage: any) {
  const { sections } = serializedPage;
  serializedPage.sections = sections.filter((x: any) => x.fields.length > 0);
  return serializedPage;
}
