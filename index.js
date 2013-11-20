// Generated by CoffeeScript 1.6.3
(function() {
  var async, mongoose;

  mongoose = require('mongoose');

  async = require('async');

  module.exports = function(model, query, itrFunc, options, cb) {
    var q, queue, stream;
    if (typeof options === "function") {
      cb = options;
      options = {};
    }
    q = model.find(query);
    if (options.snapshot) {
      q.snapshot();
    }
    if (options.lean) {
      q.lean();
    }
    stream = q.stream();
    queue = async.queue(itrFunc, options.concurrency || 100);
    queue.saturated = function() {
      return stream.pause();
    };
    queue.empty = function() {
      return stream.resume();
    };
    stream.on('data', function(doc) {
      return queue.push(doc);
    });
    stream.on('error', cb);
    return stream.on('close', function() {
      return async.whilst(function() {
        return queue.length() > 0;
      }, function(done) {
        return setTimeout(done, 1000);
      }, cb);
    });
  };

}).call(this);
