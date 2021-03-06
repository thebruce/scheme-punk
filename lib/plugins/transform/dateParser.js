'use strict';

const _ = require('lodash');
const moment = require('moment');
/**
 * This is a transformation mixin for SchemePunk.
 * SchemePunk mixins follow the formula for mixins described at:
 * http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 * More info in the README.
 *
 */
module.exports = (superclass) => class extends superclass {
  /**
     * Function to transform a date passed in from the source
     *   into a parsed date object.
     *
     * @param value
     *  A value to perform a transformation upon.
     */
  async transform(value) {
    const format = _.get(this, ['options', 'inputFormat']);
    const tmpValue = value || Date.now();

    const tmp = moment(tmpValue, format);

    if (_.get(this, 'options.inputUseUtc', false)) {
      tmp.utc();
    }

    if (!tmp.isValid()) {
      throw new Error(`The data passed to the date formatter could not be transformed into valid date.`);
    }
    return super.transform(tmp);
  }
};
