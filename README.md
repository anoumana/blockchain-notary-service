## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install hapi with --save flag to save dependency to our package.json file
```
npm install hapi --save
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```

- Install level with --save flag
```
npm install level --save
```
const bitcoinMessage = require('bitcoinjs-message'); 
- Install bitcoinjs-message with --save flag
```
npm install bitcoinjs-message --save
```

- Launch the application by running npm start 

- To Test, use curl or postman 

- To add new block, POST  localhost:8000/api/block with form-data
key:data  and value:"put your block data here"

- To get a block at a specific blockheight, 
	-- GET  localhost:8000/api/block/:blockheight 

- To add new message request to mempool, POST  localhost:8000/api/requestValidation with form-data
key:address  and value:"put your wallet address here"

- To validate the message at mempool added by the previous api, POST  localhost:8000/api/validate with form-data
key:address  and value:"put your wallet address here"
key:signature  and value:"put the signature created for your message with your wallet address here"


