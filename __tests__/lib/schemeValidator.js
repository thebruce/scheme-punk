'use strict';

const {schemeValidator} = require('../../lib/schemeValidator');
const SchemePunkErrors = require('../../lib/SchemePunkErrors');

const tmpMocks = [];
let schemeRunnerScheme;
let testScheme;

describe('Scheme Runner Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
    schemeRunnerScheme = {
      arbitraryNameForThisScheme: [
        [
          {
            source: {
              target: 'test',
              plugin: 'originalSchemeSource'
            },
            transform: {
              plugin: 'prependValuesAdapter',
              sourcePrepend: '+'
            },
            destination: {
              target: 'test'
            }
          }
        ],
        [
          {
            source: {
              target: 'test',
              plugin: 'activeSchemeSource'
            },
            transform: {
              plugin: 'appendValuesAdapter',
              sourceAppend: '-'
            },
            destination: {
              target: 'test',
              plugin: 'concatIntoDestination'
            }
          }
        ]
      ],
    };
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemeRunner validation', async () => {
    expect.assertions(1);
    expect(await schemeValidator({scheme: schemeRunnerScheme})).toMatchSnapshot();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  test('Basic schemePunk validation just mapping.', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      transform: {},
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Validation Error no Source', async () => {
    expect.assertions(2);
    testScheme = {
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data should have required property 'source'");
    }
  });
  it('Validation Error no Destination', async () => {
    expect.assertions(2);
    const testScheme1 = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      }
    };

    try {
      await schemeValidator({scheme: testScheme1, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data should have required property 'destination'");
    }
  });
  it('Validation Error no Transform', async () => {
    expect.assertions(2);
    const testScheme1 = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };

    try {
      await schemeValidator({scheme: testScheme1, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data should have required property 'transform'");
    }
  });
});


describe('OriginalSchemeSource Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('OriginalSchemeSource No target', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.source should have property target when property plugin is present, data.source should match "then" schema');
    }
  });
});

describe('ActiveSchemeSource Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('OriginalSchemeSource No target', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.source should have property target when property plugin is present, data.source should match "then" schema');
    }
  });
});

describe('Source From constant Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        constant: 'test',
        plugin: 'sourceFromConstant'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('sourceFromConstant no constant', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'sourceFromConstant'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.source should have property constant when property plugin is present, data.source should match "then" schema');
    }
  });
});


describe('ContingentSource Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        reducer: 'newTest',
        contingencies: {
          testValue1: [
            {
              type: 'dynamic',
              path: 'newTest',
              target: 'testValue1',
            },
            {
              type: 'static',
              value: 'staticTest',
              path: 'type',
            },
            {
              type: 'holdOver',
              path: 'holdOverTest',
              holdover: {
                type: 'static',
                value: 'test2'
              },
            },
          ],
          defined: [
            {
              type: 'static',
              value: 'staticTestDefined',
              path: 'type',
            },
          ],
          undefined: [
            {
              type: 'static',
              value: 'staticTestUndefined',
              path: 'type',
            },
          ]
        }
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {
          defined: [
            {
              type: 'static',
              value: 'staticTestDefined',
              path: 'type',
            },
          ],
          undefined: [
            {
              type: 'static',
              value: 'staticTestUndefined',
              path: 'type',
            },
          ]
        }
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('ContigentSource No Contigencies', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {}
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.source.contingencies should NOT have fewer than 1 properties, data.source should match "then" schema');
    }
  });
  it('ContigentSource static bad props', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {
          defined: [
            {
              type: 'static',
              path: 'type'
            }
          ],
          undefined: [
            {
              type: 'static',
              value: 'staticTestUndefined'
            }
          ]
        }
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data.source.contingencies.defined[0] should have required property 'value', data.source.contingencies.defined[0] should match \"then\" schema, data.source.contingencies.undefined[0] should have required property 'path', data.source.contingencies.undefined[0] should match \"then\" schema, data.source should match \"then\" schema");
    }
  });
  it('ContigentSource dynamic bad props', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {
          testValue1: [
            {
              type: 'dynamic',
              path: 'newTest',
              target: {}
            },
            {
              type: 'dynamic',
              path: 'newTest',
            },
            {
              type: 'holdOver',
              path: 'holdOverTest',
              holdover: {
                type: 'static',
                value: 'test2'
              },
            },
          ],
          defined: [
            {
              type: 'static',
              value: 'staticTestDefined',
              path: 'type',
            },
          ],
          undefined: [
            {
              type: 'static',
              value: 'staticTestUndefined',
              path: 'type',
            },
          ]
        }
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data.source.contingencies['testValue1'][0].target should be string, data.source.contingencies['testValue1'][0] should match \"then\" schema, data.source.contingencies['testValue1'][1] should have required property 'target', data.source.contingencies['testValue1'][1] should match \"then\" schema, data.source should match \"then\" schema");
    }
  });
  it('ContigentSource holdover bad props', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'contingentSource',
        contingencies: {
          testValue1: [
            {
              type: 'holdOver',
              path: 'holdOverTest',
              holdover: {
                type: 'static',
              },
            }
          ],
          defined: [
            {
              type: 'static',
              value: 'staticTestDefined',
              path: 'type',
            },
          ],
          undefined: [
            {
              type: 'holdOver',
              path: 'holdOverTest',
              holdover: {
                value: 'this'
              },
            },
          ]
        }
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe("data.source.contingencies['testValue1'][0].holdover should have required property 'value', data.source.contingencies['testValue1'][0] should match \"then\" schema, data.source.contingencies.undefined[0].holdover should have required property 'type', data.source.contingencies.undefined[0] should match \"then\" schema, data.source should match \"then\" schema");
    }
  });
});

