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
    // makeMeOwner
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}, {"name":"","type":"uint256"}, {"name":"","type":"uint16"}],
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
      "outputs":[{"name":"","type":"uint16"}],
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
    // setSecs
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}, {"name":"","type":"uint16"}],
      "name":"setSecs",
      "outputs":[],
      "type":"function"
    },
    // setAmount
    {
      "constant":true,
      "inputs":[{"name":"","type":"address"}, {"name":"","type":"uint256"}],
      "name":"setAmount",
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
    }
  ]
});