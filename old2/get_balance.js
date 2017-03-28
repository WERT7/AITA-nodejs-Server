/**
 * Created by WERT on 18-Mar-17.
 */

// Баланс придётся проверять так: запрос на всех, у кого есть валюта, и там искать нужный адрес и количество.
// По идее надо делать запрос на адрес, но там выдаётся только список транзаций, не восстанавливать же по этой херне баланс...
// http://coloredcoins.org/documentation/#AssetHolders

const methods = require('./../methods.js');

function get_balance(address) {
    methods.getFromApi('stakeholders', methods.assetID, function(err, body) {
        if (err)
            console.log('error: ', err);
        else {
            for (let i = 0; i < body.holders.length; i++) {
                let holder = body.holders[i];
                if (holder.address == address) {
                    console.log(address + ' balance: ' + holder.amount); // здесь баланс
                    break;
                }
            }
        }
    });
}

module.exports = get_balance;
