
const bitcoinMessage = require('bitcoinjs-message'); 
const ReqValidationClass = require('./ReqValidation.js');
const RegisteredValidatedMsgClass = require('./RegisteredValidatedMsg.js');
const ValidatedMsgClass = require('./ValidatedMsg.js');

const TimeoutRequestsWindowTime = 5*60*1000;

/* ===== Mempool Class ==========================
|  Class with a constructor for new Mempool 		|
|  ================================================*/

class Mempool{
    constructor(){
        this.mempoolValid = new Map();
        this.timeoutRequestKeys = [];
        this.mempool = new Map();
    }

    verifyAddressRequest(address){
        let self = this;
        return self.mempoolValid.has(address);
    }

    addRequestValidation(givenReqValidation){
        let self = this;
        let reqValidation = givenReqValidation;
        if(reqValidation !== null){
            let address = reqValidation.walletAddress;
            let storedReqValidation = self.mempool.get(address);
            if(storedReqValidation === undefined){
                
                console.log("request is new");
                self.timeoutRequestKeys.push(address);
                self.mempool.set(address, reqValidation);
                self.timeoutRequestKeys[address]=setTimeout(function(){ 
                    self.removeValidationRequest(reqValidation.walletAddress) 
                }, TimeoutRequestsWindowTime );
        
            }
            else{
                reqValidation = storedReqValidation;
                console.log("request exists");
            }
            reqValidation.validationWindow = self.getTimeLeft(reqValidation);

        }
        return reqValidation;
     }

     getTimeLeft(reqValidation){
        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - reqValidation.requestTimeStamp;
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
        return timeLeft;
     }


     removeValidationRequest(walletAddress){
        let self = this;
        self.mempool.delete(walletAddress);
        let index = self.timeoutRequestKeys.indexOf(walletAddress);
        delete self.timeoutRequestKeys[index];
     }
 
     removeValidAddressFromMempool(walletAddress){
        let self = this;
        self.mempoolValid.delete(walletAddress);
     }

     validateRequestByWallet(address, signature){
        let self = this;
        let storedReqValidation = self.mempool.get(address);
        if(storedReqValidation === undefined){
            return "Please add request using /api/requestValidation before calling validate api";
        }
    
        //verify time left
        let timeLeft = self.getTimeLeft(storedReqValidation);
        if(timeLeft === 0){
            return "Please add request using /api/requestValidation before calling validate api";
        }

        let message = storedReqValidation.message;
        //bitcoinMessage.verify
        let isMessageValid = bitcoinMessage.verify(message, address, signature);
        let validRequest = null;
        if(isMessageValid){
            let validatedMsg = new ValidatedMsgClass.ValidatedMsg(message, address,timeLeft, "Valid");
            validRequest = new RegisteredValidatedMsgClass.RegisteredValidatedMsg(validatedMsg);

            //add it to the valid mempool
            this.mempoolValid.set(address, validRequest);

            //cleanup timeouts and temporary mempool storage 
            clearTimeout(self.timeoutRequestKeys[address]);
            self.removeValidationRequest(address);
        }
        return validRequest;
     }

}

module.exports.Mempool = Mempool;