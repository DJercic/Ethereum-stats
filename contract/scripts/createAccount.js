const fs = require('fs');
const Web3 = require('web3');
const dotenv = require('dotenv');


dotenv.config({
  path: '.env'
});

(async function () {
  const {
    ETHEREUM_NODE_URL,
  } = process.env;
  const web3 = new Web3(ETHEREUM_NODE_URL);
  const account = web3.eth.accounts.create();
  console.error(`
    Account created!
    Address: ${account.address}
    Private key: ${account.privateKey}

    To add private key to your env variables run in your terminal:
    $ echo 'ACCOUNT_PRIVATE_KEY=${account.privateKey}' >> .env

    `);
  console.log(`ACCOUNT_PRIVATE_KEY='${account.privateKey}'`);
  console.log(`ACCOUNT_ADDRESS='${account.address}'`);
})()
.then(() => process.exit(0)).catch(console.error);
