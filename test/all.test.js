'use strict';

var vows = require('vows');
var assert = require('chai').assert;
var mongoose = require('mongoose');
var mongoosePaginate = require('../lib/mongoose-paginate');

// connect to MongoDB with Mongoose
mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost/mongoose_paginate_test');

// test setup
var testEntriesCollectionName = 'mongoosePaginateTestEntries';
var testEntriesSubCollectionName = 'mongoosePaginateTestSubEntries';

var TestSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  title: String,
  date: Date,
  child: {
    type: mongoose.Schema.ObjectId,
    ref: testEntriesSubCollectionName
  }
});

TestSchema.plugin(mongoosePaginate);

var TestEntry = mongoose.model(testEntriesCollectionName, TestSchema);

var TestSubSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  title: String,
  date: Date
});

TestSubSchema.plugin(mongoosePaginate);

var TestSubEntry = mongoose.model(testEntriesSubCollectionName, TestSubSchema);

function setup(callback) {
  var newSubEntry = new TestSubEntry({
    title: 'SubItem #1'
  });
  newSubEntry.save(function(err) {
    if (err) return callback(err);
    var testEntries = [];
    for (var i=1; i<=100;i++) {
      var newEntry = new TestEntry({
        title: 'Item #' + i,
        child: newSubEntry._id
      });
      testEntries.push(newEntry);
    }
    TestEntry.create(testEntries, callback);
  });
}

function teardown(callback) {
  mongoose.connection.db.dropDatabase(callback);
}

vows.describe('pagination module basic tests')
  .addBatch({
    'when requiring `mongoose-paginate`':{
      topic: function() {
        return mongoose;
      },
      'there should be no errs and paginate should be an object': function(topic) {
        assert.equal(typeof(topic), 'object');
      }
    }
  })

  .addBatch({
    'teardown the collections before running tests':{
      topic: function() {
        teardown(this.callback);
      }
    }
  })
  .addBatch({
    'when creating 100 dummy documents with our test mongodb string':{
      topic: function() {
        setup(this.callback);
      },
      'there should be no errs and documents.length should be 100': function(err, documents) {
        assert.equal(err, null);
        assert.equal(documents.length, 100);
      }
    }
  })
  .addBatch({
    'when paginating TestEntry querying for all documents, with page 1, 10 results per page':{
      topic: function() {
        TestEntry.paginate({}, { page: 1, limit: 10, columns: 'title' }, this.callback);
      },
      'there should be no errs': function(err, results) {
        assert.equal(err, null);
      },
      'results.length should be 10': function(err, results) {
        assert.equal(results.length, 10);
      },
      'the first result should contain the correct index #(1)': function(err, results) {
        assert.equal(results[0].title, 'Item #1');
      }
    }
  })
  .addBatch({
    'when paginating without page and limit, use default values 1 and 10':{
      topic: function() {
        TestEntry.paginate({}, {}, this.callback);
      },
      'there should be no errs': function(err, results) {
        assert.equal(err, null);
      },
      'results.length should be 10': function(err, results) {
        assert.equal(results.length, 10);
      },
      'the first result should contain the correct index #(1)': function(err, results) {
        assert.equal(results[0].title, 'Item #1');
      }
    }
  })
  .addBatch({
    'when paginating TestEntry querying for all documents, with page 2, 10 results per page':{
      topic: function() {
        TestEntry.paginate({}, { page: 2, limit: 10, columns: 'title' }, this.callback);
      },
      'there should be no errs': function(err, results) {
        assert.equal(err, null);
      },
      'results.length should be 10': function(err, results) {
        assert.equal(results.length, 10);
      },
      'the first result should contain the correct index #(11)': function(err, results) {
        assert.equal(results[0].title, 'Item #11');
      }
    }
  })
  .addBatch({
    'when paginating TestEntry querying for all documents, with page 10, 11 results per page':{
      topic: function() {
        TestEntry.paginate({}, {page: 10, limit: 10,  columns: 'title' }, this.callback);
      },
      'there should be no errs': function(err, results) {
        assert.equal(err, null);
      },
      'results.length should be 10': function(err, results) {
        assert.equal(results.length, 10);
      },
      'the first result should contain the correct index #(100)': function(err, results) {
        assert.equal(results[9].title, 'Item #100');
      }
    }
  })
  .addBatch({
    'when paginating TestEntry querying for all documents, with page 2, 10 results per page with populate and without columns':{
      topic: function() {
        TestEntry.paginate({}, {page: 2, limit: 10,  populate: 'child'}, this.callback);
      },
      'there should be no errs': function(err, results) {
        assert.equal(err, null);
      },
      'results.length should be 10': function(err, results) {
        assert.equal(results.length, 10);
      },
      'the first result should contain the correct index #(11)': function(err, results) {
        assert.equal(results[0].title, 'Item #11');
      },
      'the first result should contain the correct SubItem #(1)': function(err, results) {
        assert.equal(results[0].child.title, 'SubItem #1');
      }
    }
  })
  .addBatch({
    'when paginating TestEntry querying for all documents, with page 1, 10 results per page, sorting reverse by title':{
      topic: function() {
        TestEntry.paginate(
          {},
          {
            page: 1,
            limit: 10,
            sortBy: {
              title: -1
            }
          },
          this.callback
        );
      },
      'there should be no errs': function(err, results, pageCount, itemCount) {
        assert.equal(err, null);
      },
      'results.length should be 10': function(err, results, pageCount, itemCount) {
        assert.equal(results.length, 10);
      },
      'the first result should contain the correct index #(99)': function(err, results, pageCount, itemCount) {
        assert.equal(results[0].title, 'Item #99');
      }
    }
  })
  .addBatch({
    'when deleting all of our 100 dummy documents with our test mongodb string':{
      topic: function() {
        teardown(this.callback);
      },
      'there should be no errs': function(dropped) {
        assert.strictEqual(dropped, true);
      }
    }
  })
  .export(module);