describe('appendValues Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('AppendValues No sourceAppend', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'activeSchemeSource',
        target: 'aSourceTarget'
      },
      transform: {
        plugin: 'appendValuesAdapter'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform should have property sourceAppend when property plugin is present, data.transform should match "then" schema');
    }
  });
});

describe('dateParse validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'dateParser',
        inputFormat: 'YYYY MM DD'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  test('Basic schemePunk validation with utc', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'dateParser',
        inputFormat: 'YYYY MM DD',
        inputUseUtc: true
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Date parser bad format', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'activeSchemeSource',
        target: 'aSourceTarget'
      },
      transform: {
        plugin: 'dateParser',
        inputFormat: 1
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform.inputFormat should be string, data.transform should match "then" schema');
    }
  });
  it('Date parser bad format', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'activeSchemeSource',
        target: 'aSourceTarget'
      },
      transform: {
        plugin: 'dateParser',
        inputFormat: 'YYYY',
        inputUseUtc: 'adfadsfasdf'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform.inputUseUtc should be boolean, data.transform should match "then" schema');
    }
  });
});

describe('dateFormatter validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'dateFormatter',
        inputFormat: 'YYYY MM DD',
        outputFormat: 'YY'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  test('Basic schemePunk validation with utc', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'dateFormatter',
        outputFormat: 'YYYY MM DD'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Date formatter bad format', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'activeSchemeSource',
        target: 'aSourceTarget'
      },
      transform: {
        plugin: 'dateFormatter',
        outputFormat: 1
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform.outputFormat should be string, data.transform should match "then" schema');
    }
  });
});

describe('dateManipulate validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'dateManipulate',
        inputFormat: 'YYYY MM DD',
        outputFormat: 'YY',
        manipulator: 'add',
        manipulateArgs: [7, 'days']
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  test('Basic schemePunk validation with endOf', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'dateManipulate',
        inputFormat: 'YYYY MM DD',
        outputFormat: 'YY',
        manipulator: 'endOf'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Date formatter bad format', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'activeSchemeSource',
        target: 'aSourceTarget'
      },
      transform: {
        plugin: 'dateManipulate',
        inputFormat: 'YYYY MM DD',
        outputFormat: 'YY',
        manipulator: 'notAThing'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform.manipulator should be equal to one of the allowed values, data.transform should match "then" schema');
    }
  });
});


describe('delimit Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'delimitValues',
        sourceDelimiter: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('No sourceDelimiters', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'delimitValues'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform should have property sourceDelimiter when property plugin is present, data.transform should match "then" schema');
    }
  });
});

describe('filterAttributes', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'filterAttribute',
        filterItems: ['item1', 'item2'],
        filterBias: 'out'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Filter attribute not correct', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'filterAttribute',
        filterItems: 'things',
        filterBias: 'out'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform.filterItems should be array, data.transform should match "then" schema');
    }
  });
  it('Filter attribute not correct', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'filterAttribute',
        filterItems: ['things'],
        filterBias: {}
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform.filterBias should be string, data.transform should match "then" schema');
    }
  });
  describe('filterAttributeMulti', () => {
    beforeEach(() => {
      tmpMocks.forEach((mock) => mock.mockRestore());
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    test('Basic schemePunk validation', async () => {
      expect.assertions(1);
      testScheme = {
        source: {
          target: 'test',
          plugin: 'activeSchemeSource'
        },
        transform: {
          plugin: 'filterAttributeMulti',
          filterItems: ['item1', 'item2'],
          filterBias: 'out'
        },
        destination: {
          target: 'test',
          plugin: 'concatIntoDestination'
        }
      };
      expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
    });
    it('Filter attribute not correct', async () => {
      expect.assertions(2);
      testScheme = {
        source: {
          target: 'test',
          plugin: 'activeSchemeSource'
        },
        transform: {
          plugin: 'filterAttributeMulti',
          filterItems: 'things',
          filterBias: 'out'
        },
        destination: {
          target: 'test',
          plugin: 'concatIntoDestination'
        }
      };
      try {
        await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
      }
      catch (error) {
        expect(error).toBeInstanceOf(SchemePunkErrors);
        expect(error.message).toBe('data.transform.filterItems should be array, data.transform should match "then" schema');
      }
    });
    it('Filter attribute not correct', async () => {
      expect.assertions(2);
      testScheme = {
        source: {
          target: 'test',
          plugin: 'activeSchemeSource'
        },
        transform: {
          plugin: 'filterAttributeMulti',
          filterItems: ['things'],
          filterBias: {}
        },
        destination: {
          target: 'test',
          plugin: 'concatIntoDestination'
        }
      };
      try {
        await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
      }
      catch (error) {
        expect(error).toBeInstanceOf(SchemePunkErrors);
        expect(error.message).toBe('data.transform.filterBias should be string, data.transform should match "then" schema');
      }
    });
  });
});

