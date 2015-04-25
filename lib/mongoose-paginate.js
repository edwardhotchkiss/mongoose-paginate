/*
 * @method paginate
 * @param {Object} query Mongoose Query Object
 * @param {Number} pageNumber
 * @param {Number} resultsPerPage
 * Extend Mongoose Models to paginate queries
 */

function paginate(q, pageNumber, resultsPerPage, callback, options) {
  var query, skipFrom, sortBy, columns, populate, lean, model = this;
  options = options || {};
  columns = options.columns || null;
  sortBy = options.sortBy || null;
  populate = options.populate || null;
  lean = options.lean || null;
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
  if (lean) {
    query = query.lean();
  }
  // query
  query.exec(function(error, result) {
    callback(error, result);
  });
}

module.exports = function(schema) {
  schema.statics.paginate = paginate;
};
