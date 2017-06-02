var weather = require('./weather.js');
var location = require('./mylocation.js');
weather(function(currentWeather){
    console.log(currentWeather);
});

location(function(location){
    if(!location){
        console.log('unable to guess location');
        return;
    }
    console.log('log/lat : '+location.loc )
});