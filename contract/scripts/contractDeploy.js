/***
 * Deploy script for smart contract.
 * Infura service  doesn't support eth_sendTransaction method,
 * to bypass this a raw transactions is made and the contract
 * is serialized and uploaded manually instead of contract.deploy 
 * method that web3js usually provides.
 * Code is based on the answer here: https://ethereum.stackexchange.com/questions/26999/invalid-json-rpc-response-error-for-sendtransaction-on-infura-ropsten-node-t
 * with small modifications.
 */
const fs = require('fs');
const Web3 = require('web3');
const dotenv = require('dotenv');
const Tx = require('ethereumjs-tx').Transaction;

dotenv.config({
  path: '.env'
});

(async function () {
  const {
    ETHEREUM_NODE_URL,
    ACCOUNT_PRIVATE_KEY
  } = process.env;

  async function sendSigned(txData, privateKey) {
    const key = Buffer.from(privateKey.replace('0x', ''), 'hex');
    const transaction = new Tx(txData, {
      'chain': 'ropsten'
    });
    transaction.sign(key);
    const serializedTx = transaction.serialize().toString('hex');
    return await web3.eth.sendSignedTransaction('0x' + serializedTx);
  }

  function getSmartContractData(fileName) {
    const bytecode = fs.readFileSync(
      `./contract/artifacts/${fileName}.bin`);
    const abi = JSON.parse(fs.readFileSync(
      `./contract/artifacts/${fileName}.abi`));
    return '0x' + bytecode
  }

  const fileName = 'contract_DailyStatsContract_sol_DailyStats'
  const web3 = new Web3(ETHEREUM_NODE_URL);
  const account = web3.eth.accounts.privateKeyToAccount(
    ACCOUNT_PRIVATE_KEY);
  console.log(
    `
    Deploying Contract
    Contract: ${fileName}
    Address: ${account.address} 
    `);

  const txCount = await web3.eth.getTransactionCount(account.address);
  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex('4900000'),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    from: account.address,
    data: getSmartContractData(fileName)
  };
  const result = await sendSigned(txData, account.privateKey);
  return console.log(`
    Success deploying contract ${fileName}
    Contract address: ${result.contractAddress}

    add to .env file:
    $ echo CONTRACT_ADDRESS='${result.contractAddress}'
  `);
})() // websocket is not letting the process succeed, hence the exit(0)
.then(() => process.exit(0)).catch(console.error);
