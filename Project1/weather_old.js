var request = require('request');
var url='http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b1b15e88fa797225412429c1c50c122a1';
module.exports=function(callback){
    request({
    url :url,
    json: true
},function(error, response, body){
    if(error){
        console.log('Unable to fetch weather');
    }else{
        console.log('It\'s ' + body.main.temp + ' in ' + body.name );
    }
});


console.log('After request');
};
