
# mongoose-paginate

[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads]][npm-url]
[![Circle CI][circleci-image]][circleci-url]
[![Static Analysis][codeclimate-image]][codeclimate-url]
[![MIT License][license-image]][license-url]
[![Slack][slack-image]][slack-url]

> `mongoose-paginate` is a plugin for [Mongoose][mongoose] schemas to easily add paginated queries and results.  This plugin is to be used in combination with view pagination middleware such as [express-paginate](https://github.com/niftylettuce/express-paginate).


## Index

* [Install](#install)
* [Usage](#usage)
* [Contributors](#contributors)
* [License](#license)


## Install

```bash
npm install -S mongoose-paginate
```


## Usage

This plugin must first be added to a schema:

```js

var mongoosePaginate = require('mongoose-paginate');

MySchema.plugin(mongoosePaginate);

```

`MySchema` will have a new function called `paginate` (e.g. `MySchema.paginate()`).

### MySchema.paginate(query, options, callback)

**Arguments**

* `query` - An object for the [Mongoose][mongoose] query.
* `options` - An object with options for the [Mongoose][mongoose] query, such as sorting and population
  - `page` - Default: `1`
  - `limit` - Default: `10`
  - `columns` - Default: `null`
  - `sortBy` - Default: `null`
  - `populate` - Default: `null`
* `callback(err, results, pageCount, itemCount)` - A callback which is called once pagination results are retrieved, or when an error has occurred.

**Examples**

```js

// basic example usage of `mongoose-pagination`
// querying for `all` {} items in `MySchema`
// paginating by second page, 10 items per page (10 results, page 2)

var mongoosePaginate = require('mongoose-paginate');

MySchema.plugin(mongoosePaginate);

MySchema.paginate({}, {
  page: 2, limit: 10
}, callback);

```

```js

// advanced example usage of `mongoose-pagination`
// querying for `{ columns: 'title', { populate: 'some_ref' }, { sortBy : { title : -1 } }` items in `MySchema`
// paginating by second page, 10 items per page (10 results, page 2)

MySchema.paginate(
  {},
  {
    page: 2,
    limit: 10,
    columns: 'title',
    populate: 'some_ref',
    sortBy: {
      title: -1
    }
  },
  callback
);

```

```js

// populating more than one ref

MySchema.paginate({}, {
  page: 2,
  limit: 10,
  columns: 'title',
  populate: [ 'some_ref', 'other_ref' ],
  sortBy: {
    title: -1
  }
}, callback);

```

```js

// selecting specific field for population
// <http://mongoosejs.com/docs/api.html#query_Query-populate>

MySchema.paginate({}, {
  columns: 'title',
  populate: [
    {
      path: 'some_ref',
      select: 'field_a field_b'
    },
    'other_ref'
  ],
  sortBy: {
    title: -1
  }
}, callback);

```


## Tests

```bash
npm test
```


## Contributors

* Edward Hotchkiss <edwardhotchkiss@me.com>
* Nick Baugh <niftylettuce@gmail.com>
* villesau <ville.saukkonen@sulake.com>
* Danilo Barsotti <danilo.barsotti@musiclize.com>
* t_yamo <t_yamo@unknown-artifacts.info>
* andrew <andrew@andrew-desktop.(none)>
* Alberto Gimeno Brieba <gimenete@gmail.com>
* zhiqingchen <zhiqingchen@anjuke.com>
* Alexander Manzyuk <admsev@gmail.com>
* Gia <anggiaj@users.noreply.github.com>
* Hrvoje Šimić <shime.ferovac@gmail.com>
* Mario Colque <mario@feegos.com>
* Richard van der Dys <rhvanderdys@containerstore.com>
* Yolanda Septiana <yolapopop@gmail.com>
* charles bourasseau <charles.bourasseau@gmail.com>
* giulianoiacobelli <giuliano.iacobelli@gmail.com>


## License

[MIT][license-url]


[mongoose]: http://mongoosejs.com
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
[codeclimate-image]: http://img.shields.io/codeclimate/github/edwardhotchkiss/mongoose-paginate.svg?style=flat
[codeclimate-url]: https://codeclimate.com/github/edwardhotchkiss/mongoose-paginate
[npm-image]: http://img.shields.io/npm/v/mongoose-paginate.svg?style=flat
[npm-url]: https://npmjs.org/package/mongoose-paginate
[npm-downloads]: http://img.shields.io/npm/dm/mongoose-paginate.svg?style=flat
[circleci-image]: https://circleci.com/gh/edwardhotchkiss/mongoose-paginate/tree/master.svg?style=svg
[circleci-url]: https://circleci.com/gh/edwardhotchkiss/mongoose-paginate/tree/master
[slack-url]: http://slack.eskimo.io/
[slack-image]: http://slack.eskimo.io/badge.svg
