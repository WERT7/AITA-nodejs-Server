/**
 * Created by WERT on 16-Mar-17.
 */

const methods = require('./../methods.js');
const index = '0'; // всегда так

function get_tx_comment(txid) {
    methods.getFromApi('assetmetadata', methods.assetID + '/' + txid + ':' + index, function(err, body) {
        if (err)
            console.log('error: '+err);
        else
            console.log('tx_comment', body.metadataOfUtxo.data.description); // это и есть комментарий к транзакции
    });
}

module.exports = get_tx_comment;
