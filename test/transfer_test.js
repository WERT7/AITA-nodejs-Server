/**
 * Created by WERT on 18-Mar-17.
 */

const transfer = require('../old2/transfer.js');

var address1 = 'miCdtUnriMJAeDQCxYqFSbiStxhnZDAdLx';
var key1 = 'L5CknSMYN78WimWZbKU3hg9fBVCd6uaFdC66npBo8ZCSY86CDrXN';
var address2 = 'myeSdtYZKX2kvEmVZMvxa3nvasEJuzf2v9';
var key2 = 'L2YCm7gFAKviLGidnZU9UGzJGZ9YAhtLUfT14cY7usKTzDN6GLvW';
var amount = 1;
var comment = 'zZz2';

transfer(address1, key1, address2, amount, comment);
