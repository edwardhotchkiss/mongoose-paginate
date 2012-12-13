
# mongoose-paginate - [![Build Status](https://secure.travis-ci.org/edwardhotchkiss/mongoose-paginate.png)](http://travis-ci.org/edwardhotchkiss/mongoose-paginate)

> Mongoose ORM (NodeJS/MongoDB) Document Query Pagination

## Installation

```bash
$ npm install mongoose-paginate
```

## Usage 

```javascript

/**
 * basic example usage of `mongoose-pagination`
 * querying for `all` {} items in `MyModel`
 * paginating by second page, 10 items per page (10 results, page 2)
 **/

var paginate = require('mongoose-paginate');

MyModel.paginate({}, 2, 10, function(error, pageCount, paginatedResults) {
  if (error) {
    console.error(error);
  } else {
  	console.log('Pages:', pageCount);
    console.log(paginatedResults);
  }
}

/* EOF */

```

## Run Tests

``` bash
$ npm test
```

### Author: [Edward Hotchkiss][0]

[0]: http://edwardhotchkiss.com/
