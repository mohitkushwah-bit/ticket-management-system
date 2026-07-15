'use strict';

const path = require('path');

// Use mime 1.x (Express/send) and add getType for superagent.
const mime = require(path.join(__dirname, '..', 'node_modules', 'mime', 'mime.js'));

if (typeof mime.getType !== 'function') {
  mime.getType = function getType(type) {
    const value = String(type);
    const ext = value.includes('/') ? value : value.replace(/^.*[/\\]/, '').toLowerCase();
    const result = mime.lookup(ext);
    if (!result || result === mime.default_type) {
      return mime.types[ext] || null;
    }
    return result;
  };
}

module.exports = mime;
