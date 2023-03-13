const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    imageUrl: String,
    siteUrl: String,
    creationDate: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // user_id: mongoose.Schema.Types.ObjectId
    author: String
})

// module.exports = mongoose.model('Portfolios', portfolioSchema)
module.exports = mongoose.model('Portfolio', portfolioSchema)