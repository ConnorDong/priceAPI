const router = require('express').Router();
const rp = require('request-promise');
const { reject } = require('lodash');
const {Folder} = require('../db/models')
const {Coin} = require('../db/models');
const { authenticate } = require('../middleware');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

const notFound = "Coin Not Found";
async function coinGeckoAPIprices(coins) {
    let data = await CoinGeckoClient.simple.price({
        ids: coins,
        vs_currencies: ['usd'],
        include_24hr_change: true
    });
    return data;
}
async function coinGeckoAPIcheckexists(name) {
    let data = await CoinGeckoClient.simple.price({
        ids: [name],
        vs_currencies: ['usd'],
        include_24hr_change: true
    });
    return data;
}

async function validateCoin(coin) {
    let coinInfo = await coinGeckoAPIcheckexists(coin);
    if(Object.keys(coinInfo.data).length != 0) {
        console.log("coin exists: "+ coin);
        return coinInfo;
        //return Promise.resolve({then: function(onFulfill, onReject) { onFulfill('fulFilled'); }});
    } else {
        console.log("coin does NOT Exist: " + coin)
        return notFound;
    }
}
router.get('/lists/:listID/coins', authenticate, async (req, res) => {
    // return all coins with a specific list
    let coins = await Coin.find({
        _listID : req.params.listID
    })
    let arr = [];
    for(let i = 0; i < coins.length; i++) {
        arr.push(coins[i].title);
    }
    let coinprices = await coinGeckoAPIprices(arr);
    let coinpricesData = coinprices.data;
    for(let i = 0; i < coins.length; i++) {
        let name = coins[i].title;
        let price = coinpricesData[name].usd;
        let change = coinpricesData[name].usd_24h_change;
        coins[i].price = price;
        coins[i].change = Math.round(change * 10) / 10;
    }
    res.send(coins)

})

router.post('/lists/:listID/coins', authenticate, async(req, res)=>{
    //create new coin in list
    let coinname = req.body.title;
    let coinInfo = await validateCoin(coinname);
    if(coinInfo != notFound) {
        verifyFolder(req.params.listID, req.user_id)
        .then((canCreateCoin)=>{
            if(canCreateCoin) {
            let newCoin = new Coin({
                    title: req.body.title,
                    _listID: req.params.listID
                });
                newCoin.save().then((newCoinDoc)=>{
                    res.send(newCoinDoc)
                }) 
 
            } else {
                res.sendStatus(404);
            }
        }).catch((err)=>{
            res.send(err);
        })
    } else {
        res.sendStatus(400);
    }
    

})

router.patch('/lists/:listID/coins/:coinID',authenticate, (req, res)=>{
    //udpate existing coin
    verifyFolder(req.params.listID, req.user_id)
    .then((canUpdateCoin)=>{
        if(canUpdateCoin){
            Coin.findOneAndUpdate({_id: req.params.coinID, _listID: req.params.listID}
                , {$set: req.body}
                ).then(()=>{
                    res.send({message: 'update success'});
                })
        } else {
            res.sendStatus(404);
        }
    })

})

router.delete('/lists/:listID/coins/:coinID', authenticate,(req, res)=>{
    //delete existing coin
    verifyFolder(req.params.listID, req.user_id)
    .then((canUpdateCoin)=>{
        if(canUpdateCoin){
            Coin.findOneAndRemove({_id: req.params.coinID, _listID: req.params.listID}
                ).then((removedCoin)=>{
                    res.send(removedCoin);
                })
        } else {
            res.sendStatus(404);
        }
    })


})
//get one coin

// router.get('/lists/:listID/coins/:coinID',  authenticate, (req, res)=>{
//     Coin.findOne({_id: req.params.coinID, _listID: req.params.listID})
//     .then((coin)=>{
//         res.send(coin)
//     })
// })

// Helper functions 
//verify user has access to a folder
let verifyFolder = (listId, userId)=>{
    var promise = new Promise((resolve,reject)=>{
        Folder.findOne({
            //find folder which has _id = listId and _userId = userId
            _id: listId, 
            _userId: userId
    
        }).then((list)=>{
    
            if(list) {
                //folder is valid
                console.log("user has access to folder")
                resolve(true);
            }
            resolve(false);
        }).catch((e)=>{
            reject(e);
        })
    })

    return promise;
}

module.exports = {router};