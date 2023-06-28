const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required:[true, 'Email is require'],
        unique: true,
        validate: validator.isEmail,
        match: [/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/, 
            'Please enter a valid email address.'],
    },
    password:{
        type:String,
        required: [true, 'Password is required'],
    },
    name:{
        type: String,
        required: [true, 'Name is require'],
    },
    phone: String,
    location: String,
    resume: String,
    profile_picture: String,
    bio: String,
    created_at: { 
        type: Date, 
        default: Date.now },
    updated_at: { 
        type: Date, 
        default: Date.now }
})
module.exports = mongoose.model('User', userSchema)