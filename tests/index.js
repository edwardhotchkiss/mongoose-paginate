'use strict';

let mongoose = require('mongoose');
let expect = require('chai').expect;
let mongoosePaginate = require('../index');

let MONGO_URI = 'mongodb://localhost:27017/mongoose_paginate_test';

const AUTHOR_1 = { name: 'bbb' };
const AUTHOR_2 = { name: 'CCCC' };
const AUTHOR_3 = { name: 'dddd' };
const AUTHOR_4 = { name: 'Arthur Conan Doyle' };

let AuthorSchema = new mongoose.Schema({ name: String });

AuthorSchema.plugin(mongoosePaginate);
let Author = mongoose.model('Author', AuthorSchema);

let BookSchema = new mongoose.Schema({
  title: String,
  date: Date,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'Author'
  }
});

BookSchema.plugin(mongoosePaginate);
let Book = mongoose.model('Book', BookSchema);

describe('mongoose-paginate', function () {

  before(function (done) {
    mongoose.connect(MONGO_URI, done);
  });

  before(function (done) {
    mongoose.connection.db.dropDatabase(done);
  });

  before(function () {
    let book, books = [];
    let date = new Date();
    Author.create([AUTHOR_1, AUTHOR_2, AUTHOR_3]);
    return Author.create(AUTHOR_4).then(function (author) {
      for (let i = 1; i <= 100; i++) {
        book = new Book({
          title: 'Book #' + i,
          date: new Date(date.getTime() + i),
          author: author._id
        });
        books.push(book);
      }
      return Book.create(books);
    });
  });

  afterEach(function () {
    delete mongoosePaginate.paginate.options;
  });

  it('returns promise', function () {
    let promise = Book.paginate();
    expect(promise.then).to.be.an.instanceof(Function);
  });

  it('calls callback', function (done) {
    Book.paginate({}, {}, function (err, result) {
      expect(err).to.be.null;
      expect(result).to.be.an.instanceOf(Object);
      done();
    });
  });

  describe('paginates', function () {
    it('with criteria', function () {
      return Book.paginate({ title: 'Book #10' }).then((result) => {
        expect(result.docs).to.have.length(1);
        expect(result.docs[0].title).to.equal('Book #10');
      });
    });
    it('with default options (page=1, limit=10, lean=false)', function () {
      return Book.paginate().then(function (result) {
        expect(result.docs).to.have.length(10);
        expect(result.docs[0]).to.be.an.instanceof(mongoose.Document);
        expect(result.total).to.equal(100);
        expect(result.limit).to.equal(10);
        expect(result.page).to.equal(1);
        expect(result.pages).to.equal(10);
        expect(result.offset).to.equal(0);
      });
    });
    it('with custom default options', function () {
      mongoosePaginate.paginate.options = {
        limit: 20,
        lean: true
      };
      return Book.paginate().then(function (result) {
        expect(result.docs).to.have.length(20);
        expect(result.limit).to.equal(20);
        expect(result.docs[0]).to.not.be.an.instanceof(mongoose.Document);
      });
    });
    it('with offset and limit', function () {
      return Book.paginate({}, { offset: 30, limit: 20 }).then(function (result) {
        expect(result.docs).to.have.length(20);
        expect(result.total).to.equal(100);
        expect(result.limit).to.equal(20);
        expect(result.offset).to.equal(30);
        expect(result).to.not.have.property('page');
        expect(result).to.not.have.property('pages');
      });
    });
    it('with page and limit', function () {
      return Book.paginate({}, { page: 1, limit: 20 }).then(function (result) {
        expect(result.docs).to.have.length(20);
        expect(result.total).to.equal(100);
        expect(result.limit).to.equal(20);
        expect(result.page).to.equal(1);
        expect(result.pages).to.equal(5);
        expect(result.next).to.equal(2);
        expect(result.prev).to.be.undefined;
        expect(result).to.not.have.property('offset');
      });
    });
    it('on the first page', function () {
      return Book.paginate({}, { page: 1, limit: 20 }).then(function (result) {
        expect(result.next).to.equal(2);
        expect(result).to.not.have.property('prev');
      });
    });
    it('on the last page', function () {
      return Book.paginate({}, { page: 5, limit: 20 }).then(function (result) {
        expect(result.prev).to.equal(4);
        expect(result).to.not.have.property('next');
      });
    });
    it('on the middle page', function () {
      return Book.paginate({}, { page: 3, limit: 20 }).then(function (result) {
        expect(result.prev).to.equal(2);
        expect(result.next).to.equal(4);
      });
    });
    it('with page 1 and limit', function () {
      return Book.paginate({}, { page: 1, limit: 20 }).then(function (result) {
        expect(result.next).to.equal(2);
        expect(result).to.not.have.property('prev');
      });
    });
    it('with zero limit', function () {
      return Book.paginate({}, { page: 1, limit: 0 }).then(function (result) {
        expect(result.docs).to.have.length(0);
        expect(result.total).to.equal(100);
        expect(result.limit).to.equal(0);
        expect(result.page).to.equal(1);
        expect(result.pages).to.equal(Infinity);
      });
    });
    it('with select', function () {
      return Book.paginate({}, { select: 'title' }).then(function (result) {
        expect(result.docs[0].title).to.exist;
        expect(result.docs[0].date).to.not.exist;
      });
    });
    it('with sort', function () {
      return Book.paginate({}, { sort: { date: -1 } }).then(function (result) {
        expect(result.docs[0].title).to.equal('Book #100');
      });
    });
    it('with populate', function () {
      return Book.paginate({}, { populate: 'author' }).then(function (result) {
        expect(result.docs[0].author.name).to.equal('Arthur Conan Doyle');
      });
    });
    it('with sorting & collation', function () {
      return Author.paginate({}, { sort: { name: 1 }, collation: { locale: 'en', strength: 1 } }).then(function (result) {
        expect(result.docs[0].name).to.equal(AUTHOR_4.name);
        expect(result.docs[1].name).to.equal(AUTHOR_1.name);
        expect(result.docs[2].name).to.equal(AUTHOR_2.name);
        expect(result.docs[3].name).to.equal(AUTHOR_3.name);
      });
    });
    describe('with lean', function () {
      it('with default leanWithId=true', function () {
        return Book.paginate({}, { lean: true }).then(function (result) {
          expect(result.docs[0]).to.not.be.an.instanceof(mongoose.Document);
          expect(result.docs[0].id).to.equal(String(result.docs[0]._id));
        });
      });
      it('with leanWithId=false', function () {
        return Book.paginate({}, { lean: true, leanWithId: false }).then(function (result) {
          expect(result.docs[0]).to.not.be.an.instanceof(mongoose.Document);
          expect(result.docs[0]).to.not.have.property('id');
        });
      });
    });
  });

  after(function (done) {
    mongoose.connection.db.dropDatabase(done);
  });

  after(function (done) {
    mongoose.disconnect(done);
  });

});
