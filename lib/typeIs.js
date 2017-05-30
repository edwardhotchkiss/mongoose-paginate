'use strict';
module.exports = function typeIs(any) {
  const mathReg = /^\[object ([A-Za-z]+)\]$/g;
  return Object.prototype.toString.call(any).replace(/^\[object ([A-Za-z]+)\]$/, '$1')
}
