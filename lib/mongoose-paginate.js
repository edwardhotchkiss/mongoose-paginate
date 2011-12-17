
/*!
  Module dependencies
*/

var mongoose = require('mongoose');

/*!
  @method paginate
  @param {Object} query Mongoose Query Object
  @param {Number} pageNumber 
  @param {Number} resultsPerPage
  Extend Mongoose Models to paginate queries
 */

mongoose.Model.paginate = function(q, pageNumber, resultsPerPage, callback){
  var MyModel = this;
  callback = callback || function(){};
  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  var query = MyModel.find(q).skip(skipFrom).limit(resultsPerPage);
  query.exec(function(error, results) {
    if (error) {
      callback(error, null, null);
    } else {
      MyModel.count({}, function(error, count) {
        if (error) {
          callback(error, null, null);
        } else {
          pageCount = Math.floor(count / resultsPerPage);
          callback(null, pageCount, results);
        }
      });
    }
  });
}

/* EOF */