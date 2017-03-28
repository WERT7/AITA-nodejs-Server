/**
 * Created by WERT on 12-Mar-17.
 */

var bitcoin = require('bitcoinjs-lib');
var request = require('request');

funded_address = 'mqJnkoojoqi3TLvCyKw1Ye4ts44dZtaMgm';
private_key = 'L1cBixHqywmt9Z9y9XAB4EVxoG6vSawZdrTHGiypL7bqdiyMpsKR';

function postToApi(api_endpoint, json_data, callback) {
    console.log(api_endpoint+': ', JSON.stringify(json_data));
    request.post({
            url: 'http://testnet.api.coloredcoins.org:80/v3/' + api_endpoint,
            headers: { 'Content-Type': 'application/json' },
            form: json_data
        },
        function (error, response, body) {
            if (error) {
                return callback(error);
            }
            if (typeof body === 'string') {
                body = JSON.parse(body)
            }
            console.log('Status: ', response.statusCode);
            console.log('Body: ', JSON.stringify(body));
            return callback(null, body);
        });
}

var asset = {
    // 'assetId': 'Ua2UaH19AbhNjjfv9NLEvHzB86yfS7LjRNzj7H',
    'issueAddress': funded_address,
    'amount': 10,
    'fee': 5000,
    // 'financeOutputTxid': 'a62d624bc5ba6dce2c8e4203368f4a9176e7e4ca1dece5138fd5dab721882863',
    'reissueable': true,
    // 'assetGenesis': 'a62d624bc5ba6dce2c8e4203368f4a9176e7e4ca1dece5138fd5dab721882863',
    'flags': {
        splitChange: true
    },
    'metadata': {
        assetName: "Test AITA currency #3",
        issuer: "WERT",
        description: "Third try to issue universal currency for AITA Awards Miledger"
    }
};

function signTx(unsigned_tx, private_key_wif) {
    var privateKey = bitcoin.ECKey.fromWIF(private_key_wif);
    var tx = bitcoin.Transaction.fromHex(unsigned_tx);
    var insLength = tx.ins.length;
    for (var i = 0; i < insLength; i++) {
        tx.sign(i, privateKey);
    }
    return tx.toHex();
}

postToApi('issue', asset, function(err, body) {
    if (err) {
        console.log('error: ', err);
    }
    else {
        var signedTxHex = signTx(body.txHex, private_key);
        var transaction = {
            'txHex': signedTxHex
        };
        postToApi('broadcast', transaction, function(err, body) {
            if (err) {
                console.log('error: ', err);
            }
        });
    }
});
