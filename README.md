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

### Testing your project
- To Test, use curl or postman 

- To add new message request to mempool, POST  localhost:8000/requestValidation with form-data
key:address  and value:"put your wallet address here"

Response - The response will contain: walletAddress, requestTimeStamp, message and validationWindow
```
{
    "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "requestTimeStamp": "1544451269",
    "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
    "validationWindow": 300
}
```
Message format = [walletAddress]:[timeStamp]:starRegistry
The request has a limited validation window of five minutes.
When re-submitting within validation window, the validation window will reduce until it expires.

- To validate the message at mempool added by the previous api, POST  localhost:8000/message-signature/validate with form-data
key:address  and value:"put your wallet address here"
key:signature  and value:"put the signature created for your message with your wallet address here"

Response - If submitted within 5 mins window after sending /requestValidation api and if the signature is valid, you get a valid response back and the address will be stored as a valid address. Only after the address is validated using the signature, you will be able to add new star block.

```
{
    "registerStar": true,
    "status": {
        "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1544454641",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544454641:starRegistry",
        "validationWindow": 193,
        "messageSignature": true
    }
}
```

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


- To get  star block by its hash value, 
	-- GET  localhost:8000/stars/hash:{hashValue} 

Response will be in the format below: 
```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```

- To get star blocks by address, 
	-- GET  localhost:8000/stars/address:{address} 

Response will be in the format below - there could be more than one star block returned.
```
[
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  },
  {
    "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
    "height": 2,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "17h 22m 13.1s",
        "dec": "-27° 14' 8.2",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532330848",
    "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
  }
]
```

- To get a block at a specific blockheight, 
	-- GET  localhost:8000/block/:blockheight 

Response format:
```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
````