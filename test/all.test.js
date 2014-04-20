
/*
 * @list dependencies
 */

var vows, assert, mongoose, paginate;

vows = require('vows');
assert = require('assert');
mongoose = require('mongoose');
paginate = require('../lib/mongoose-paginate');

/*
 * connect to MongoDB with Mongoose
 */

mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost/test');

/*
 * @tests setup
 */

var TestSchema = new mongoose.Schema({
  id    : mongoose.Schema.ObjectId,
  title : String, 
  date  : Date,
  child : { type: mongoose.Schema.ObjectId, ref: 'TestSubEntries' }
});

var TestEntry = mongoose.model('TestEntries', TestSchema);

var TestSubSchema = new mongoose.Schema({
  id    : mongoose.Schema.ObjectId,
  title : String, 
  date  : Date
});

var TestSubEntry = mongoose.model('TestSubEntries', TestSubSchema);

function setup(callback) {
  var newSubEntry = new TestSubEntry({
    title: 'SubItem #1',
  });
  newSubEntry.save(function(error, subEntry) {
    var complete = 0;
    for (var i = 1; i < 101; i++) {
      var newEntry = new TestEntry({
        title : 'Item #'+i,
        child : subEntry._id,
      });
      newEntry.save(function(error, result) {
        if (error) {
          console.error(error);
        } else {
          complete++;
          if (complete === 100) {
            callback(null, 100);
          }
        }
      });
    }
  });
}

/*
 * teardown
 */

function teardown(callback){
  TestSubEntry.remove({}, function(error) {
    if (error) {
      callback(error, null);
    } else {
      var complete = 0;
      TestEntry.find({}, function(error, results) {
        if (error) {
          callback(error, null);
        } else {
          for (result in results) {
            results[result].remove(function(error) {
              if (error) {
                callback(error, null);
              } else {
                complete++;
                if (complete === 100) {
                  callback(null, 100);
                }
              }
            });
          }
        }
      });
    }
  });
};

/*
 * @tests vows
 */

vows.describe('pagination module basic test').addBatch({
  'when requiring `mongoose-paginate`':{
    topic:function(){
      return paginate;
    },
    'there should be no errors and paginate should be an object':function(topic) {
      assert.equal(typeof(topic), 'object');
    }
  }
})

.addBatch({
  'when creating 100 dummy documents with our test mongodb string':{
    topic:function(){
      setup(this.callback);
    },
    'there should be no errors and resultCount should be 100':function(error, resultCount) {
      assert.equal(error, null);
      assert.equal(resultCount, 100);
    }
  }
})

.addBatch({
  'when paginating TestEntry querying for all documents, with page 1, 10 results per page':{
    topic:function(){
      TestEntry.paginate({}, 1, 10, this.callback, { columns: 'title' });
    },
    'there should be no errors':function(error, pageCount, results) {
      assert.equal(error, null);
    },
    'results.length should be 10':function(error, pageCount, results) {
      assert.equal(results.length, 10);
    },
    'the first result should contain the correct index #(1)':function(error, pageCount, results) {
      assert.equal(results[0].title, 'Item #1');
    }
  }
})

.addBatch({
  'when paginating TestEntry querying for all documents, with page 2, 10 results per page':{
    topic:function(){
      TestEntry.paginate({}, 2, 10, this.callback, { columns: 'title' });
    },
    'there should be no errors':function(error, pageCount, results) {
      assert.equal(error, null);
    },
    'results.length should be 10':function(error, pageCount, results) {
      assert.equal(results.length, 10);
    },
    'the first result should contain the correct index #(11)':function(error, pageCount, results) {
      assert.equal(results[0].title, 'Item #11');
    }
  }
})

.addBatch({
  'when paginating TestEntry querying for all documents, with page 10, 11 results per page':{
    topic:function(){
      TestEntry.paginate({}, 10, 10, this.callback, { columns: 'title' });
    },
    'there should be no errors':function(error, pageCount, results) {
      assert.equal(error, null);
    },
    'results.length should be 10':function(error, pageCount, results) {
      assert.equal(results.length, 10);
    },
    'the first result should contain the correct index #(100)':function(error, pageCount, results) {
      assert.equal(results[9].title, 'Item #100');
    }
  }
})

.addBatch({
  'when paginating TestEntry querying for all documents, with page 2, 10 results per page with populate and without columns':{
    topic:function(){
      TestEntry.paginate({}, 2, 10, this.callback, { populate: 'child' });
    },
    'there should be no errors':function(error, pageCount, results) {
      assert.equal(error, null);
    },
    'results.length should be 10':function(error, pageCount, results) {
      assert.equal(results.length, 10);
    },
    'the first result should contain the correct index #(11)':function(error, pageCount, results) {
      assert.equal(results[0].title, 'Item #11');
    },
    'the first result should contain the correct SubItem #(1)':function(error, pageCount, results) {
      assert.equal(results[0].child.title, 'SubItem #1');
    }
  }
})

.addBatch({
  'when deleting all of our 100 dummy documents with our test mongodb string':{
    topic:function(){
      teardown(this.callback);
    },
    'there should be no errors and resultCount should be a number':function(error, resultCount) {
      assert.equal(error, null);
      assert.equal(resultCount, 100);
    }
  }
})

.export(module);
