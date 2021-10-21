//handle connection to MongoDB
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TaskManager', {useNewURLParser: true}).then(()=>{
    console.log("Connected to MongoDB");
}).catch((e)=>{
    console.log("Error connected to MongoDB");
    console.log(e);
})


module.exports = {
    mongoose
};