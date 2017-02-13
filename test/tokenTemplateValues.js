'use strict';

// Require mixin.
const tokenTemplateValues = require('../lib/plugins/transform/tokenTemplateValues');

// Require a super class.
const superClass = require('../lib/transform/schemePunkTransform');

// Create an implementing class using mixin and super.
const Implemented = class implementer extends tokenTemplateValues(superClass) {
  transform(value) {
    this.value = super.transform(value);
  }
};

// Options for testing with template path and object with no tokens.
const options = {
  origin: '../../../test/helpers/templateLiteralTestOne.tpl',
  named: false
};

// Options for testing with tokens and value.
const options2 = {
  origin: '../../../test/helpers/templateLiteralTestTwo.tpl',
  named: true,
  tokens: {
    name: 'name',
    test: 'testKey2'
  }
};

// Test case value.
const value = {
  name: 'testName',
  testKey: 'item0',
  testKey2: 'item1'
};

// Options for testing with tokens and value.
const options3 = {
  origin: '../../../test/helpers/templateLiteralTestThree.tpl',
  named: true,
  tokens: {
    test: 'testKey2'
  }
};

const testClass = new Implemented(options, {});

const testClass2 = new Implemented(options2, {});

const testClass3 = new Implemented(options3, {monkey: 'toofer'});

module.exports = {
  tokenOnlyValues: (test) => {
    test.expect(1);
    testClass.transform(value);
    test.deepEqual(
      testClass.value,
      'Dust template one name is testName, testKey is item0.'
    );
    test.done();
  },
  tokenOnlyTokens: (test) => {
    test.expect(1);
    testClass2.options.origin = 'test/helpers/templateLiteralTestTwo.tpl';
    testClass2.transform(value);
    test.deepEqual(
      testClass2.value,
      'Dust template one name is: testName, test has the value of testKey2: item1.'
    );
    test.done();
  },
  getTraceIndex: (test) => {
    test.expect(1);
    test.deepEqual(
      testClass.getTraceIndex(1),
      0
    );
    test.done();
  },
  holdOversWithTokens: (test) => {
    test.expect(1);
    testClass3.options.origin = 'test/helpers/templateLiteralTestThree.tpl';
    testClass3.transform(value);
    test.deepEqual(
      testClass3.value,
      'Dust template one name is: toofer, test has the value of testKey2: item1.'
    );
    test.done();
  }
};