const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true,
        minLength: [3, 'Username should be at least 3 characters long!'],
    },
    password: {
        type: String,
        required:  [true, 'Password is required!'],
        min: [4, 'Passwod should be at least 4 characters long!'],
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        minLength: [10, 'Email should be at least 10 characters long!'],
    },
});


userSchema.virtual('repeatPassword')
    .set(function (value) {
        if (this.password !== value) {
            throw new Error('Password missmatch!')
        }
    })

userSchema.pre('save', async function () {
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
});


const User = mongoose.model('User', userSchema);

module.exports = User;


