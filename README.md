# ESMF JavaScript SDK

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](LICENSE)

`@esmf/sdk-js` loads [SAMM](https://eclipse-esmf.github.io/samm-specification/snapshot/index.html) Aspect Models written
in [RDF/Turtle](<https://en.wikipedia.org/wiki/Turtle_(syntax)>) and turns them into typed, native JavaScript/TypeScript
objects that can be inspected, searched and traversed.

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
    - [Load an Aspect](#load-an-aspect)
    - [Load namespaces](#load-namespaces)
    - [Find model elements](#find-model-elements)
    - [Traverse a model with a visitor](#traverse-a-model-with-a-visitor)
    - [Error handling](#error-handling)
- [Development](#development)
- [Documentation](#documentation)
- [Getting help](#getting-help)
- [License](#license)

## Features

- Supports SAMM 2.0.0, 2.1.0 and 2.2.0; the SAMM, characteristic, entity and unit catalogs are built in.
- Promise and RxJS Observable APIs.
- Resolves imports across multiple Turtle files and groups elements by namespace.
- Typed errors for unsupported versions, missing Aspects or invalid RDF.
- Verified against the official [ESMF SDK test Aspect Models](test/tck/README.md).
- ES module with bundled type definitions.

## Requirements

- Node.js 24 or newer (or a bundler targeting modern browsers)
- An ES module environment. CommonJS consumers need `require(esm)` support (Node.js ≥ 22.12) or a dynamic `import()`.

## Installation

The package is attached as `esmf-sdk-js-<version>.tgz` to every
[GitHub release](https://github.com/eclipse-esmf/esmf-sdk-js-aspect-model-loader/releases):

```bash
pnpm add https://github.com/eclipse-esmf/esmf-sdk-js-aspect-model-loader/releases/download/v4.0.0/esmf-sdk-js-4.0.0.tgz
# or
npm install https://github.com/eclipse-esmf/esmf-sdk-js-aspect-model-loader/releases/download/v4.0.0/esmf-sdk-js-4.0.0.tgz
```

Upgrading from `@esmf/aspect-model-loader`? See the [migration guide](CHANGELOG.md#migration-guide).

## Usage

All public classes and types are exported from the package root:

```ts
import {AspectModelLoader, NamespaceLoader} from '@esmf/sdk-js';
```

The loaders expect the **content** of the Turtle files as strings. All files must use the same SAMM version.

### Load an Aspect

A self-contained model (no imports of other files):

```ts
import {readFile} from 'node:fs/promises';
import {AspectModelLoader} from '@esmf/sdk-js';

const ttl = await readFile('Movement.ttl', 'utf8');
const aspect = await new AspectModelLoader().loadSelfContainedAspect(ttl);

console.log(aspect.name, aspect.properties.map(property => property.name));
```

A model spread over several files – pass the URN of the Aspect and the content of all required files:

```ts
const aspect = await new AspectModelLoader().loadAspect('urn:samm:org.eclipse.examples:1.0.0#Movement', movementTtl, sharedTtl);
```

Pass an empty string as URN if the content contains exactly one Aspect.

Prefer RxJS? Every Promise method has an Observable counterpart (`loadSelfContainedModel`, `load`). The Observables
replay their result to late subscribers:

```ts
new AspectModelLoader().load('urn:samm:org.eclipse.examples:1.0.0#Movement', movementTtl, sharedTtl).subscribe(aspect => {
    // ...
});
```

The returned Aspect is frozen.

### Load namespaces

Load all model elements – not only Aspects – grouped by namespace:

```ts
const namespaces = await new NamespaceLoader().loadNamespaces(ttl1, ttl2);

for (const [namespace, elements] of namespaces) {
    console.log(namespace, elements.map(element => element.name));
}
```

`new NamespaceLoader().load(...)` is the Observable variant.

### Find model elements

After loading, the loader instance can be used to look up elements:

```ts
const loader = new AspectModelLoader();
await loader.loadSelfContainedAspect(ttl);

loader.findByUrn('urn:samm:org.eclipse.examples:1.0.0#speed'); // element or undefined
loader.findByName('speed'); // all elements with that name
loader.filterElements(element => element.name.startsWith('is')); // custom predicate
```

### Traverse a model with a visitor

Extend `DefaultAspectModelVisitor` and override the `visit*` methods you are interested in:

```ts
import {DefaultAspectModelVisitor, DefaultProperty} from '@esmf/sdk-js';

class PropertyCounter extends DefaultAspectModelVisitor<void, unknown> {
    count = 0;

    visitProperty(property: DefaultProperty, context: unknown): void {
        this.count++;
        return super.visitProperty(property, context);
    }
}

const counter = new PropertyCounter();
counter.visit(aspect, {});
```

### Error handling

All errors raised while loading extend `AspectModelError`:

| Error                           | Reason                                                       |
| ------------------------------- | ------------------------------------------------------------ |
| `RdfParseError`                 | The Turtle content cannot be parsed                          |
| `UnsupportedVersionError`       | The SAMM version is missing or not supported                 |
| `AspectNotFoundError`           | No Aspect with the given URN exists                          |
| `MultipleAspectsFoundError`     | No URN was given, but the content contains several Aspects   |
| `EntityInstanceResolutionError` | An entity instance cannot be resolved                        |
| `NotAbstractEntityError`        | An entity is extended that is not an abstract entity         |

```ts
import {AspectModelError, UnsupportedVersionError} from '@esmf/sdk-js';

try {
    await loader.loadSelfContainedAspect(ttl);
} catch (error) {
    if (error instanceof UnsupportedVersionError) {
        // ...
    } else if (error instanceof AspectModelError) {
        // ...
    }
}
```

## Development

The project uses [pnpm](https://pnpm.io) and Node.js 24 or newer.

```bash
pnpm install
pnpm run all   # build, format, lint, typecheck, tests with coverage and package checks
```

| Script                   | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| `pnpm run build`         | Compile `src` to `dist`                                                |
| `pnpm test`              | Run all tests with Vitest, including the ESMF test Aspect Models       |
| `pnpm run test:coverage` | Run the tests with coverage thresholds                                 |
| `pnpm run lint`          | Lint with ESLint (`lint:fix` to fix automatically)                     |
| `pnpm run typecheck`     | Typecheck sources and tests                                            |
| `pnpm run prettier`      | Format sources and tests (`test:prettier` to check only)               |
| `pnpm run docs:api`      | Generate the API documentation into `docs/api`                         |
| `pnpm run check:package` | Validate the published package with publint and Are the Types Wrong   |

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution process and [CHANGELOG.md](CHANGELOG.md) for the release
history.

## Documentation

- [JavaScript SDK guide](https://eclipse-esmf.github.io/js-sdk-guide/index.html)
- [ESMF developer documentation](https://eclipse-esmf.github.io)

## Getting help

- Read the [documentation](#documentation).
- Report bugs or request features via [GitHub issues](https://github.com/eclipse-esmf/esmf-sdk-js-aspect-model-loader/issues).
- Discuss development topics on the [ESMF developer mailing list](https://accounts.eclipse.org/mailing-list/esmf-dev).

## License

SPDX-License-Identifier: MPL-2.0

This program and the accompanying materials are made available under the terms of the
[Mozilla Public License, v. 2.0](LICENSE). The [notice file](NOTICE.md) details contained third-party materials.
