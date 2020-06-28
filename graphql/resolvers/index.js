const File = require('../../models/file');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const files = fileIds => {
    return File.find({ _id: { $in: fileIds }})
    .then(files => {
        return files.map(file =>
            {
                return  { ...file._doc,
                    _id: file.id,
                 uploaderr: user.bind(this, file.uploaderr) }} );
    })
    .catch(err => {
        throw err;
    })
}
const user = userId => {
    return User.findById(userId)
    .then(user =>{
        return { ...user._doc, _id:user.id,
             uploadedFiles: files.bind(this,user._doc.uploadedFiles) }
    }
        )
    .catch(err =>{ throw console.error();
    })
}
module.exports =  {
    files: () => {
        return File.find()
            .then(files => {
                return files.map(file => {
                    return {
                        ...file._doc,
                        _id: file.id,
                        uploaderr: user.bind(this, file._doc.uploaderr)
                    }
                })
            }).catch(err => {
                throw err;
            });
    },
    createFile: (args) => {
        const file = new File({
            name: args.fileInput.name,
            uploaderr: '5ef8f34a216839a9e444e113'
        });
        let uploadedFile;
        return file
            .save()
            .then(result => {
                uploadedFile = { ...result._doc, _id: result._doc._id.toString(),
                     uploaderr: user.bind(this, result._doc.uploaderr) };
                return User.findById('5ef8f34a216839a9e444e113')
            }
            ).then(user => {    
                if (!user) {
                    throw new Error('User not found')
                }
                console.log(file)
                user.uploadedFiles.push(file)
                return user.save();
            }).then(result => {
                return uploadedFile;
            }).catch(err => {
                console.log(err);
                throw err;
            })
    },
    createUser: args => {
        return User.findOne({ email: args.userInput.email })
            .then(user => {
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
}