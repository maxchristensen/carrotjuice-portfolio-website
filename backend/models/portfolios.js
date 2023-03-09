const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    imageUrl: String,
    siteUrl: String,
    creationDate: String
})

module.exports = mongoose.model('Portfolios', portfolioSchema)