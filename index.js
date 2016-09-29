'use strict';

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
  let page, offset, skip, promises = [];
  if (options.hasOwnProperty('offset')) {
    offset = options.offset;
    skip = offset;
  } else if (options.hasOwnProperty('page')) {
    page = options.page;
    skip = (page - 1) * limit;
  } else {
    page = 1;
    offset = 0;
    skip = offset;
  }

  promises.push(this.count(query).exec());

  if (limit > 0) {
    let docsQuery = this.find(query)
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

    let docPromise = docsQuery.exec();
    if (lean && leanWithId) {
      docPromise = docPromise.then((docs) => {
        docs.forEach((doc) => {
          doc.id = String(doc._id);
        });
        return docs;
      });
    }

    promises.push(docPromise);
  }

  return Promise.all(promises).then((data) => {
    let result = {
      total: data[0],
      docs: data[1] || [],
      limit: limit
    };
    if (offset !== undefined) {
      result.offset = offset;
    }
    if (page !== undefined) {
      result.page = page;
      result.pages = Math.ceil(result.total / limit) || 1;
      let prev = page - 1;
      let next = page + 1;

      if (prev > 0) {
        result.prev = prev;
      }

      if (next <= result.pages) {
        result.next = next;
      }
    }
    if (typeof callback === 'function') {
      return callback(null, result);
    }
    return result;
  });
}

/**
 * @param {Schema} schema
 */

module.exports = function(schema) {
  schema.statics.paginate = paginate;
};

module.exports.paginate = paginate;
