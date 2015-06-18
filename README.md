
# mongoose-paginate [![Build Status](https://secure.travis-ci.org/edwardhotchkiss/mongoose-paginate.png)](http://travis-ci.org/edwardhotchkiss/mongoose-paginate) [![Git Tip](http://img.shields.io/gittip/edwardhotchkiss.svg)](https://www.gittip.com/edwardhotchkiss/)

> Mongoose ORM (NodeJS/MongoDB) Document Query Pagination

To be used in combination with view pagination middleware such as [express-paginate](https://github.com/niftylettuce/express-paginate).

## Installation

```bash
npm install -S mongoose-paginate
```

## Usage

#### Basic

```js

/*
 * basic example usage of `mongoose-pagination`
 * querying for `all` {} items in `MyModel`
 * paginating by second page, 10 items per page (10 results, page 2)
 */

var mongoosePaginate = require('mongoose-paginate');

MyModel.plugin(mongoosePaginate)

MyModel.paginate({}, 2, 10, function(error, pageCount, paginatedResults, itemCount) {
  if (error) {
    console.error(error);
  } else {
  	console.log('Pages:', pageCount);
    console.log(paginatedResults);
  }
});

```

#### Advanced

```js

/*
 * advanced example usage of `mongoose-pagination`
 * querying for `{ columns: 'title', { populate: 'some_ref' }, { sortBy : { title : -1 } }` items in `MyModel`
 * paginating by second page, 10 items per page (10 results, page 2)
 */

var mongoosePaginate = require('mongoose-paginate');

MyModel.plugin(mongoosePaginate)

MyModel.paginate({}, 2, 10, function(error, pageCount, paginatedResults, itemCount) {
  if (error) {
    console.error(error);
  } else {
    console.log('Pages:', pageCount);
    console.log(paginatedResults);
  }
}, { columns: 'title', populate: 'some_ref', sortBy : { title : -1 });

/*
 * Populating more than one ref
 */
 
 MyModel.paginate({}, 2, 10, function(error, pageCount, paginatedResults, itemCount) {
  if (error) {
    console.error(error);
  } else {
    console.log('Pages:', pageCount);
    console.log(paginatedResults);
  }
}, { columns: 'title', populate: ['some_ref', 'other_ref'], sortBy : { title : -1 });

/* 
 * Selecting specific field for population (http://mongoosejs.com/docs/api.html#query_Query-populate)
 */
 
 MyModel.paginate({}, 2, 10, function(error, pageCount, paginatedResults, itemCount) {
  if (error) {
    console.error(error);
  } else {
    console.log('Pages:', pageCount);
    console.log(paginatedResults);
  }
}, { columns: 'title', populate: [{ path: 'some_ref', select: 'field_a field_b' }, 'other_ref' ], sortBy : { title : -1 });

```

## Run Tests

``` bash
$ npm test
```

### Author: [Edward Hotchkiss][0]

[0]: http://edwardhotchkiss.com/


### Contributors

* [Nick Baugh](https://github.com/niftylettuce)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/edwardhotchkiss/mongoose-paginate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

