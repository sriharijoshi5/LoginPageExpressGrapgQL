const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
module.exports = {

    createUser: async args => {
        const existingUser = await User.findOne({ email: args.userInput.email })
        try {
            if (existingUser) {
                throw new Error('User exists already')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);


            const user = new User({
                name: args.userInput.name,
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = user.save();
            return { ...result._doc, password: null, _id: (await result).id }
        }
        catch (err) {
            throw err;
        }

    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if( !user ){
            throw new Error('User does not exist!')
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('Password is incorrect');
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey',{
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1 }
    }
};

