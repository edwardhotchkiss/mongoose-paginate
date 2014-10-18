
/*
 * @list dependencies
 */

var async = require('async');

/*
 * @method paginate
 * @param {Object} query Mongoose Query Object
 * @param {Number} pageNumber
 * @param {Number} resultsPerPage
 * Extend Mongoose Models to paginate queries
 */

function paginate(q, pageNumber, resultsPerPage, callback, options) {
  var query, skipFrom, sortBy, columns, populate, model = this;
  options = options || {};
  columns = options.columns || null;
  sortBy = options.sortBy || null;
  populate = options.populate || null;
  callback = callback || function() {};
  skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  query = model.find(q);
  if (columns !== null) {
    query = query.select(options.columns);
  }
  query = query.skip(skipFrom).limit(resultsPerPage);
  if (sortBy !== null) {
    query.sort(sortBy);
  }
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach(function(field) {
        query = query.populate(field);
      });
    } else {
      query = query.populate(populate);
    }
  }
  async.parallel({
    results: function(callback) {
      query.exec(callback);
    },
    count: function(callback) {
      model.count(q, function(err, count) {
        callback(err, count);
      })
    }
  }, function(error, data) {
    if (error) {
      return callback(error);
    }
    callback(null, Math.ceil(data.count / resultsPerPage) || 1, data.results, data.count);
  });
}

module.exports = function(schema) {
  schema.statics.paginate = paginate;
}
