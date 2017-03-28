var bitcoin = require('bitcoinjs-lib');
var request = require('request');

var address1 = 'mfiBbCaSk8WVu12axqyPN39zBj41Livxta';
var private_key1 = 'KzCcNefqZEz1XsCRCqk58u6naqjGscBMTjgewUCKaYQ9hrcnqL59';
var address2 = 'mo3NpZaQjJ5iHBLLnPmwAp9awEvvirDKtR';
var assetId = 'La5GhDG66mmuF2sP7NB3UwhyoPEPry5cY9TLqn';

function postToApi(api_endpoint, json_data, callback) {
    console.log(api_endpoint + ': ', JSON.stringify(json_data));
    request.post({
            url: 'http://testnet.api.coloredcoins.org:80/v3/' + api_endpoint,
            headers: { 'Content-Type': 'application/json' },
            form: json_data
        },
        function (error, response, body) {
            if (error) {
                return callback(error)
            }
            if (typeof body === 'string') {
                body = JSON.parse(body)
            }
            console.log('Status: ', response.statusCode);
            console.log('Body: ', JSON.stringify(body));
            return callback(null, body)
        })
}

// send parameters
var asset = {
    'fee': 5000,
    'from': [address1],
    'to': [{
        'address': address2,
        'amount': 1,
        'assetId': assetId
    }],
    // metadata: {
    //     userData: {
    //         meta: [ { key: 'TxComment', value: 'ololo', type: 'String' } ]
    //     }
    // }
    'metadata':  { assetName: 'laboris',
        issuer: 'anim nisi consectetur',
        description: 'Fugiat ipsum sunt amet reprehenderit irure.',
        urls:
            [ { name: 'magna',
                url: 'http://D7I.com',
                mimeType: 'text/html',
                dataHash: '637b7a78fa119d05bde3765ac40c72d22906da7977640a79d11a291a73c9549' },
                { name: 'do',
                    url: 'http://2mz.com',
                    mimeType: 'text/html',
                    dataHash: 'd71ce3f84ff0a6fe78ce6448c995af6c530b7dfbdd6c5ac19b79e02183b17ab' },
                { name: 'et',
                    url: 'http://MLy.com',
                    mimeType: 'text/html',
                    dataHash: '1d736e670a061362b2d4ddc632ed5fe40d5554dabc8395d311f076a13848d16' } ],
        userData:
            { meta:
                [ { key: 'reprehenderit', value: '78584', type: 'Number' },
                    { key: 'culpa', value: 'Pg2sxqj6CX', type: 'String' },
                    { key: 'duis', value: true, type: 'Boolean' } ],
                fookey: 'fBRiImkkFZdDt0ILvX8qJ7UmAllO8p',
                barkey: '3081468253' } }
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


// send asset
postToApi('sendasset', asset, function(err, body){
    if (err)
        console.log('error: ', err);
    else
    {
        var signedTxHex = signTx(body.txHex, private_key1);
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
