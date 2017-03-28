var bitcoin = require('bitcoinjs-lib');
var request = require('request');

funded_address = 'mo3NpZaQjJ5iHBLLnPmwAp9awEvvirDKtR';

function postToApi(api_endpoint, json_data, callback) {
    console.log(api_endpoint+': ', JSON.stringify(json_data));
    request.post({
            url: 'http://testnet.api.coloredcoins.org:80/v3/' + api_endpoint,
            headers: {'Content-Type': 'application/json'},
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
    'issueAddress': funded_address,
    'amount': 10,
    'fee': 5000,
    'flags': {
        splitChange: true
    }
};

postToApi('issue', asset, function(err, body) {
    if (err) {
        console.log('error: ', err);
    }
});
