const NodeCache = require('node-cache');
const cache = new NodeCache();

module.exports = {
    async set(key, value, ttl) {
        return cache.set(key, value, ttl);
    },
    async get(key) {
        return cache.get(key);
    },
    async del(key) {
        return cache.del(key);
    }
};