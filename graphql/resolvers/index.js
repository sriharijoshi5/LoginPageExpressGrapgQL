const authResolver = require('./auth')
const fileResolver = require('./files')

const rootResolver = {
    ...authResolver,
    ...fileResolver
}

module.exports = rootResolver;