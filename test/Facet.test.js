const TuviellaToken = artifacts.require('TuviellaToken')
const Faucet = artifacts.require('Faucet')

require('chai')
    .user(require('chai-as-proimised'))
    .should()   


contract('Faucet'), (accounts)