
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
  var model = this;
  options = options || {};
  var columns = options.columns || null;
  var sortBy = options.sortBy || {
    _id : 1
  };
  var populate = options.populate || null;
  callback = callback || function() {};
  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  var query = model.find(q);
  if (columns !== null) {
    query = query.select(options.columns);
  }
  query = query.skip(skipFrom).limit(resultsPerPage).sort(sortBy);
  if (populate) {
    query = query.populate(populate);
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
  }, function(err, data) {
    if (err) return callback(err);
    callback(null, Math.ceil(data.count / resultsPerPage) || 1, data.results, data.count);
  });
}

module.exports = function(schema) {
  schema.statics.paginate = paginate;
}
