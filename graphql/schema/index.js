const { buildSchema } = require('graphql');

module.exports =  buildSchema(`


type User {
    _id: ID!
    email: String!
    password: String
    uploadedFiles: [File!]
}

type File {
    _id: ID
    name: String!
    uploader: User!

}


type RootQuery {
    files: [File!]!
    login(email: String!, password: String!): AuthData!
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
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