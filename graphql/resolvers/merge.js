const File= require('../../models/file')
const User = require('../../models/user')

const transformFile = file => {
    return {
        ...file._doc,
        _id: file.id,
        uploader: user.bind(this, file.uploader)};
}

const files = async fileIds => {
    try {
        const files = await File.find({ _id: { $in: fileIds } });

        return files.map(file => {
            return transformFile(file);
        });
    }
    catch (err) {
        console.log(err)
        throw err;
    }
}
const user = async userId => {
    try {
        const user = await User.findById(userId)

        return {
            ...user._doc,
            _id: user.id,
            uploadedFiles: files.bind(this, user._doc.uploadedFiles)
        }


    }
    catch (err) { throw err; }
}

exports.transformFile = transformFile;
// exports.user = user;
// exports.files = files;