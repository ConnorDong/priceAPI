const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        minlength: 1, 
        trim: true
    },
    // with auth
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Folder = mongoose.model('List', FolderSchema)

module.exports = {Folder}