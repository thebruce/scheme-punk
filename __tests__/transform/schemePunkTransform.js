'use strict';

const SchemePunkTransformBase = require('../../lib/transform/schemePunkTransform');
const options = require('./../__helpers__/schemePunkTestOptions');
const fs = require('fs-extra');

const schemePunkScheme = fs.readJSONSync('./__tests__/__mocks__/schemePunkMockScheme.json');
const schemePart = fs.readJSONSync('./__tests__/__mocks__/sourceSchema.json');

let tmpMocks = [];
let converterEx;

beforeEach(() => {
  tmpMocks.forEach(mock => mock.mockRestore());
  tmpMocks = [];
  jest.resetAllMocks();
  jest.spyOn(Date, 'now').mockReturnValue(2000);
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Scheme Punk Transform', () => {

  const noTransformOptions = {
    transform: {},
    holdOvers: {
      test: 'test'
    }
  };

  test('Class Construction', () => {
    let testClass;
    expect.assertions(1);
    return SchemePunkTransformBase()
    .then((SchemeTransform) => {
      testClass = SchemeTransform;
      const schemeTransform = new SchemeTransform();
      schemeTransform.init(options.transform, {});
      return schemeTransform;
    })
    .then(schemeTransform => expect(schemeTransform)
    .toBeInstanceOf(testClass))
  });

  test('Class Construction with Plugin', () => {
    let testClass;
    expect.assertions(1);
    return SchemePunkTransformBase(options.transform.plugin)
    .then((SchemeTransform) => {
      testClass = SchemeTransform;
      const schemeTransform = new SchemeTransform();
      schemeTransform.init(options.transform, {});
      return schemeTransform;
    })
    .then(schemeTransform => expect(schemeTransform)
    .toBeInstanceOf(testClass))
  });

  test('TransformBase use transform method', () => {
    expect.assertions(1);
    return SchemePunkTransformBase(options.transform.plugin)
    .then((TransformSource) => {
      const transformSource = new TransformSource();
      transformSource.init(options.transform, {})
      return Promise.all([transformSource, transformSource.transform({dumber: 'dumb'})]);
    })
    .then(([transformer]) => {
      return transformer.getTransformedValue();
    })
    .then(transformedValue => expect(transformedValue).toEqual(["dumber"]))
  });
})