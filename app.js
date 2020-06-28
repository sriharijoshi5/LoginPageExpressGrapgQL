const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const app = express();

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')


app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue:graphQlResolvers,
    graphiql: true
}))
let dbUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-fxvvx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then((result) => {
    app.listen(3000);
    console.log('Server is up and running')
    return result;
}).catch(err => {
    console.log(err);
    throw err;
})