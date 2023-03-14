const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    bio: String,
    email: String,
    password: String,
    userImage:  String,
    gitLink: String,
    linkedIn: String,
    instagram: String,
    twitter: String,
    externalSite: String,
})

module.exports = mongoose.model('User', userSchema)