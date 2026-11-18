# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to
[Semantic Versioning](https://semver.org/).

## [4.0.0] - unreleased

### ⚠️ Breaking changes

- **Package renamed** from `@esmf/aspect-model-loader` to `@esmf/sdk-js` (ESMF JavaScript SDK).
- **ESM only**: the CommonJS build was removed. Deep imports such as `@esmf/aspect-model-loader/dist/...` are no longer
  supported; import everything from the package root. `require()` works only on Node.js versions supporting
  `require(esm)` (≥ 22.12).
- **Node.js ≥ 24** is required.
- Removed the runtime dependencies `buffer`, `util` and `tslib`.
- Enums were replaced by `const` objects plus union types of the same name (usage like `SammVersion.SAMM_2_2_0` still
  works, but they are no longer TypeScript `enum`s).
- `RdfModel.getPrefixes()` / `prefixes` return a `Record<string, string>`.
- Range constraint values are typed as `number | string`.
- `DefaultEntityInstance` exposes its values via an index signature.
- `isAspectModelDefinition` returns a `boolean`.
- Quantity kind URNs contain the `#` separator; `Unit.quantityKinds` contains `QuantityKind` objects without
  duplicates. `getSupportedUnitNames()` and `getSupportedQuantityKindsNames()` return names.
- XSD data types are kept per loader instance instead of globally.
- Errors are thrown as typed errors (see below); the message for an unsupported SAMM version reports `unknown` when no
  version could be detected.
- Loading content with several Aspects and an empty URN fails with `MultipleAspectsFoundError`.
- Several internal methods and classes were renamed during refactoring; only the public API exported from the package
  root is considered stable.

### Added

- Promise API: `AspectModelLoader.loadAspect()`, `AspectModelLoader.loadSelfContainedAspect()` and
  `NamespaceLoader.loadNamespaces()`.
- Typed errors: `AspectModelError` with `UnsupportedVersionError`, `AspectNotFoundError`,
  `MultipleAspectsFoundError`, `EntityInstanceResolutionError`, `NotAbstractEntityError` and `RdfParseError`.
- Export of `BoundDefinition`.
- Conformance test suite with the 188 valid test Aspect Models of the ESMF SDK (`test/tck.spec.ts`).
- API documentation generated with TypeDoc (`pnpm run docs:api`) and published via GitHub Pages.
- Package validation with publint and Are the Types Wrong (`pnpm run check:package`).
- SAMM 2.2.0 support including `samm:Value`.

### Changed

- Observables returned by `load()` replay their result to late subscribers.
- Tooling: pnpm, Vitest, strict TypeScript, stricter ESLint rules; unit data split into `units.ts` and `units-data.ts`.

### Fixed

- Empty RDF input resolves instead of never completing.
- The `elementCharacteristic` of collections is resolved through the complete characteristic chain (e.g. a
  `SingleEntity` was previously instantiated as plain `Characteristic`).
- Recursive entities (an entity having a property that refers to the entity itself) no longer cause a stack overflow.

### Migration guide

1. Replace the dependency: `pnpm remove @esmf/aspect-model-loader && pnpm add <path-or-url-to>/esmf-sdk-js-4.0.0.tgz`.
2. Replace all imports `from '@esmf/aspect-model-loader'` (including deep `dist/...` imports) with
   `from '@esmf/sdk-js'`.
3. Make sure your project runs on Node.js ≥ 24 and is consumed as ES module (`"type": "module"` or a bundler).
4. Optionally switch from `load(...).subscribe(...)` to `await loadAspect(...)` and handle `AspectModelError`s.
5. Adjust code relying on the changed types listed above (prefixes, range values, quantity kinds, enums).
