// Flags: --expose-internals
'use strict';
const common = require('../common');
const assert = require('assert');
const JSStreamWrap = require('internal/js_stream_socket');
const { Duplex } = require('stream');

process.once('uncaughtException', common.mustCall((err) => {
  assert.strictEqual(err.message, 'exception!');
}));

const socket = new JSStreamWrap(new Duplex({
  read: common.mustNotCall(),
  write: common.mustCall((buffer, data, cb) => {
    throw new Error('exception!');
  })
}));

socket.end('foo');
socket.on('error', common.expectsError({
  type: Error,
  message: 'write EPROTO'
}));
