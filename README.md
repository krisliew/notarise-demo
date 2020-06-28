
# Certificate Notarisation Demo
Online Demo Link: http://soonjing.herokuapp.com/

> Do ensure that you are running on http because https would not work.


## Blockchain
  - Symbol Blockchain Explorer: http://explorer-951.symboldev.network/
  - Endpoint: http://api-01.ap-southeast-1.testnet-0951-v1.symboldev.network:3000/
    

## Guide

 1. How to verify a certificate?
	  - Go to http://soonjing.herokuapp.com/ 
	  - Click the **Verify Certificate** button
	  - Upload your certificateFile.pdf and voila! 
  
2. How to notarise a certificate?
	- Go to http://soonjing.herokuapp.com/notarise
	- Input your certificate title
	- Upload your certificate file (only accept pdf format certificate)
	- Click the **Issue Certificate** button
	- When your certificate gets confirmed on blockchain, you will be prompted to download the notarised certificate file. Additionally, you may also rename the file name
	- Finally, you may try to verify the certificate you just notarised to see if it worked


## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start
```
