var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var bp= require('body-parser');
var _=require('underscore');
var fs = require('fs');
var mongoclient=require('mongodb').MongoClient;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    var db;

    mongoclient.connect('mongodb://admin:admin@ds147599.mlab.com:47599/nitidb',(err,database)=>{
        if(err){
            return console.log(err);
        }
        db=database;
    })
    app.use(express.static('public'));
    app.use(bp.json());
     db.collection('mytasks').save('test',(err,result)=>{
            if(err){
            return console.log(err);
            }
            console.log('saved to database')
        })

  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
