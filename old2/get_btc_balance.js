/**
 * Created by WERT on 18-Mar-17.
 */

var request = require("request");

function getBtcBalance(address) {
    var options = {
        method: 'GET',
        url: 'https://api.blockcypher.com/v1/btc/test3/addrs/' + address + '/balance',
    };

    request(options, function (error, response, body) {
        if (error)
            console.log(error);
        else {
            console.log(body);
            body = JSON.parse(body);
            console.log(body.final_balance); // Вот это нужно. final_balance включает неподтверждённые транзакции, но всё равно ими можно пользоваться для переводов и т.д., я проверил
        }
    });
}

module.exports = getBtcBalance;
