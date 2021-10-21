const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        minlength: 1, 
        trim: true
    }, 
    _listID: {
        type: mongoose.Types.ObjectId,
        requried: true
    }, 
    completed: {
        type:Boolean,
        default: false
    }, 
    price: {
        type: Number, 
        minlength: 1, 
        trim: true
    }, 
    change: {
        type: Number, 
        minlength: 1, 
        trim: true
    }
})

const Coin = mongoose.model('Coin', CoinSchema)

module.exports = {Coin}