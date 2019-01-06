/* ===== ReqValidation Class ==============================
|  Class with a constructor for ReqValidation 			   |
|  ===============================================*/

class ReqValidation {
	constructor(address){
		this.walletAddress = address;
		this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
		this.message = this.walletAddress + ":" + this.requestTimeStamp + ":starRegistry" ;
		this.validationWindow = 0;
	}
}

module.exports.ReqValidation = ReqValidation;