'use strict';

/**
 * @package mongoose-paginate
 * @param {Object} [query={}]
 * @param {Object} [options={}]
 * @param {Object|String} [options.select]
 * @param {Object|String} [options.sort]
 * @param {Array|Object|String} [options.populate]
 * @param {Boolean} [options.lean=true]
 * @param {Number} [options.page=1]
 * @param {Number} [options.perPage=10]
 * @param {Function} [callback]
 * @returns {Promise}
 */

async function paginate(query = {}, options = {}, callback) {
    const o = Object.assign({}, options);
    o.page = o.page || 1;
    o.sort = o.sort || { createdAt: -1 };
    o.perPage = o.perPage || 10;
    o.lean = o.lean ? o.lean : true;    
    o.skip = (o.page - 1) * o.perPage;
    
    const mongooseObj = this.find(query);
    if (o.select) mongooseObj.select(o.select)
    if (o.sort) mongooseObj.sort(o.sort)
    if (o.skip) mongooseObj.skip(o.skip)
    if (o.perPage) mongooseObj.limit(o.perPage)
    if (o.lean) mongooseObj.lean()
    if (o.populate) {
        [].concat(o.populate).forEach((item) => {
            mongooseObj.populate(item);
        });
    }

    o.data = await mongooseObj.exec();
    o.documents = await this.countDocuments(query).exec();
    o.pages = Math.ceil(o.documents / o.perPage) || 1  

    if (typeof callback === 'function') return callback(null, o);
    return o;
}

/**
 * @param {Schema} schema
 */
module.exports = function (schema) {
    schema.statics.paginate = paginate;
};

module.exports.paginate = paginate;
