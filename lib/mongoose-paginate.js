
/**
 * @list dependencies
 **/

var mongoose = require('mongoose');

/**
 * @method paginate
 * @param {Object} query Mongoose Query Object
 * @param {Number} pageNumber 
 * @param {Number} resultsPerPage
 * Extend Mongoose Models to paginate queries
 **/

mongoose.Model.paginate = function(q, pageNumber, resultsPerPage, callback, options) { 
  var model = this;
  var options = options || {};
  var columns = options.columns || null;
  var sortBy = options.sortBy || {_id:1};
  callback = callback || function(){};
  
  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;

  if(columns == null){
	var query = model.find(q).skip(skipFrom).limit(resultsPerPage).sort(sortBy);
  }else{
	var query = model.find(q).select(options.columns).skip(skipFrom).limit(resultsPerPage).sort(sortBy);
  }

  query.exec(function(error, results) {
    if (error) {
      callback(error, null, null);
    } else {
      model.count(q, function(error, count) {
        if (error) {
          callback(error, null, null);
        } else {
          var pageCount = Math.ceil(count / resultsPerPage);
          if (pageCount == 0) {
            pageCount = 1;
          };
          callback(null, pageCount, results);
        };
      });
    };
  });
};
