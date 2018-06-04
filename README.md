# PLY [![Build Status](https://travis-ci.org/128technology/ply.svg?branch=master)](https://travis-ci.org/128technology/ply)  ![npm version](https://badge.fury.io/js/%40128technology%2Fply.svg)

PLY (**P**resentation **L**anguage for **Y**inz) is a library to manage JSON files that model a GUI for configuring a YANG (RFC 6020) datastore. It directly integrates with the [Yinz](https://github.com/128technology/yinz) library which manages both the datamodel and instance data associated with that datamodel.

PLY intends to provide the following functionality:
* Ingest a presentation model described by one or more JSON files.
* Ingest a datamodel and associate it with the presentation model. The datamodel will be used to look up information from fields.
* Injest an instance of the model and associate the values from the instance with presentation fields.
* Serialize this *presentation instance* to JSON that can be sent to a client to draw a GUI.
* Validate that a presentation model is both syntactically and semantically valid.
* Given a datamodel, ensure that all aspects of the datamodel have a corresponding entry in the presentation model.

# Model Format

## Pages
A page is typically broken out into it's own JSON file. Pages generally represent containers and instances of list items.  For example, if the model has a list of routers, there would probably be a page named `router.json` which describes what an instance of a router would look like.  The schema of a page is pretty simple, it contains a `title`, an `id`, and an array of `sections`.  The most basic page would like like the following:
```json
{
  "id": "my-new-page",
  "title": "My New Page",
  "sections": []
}
```

Generally it is a good idea for the page `id` to match the name of the file.  For example, `router.json` would have an `id` of `router`.

## Sections

### `leaf-section`
If you have a section of basic fields (e.g. no containers, lists, or leaf-lists), then this is the section type you would want to use. This section type has an `id`, a `title`, and an array of `fields`. Generally the `id` for the section has the format `page-id.section-id`, so if it was on the `router` page it might look something like `router.settings`. **If you do not specify a type for a section it will default to this type.**  A basic `leaf-section` looks like the following:
```json
{
  "id": "my-new-page.my-new-section",
  "title": "My New Section",
  "fields": []
}
```

If you chose to specify the type explicitly it would look like:
```json
{
  "id": "my-new-page.my-leaf-section",
  "title": "My Leaf Section",
  "type": "leaf-section",
  "fields": []
}
```

### `list-section`
All lists need to be contained in their own `list-section`. A `list-section` will have exactly one field which references the list itself.  A `list-section`'s `title` field is explicitly set to `null` and the `label` of the list field inside the section is used instead. The specifics of the single list field are outlined in the Fields section, including descriptions of the `link` and `columns` properties.  A basic `list-section` looks like the following:
```json
{
  "id": "my-new-page.my-list-section",
  "title": null,
  "type": "list-section",
  "fields": [{
    "link": "dog",
    "id": "id.to.a.list.field",
    "label": "Dogs"
  }]
}
```

### `list-table`
All leaf-lists need to be contained in their own `list-table` section.  Similarly to the `list-section` a `list-table` section has exactly one field describing the leaf-list.  It also has a `title` explicitly set to `null`.  An example `list-table` section looks like the following:
```json
{
  "id": "my-new-page.my-list-table-section",
  "title": null,
  "type": "list-table",
  "fields": [{
    "id": "id.to.a.leaf-list.field",
    "label": "Cats",
    "columnLabels": [{
      "id": "name",
      "label": "Cat"
    }]
  }]
}
```

### `container-list-section`
If you want links that dive into one or more containers/pages in a section, you will want to use the `container-list-section`.  An example looks like the following:
```json
{
  "id": "my-new-page.my-link-section",
  "title": "Example Container Links",
  "type": "container-list-section",
  "fields": [{
    "id": "id.to.a.container.field",
    "link": "container-1",
    "label": "Container 1"
  }]
}
```
