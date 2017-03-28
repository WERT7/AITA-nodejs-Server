'use strict';

const request = require('request');
const express = require('express');
const app = express();

const methods = require('./methods');

app.get('/generate_new_wallet', (req, res) => {
    res.status(200).json(methods.generateNewWallet());
});

// Возвращает число - количество бонусов на запрошенном кошельке
app.get('/get_balance/:address', (req, res) => {
    methods.getFromApi('stakeholders', methods.assetID, function(err, body) {
        if (err)
            res.status(500).send(err);
        else {
            let address = req.params.address;
            for (let i = 0; i < body.holders.length; i++) {
                let holder = body.holders[i];
                if (holder.address == address) {
                    res.status(200).send(String(holder.amount));
                    break;
                }
            }
            res.status(200).send('0'); // если адреса нет в списке холдеров, то считаем, что баланс = 0. Вообще говоря, адрес может быть неправильный, но щас лень проверять это...
        }
    });
});

// Возвращает число - количество сатоши на запрошенном кошельке (1 биткоин = 100 000 000 сатоши)
app.get('/get_btc_balance/:address', (req, res) => {
    var options = {
        method: 'GET',
        url: 'https://api.blockcypher.com/v1/btc/test3/addrs/' + req.params.address + '/balance',
    };

    request(options, function (error, response, body) {
        if (error)
            res.status(500).send(error);
        else {
            body = JSON.parse(body);
            res.status(200).send(String(body.final_balance)); // Вот это нужно. final_balance включает неподтверждённые транзакции, но всё равно ими можно пользоваться для переводов и т.д., я проверил
        }
    });
});

// Получить бесплатно тестовых биткоинов, используя API Blockcypher
// https://www.blockcypher.com/dev/bitcoin/#testing
app.post('/get_free_coins', (req, res) => {
    let blockcypher_token = 'fdeef36e3ed24196a1c37cee07c9b63d';
    let address = req.query.address;
    let amount = Number(req.query.amount);

    let options = {
        method: 'POST',
        url: 'https://api.blockcypher.com/v1/btc/test3/faucet',
        qs: { token: blockcypher_token },
        headers: { 'content-type': 'application/json' },
        body: { 'address': address, 'amount': amount },
        json: true
    };

    request(options, function (error, response, body) {
        if (error)
            res.status(500).send(error);
        else {
            if (body.tx_ref)
                res.status(200).send(body);
            else
                res.status(500).send('Faucet error: ' + body);
        }
    });
});

// Выпуск бонусов. Выпускает "мастер-аккаунт" и сразу переводит на адрес, который запросил выпуск
app.post('/issue', (req, res) => {
    var issuerAddress = 'myeSdtYZKX2kvEmVZMvxa3nvasEJuzf2v9'; // всегда один
    var issuerPrivateKey = 'L2YCm7gFAKviLGidnZU9UGzJGZ9YAhtLUfT14cY7usKTzDN6GLvW';

    var toAddress = req.query.address;
    var amount = req.query.amount;

    var asset = {
        'issueAddress': issuerAddress,
        'amount': amount,
        'fee': 5000,
        'reissueable': true,
        'flags': {
            splitChange: true
        },
        'metadata': {
            assetName: "Test AITA currency",
            issuer: "App in the Air",
            description: "Universal currency for AITA Awards Miledger"
        },
        'transfer':[{
            'address': toAddress,
            'amount': amount
        }]
    };

    methods.postToApi('issue', asset, function(err, body) {
        if (err) {
            res.status(500).send('Issuance error: ' + err);
        }
        else {
            if (body.status != 500) {
                methods.broadcastTx(methods.signTx(body.txHex, issuerPrivateKey), function (err, body) {
                    if (err)
                        res.status(500).send('Issuance error: ' + err);
                    else {
                        if (body.status != '500') {
                            res.status(200).json({
                                'recipient': toAddress,
                                'amount': amount,
                                'txid': body.txid
                            });
                        }
                        else
                            res.status(500).send(body);
                    }
                });
            }
            else {
                res.status(500).send('Seems like not enough satoshi to pay for transaction...');
            }
        }
    });
});

// Перевод бонусов
app.post('/transfer', (req, res) => {
    var fromAddress = req.query.from;
    var fromPrivateKey = req.query.from_pk;
    var toAddress = req.query.to;
    var amount = req.query.amount;
    var comment = req.query.comment;

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
            res.status(500).send('Transfer error: ' + err);
        }
        else {
            if (body.status != 500) {
                let signedTxHex = methods.signTx(body.txHex, fromPrivateKey);
                methods.broadcastTx(signedTxHex, function (err, body) {
                    if (err)
                        res.status(500).send(err);
                    else {
                        if (body.status != '500')
                            res.status(200).send(body.txid);
                        else
                            res.status(500).send(body);
                    }
                });
            }
            else
                res.status(500).send('Seems like not enough satoshi to pay for transaction...');
        }
    });
});

// Комментарий к транзакции не записывается в базу, его достаём через API
app.get('/get_tx_comment/:txid', (req, res) => {
    var txid = req.params.txid;
    var index = '0';

    methods.getFromApi('assetmetadata', methods.assetID + '/' + txid + ':' + index, function(err, body) {
        if (err)
            res.status(500).send(error);
        else {
            let comment = body.metadataOfUtxo.data.description;
            if (comment)
                res.status(200).send(comment); // это и есть комментарий к транзакции
            else
                res.status(200).send('No comment found for this transaction');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
