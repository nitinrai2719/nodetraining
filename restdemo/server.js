var express = require('express');
var bp= require('body-parser');
var _=require('underscore');
var app=express();
var pid=1;
var mytask =[];
app.use(express.static('public'));
app.use(bp.json());

app.get('/showtask', function(req,res){
    res.json(mytask);
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
app.delete('/deletetask/:id', function(req,res){
    var inId=parseInt(req.params.id,10);
    var matchedData=_.findWhere(mytask,{id:inId});
    if(matchedData){
        task=_.without(mytask,matchedData);
        res.json(matchedData);
    }else{
        res.json({"error":"Id not found"})
    }
})
app.post('/postmytask', function(req,res){
    var body=req.body;
    body.id=pid++;
    mytask.push(body);
    res.json(body);
})
app.listen(3000, function(){
console.log('server is started');
});

