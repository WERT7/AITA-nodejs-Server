/**
 * Created by WERT on 16-Mar-17.
 */

const methods = require('./../methods.js');

var issuerAddress = 'myeSdtYZKX2kvEmVZMvxa3nvasEJuzf2v9'; // всегда один
var issuerPrivateKey = 'L2YCm7gFAKviLGidnZU9UGzJGZ9YAhtLUfT14cY7usKTzDN6GLvW';

function issueAndTransfer(toAddress, amount) { // toAddress - адрес компании, запросившей выпуск валюты
    var asset = {
        'issueAddress': issuerAddress,
        'amount': amount,
        'fee': 5000,
        'reissueable': true,
        'flags': {
            splitChange: true
        },
        'metadata': {
            assetName: "Test AITA currency #4",
            issuer: "App in the Air",
            description: "Third try to issue universal currency for AITA Awards Miledger"
        },
        'transfer':[{
            'address': toAddress,
            'amount': amount
        }]
    };

    methods.postToApi('issue', asset, function(err, body) {
        if (err) {
            console.log('Issuance error: ', err);
        }
        else {
            methods.broadcastTx(methods.signTx(body.txHex, issuerPrivateKey));
        }
    });
}

module.exports = issueAndTransfer;
