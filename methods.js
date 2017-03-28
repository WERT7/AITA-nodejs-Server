/**
 * Created by WERT on 16-Mar-17.
 */

const assetID = 'Ua44VnBgqZNf2k8hjJnRu54yLuWGGcvFxtRK97'; // айдишник нашей валюты всегда постоянный, выяснится после первого выпуска

var bitcoin = require('bitcoinjs-lib');
var request = require('request');

// Возвращает новый адрес и секретный ключ
function generateNewWallet() {
    var key = bitcoin.ECKey.makeRandom();
    var address = key.pub.getAddress(bitcoin.networks.testnet).toString();
    var wif = key.toWIF();
    console.log('new TESTNET address: [' + address + ']');
    console.log('Private Key of new address (WIF format): [' + wif + ']');

    return { address, wif };
}

// Запрос POST на API Colored Coins
function postToApi(api_endpoint, json_data, callback) {
    console.log(api_endpoint + ': ', JSON.stringify(json_data));
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
                body = JSON.parse(body);
            }
            console.log('Status: ', response.statusCode);
            console.log('Body: ', JSON.stringify(body));
            return callback(null, body);
        });
}

// Запрос GET на API Colored Coins
function getFromApi(api_endpoint, param, callback) {
    console.log('Get from:' + api_endpoint + '/' + param);
    request.get('http://testnet.api.coloredcoins.org:80/v3/' + api_endpoint + '/' + param, function (error, response, body) {
        if (error) {
            return callback(error);
        }
        if (typeof body === 'string') {
            body = JSON.parse(body)
        }
        console.log('Status:', response.statusCode);
        console.log('Body:', body);
        return callback(null, body);
    });
}

// Подписать транзакцию (используется секретный ключ пользователя)
function signTx(unsignedTx, privateKeyWif) {
    var privateKey = bitcoin.ECKey.fromWIF(privateKeyWif);
    var tx = bitcoin.Transaction.fromHex(unsignedTx);
    var insLength = tx.ins.length;
    for (var i = 0; i < insLength; i++) {
        tx.sign(i, privateKey);
    }
    return tx.toHex(); // signedTxHex
}

// Отослать транзакцию в сеть биткоина
function broadcastTx(signedTxHex, callback) {
    var transaction = {
        'txHex': signedTxHex
    };
    postToApi('broadcast', transaction, callback);
}

module.exports = {
    assetID,
    generateNewWallet,
    postToApi,
    getFromApi,
    signTx,
    broadcastTx
};
