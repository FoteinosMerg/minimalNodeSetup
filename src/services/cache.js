"use strict"
const mongoose = require('mongoose');
const redis = require('redis');
const client = redis.createClient('redis://127.0.0.1:6379');
const util = require('util');
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options={}) {
  this._cache = true;
  this._hashKey = JSON.stringify(options.key || '')
  return this; // Facilitates chainability
}

// Overwrite prototype execution taken from mongoose
mongoose.Query.prototype.exec = async function() {

  if (!this._cache) {
    // Ignore cache controls and run original mongoose function
    return exec.apply(this, arguments);
  }

  // Construct unique and consistent key
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));

  // Detect possible value for the above key inside Redis cache
  const cacheValue = await client.hget(this._hashKey, key);

  // If cached, return it
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  // Otherwise forward query to MongoDB and then store in Redis cache
  const result = await exec.apply(this, arguments);
  client.hset(this._hashKey, key, JSON.stringify(result), 'EX', 10);

  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  }
};
