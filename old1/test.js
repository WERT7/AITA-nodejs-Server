var blocktrail = require('blocktrail-sdk');

console.log("123456789 Satoshi to BTC: ",
    blocktrail.toBTC(123456789));
console.log("1.23456789 BTC to Satoshi: ",
    blocktrail.toSatoshi(1.23456789));
