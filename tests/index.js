'use strict';

let mongoose = require('mongoose');
let expect = require('chai').expect;
let mongoosePaginate = require('../index');

let MONGO_URI = 'mongodb://127.0.0.1/mongoose_paginate_test';

let AuthorSchema = new mongoose.Schema({ name: String });
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

describe('mongoose-paginate', () => {

  before((done) => {
    mongoose.connect(MONGO_URI, done);
  });

  before((done) => {
    mongoose.connection.db.dropDatabase(done);
  });

  before(() => {
    let book, books = [];
    let date = new Date();
    return Author.create({ name: 'Arthur Conan Doyle' }).then((author) => {
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

  it('returns promise', () => {
    let promise = Book.paginate();
    expect(promise.then).to.be.an.instanceof(Function);
  });

  it('calls callback', (done) => {
    Book.paginate({}, {}, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an.instanceOf(Object);
      done();
    }, (error) => {
      expect(error).to.be.undefined;
    });
  });

  describe('paginates', () => {
    it('with criteria', () => {
      return Book.paginate({ title: 'Book #10' }).then((result) => {
        expect(result.docs).to.have.length(1);
        expect(result.docs[0].title).to.equal('Book #10');
      }, (error) => {
        expect(error).to.be.undefined;
      });
    });
    it('with default options (page=1, limit=10, lean=false)', () => {
      return Book.paginate().then((result) => {
        expect(result.docs).to.have.length(10);
        expect(result.docs[0]).to.be.an.instanceof(mongoose.Document);
        expect(result.total).to.equal(100);
        expect(result.limit).to.equal(10);
        expect(result.page).to.equal(1);
        expect(result.offset).to.equal(0);
      }, (error) => {
        expect(error).to.be.undefined;
      });
    });
    it('with custom default options', () => {
      mongoosePaginate.paginate.options = {
        limit: 20,
        lean: true
      };
      return Book.paginate().then((result) => {
        expect(result.docs).to.have.length(20);
        expect(result.limit).to.equal(20);
        expect(result.docs[0]).to.not.be.an.instanceof(mongoose.Document);
        delete mongoosePaginate.paginate.options;
      }, (error) => {
        expect(error).to.be.undefined;
      });
    });
    it('with offset and limit', () => {
      return Book.paginate({}, { offset: 30, limit: 20 }).then((result) => {
        expect(result.docs).to.have.length(20);
        expect(result.total).to.equal(100);
        expect(result.limit).to.equal(20);
        expect(result.offset).to.equal(30);
        expect(result).to.not.have.property('page');
        expect(result).to.not.have.property('pages');
      }, (error) => {
        expect(error).to.be.undefined;
      });
    });
    it('with page and limit', () => {
      return Book.paginate({}, { page: 1, limit: 20 }).then((result) => {
        expect(result.docs).to.have.length(20);
        expect(result.total).to.equal(100);
        expect(result.limit).to.equal(20);
        expect(result.page).to.equal(1);
        expect(result.pages).to.equal(5);
        expect(result).to.not.have.property('offset');
      }, (error) => {
        expect(error).to.be.undefined;
      });
    });
    it('with zero limit', () => {
      return Book.paginate({}, { page: 1, limit: 0 }).then((result) => {
        expect(result.docs).to.have.length(0);
        expect(result.total).to.equal(100);
        expect(result.limit).to.equal(0);
        expect(result.page).to.equal(1);
        expect(result.pages).to.equal(Infinity);
      });
    });
    it('with select', () => {
      return Book.paginate({}, { select: 'title' }).then((result) => {
        expect(result.docs[0].title).to.exist;
        expect(result.docs[0].date).to.not.exist;
      }, (error) => {
        expect(error).to.be.undefined;
      });
    });
    it('with sort', () => {
      return Book.paginate({}, { sort: { date: -1 } }).then((result) => {
        expect(result.docs[0].title).to.equal('Book #100');
      }, (error) => {
        expect(error).to.be.undefined;
      });
    });
    it('with populate', () => {
      return Book.paginate({}, { populate: 'author' }).then((result) => {
        expect(result.docs[0].author.name).to.equal('Arthur Conan Doyle');
      }, (error) => {
        expect(error).to.be.undefined;
      });
    });
    describe('with lean', () => {
      it('with default leanWithId=true', () => {
        return Book.paginate({}, { lean: true, leanWithId: true }).then((result) => {
          expect(result.docs[0]).to.not.be.an.instanceof(mongoose.Document);
          expect(result.docs[0].id).to.equal(String(result.docs[0]._id));
        }, (error) => {
          expect(error).to.be.undefined;
        });
      });
      it('with lean without leanWithId', () => {
        return Book.paginate({}, { 
          lean: true
        }).then((result) => {
          expect(result.docs).to.not.be.an.instanceof(mongoose.Document);
          expect(result.docs).to.not.have.property('id');
        }, (error) => {
          expect(error).to.be.undefined;
        });
      });
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(done);
  });

  after((done) => {
    mongoose.disconnect(done);
  });

});
