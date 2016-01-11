'use strict';

const mongoose = require('mongoose');

/**
 * @package mongoose-paginate
 * @param {Object} [query={}]
 * @param {Object} [options={}]
 * @param {Object|String} [options.select]
 * @param {Object|String} [options.sort]
 * @param {Array|Object|String} [options.populate]
 * @param {Boolean} [options.lean=false]
 * @param {Boolean} [options.leanWithId=true]
 * @param {Number} [options.offset=0] - Use offset or page to set skip position
 * @param {Number} [options.page=1]
 * @param {Number} [options.limit=10]
 * @param {Function} [callback]
 * @returns {Promise}
 */

function paginate(query, options, callback) {
  query = query || {};
  options = Object.assign({}, paginate.options, options);
  let select = options.select;
  let sort = options.sort;
  let populate = options.populate;
  let lean = options.lean || false;
  let leanWithId = options.hasOwnProperty('leanWithId') ? options.leanWithId : true;
  let limit = options.hasOwnProperty('limit') ? options.limit : 10;
  let page, offset, skip, docsQuery, promises;
  if (options.offset) {
    offset = options.offset;
    skip = offset;
  } else if (options.page) {
    page = options.page;
    skip = (page - 1) * limit;
  } else {
    page = 1;
    offset = 0;
    skip = offset;
  }
  if (limit > 0) {
    docsQuery = this.find(query)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(lean);
    if (populate) {
      [].concat(populate).forEach((item) => {
        docsQuery.populate(item);
      });
    }
  }
  promises = {
    docs: (docsQuery) ? docsQuery.exec() : false,
    count: this.count(query).exec()
  };
  promises = Object.keys(promises).map((index) => {
    if (promises[index]) {
      return promises[index];
    }
  });
  let promise = new Promise((resolve, reject) => {
    Promise.all(promises).then((data) => {
      let docs = (limit > 0) ? data[0] : [];
      let count = data[1];
      let result = {
        docs: docs,
        total: count,
        limit: limit
      };
      if (lean && leanWithId) {
        result.docs = result.docs.map((doc) => {
          doc.id = String(doc._id);
          return doc;
        }); 
      }
      if (offset !== undefined) {
        result.offset = offset;
      }
      if (page !== undefined) {
        result.page = page;
        result.pages = Math.ceil(result.total / limit) || 1;
      }
      if (typeof callback === 'function') {
        return callback(null, result);
      }
      resolve(result);
    }, (error) => {
      if (typeof callback === 'function') {
        return callback(error, null);
      }
      reject(error);
    });
  });
  return promise;
}

/**
 * @param {Schema} schema
 * use native ES6 promises verus mpromise
 */

mongoose.Promise = global.Promise;

module.exports = function(schema) {
  schema.statics.paginate = paginate;
};

module.exports.paginate = paginate;
