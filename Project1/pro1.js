console.log('starting password manager');
var storage=require('node-persist');
storage.initSync();
storage.setItemSync('accounts',[{
    username:'nitin',
    pwd:'ammy'
}])
var accounts=storage.getItemSync('accounts');
console.log(accounts);
accounts.push({
    username:'rai',
    pwd:'ammy'
});
storage.setItemSync('accounts',accounts);
console.log(accounts);