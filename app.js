const express = require('express');
const app = express();
const mongoose = require('./db/mongoose').mongoose

const bodyParser = require('body-parser');

//load mongoose models
const {Folder, Coin } = require('./db/models')
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

//MiddleWARE



//load middleware
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, OPTIONS, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header(
      'Access-Control-Expose-Headers', 
      'x-access-token, x-refresh-token'
    );
    next();
  });



//MiddleWARE end
const defaultController = require("./controllers/default-controller").router;  
const folderController = require("./controllers/folder-controller");  
const coinController = require('./controllers/coin-controller').router;
const userController = require('./controllers/user-controller').router;
app.use("/api", defaultController)
app.use('/api', folderController)
app.use('/api', coinController)
app.use('/users', userController)

app.listen(3000, () =>{
    console.log("Server is listening on port 3000");
})