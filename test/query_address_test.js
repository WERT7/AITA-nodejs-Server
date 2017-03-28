/**
 * Created by WERT on 18-Mar-17.
 */

const methods = require('../methods.js');

var address = 'myeSdtYZKX2kvEmVZMvxa3nvasEJuzf2v9';

methods.getFromApi('addressinfo', address, function(err, body) {
    if (err)
        console.log('error: ', err);
    else
        console.log(body.utxos[0].assets);
});

