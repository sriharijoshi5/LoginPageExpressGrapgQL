const File = require('../../models/file');
const { transformFile } = require('./merge')
const User = require('../../models/user')

module.exports = {
    files: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated')
        }
        try {
            const files = await File.find()

            return files.map(file => {
                return transformFile(file);
            })
        } catch (err) {
            console.log(err)
            throw err;
        };

    },
    createFile: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated')
        }
        const file = new File({
            name: args.fileInput.name,
            uploader: req.userId

        });
        let uploadedFile;
        try {
            const result = await file.save();

            uploadedFile = transformFile(result);
            const uploader = await User.findById(req.userId)
            if (!uploader) {
                throw new Error('User not found')
            }

            uploader.uploadedFiles.push(file)
            await uploader.save();


            return uploadedFile;
        } catch (err) {
            console.log(err);
            console.log(err)
            throw err;
        }
    },
};

