/* ===== Star Class ==============================
|  Class with a constructor for Star 			   |
|  ===============================================*/

class Star {
	constructor(message,  address, signatureValid){
		this.address = address;
		this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
		this.message = message;
        this.validationWindow = 0;
        this.messageSignature = signatureValid;
	}
}

module.exports.Star = Star;

