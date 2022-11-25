# SDS JS SDK :: Aspect Model Loader 🚀

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

The main purpose of this package it to allow users to load and parse one or
more [.ttl files](<https://en.wikipedia.org/wiki/Turtle_(syntax)>) into native TypeScript objects.

## Getting help

Are you having trouble with SDS SDK JS? We want to help!

* Check the [developer documentation](https://openmanufacturingplatform.github.io)
* Having issues with the SDS SDK JS? Open
  a [GitHub issue](https://github.com/OpenManufacturingPlatform/sds-sdk-js-aspect-model-loader/issues).

## Getting started

### Install from the public npm (Currently not available):

```
npm install @sds/aspect-model-loader
```

### Install from github release repository:

```
npm install https://github.com/OpenManufacturingPlatform/sds-sdk-js-aspect-model-loader/releases/download/<TAG_VERSION>/sds-aspect-model-loader-x.x.x.tgz
```

## Usage

This package contains two methods for loading ttl files(string value of the .ttl files).

Load an aspect model which is self-contained (includes no imports to other ttl file):

```
new AspectModelLoader().loadSelfContainedModel(ttl).subscribe((aspect: Aspect) => {
...
});
```

or if the model contains imports to additional ttl files:

```
new AspectModelLoader().load('<aspect-model-urn>', ttl-1, ttl-2, ttl-3).subscribe((aspect: Aspect) => {
...
});
```

If you are using external .ttl files you may need to parse the contents of these files to strings, to be passed to the
methods params.

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

Further documentation and howto's are provided in the
official [JS SDK Aspect Model loader User Documentation](https://openmanufacturingplatform.github.io/sds-documentation/js-sdk-aml-guide/index.html)

## License

SPDX-License-Identifier: MPL-2.0

This program and the accompanying materials are made available under the terms of the
[Mozilla Public License, v. 2.0](LICENSE).

The [Notice file](NOTICE.md) details contained third party materials.

