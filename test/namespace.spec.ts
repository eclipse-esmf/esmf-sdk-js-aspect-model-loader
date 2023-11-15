/*
 * Copyright (c) 2023 Robert Bosch Manufacturing Solutions GmbH
 *
 * See the AUTHORS file(s) distributed with this work for
 * additional information regarding authorship.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * SPDX-License-Identifier: MPL-2.0
 */

import { BaseMetaModelElement } from "../src";
import { Subscription } from "rxjs";
import { movementAspectModelWithExternalReference } from "./models/movement-model";
import { characteristicDifferentNamespace } from "./models/characteristics";
import { NamespaceLoader } from "../src/namespace-loader";
import DoneCallback = jest.DoneCallback;

describe("Namespace tests", (): void => {
  let subscription: Subscription;
  let loader: NamespaceLoader;
  let namespaces: Map<string, Array<BaseMetaModelElement>>;

  beforeEach((done: DoneCallback): void => {
    loader = new NamespaceLoader();
    subscription = loader.load(characteristicDifferentNamespace, movementAspectModelWithExternalReference).subscribe(_namespaces => {
      namespaces = _namespaces;
      done();
    });
  });

  test("should load different namespaces successfully", (): void => {
      expect(namespaces.size).toEqual(2);
      expect(namespaces.has("urn:samm:org.eclipse.esmf.test:1.0.0#")).toBeTruthy();
      expect(namespaces.has("urn:samm:org.eclipse.esmf.test-with-different-ns:1.0.0#")).toBeTruthy();
  });

  afterEach((): void => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });
});
