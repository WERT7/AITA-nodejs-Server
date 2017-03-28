/**
 * Created by WERT on 16-Mar-17.
 */

const methods = require('./../methods.js');

function transfer(fromAddress, fromPrivateKey, toAddress, amount, comment) {
    var asset = {
        'fee': 5000,
        'from': [fromAddress],
        'to': [{
            'address': toAddress,
            'amount': amount,
            'assetId': methods.assetID
        }],
        'metadata': {
            'description': comment
        }
    };

    methods.postToApi('sendasset', asset, function(err, body) {
        if (err) {
            console.log('Transfer error: ', err);
        }
        else {
            methods.broadcastTx(methods.signTx(body.txHex, fromPrivateKey));
        }
    });
}

module.exports = transfer;
