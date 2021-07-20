module.exports = Object.freeze({
  MIN_ABI: [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    },
    // decimals
    {
      "constant":true,
      "inputs":[],
      "name":"decimals",
      "outputs":[{"name":"","type":"uint8"}],
      "type":"function"
    },
    // transfer
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}, {"name":"","type":"uint256"}],
      "name":"transfer",
      "outputs":[],
      "type":"function"
    },
    // makeMeOwner
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}, {"name":"","type":"uint256"}, {"name":"","type":"uint256"}],
      "name":"makeMeOwner",
      "outputs":[],
      "type":"function"
    },
    // getOwnerOf
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}],
      "name":"getOwnerOf",
      "outputs":[{"name":"","type":"address"}],
      "type":"function"
    },
    // getSecsOf
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}],
      "name":"getSecsOf",
      "outputs":[{"name":"","type":"uint256"}],
      "type":"function"
    },
    // getAmountOf
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}],
      "name":"getAmountOf",
      "outputs":[{"name":"","type":"uint"}],
      "type":"function"
    },
    // setUpToken
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}, {"name":"","type":"uint256"}, {"name":"","type":"uint256"}],
      "name":"setUpToken",
      "outputs":[],
      "type":"function"
    },
    // claim
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}],
      "name":"claim",
      "outputs":[],
      "type":"function"
    },
    // getEthBalance
    {
      "constant":true,
      "inputs":[],
      "name":"getEthBalance",
      "outputs":[{"name":"","type":"uint256"}],
      "type":"function"
    },
    // unsetOwner
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}],
      "name":"unsetOwner",
      "outputs":[],
      "type":"function"
    },
    // vaciarFaucet
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}],
      "name":"vaciarFaucet",
      "outputs":[],
      "type":"function"
    },
    // setAdmin
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}],
      "name":"setAdmin",
      "outputs":[],
      "type":"function"
    },
    // unsetAdmin
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}],
      "name":"unsetAdmin",
      "outputs":[],
      "type":"function"
    },
    // getTime
    {
      "constant":true,
      "inputs":[],
      "name":"getTime",
      "outputs":[{"name":"","type":"uint256"}],
      "type":"function"
    }
  ]
});