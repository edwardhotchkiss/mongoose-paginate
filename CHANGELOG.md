v5.0.0 / 2015-12-07
==================

  * Support only Node.js >= 4.0
  * Support only Mongoose >= 4.0
  * Same resulting object for promise and callback
  * Renamed columns -> select (like in Mongoose)
  * Renamed sortBy -> sort (like in Mongoose)
  * Added offset option
  * Added leanWithId option
  * Zero limit to get only metadata
  * Custom default options
  * Mocha tests
  * Travis CI
  
v4.2.0 / 2015-09-12
==================

  * [minor, whitespace]
  * Merge branch 'tsm91-master'
  * [merge] conflicts resolved, derp
  * Merge pull request #58 from edwardhotchkiss/develop
  * [merge, docs] readme merged and edited
  * [circleci, tests] just master
  * [minor, docs] less intense deprecation message
  * Merge branch 'develop' of github.com:edwardhotchkiss/mongoose-paginate into develop
  * [test, circleci] branches => add develop
  * Merge pull request #57 from edwardhotchkiss/feature/cleanup
  * [docs, license] => .md, remove slack, fix circleci build image
  * [circleci, tests] removed commented out shit
  * [minor, whitespace] removed trailing line
  * allow chaining
  * Update README.md
  * update readme
  * implement alternate promise return
  * update dependecies
  * [test, deps] update vows and chai
  * [package, deps] updated async and mongoose to latest, see issue #50
  * [minor, license] use @niftylettuce real name for copyright
  * [docs, changelog] updated partially to reflect commits w/ tags

v4.0.1 / 2015-08-5
===================

  * Add to README
  * add .lean() option
  * Fixed CircleCI
  * Added note to readme about breaking changes
  * Added string for node version in circle.yml

3.1.0 / 2014-06-12
==================

 * [dist] note @niftylettuce express-paginate
 * Merge pull request #21 from niftylettuce/master
 * Added note for express-paginate

3.0.0 / 2014-06-12
==================

 * [major, dist] use as mongoosejs plugin now
 * [minor] format shit
 * Merge branch 'niftylettuce-master'
 * [pr, merge, minors, travis] use node v0.10.x
 * Converted `mongoose-paginate` to a Mongoose plugin
 * [travis, fix] @travis-ci does not support ^ apparently / older npm module for packages, regress to >= or ~ hmm

2.3.0 / 2014-06-12
==================

 * [ocd]
 * [package, contribs] added @niftylettuce
 * Merge pull request #18 from niftylettuce/master
 * Integrated async, fixed tests for collection removal
 * Update README.md

2.2.0 / 2014-04-29
==================

 * [dist] bump!
 * [docs, sort, advanced] added docs for sort, select
 * [tests, sort] added sortBy test

2.1.0 / 2014-04-21
==================

 * [dist] bump to 2.1.0
 * [tests] total item count arg
 * [minor, format]
 * Merge branch 'master' of github.com:edwardhotchkiss/mongoose-paginate
 * [args, count] pass in
 * [dist] bump!
 * Merge pull request #14 from t-yamo/master
 * add itemCount to usage

2.0.0 / 2014-04-20
==================

 * [fix] now: mongoose = require(mongoose-paginate);, closes issue #12

1.4.0 / 2014-04-20
==================

 * [tests, rename]
 * Merge pull request #13 from t-yamo/master
 * support populate
 * [changelog, dist, version]
 * [tests, minor] added more tests, cleaned up some minor shit
 * Merge pull request #11 from rompetoto/master
 * - Ran JsFormat on code - Removed Unneeded nulls in error callbacks - Added total page count to callback

1.3.0 / 2014-04-07
==================

 * [tests, minor] added more tests, cleaned up some minor shit
 * Merge pull request #11 from rompetoto/master
 * - Ran JsFormat on code - Removed Unneeded nulls in error callbacks - Added total page count to callback

1.2.0 / 2014-01-27
==================

 * [test] elaborate on batch item description
 * [whitespace, license]
 * Merge pull request #8 from danilodeveloper/master
 * test 'entry should be undefined' added
 * assert fixed
 * sort bug fixed
 * added option to return only selected column or columns

1.1.5 / 2012-12-13
==================

  * [deps] mongoose - bump from older 2.7.0 to 3.5.1
  * [deps] bumped vows to latest, 0.7.0

1.1.4 / 2012-12-13
==================

  * [dist] version bump
  * [package] >= 0.8.0
  * [travis, tests] only test master branch
  * [travis, tests] only test 0.8
  * Merge pull request #2 from Pechalka/master
  * fix zero count
  * fix count
  * Merge pull request #1 from colkito/patch-1
  * Update for express 3.0

1.1.3 / 2012-06-26
==================

  * [deps] bump mongoose to 2.7.0
  * [docs] minor
  * [node] dont be a dictator, require 0.6.0+ for new engine
  * [travis] test on 0.6/0.8.0
  * [changelog] updated

0.1.2 / 2012-06-10
==================

  * [docs] description
  * [.gitignore] added
  * [deps] bump mongoose to 2.6.7
  * [node] engine bump
  * [changelog] created, updated

0.1.1 / 2012-03-22
==================

  * [package] bugs
  * [package] homepage
  * [package] contributors
  * [license] 2011-2012
  * [stylize] make it look pretty
  * [node] bump engine req to 0.6.11
  * [deps] bump mongoose to 2.5.13
  * [deps] bump vows to 0.6.2
 