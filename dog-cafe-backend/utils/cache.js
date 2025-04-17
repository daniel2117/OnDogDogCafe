const NodeCache = require('node-cache');
const cache = new NodeCache({ 
    stdTTL: process.env.CACHE_TTL || 600,
    checkperiod: 120,
    useClones: false
});

module.exports = {
    async set(key, value, ttl) {
        return cache.set(key, value, ttl);
    },
    
    async get(key) {
        return cache.get(key);
    },
    
    async del(key) {
        return cache.del(key);
    },
    
    // Add new methods
    async flush() {
        return cache.flushAll();
    },
    
    async stats() {
        return cache.getStats();
    },
    
    async keys() {
        return cache.keys();
    },
    
    async has(key) {
        return cache.has(key);
    }
};