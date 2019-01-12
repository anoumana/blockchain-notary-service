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
- Install bitcoinjs-message with --save flag
```
npm install bitcoinjs-message --save
```

- Install hex2ascii with --save flag
```
npm install hex2ascii --save
```

- Launch the application by running npm start 

- To Test, use curl or postman 

- To add new star block, POST  localhost:8000/block with "Content-Type":"application/json" and pass the post body as a raw json
```
{
	"address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
	"star": {
				"dec": "68° 52' 56.9",
				"ra": "16h 29m 1.0s",
				"story": "Found star using https://www.google.com/sky/"
			}
}
```

- To get a star block by its hash value, 
	-- GET  localhost:8000/stars/hash/:hashValue 

- To get a block at a specific blockheight, 
	-- GET  localhost:8000/block/:blockheight 

- To add new message request to mempool, POST  localhost:8000/api/requestValidation with form-data
key:address  and value:"put your wallet address here"

- To validate the message at mempool added by the previous api, POST  localhost:8000/api/validate with form-data
key:address  and value:"put your wallet address here"
key:signature  and value:"put the signature created for your message with your wallet address here"


