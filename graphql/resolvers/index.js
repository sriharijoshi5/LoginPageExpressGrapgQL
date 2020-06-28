const File = require('../../models/file');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const files = fileIds => {

    return File.find({ _id: {$in: fileIds}}).then(
                files =>
                {
                    return files.map( file =>
                   { return { ...file._doc, 
                        _id: file.id, 
                        uploader: user.bind(this, file.uploader) }}
                    )}
    ).catch(
        err =>
        {
            console.log(err)
            throw err;
        }
    )
}
const user = userId =>{
    return User.findById(userId).then(
        user => {
            return { ...user._doc, _id: user.id,
                uploadedFiles: files.bind(this, user._doc.uploadedFiles) }
        }
    ).catch(err =>{ throw err;})
}

module.exports = {
        files: () => {
        return File.find()
        .then(files => {
            return files.map(file => {
            return {
                ...file._doc,
                _id: file.id,
                uploader: user.bind(this, file._doc.uploader)
            }
        })}).catch(err => {
            throw err;
        });

    },
    createFile: (args) => {
        const file = new File({
            name: args.fileInput.name,

            uploader: '5ef901a7631cdd87e40b2fe5'

        });
        let uploadedFile;
        return file
            .save()
            .then(result => {

                uploadedFile =   { ...result._doc,
                     _id: result._doc._id.toString()  };;
                return User.findById('5ef901a7631cdd87e40b2fe5')
            }
            ).then(user=>{
                if (!user) {
                    throw new Error('User not found')
                }
                else
                {user.uploadedFiles.push(file)
                return user.save();}
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
};

