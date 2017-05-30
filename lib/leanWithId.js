'use strict';
const typeIs = require('./typeIs');

const leanWithId = function (docs, deep) {
  const type = typeIs(docs);
  if (type === 'Array') {
    return docs.map(doc => {
      if (deep) {
        return leanWithId(doc, deep);
      }
      doc.id = String(doc._id);
      return doc;
    });
  } else if (type === 'Object') {
    if (deep) {
      Object.keys(docs).forEach(key => {
        const doc = docs[key];
        const childType = typeIs(doc);
        if (childType === 'Array' || childType === 'Object') {
          docs[key] = leanWithId(doc, deep);
        }
      });
    }
    docs.id = String(docs._id);
    return docs;
  }
  return docs;
};

module.exports = leanWithId;
