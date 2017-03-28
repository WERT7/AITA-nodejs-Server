// const httpify = require('httpify')
//
// address = 'mfiBbCaSk8WVu12axqyPN39zBj41Livxta';
// amount = 1000;
//
//     httpify({
//       method: 'POST',
//       url: `https://api.blockcypher.com/v1/btc/test3/faucet?token=fdeef36e3ed24196a1c37cee07c9b63d`,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ address, amount }),
//     }, function (err, result) {
//       if (err) return reject(err)
//
//         console.log(result.body);
//       if (result.body.code === 401) {
//         return reject(new Error('Hit faucet rate limit; ' + result.body.msg))
//       } else if (result.body.code === 0) {
//             return reject(new Error(result.body.msg))
//       }
//             else console.log(result.body)
//     });

var request = require('request');
var blockcypher_token = 'fdeef36e3ed24196a1c37cee07c9b63d';

/* По докам, фасет откажет в операции, если на кошельке > 10 000 000 сатоши (0.1 BTC)
 * Или если сумма за раз > 500 000 сатоши
 * https://www.blockcypher.com/dev/bitcoin/#testing */

function getFreeCoins(address, amount) {
    // request.post({
    //         url: 'https://api.blockcypher.com/v1/btc/test3/faucet?token=' + blockcypher_token,
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(address, amount)
    //     },
    //     function (error, response, body) {
    //         if (error) {
    //             // todo
    //         }
    //         if (typeof body === 'string') {
    //             body = JSON.parse(body)
    //         }
    //         console.log('Status: ', response.statusCode);
    //         console.log('Body: ', JSON.stringify(body));
    //     });
    var options = {
        method: 'POST',
        url: 'https://api.blockcypher.com/v1/btc/test3/faucet',
        qs: { token: blockcypher_token },
        headers: { 'content-type': 'application/json' },
        body: { 'address': address, 'amount': amount },
        json: true
    };

    request(options, function (error, response, body) {
        if (error)
            console.log(error);
        else {
            console.log('Free coins sent: [' + address + '], ' + amount);
            console.log(body);
        }
    });
}

module.exports = getFreeCoins;
