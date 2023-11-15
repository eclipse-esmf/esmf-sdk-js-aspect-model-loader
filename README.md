# ESMF JS SDK :: Aspect Model Loader 🚀

## Table of Contents

- [Introduction](#introduction)
- [Getting help](#getting-help)
- [Getting started](#getting-started)
    - [Install from the public npm](#install-from-the-public-npm)
    - [Usage](#usage)
    - [Helpful functions](#helpful-functions)
    - [Development](#development)
        - [Create bundle](#create-bundle)
        - [Update indexes](#update-indexes)
- [Documentation](#documentation)
- [License](#license)

## Introduction

This project enables developers to effortlessly load and parse one or more [.ttl files](<https://en.wikipedia.org/wiki/Turtle_(syntax)>) 
and instantiate native TypeScript objects of the pared [SAMM](<https://projects.eclipse.org/projects/dt.esmf>) semantic concepts.

## Getting help

Are you having trouble with ESMF JS? We want to help!

- Check the [developer documentation](https://eclipse-esmf.github.io)
- Having issues with the ESMF JS? Open
  a [GitHub issue](https://github.com/eclipse-esmf/esmf-sdk-js-aspect-model-loader/issues).

## Getting started

### Install from the public npm:

<!-- TODO: Replace this with esmf -->

```
npm install @esmf/aspect-model-loader
```

## Usage

Instantiating an Aspect the following two methods for loading ttl files(string value of the .ttl files) are provided.

Load an aspect model which is self-contained (includes no imports to other ttl file):

```
new AspectModelLoader().loadSelfContainedModel(ttl).subscribe((aspect: Aspect) => {
...
});
```

or if the model contains imports to further ttl files:

```
new AspectModelLoader().load('<aspect-model-urn>', ttl-1, ttl-2, ttl-3, ...).subscribe((aspect: Aspect) => {
...
});
```

Besides loading an aspect the project also supports to load and group the SAMM definitions by namespace.

Load all namespace and related SAMM semantic concepts:

```
new NamespaceLoader().load(ttl-1, ttl-2, ttl-3, ...).subscribe((namespaces: Observable<Map<string, Array<BaseMetaModelElement>>>) => {
...
});
```

If you are using external .ttl files you may need to parse the contents of these files to strings, to be passed to the
methods params. Further all .ttl files must use the same SAMM version. Loading SAMM semantic concepts from different .ttl files
having different SAMM versions is not supported yet.

## Helpful functions

This module exposes some helper functions that can be used to find items inside the loaded ttl object.

Find a specific model element, and returns it or undefined.

```
let specificElement = loader.findByUrn(options.urnSelectedModelElement)
```

Find a specific model element by name, and returns the found elements.

```
let specificElement = loader.findByName(options.selectedModelName)
```

## Development

### Create bundle

```
npm run build
```

to build and to create the library

#### Update indexes

```
ctix create ./src
```

to update all index files under `src`. For more information see the project https://github.com/imjuni/create-ts-index.

## Documentation

Further documentation and HowTos are provided in the
official [JS SDK User Documentation](https://eclipse-esmf.github.io/js-sdk-guide/index.html)

## License

SPDX-License-Identifier: MPL-2.0

This program and the accompanying materials are made available under the terms of the
[Mozilla Public License, v. 2.0](LICENSE).

The [Notice file](NOTICE.md) details contained third party materials.
