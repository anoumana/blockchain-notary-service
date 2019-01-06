
const ReqValidationClass = require('./ReqValidation.js');
const TimeoutRequestsWindowTime = 1*60*1000;

/* ===== Mempool Class ==========================
|  Class with a constructor for new Mempool 		|
|  ================================================*/

class Mempool{
    constructor(){
        this.mempool = [];
        this.timeoutRequestKeys = [];
        this.timeoutRequests = new Map();
    }


    addRequestValidation(givenReqValidation){
        let self = this;
        let reqValidation = givenReqValidation;
        if(reqValidation !== null){
            let address = reqValidation.walletAddress;
            let storedReqValidation = self.timeoutRequests.get(address);
            if(storedReqValidation === undefined){
                
                console.log("request is new");
                self.timeoutRequestKeys.push(address);
                self.timeoutRequests.set(address, reqValidation);
                self.timeoutRequestKeys[address]=setTimeout(function(){ 
                    self.removeValidationRequest(reqValidation.walletAddress) 
                }, TimeoutRequestsWindowTime );
        
            }
            else{
                reqValidation = storedReqValidation;
                console.log("request exists");
            }

            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - reqValidation.requestTimeStamp;
            let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
            reqValidation.validationWindow = timeLeft;
        }
        return reqValidation;
     }

     removeValidationRequest(walletAddress){
        let self = this;
        self.timeoutRequests.delete(walletAddress);
        let index = self.timeoutRequestKeys.indexOf(walletAddress);
        delete self.timeoutRequestKeys[index];
     }
 

}

module.exports.Mempool = Mempool;