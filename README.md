# ethereum-stats

Daily statistics for Ethereum blockchain

## Quick start

- Install node.js or run `nvm use` from the repo.
- Install [git lfs](https://git-lfs.github.com/)
- Install yarn `npm install -g yarn`

```bash
$ cp .env.default .env
```

1. Open .env in a text editor and set the following variables:

- ETHEREUM_NODE_URL (Use websockets as protocol)

**Example of .env file:**

```
   ETHEREUM_NODE_URL=wss://rinkeby.infura.io/ws/v3/.....
   NODE_ENV=dev
   DB_HOST=localhost
   DB_NAME=ethereum_stats
   DB_USER=ethereum-stats
   DB_PASS=ethereum-stats
   DB_PORT=5435
```

2. Setup account

```bash
$ yarn setup:account
```

3. Add gas through facet

- this depends on what network you plan on testing

4. Deploy contract

```bash
$ yarn setup:contract
```

Start the service

```bash
$ docker-compose up -d db # spin up local postgresql 14
$ yarn install
$ yarn start
```

## Local deployment

### Prerequisites

1. [node v14](https://nodejs.org/en/)
2. [yarn](https://yarnpkg.com/)  
   If you don't have yarn installed run

```bash
$ npm install --global yarn
```

3. [docker](https://docs.docker.com/engine/install/#server)
4. [docker-compose](https://docs.docker.com/compose/install/)

### External services

1. Service to connect to ethereum blockchain

   - [infura.io](https://infura.io/)

2. Postgresql database
   - run from terminal `docker-compose up -d db` to setup local postgresql

### Start the service

```bash
$ yarn install
$ yarn start
```

## Improvements

### Smart contract

- Currently the contract is just appending Stats to a variable. How much "Stats" is possible to save on ethereum blockchain? What's the price?

- Gas optimizations, which I'm sure there is plenty

### Code optimizations

- Error handling in general (always a problem with typescript), one case stands out and that is http connection timeout (or web socket timeouts in this case)
- Stale/dead web socket connection to ethereum node (didn't see this one happen but I'm sure it can)

### Tests

- Update number of unit tests, especially for src/sync.ts
- Local node to test run integrations test on the blockchain
- E2E test which connects the database and the ethereum blockchain

### Features

- Currently if the process fails and restarts after X amount of days, the non synced stats will not be written to the ethereum blockchain. I would add another database entity Stats which would stand for all the daily stats already written to the blockchain.

### ToDo's

Define what small level tasks I want to accomplish

- [x] Setup postgres as docker service
- [x] Setup typeorm and connect to postgres
- [x] Setup testing
- [x] Setup integration testing
- [ ] check if date is in format in smart contract "YYYY-mm-dd"
- [x] Setup Block model
- [x] Create a query to extract and sum all gas fees for that day.
- [x] Write to Smart Contract to save Gas Spend on a given day
- [x] Catch errors while reading/writing from ethereum blockchain
- [ ] Add retry logic to ethereum.service.fetchBlock()...
- [ ] Setup github actions to automatically run tests
- [ ] Setup hardhat for contract development (**I assume this is a must**)
- [ ] Write synced timestamps to database to reduce calls gas when trying to resync
- [ ] Check if websocket connection to ethereum node gets stale
- [ ] Setup local etherum network (geth | ganache cli)
- [ ] Move contract to mappings instead of an array

## The Plan (Original)

1. Setup project, basic typescript. &check;
2. MVP for reading form Ethereum blockchain &check;
   1. Try connecting to the blockchain and read blocks/transactions &check;
   2. Based on data structures and relation ships define which database will be used &check;
   3. Setup a ethereum service as an abstraction for reading. &check;
3. MVP for Smart Contract &check;
   1. Develop & publish smart contract &check;
4. Connect service to Smart Contract &check;
5. Look for edge cases when reading from Ethereum blockchain
