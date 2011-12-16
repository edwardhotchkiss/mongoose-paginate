
/*!
  Core Modules
 */

var vows = require('vows'),
    assert = require('assert'),
    paginate = require('../lib/mongoose-paginate');

/*!
  Vows
 */

vows.describe('pagination module basic test')

.addBatch({
  'when requiring `mongoose-paginate`':{
    topic:function(){
      return paginate;
    },
    'there should be no errors and paginate should be an object':function(topic){
      assert.equal(typeof(topic), 'object');
    }
  }
})

.export(module);

/* EOF */