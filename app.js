const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const app = express();
const File = require('./models/file');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

app.use(bodyParser.json());


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
    type File {
        _id: ID
        name: String!
        uploader: User!
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
    `),
    rootValue: {
        files: () => {
            return File.find().populate('uploader').
            then(files => {
                return files.map(file => {
                return {
                    ...file._doc,
                    _id: file.id,
                    uploader: {
                        ...file._doc.uploader._doc, password: null
                    }
                }
            })}).catch(err => {
                throw err;
            });
        },
        createFile: (args) => {
            const file = new File({
                name: args.fileInput.name,
                uploader: '5ef854a91a531dba10309256'
            });
            let uploadedFile;
            return file
                .save()
                .then(result => {
                    uploadedFile =   { ...result._doc, _id: result._doc._id.toString() };;
                    return User.findById('5ef854a91a531dba10309256')
                    console.log(result);
                }
                ).then(user=>{
                    if (!user) {
                        throw new Error('User not found')
                    }
                    user.uploadedFiles.push(file)
                    return user.save();
                }).then(result=>{
                    return uploadedFile;
                }).catch(err => {
                    console.log(err);
                    throw err;
                })
        },
        createUser: args => {
            return User.findOne({ email: args.userInput.email })
            .then(user =>{
                if (user) {
                    throw new Error('User exists already')
                }
            return bcrypt.hash(args.userInput.password, 12);
            })
            .then(
                hashedPassword => {
                    const user = new User({
                        name: args.userInput.name,
                        email: args.userInput.email,
                        password: hashedPassword
                    })
                    return user.save();
                }
            ).then(result => {
                return { ...result._doc, password: null, _id: result.id }
            })
                .catch(err => {
                    throw err;
                }
                );

        }
    },
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