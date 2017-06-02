var express = require('express');
var cluster=require('cluster');
var bp= require('body-parser');
var _=require('underscore');
var mongoclient=require('mongodb').MongoClient;
   
if(cluster.isMaster){
    var cpuCount=require('os').cpus().length;
     console.log('Master cluster setting up ' + cpuCount + ' workers...');
    for(var i=0;i<cpuCount;i++){
        cluster.fork();
    }
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
}else{
     var app=express();

    var pid=1;
    var mytask =[];
    var db;

    mongoclient.connect('mongodb://admin:admin@ds147599.mlab.com:47599/nitidb',(err,database)=>{
        if(err){
            return console.log(err);
        }
        db=database;
    })
    app.use(express.static('public'));
    app.use(bp.json());

    app.get('/showtask', function(req,res){
       /* db.collection('mytasks').find().toArray((err,result)=>{
            if(err){
                return console.log(err);
            }
            res.send("Hello From worker "+ cluster.worker.id);
        })*/
         res.send("Hello From worker "+ cluster.worker.id);
    })

    app.get('/showtask/:id', function(req,res){
        var inId=parseInt(req.params.id,10);
        var matchedData=_.findWhere(mytask,{id:inId});
        if(matchedData){
            res.json(matchedData);
        }else{
            res.json(404).send();
        }
    })
    app.delete('/deletetask', function(req,res){
        db.collection('mytasks').findOneAndDelete({name: req.body.name},(err,result)=>{
            if(err){
                return res.send(500,err);
            }
            res.send('record deleted');
        })
    })
    app.post('/postmytask', function(req,res){
        db.collection('mytasks').save(req.body,(err,result)=>{
            if(err){
            return console.log(err);
            }
            console.log('saved to database')
        })
    
    })
    

app.listen(3000, function(){
    console.log('server is started');
});
}
