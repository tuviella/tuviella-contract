# Tuviella contracts

Contracts for tuviella swap

## Devevelopment

Notes for developers

### Requirements

- Nodejs 14.x (use nvm (linux/mac)[https://github.com/nvm-sh/nvm] or (windows)[https://github.com/coreybutler/nvm-windows])
- yarn (`npm install -g yarn`)

### Run instructions

Install dependencies

```bash
yarn install
```

Run ganache to create a local blockchain (chainid = 333) with mnemonic keys `bitter banner man sting lyrics eye speed immense inject roof dust marine`

```bash
yarn start
```

Deploy contract using truffle or (remix)[https://remix.ethereum.org]

- Truffle: `yarn migrate`
- Remix: `yarn remix` (this will open a connection for remix IDE to connect to localhost)


## Testing

Execute tests

```bash
yarn test
```

## Configure metamask

You can configure metamask to work with local blockchain (first you need to execute `yarn start`)

- Mnemonic key (import account): bitter banner man sting lyrics eye speed immense inject roof dust marine
- Network name: Local ganache (tuviella)
- RPC url: http://localhost:8545
- Network id: 333
- Coin symbol: MATIC
- Explorer url: <not available>
