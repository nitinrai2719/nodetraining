var crypto=require('crypto-js');
var secretMessage ={
    name: 'facebook',
    secretName: '007'
};
var secretKey='123abc';
var encryptMessage = crypto.AES.encrypt(JSON.stringify(secretMessage),secretKey);
console.log("Encrypted Message: " + encryptMessage);


var bytes=crypto.AES.decrypt(encryptMessage,secretKey);
var decryptedMessage = JSON.parse(bytes.toString(crypto.enc.Utf8));
console.log("After Decrption ");
console.log( decryptedMessage);