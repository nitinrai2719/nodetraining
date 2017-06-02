var storage = require('node-persist');
var crypto = require('crypto-js');
storage.initSync();
var argv = require('yargs')
	.command('adduser', 'Greets the user', function (yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Your first name goes here',
				type: 'string'
			},
			lastname: {
				demand: true,
				alias: 'l',
				description: 'Your last name goes here',
				type: 'string'
			},
            projectname: {
				demand: true,
				alias: 'p',
				description: 'Name of the project',
				type: 'string'
			},
            location: {
				demand: true,
				alias: 'c',
				description: 'location',
				type: 'string'
			},
            employmentType: {
				demand: false,
				alias: 'e',
				description: 'Employment type',
				type: 'string'
			},
            masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Master password',
				type: 'string'
			}
		}).help('help');
	})
	.command('get', 'Get an existing user', function (yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Account name (eg: Twitter, Facebook)',
				type: 'string'
			},
            masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Master password',
				type: 'string'
			}
		}).help('help');
	})
	.help('help')
	.argv;
var command = argv._[0];

console.log(argv);

function createUser (account,masterPassword) {
     console.log('inside create user!');
	var accounts = storage.getItemSync('accounts');

	if (typeof accounts === 'undefined') {
		accounts = [];
	}
   
    
    
	accounts.push(account);
    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
	storage.setItemSync('accounts', encryptedAccounts.toString());
      console.log('inside create user!' + encryptedAccounts);
	return account;
}

function getuser(accountName,masterPassword) {
	var encryptedAccount = storage.getItemSync('accounts');
	var accounts = [];

	// decrypt
	if (typeof encryptedAccount !== 'undefined') {
		var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
	}

	var matchedAccount;

	accounts.forEach(function (account) {
		if (account.name === accountName) {
            matchedAccount=account;
			
		}
	});

	return matchedAccount;
}

if (command === 'adduser') {
    try{
        var createdAccount = createUser({
            name: argv.name,
            lastname: argv.lastname,
            projectname: argv.projectname,
            location: argv.location,
            employmentType:argv.employmentType

        },argv.masterPassword);
        console.log('User created!');
        console.log(createdAccount);
    }catch(e){
        console.log('user can not be created');
    }
} else if (command === 'get') {
    try{
        var fetchedAccount = getuser(argv.name,argv.masterPassword);

        if (typeof fetchedAccount === 'undefined') {
            console.log('Account not found');
        } else {
            console.log('Account found!');
            console.log(fetchedAccount);
        }
    }catch(e){
       console.log('can not fetch user details'); 
    }
}