const expect = require('chai').expect;
const leanWithId = require('../lib/leanWithId');
const typeIs = require('../lib/typeIs');

describe('lib/leanWithId', function() {
  const arrayDocs = [{
    _id: 'id_1',
    title: 'test1',
    content: 'test1',
    classify: {
      _id: 'classify_1',
      title: 'test_classify_1'
    },
    label: [{
      _id: 'label_1',
      title: 'test_label_1'
    }, {
      _id: 'label_2',
      title: 'test_label_2'
    }]
  },{
    _id: 'id_2',
    title: 'test2',
    content: 'test2',
    classify: {
      _id: 'classify_1',
      title: 'test_classify_1'
    },
    label: [{
      _id: 'label_1',
      title: 'test_label_1'
    }, {
      _id: 'label_2',
      title: 'test_label_2'
    }]
  },{
    _id: 'id_3',
    title: 'test3',
    content: 'test3',
    classify: {
      _id: 'classify_1',
      title: 'test_classify_1'
    },
    label: [{
      _id: 'label_1',
      title: 'test_label_1'
    }, {
      _id: 'label_2',
      title: 'test_label_2'
    }]
  }];

  it('return array', function () {
    const doc = leanWithId(arrayDocs);
    expect(typeIs(doc)).to.equal('Array');
  });

  it('return object', function () {
    const doc = leanWithId(arrayDocs[0]);
    expect(typeIs(doc)).to.equal('Object');
  });

  it('docs is lean whit id', function () {
    const doc = leanWithId(arrayDocs);
    expect(doc[0].id).to.equal(doc[0]._id);
  });

  it('object are not lean whit id', function () {
    const doc = leanWithId(arrayDocs);
    expect(doc[0].classify).to.not.have.property('id');
  });

  it('array are not lean whit id', function () {
    const doc = leanWithId(arrayDocs);
    expect(doc[0].label[0]).to.not.have.property('id');
  });

  it('deep=true deep obj are lean whit id', function () {
    const doc = leanWithId(arrayDocs, true);
    expect(doc[0].classify.id).to.equal(String(doc[0].classify._id));
  });

  it('deep=true deep array are lean whit id', function () {
    const doc = leanWithId(arrayDocs, true);
    expect(doc[0].label[0].id).to.equal(String(doc[0].label[0]._id));
  });

});
