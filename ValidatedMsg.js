/* ===== ValidatedMsg Class ==============================
|  Class with a constructor for ValidatedMsg 			   |
|  ===============================================*/

class ValidatedMsg {
	constructor(message,  address, validationWindow, signatureValid){
		this.address = address;
		this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
		this.message = message;
        this.validationWindow = validationWindow;
        this.messageSignature = signatureValid;
	}
}

module.exports.ValidatedMsg = ValidatedMsg;

