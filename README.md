# ethereum-stats

Daily statistics for Ethereum blockchain

## Quick start

### Prerequisites

1. [yarn](https://yarnpkg.com/)  
   If you don't have yarn installed run:

```bash
$ npm install --global yarn
```

2. [docker](https://docs.docker.com/engine/install/#server) & [docker-compose](https://docs.docker.com/compose/install/)

### Start the service

```bash
$ yarn install
```

```bash
$ yarn run start
```

## The Plan

1. Setup project, basic typescript.
2. MVP for reading form Ethereum blockchain
   1. Try connecting to the blockchain and read blocks/transactions
   2. Based on datastructures and relationsships define which database will be used
   3. Setup a ethereum service as an abstraction for reading.
3. MVP for Smart Contract
   1. Develop & publish smart contract
4. Connect service to Smart Contrac
5. Look for edge cases when reading from Ethereum blockchain
