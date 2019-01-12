/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
	constructor(data){
		this.hash = "";
		this.height = 0;
		this.body = new StarBody(data);
		this.time = new Date().getTime().toString().slice(0,-3);
	}
}

class StarBody{
	constructor(data){
		let dataObj = JSON.parse(data);
		this.address = dataObj.address;
		this.star = dataObj.star;
		this.star.storyDecoded = this.star.story;
		this.star.story = Buffer.from(this.star.story, 'utf8').toString('hex');
	}
}

module.exports.Block = Block;