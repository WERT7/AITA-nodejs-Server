var bitcoin = require('bitcoinjs-lib');
var request = require('request');

function postToApi(api_endpoint, json_data, callback) {
    console.log(api_endpoint + ': ', JSON.stringify(json_data));
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
                body = JSON.parse(body);
            }
            console.log('Status: ', response.statusCode);
            console.log('Body: ', JSON.stringify(body));
            return callback(null, body);
        });
}

var signedTxHex = '01000000019c1b12dd1f5c6e6df9238ee1f224e9fe77575ec74224290d7843320f8dead32d010000006a473044022012cb8ec5e6659fa6d3e00329742663cca4221935729af77d4fc12297e5f55c4b02204881bc1a0ad8558eead164edf90c42a11c218ecb5fae46e598d01e4e2e29008a012103da9fca069b6f7ba46665856b9f1f06db9222d3767060f8abbd2781a1b4ae1e5effffffff030000000000000000086a06434302050a10c0700100000000001976a9145289d5269c1668d41a96c121cf61437c8a3ff2a288ac58020000000000001976a9145289d5269c1668d41a96c121cf61437c8a3ff2a288ac00000000';
var transaction = {
    'txHex': signedTxHex
};

postToApi('broadcast', transaction, function(err, body) {
    if (err) {
        console.log('error: ', err);
    }
});