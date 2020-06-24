const express = require('express');
const bodyParser = require('body-parser');
const grphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.listen(3000);
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
    type RootQuery {

    }
    type RootMutation {

    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {}
}))
