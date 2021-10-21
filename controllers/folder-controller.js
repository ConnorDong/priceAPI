const router = require('express').Router();
const {Folder, Coin} = require('../db/models')
const {authenticate} = require('../middleware');
//get all folders
router.get('/lists', authenticate, (req, res) =>{
    //return all folders that belong to authenticated user
    Folder.find({
    _userId: req.user_id
    }).then((lists)=>{
        res.send(lists);
    });

});
//add folder
router.post('/lists', authenticate, (req, res) =>{
    //new folder
    let title = req.body.title;
    let newFolder = new Folder({
        title, 
        _userId: req.user_id
    })
    newFolder.save().then((folderDoc) => {
        res.send(folderDoc);
    })

})
router.patch('/lists/:id', authenticate, (req, res) =>{
    //update
    Folder.findOneAndUpdate({_id: req.params.id, _userId: req.user_id}, {
        $set: req.body
    }).then(()=>{
        res.sendStatus(200);
    })
})
router.delete('/lists/:id', authenticate, (req, res) =>{
    //delete folder
    Folder.findOneAndRemove({
        _id: req.params.id,
         _userId: req.user_id
    }).then((removedFolderDoc)=>{


        //remove Coins
        //console.log(removedFolderDoc._id);
        deleteCoinsFromFolder(removedFolderDoc._id);
        res.send(removedFolderDoc);
    }).catch((e)=>{
        res.send(e);
    })
})
/* HELPER METHODS */
let deleteCoinsFromFolder = (_listID) => {
    Coin.deleteMany({
        _listID
    }).then(() => {
        console.log("Coins from " + _listID + " were deleted!");
    })
}


module.exports = router;