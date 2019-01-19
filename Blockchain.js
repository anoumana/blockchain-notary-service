/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
//Importing levelSandbox class
const LevelSandboxClass = require('./levelSandbox.js');
const BlockClass = require('./Block.js');

// Creating the levelSandbox class object
const db = new LevelSandboxClass.LevelSandbox();

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
  }

  // Add new block
  addBlock(newBlock){
		let self = this;
		// UTC timestamp
		newBlock.time = new Date().getTime().toString().slice(0,-3);
		return new Promise( function(resolve){
			// get the chain length by counting all the blocks
			db.getBlocksCount().then ( function(chainLength)
			{
				console.log("chainLength :" + chainLength);
				return chainLength;
			})
			.then( function(chainLength){
				console.log("in second then " +chainLength);
				if (chainLength == 0 ){
					// create Genesis block if it is the first block of the chain
					let gBlock = new BlockClass.Block("First block in the chain - Genesis block", true);
					gBlock.hash =  SHA256(JSON.stringify(gBlock)).toString();
					//add to levelDB
					db.addLevelDBData(0, JSON.stringify(gBlock).toString())
					.then((result) => {
						if(!result) {
								console.log("Error Adding gdata");
							}else {
								console.log(result);
								// // newblock ht increased by 1
								newBlock.height = 1;
								return result;
							}
						})
					.then(function(result){
						let ggBlock = JSON.parse(result);
						newBlock.previousBlockHash = ggBlock.hash;
						// Block hash with SHA256 using newBlock and converting to a string
						newBlock.hash = SHA256(JSON.stringify(newBlock));
						console.log("Block :" + JSON.stringify(newBlock));
						newBlock.height =chainLength+1;
						db.addLevelDBData(newBlock.height, JSON.stringify(newBlock))
							.then((result) => {
								if(!result) {
										console.log("Error Adding data");
									}else {
										console.log("after add: " + result);
										resolve(newBlock);
									}
								})
							.catch((err) => { console.log(err);  resolve(null)});

					});

				}
				else{
					// get previous block
					self.getBlock(chainLength-1)
						.then((result) => {
							if(!result) {
								console.log("Error getting pblock");
							}else {
								console.log(result);
								newBlock.previousBlockHash = result.hash;
								// Block hash with SHA256 using newBlock and converting to a string
								//newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
								return result;
							}
						})
					//.catch((err) => { console.log(err); }
					.then(function(result){
						let pBlock = result;
						newBlock.previousBlockHash = pBlock.hash;
						//block height
						newBlock.height =chainLength;
						// Block hash with SHA256 using newBlock and converting to a string
						newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
						console.log("Block :" + JSON.stringify(newBlock));
						db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString())
							.then((result) => {
								if(!result) {
										console.log("Error Adding data");
									}else {
										console.log("after add chainlength gt 0: " + result);
										resolve(newBlock);
									}
								})
							.catch((err) => { console.log(err);  resolve(null)});

					});

				}
			});
			
		});
	}


  // Get block height
    getBlockHeight(){
		let blockHeight = 0;
		return new Promise((resolve) => {
            db.getBlocksCount().then(function(value){
				//	blockHeight is the # of blocks before the block;
				blockHeight = value-1;
				console.log("blockHeight :" + blockHeight);
				resolve(blockHeight);
            });
        })
    }

	getBlockByHash(hashValue){
		return new Promise((resolve) => {
            db.getValueFromLevelDBData("hash", hashValue).then(function(value){
								console.log("hashValue sent to getBlockWithHash :" + hashValue);
								console.log("block val: " + value);
								resolve(value);
            });
        })

	}

	getBlockByAddress(address){
		return new Promise((resolve) => {
            db.getChildValueFromLevelDBData("body", "address", address).then(function(value){
								console.log("address sent to getBlockByAddress :" + address);
								console.log("block val: " + value);
								resolve(value);
            });
        })

	}

    // get block
    getBlock(blockHeight){
			return new Promise((resolve) => {
            db.getLevelDBData(blockHeight).then(function(value){
								console.log("blockHeight sent to getBlock :" + blockHeight);
								console.log("block val: " + value);
								resolve(value);
            });
        })
    }

    // validate block
    validateBlock(blockHeight){
			let self = this;
			return new Promise(function(resolve){
				self.getBlock(blockHeight)
				.then((result) => {
					if(!result) {
						console.log("Error getting block in validateBlock");
						resolve(false);
					}else {
						console.log(result);
						let block = JSON.parse(result);
						// get block hash
						console.log(JSON.stringify(block)); // "Stuff worked!"
						let blockHash = block.hash;
						// remove block hash to test block integrity
						block.hash = '';
						// generate block hash
						let validBlockHash = SHA256(JSON.stringify(block)).toString();
						console.log("validBHash :" + validBlockHash);
						// Compare
						if(validBlockHash === blockHash) {
									resolve(true);
						} else {
							resolve(false);
						}
					}
				})
			})
    }


		validateBlockGivenBlock(givenBlock){
			let block = JSON.parse(givenBlock);
			console.log("In validateBlockGivenBlock : " + givenBlock); 
			let blockHash = block.hash;
			// remove block hash to test block integrity
			block.hash = '';
			// generate block hash
			let validBlockHash = SHA256(JSON.stringify(block)).toString();
			console.log("validBHash :" + validBlockHash);
			// Compare
			if(validBlockHash === blockHash)
			{
				return true;
			} else {
				return false;
			}
     	}

		 // Validate blockchain
		validateChain(){
			 let self = this;
			 let errorLog = [];
			 let chainLength = 0;
			 let block1 = null;
			 return new Promise(function(resolve){

			 db.getBlocksCount().then ( function(chainLength)
			 {
				 console.log("chainLength :" + chainLength);
				 var promises = [];

				 //get all blocks to be used for Promize.all
				for(var i = 0; i < chainLength; i++){
					promises.push(self.getBlock(i));
				}

				//Using Promise.all to execute all promises at the same time
				 Promise.all(promises)
					.then((blocks) => {
						for(var i = 0; i < chainLength; i++){
							// console.log("blocks");
							// console.log(JSON.stringify(blocks[i]));
							// console.log(JSON.stringify(blocks[i+1]));
							//validate the block
							if (!self.validateBlockGivenBlock(blocks[i]))
							{errorLog.push(i);}

							if(i < chainLength-1){
								let blockHash = JSON.parse(blocks[i]).hash;
								// get the previousblock hash of the next block  
								let previousHash = JSON.parse(blocks[i+1]).previousBlockHash;
								//compare with the hash of this blcok
								if (blockHash!==previousHash) {
									errorLog.push(i);
								}
							}
							else {
								if (errorLog.length>0) {
									//at the end send the errorlog if there are errors
									// console.log('Block errors = ' + errorLog.length);
									// console.log('Blocks: '+errorLog);
									resolve(errorLog);
								} else {
									console.log('No errors detected');
									resolve(true);
								}
							}
						}
					})
					.catch((e) => {
							console.log("Exception **: " + e);
							resolve(e);
					});

				})
			});
		}
}

 
module.exports.Blockchain = Blockchain;
