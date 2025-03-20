/// <reference types="vitest" />
import { expect, afterEach, beforeEach, describe, test, vi } from 'vitest';

declare global {
  // eslint-disable-next-line no-var
  var describe: typeof describe;
  // eslint-disable-next-line no-var
  var test: typeof test;
  // eslint-disable-next-line no-var
  var expect: typeof expect;
  // eslint-disable-next-line no-var
  var vi: typeof vi;
  // eslint-disable-next-line no-var
  var beforeEach: typeof beforeEach;
  // eslint-disable-next-line no-var
  var afterEach: typeof afterEach;
}

export {}; 