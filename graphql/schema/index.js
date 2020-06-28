const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type File {
    _id: ID
    name: String!
    uploaderr: User!
}

type RootQuery {
    files: [File!]!
}

type User {
    _id: ID!
    email: String!
    password: String
    uploadedFiles: [File!]
}

input FileInput {
    name: String!
}

input UserInput {
    name: String!
    email: String!
    password: String!
}

type RootMutation {
    createFile(fileInput: FileInput): File
    createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);