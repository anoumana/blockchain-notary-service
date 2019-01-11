/* ===== RegisteredValidatedMsg Class ==============================
|  Class with a constructor for RegisteredValidatedMsg 			   |
|  ===============================================*/

class RegisteredValidatedMsg {
	constructor(validatedMsg){
		this.registerStar = true;
		this.status = validatedMsg;
	}
}

module.exports.RegisteredValidatedMsg = RegisteredValidatedMsg;

