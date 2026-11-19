# ESMF SDK test aspect models

The `models` folder contains the valid test aspect models of the
[Eclipse ESMF SDK](https://github.com/eclipse-esmf/esmf-sdk) (SAMM 2.2.0), copied unchanged from
`core/esmf-test-aspect-models/src/main/resources/valid/org.eclipse.esmf.test/1.0.0/`
at commit [`13bc477`](https://github.com/eclipse-esmf/esmf-sdk/tree/13bc477e68c6e6b3b9a8b58925855c81d514ea39).

The files are licensed under the Mozilla Public License 2.0 as stated in their headers.
They are used by `test/tck.spec.ts` to verify that every aspect model can be loaded.

To update them, download the files from the path above again and replace the content of `models`.
