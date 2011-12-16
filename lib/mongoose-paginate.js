
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
  callback = callback || function(){};
  var skipFrom = pageNumber * resultsPerPage;
  var query = this.find(q).skip(skipFrom).limit(resultsPerPage);
  query.exec(function(error, results) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

/* EOF */