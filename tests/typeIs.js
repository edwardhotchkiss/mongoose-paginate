const expect = require('chai').expect;
const typeIs = require('../lib/typeIs');

describe('lib/typeIs', function() {

  it('typeIs 123 to equal Number', function () {
    expect(typeIs(123)).to.equal('Number');
  });
  it('typeIs "123" to equal String', function () {
    expect(typeIs("123")).to.equal('String');
  })
  it('typeIs ["123", 123] to equal Array', function () {
    expect(typeIs(["123", 123])).to.equal('Array');
  })
  it('typeIs true to equal Boolean', function () {
    expect(typeIs(true)).to.equal('Boolean');
  })
  it('typeIs undefined to equal undefined', function () {
    expect(typeIs(undefined)).to.equal('Undefined');
  })
  it('typeIs null to equal null', function () {
    expect(typeIs(null)).to.equal('Null');
  })
  it('typeIs { a: 123 } to equal Object', function () {
    expect(typeIs({ a: 123 })).to.equal('Object');
  })
});
