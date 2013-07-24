var request = require('request');
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 5000);
var io = require('socket.io').listen(server)

app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
  
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

INSTAURL = "https://api.instagram.com/v1/tags/salemis/media/recent?client_id=";
client = process.env.CLIENT_ID;
next_url = '';

io.sockets.on('connection', function (socket) {
	console.log('A connection')
	socket.emit('photos', photos);
	
	socket.on('getphotos', function(){
		getPhotos(INSTAURL,client);
	});
	
	socket.on('next', function(){
		console.log('getting new photos');
		getPhotos(next_url);
	});
});

photos = new Array();
ids = new Array();
getPhotos(INSTAURL,client);

function getPhotos(url,client,callback){	
	if (client){
		fullUrl = url+client;
	} else {
		fullUrl = url;
	}
	console.log(fullUrl);
	request.get(fullUrl, function (error, response, data) {
		if (!error && response.statusCode == 200) {
			console.log("We got data");
			iteratePhotos(data);
			// Just here in case we need a callback at some point, used in testing mainly
			if (callback) {
				callback();
			}
		};
	});
};

function iteratePhotos(data){
	console.log("iterate photos called")
	dataParse = JSON.parse(data);
	media = dataParse.data;
	for (var i in media) {
		photo = media[i];
		value = havePhoto(photo.id, ids)
		if (!value) {
			photos.push(photo);
			ids.push(photo.id);
			io.sockets.emit('new', photo)
			console.log(photo.id + " is new")
		} else {
			console.log(photo.id + " isn't new")
		}
	}
	next_url = dataParse.pagination.next_url;
	if (next_url == undefined){
		console.log("Got all the possible photos");
		io.sockets.emit('done');
	}
};

function havePhoto(obj,arr) {
    return (arr.indexOf(obj) != -1);
}