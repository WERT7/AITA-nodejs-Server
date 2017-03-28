var bitcoin = require('bitcoinjs-lib');
var key = bitcoin.ECKey.fromWIF("L4hrkzAf33pxPcZjqy1NB3fKbyzm3DbDSHWy9EnTCE44hkhWrfpg");

var tx = new bitcoin.TransactionBuilder();
tx.addInput("c74878df2883a4ebea2d6fc100b6f15ded911b61fd2003ee03ec5ef4a643fc0b", 1);
tx.addOutput("n2eMqTT929pb1RDNuqEnxdaLau1rxy3efi", 5000);
// tx.sign(0, key);