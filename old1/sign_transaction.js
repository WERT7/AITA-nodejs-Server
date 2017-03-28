var bitcoin = require('bitcoinjs-lib');

function signTx (unsignedTx, wif) {
    var privateKey = bitcoin.ECKey.fromWIF(wif);
    var tx = bitcoin.Transaction.fromHex(unsignedTx);
    var insLength = tx.ins.length;
    for (var i = 0; i < insLength; i++) {
        tx.sign(i, privateKey);
    }
    return tx.toHex();
}

var key = 'L5UhU9ZyHnyMspjCLtc5wmuoKWeH6gJLVTSPQymiHwLUiuSmnJxK';
var txHex = '01000000019c1b12dd1f5c6e6df9238ee1f224e9fe77575ec74224290d7843320f8dead32d0100000000ffffffff030000000000000000086a06434302050a10c0700100000000001976a9145289d5269c1668d41a96c121cf61437c8a3ff2a288ac58020000000000001976a9145289d5269c1668d41a96c121cf61437c8a3ff2a288ac00000000';

var signedTxHex = signTx(txHex, key);
console.log("signedTxHex: ["+signedTxHex+"]");
