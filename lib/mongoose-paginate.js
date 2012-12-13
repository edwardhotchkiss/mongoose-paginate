/**
 * Module dependencies
 **/

var mongoose = require('mongoose');

/**
 * @method paginate
 * @param {Object} query Mongoose Query Object
 * @param {Number} pageNumber 
 * @param {Number} resultsPerPage
 * Extend Mongoose Models to paginate queries
 **/

mongoose.Model.paginate = function(q, pageNumber, resultsPerPage, callback){ 
  var model = this;
  callback = callback || function(){};
  
  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  var query = model.find(q).skip(skipFrom).limit(resultsPerPage);

  query.exec(function(error, results) {
    if (error) {
      callback(error, null, null);
    } else {
      model.count(q, function(error, count) {
        if (error) {
          callback(error, null, null);
        } else {
          var pageCount = Math.floor(count / resultsPerPage);
          if (pageCount == 0) // fix : 1 of 0
            pageCount = 1;
          callback(null, pageCount, results);
        }
      });
    }
  });
}

/* EOF */