describe('filterObject Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'filterObject',
        filterItems: ['things', 'things1'],
        filterBias: 'out'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('No sourceDelimiters', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'filterObject',
        filterItems: 'nope',
        filterBias: []
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform.filterItems should be array, data.transform.filterBias should be string, data.transform should match "then" schema');
    }
  });
});

describe('filterObjectMulti Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'filterObjectMulti',
        filterItems: ['things', 'things1'],
        filterBias: 'out'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('No sourceDelimiters', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'filterObjectMulti',
        filterItems: 'nope',
        filterBias: []
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform.filterItems should be array, data.transform.filterBias should be string, data.transform should match "then" schema');
    }
  });
});

describe('prependValues Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'prependValuesAdapter',
        sourcePrepend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Prepend Values No sourcePrepend', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'activeSchemeSource',
        target: 'yep'
      },
      transform: {
        plugin: 'prependValuesAdapter',
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform should have property sourcePrepend when property plugin is present, data.transform should match "then" schema');
    }
  });
});

describe('tokenTemplates Validation', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'tokenTemplateValues',
        json: true,
        named: true,
        unescape: true,
        tokens: ['item'],
        template: {
          targetPartial: 'this',
          filterPartials: ['this1', 'this2']
        }
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('tokenTemplates', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'activeSchemeSource',
        target: 'yep'
      },
      transform: {
        plugin: 'tokenTemplateValues',
        json: 'n',
        named: 'h',
        unescape: 'j',
        tokens: 'thing',
        template: {
          targetPartial: {},
          filterPartials: 'this'
        }
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform.named should be boolean, data.transform.json should be boolean, data.transform.unescape should be boolean, data.transform.tokens should be object,array, data.transform.template.targetPartial should be string, data.transform.template.filterPartials should be array, data.transform should match "then" schema');
    }
  });
  test('need tokens if named', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'activeSchemeSource'
      },
      transform: {
        plugin: 'tokenTemplateValues',
        json: true,
        named: true,
        unescape: true,
        template: {
          targetPartial: 'this',
          filterPartials: ['this1', 'this2']
        }
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.transform should have property tokens when property named is present, data.transform should match "then" schema, data.transform should match "then" schema');
    }
  });
});

describe('ConcatIntoDestination', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic concatIntoDestination schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'concatIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('OriginalSchemeSource No target', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'originalSchemeSource',
        target: 'aSourceTarget'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        plugin: 'concatIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.destination should have property target when property plugin is present, data.destination should match "then" schema');
    }
  });
});

describe('Destroy Destination', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic destroyDestination schemePunk validation', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'destroyDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Destroy Destination No target', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'originalSchemeSource',
        target: 'aSourceTarget'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        plugin: 'destroyDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.destination should have property target when property plugin is present, data.destination should match "then" schema');
    }
  });
});

describe('Merge into Destination', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic merge into destination', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'mergeIntoDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Merge into Destination No target', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        plugin: 'originalSchemeSource',
        target: 'infinity'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        plugin: 'mergeIntoDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.destination should have property target when property plugin is present, data.destination should match "then" schema');
    }
  });
});

describe('Push Destination', () => {
  beforeEach(() => {
    tmpMocks.forEach((mock) => mock.mockRestore());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('Basic Push Destination', async () => {
    expect.assertions(1);
    testScheme = {
      source: {
        target: 'test',
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        target: 'test',
        plugin: 'pushDestination'
      }
    };
    expect(await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'})).toMatchSnapshot();
  });
  it('Push into Destination No target', async () => {
    expect.assertions(2);
    testScheme = {
      source: {
        target: 'thisGuy',
        plugin: 'originalSchemeSource'
      },
      transform: {
        plugin: 'appendValuesAdapter',
        sourceAppend: '-'
      },
      destination: {
        plugin: 'pushDestination'
      }
    };
    try {
      await schemeValidator({scheme: testScheme, useValidator: 'schemePunkValidator'});
    }
    catch (error) {
      expect(error).toBeInstanceOf(SchemePunkErrors);
      expect(error.message).toBe('data.destination should have property target when property plugin is present, data.destination should match "then" schema');
    }
  });
});
