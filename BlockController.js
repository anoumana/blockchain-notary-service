const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');
const BlockClass = require('./Block.js');
const BlockchainClass = require('./Blockchain.js');
const MempoolClass = require('./Mempool.js');
const ReqValidationClass = require('./ReqValidation.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        //this.blocks = [];
        // Creating the levelSandbox class object
        this.blockChain = new BlockchainClass.Blockchain();
        this.mempool = new MempoolClass.Mempool();
    
        //this.initializeMockData();
        this.getBlockByBlockHeight();
        this.getStarBlockByHash();
        this.getStarBlocks();
        this.postNewBlock();
        this.postReqValidation();
        this.postValidate();
    }

    /**
     * Implement a GET Endpoint to retrieve a star block by hash, url: "/stars/{hash}"
     */
    getStarBlockByHash() {
        this.server.route({
            method: 'GET',
            path: '/stars/hash/{hash}',
            handler: (request, h) => {
 
                let hashValue = request.params.hash;
                return this.blockChain.getBlockByHash(hashValue).then(function(valueArray){
                    console.log("block chain getStarBlockByHash + " + valueArray);
                    if( valueArray === undefined) {
                        return `Invalid block  ${encodeURIComponent(hashValue)}`;
                    }
                    else {
                        //add decode info to the response block
                        valueArray.forEach(function (value) {
                            value.body.star.storyDecoded = hex2ascii(value.body.star.story);
                            console.log(JSON.stringify(value));
                        });
                        return valueArray;
                    }
                });
                   
            }
        });
    }

    /**
     * Implement a GET Endpoint to retrieve a star block by hash or by address
     */
    getStarBlocks() {
        this.server.route({
            method: 'GET',
            path: '/stars/{queryParam}',
            handler: (request, h) => {
                
                let query = request.params.queryParam;
                let queryParts = query.split(':');

                var address;
                var hashValue;
                if(queryParts[0] === "address")
                    address = queryParts[1];

                if(queryParts[0] === "hash")
                    hashValue = queryParts[1];

                if(address !== undefined ){
                    return this.blockChain.getBlockByAddress(address).then(function(valueArray){
                        console.log("block chain getBlockByAddress + " + valueArray);
                        if( valueArray === undefined) {
                            return `Invalid block  ${encodeURIComponent(address)}`;
                        }
                        else {
                            //add decode info to the response block
                            valueArray.forEach(function (value) {
                                value.body.star.storyDecoded = hex2ascii(value.body.star.story);
                                console.log(JSON.stringify(value));
                            });
                            return valueArray;
                        }
                    });
                }

                if(hashValue !== undefined ){
                    return this.blockChain.getBlockByHash(hashValue).then(function(valueArray){
                        console.log("block chain getStarBlockByHash + " + valueArray);
                        if( valueArray === undefined) {
                            return `Invalid block  ${encodeURIComponent(hashValue)}`;
                        }
                        else {
                            //add decode info to the response block
                            valueArray.forEach(function (value) {
                                value.body.star.storyDecoded = hex2ascii(value.body.star.story);
                                console.log(JSON.stringify(value));
                            });
                            return valueArray;
                        }
                    });

                }
            }
        });
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/block/{blockHeight}"
     */
    getBlockByBlockHeight() {
        this.server.route({
            method: 'GET',
            path: '/block/{blockHeight}',
            handler: (request, h) => {
                
                let blockHeight = request.params.blockHeight;

                return this.blockChain.getBlock(blockHeight).then(function(value){
                    console.log("block chain get block + " + value);
                    if( value === undefined) {
                        return `Invalid block  ${encodeURIComponent(blockHeight)}`;
                    }
                    else {
                        if(value.body.star !== undefined){
                            value.body.star.storyDecoded = hex2ascii(value.body.star.story);
                        }
                        return value;
                    }
                });
                   
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/block',
            handler: (request, h) => {
                let self = this;
                var payload = request.payload;   
                if(payload == null){ return "Please include block data"};
                if(Array.isArray(payload)){ return "Please include only one star block data"};
                // verify block has star data
                var newBlock;
                try{
                    newBlock = new BlockClass.Block(payload)
                    let starData = newBlock.body.star;
                    if(starData.dec === null ||  starData.dec === undefined){ return "Please include star data"};
                    if(starData.ra === null ||  starData.ra === undefined){ return "Please include star data"};
                    if(starData.story === null ||  starData.story === undefined){ return "Please include star data"};
                 }catch(err) {return "Please include address and star data" };

                //mempool verifyAddressRequest
                var walletAddress;
                if(typeof payload === 'string') walletAddress = JSON.parse(payload).address;
                else walletAddress = payload.address;
                
                let isValid = this.mempool.verifyAddressRequest(walletAddress);
                if(!isValid){return 'Address is not Verified, please use /requestValidation and /message-signature/validate to validate the address first'}
                return this.blockChain.addBlock(newBlock).then(function(value){
                    if( value !== null) {
                        //add decode info to the response block
                        value.body.star.storyDecoded = hex2ascii(value.body.star.story);
                        //clean up the mempool address verification
                        self.mempool.removeValidAddressFromMempool(walletAddress);
                        return value;
                    }
                    else {
                        return 'Block was not successfully added';
                    }
                });

            }
        });
    }


    /**
     * Implement a POST Endpoint to requestValidation , url: "/requestValidation"
     */
    postReqValidation() {
        this.server.route({
            method: 'POST',
            path: '/requestValidation',
            handler: (request, h) => {
                var payload = request.payload   
                if(payload == null){ return "Please include address info"};
                if(payload.address !== ""){
                    let newReqValidationObj = new ReqValidationClass.ReqValidation(payload.address);

                    return this.mempool.addRequestValidation(newReqValidationObj);
                }
                else{
                    return 'Please include address info';
                }
            }
        });
    }


    /**
     * Implement a POST Endpoint to validate , url: "/message-signature/validate"
     */
    postValidate() {
        this.server.route({
            method: 'POST',
            path: '/message-signature/validate',
            handler: (request, h) => {
                var payload = request.payload   
                if(payload == null){ return "Please include message and signature info"};
                let address = payload.address;
                let signature = payload.signature;
                if(address === "" || address === null){
                    return "Please include message and signature info";
                }
                if(signature === "" || signature === null){
                    return "Please include message and signature info";
                }

                return this.mempool.validateRequestByWallet(address, signature);
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    // initializeMockData() {
    //     if(this.blocks.length === 0){
    //         for (let index = 0; index < 10; index++) {
    //             let blockAux = new BlockClass.Block(`Test Data #${index}`);
    //             blockAux.height = index;
    //             blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
    //             this.blocks.push(blockAux);
    //         }
    //     }
    // }


}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}