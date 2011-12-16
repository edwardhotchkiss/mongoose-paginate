
/*!
  Module dependencies
*/

var mongoose = require('mongoose');

/*!
  @method paginate
  @param {Object} query Mongoose Query Object
  @param {Number} perPage 
  Extend Mongoose Models to paginate queries
 */
mongoose.Model.paginate = function(query, start, end, callback){
  callback = callback || function(){};
  query.exec(function(error, results) {
    if (error) {
      console.error(error);
    } else {
      console.log(results);
    }
  });
}

/* EOF */