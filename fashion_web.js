// fashion_web.js
var express = require("express");
var logfmt = require("logfmt");
var mongo = require('mongodb'); //npm install
var mongoskin = require('mongoskin'); //npm install
var bodyParser = require('body-parser'); //npm install
var app = express();
var mongoURL = process.env.MONGOLABL_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mdb' //needed to add MONGOHQ to Heroku
var db = mongoskin.db(mongoURL, {safe:true})

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.param('collectionName', function(req,res,next,collectionName){
	req.collection = db.collection(collectionName)
	return next()
})

app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
  res.send('Hello World!');

});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

//get request for all users
app.get('/users',function(req,res){
	var collection = db.collection("users")

	collection.find({},{}).toArray(function(e,results){
		console.log(e);
		if(e) res.status(500).send()
			res.send(results)
	})
})

//get request for one user given his facebook ID
app.get('/users/:id',function(req,res){
	var collection = db.collection("users")
	console.log(req.params.id)
	collection.find({"userID": { $in: [req.params.id ] }},{}).toArray(function(e,results){
		console.log(e);
		if(e) res.status(500).send()
			res.send(results)
	})
})

app.put('/users/:id/profilePictures', function(req, res, next) {

  var collection = db.collection('users')

  var str1 = "profilePictures"; //key
  
  
 var action = {};
 action[str1] = req.body;
  collection.updateById(req.params.id, {$set: //inc for integers, set for strings
    {followingDictionary:req.body}
  }, {safe: true, multi: false}, function(e, result){
    if (e) res.status(500).send()
    res.send(req.body)
  })
})


//create new user
app.post('/users', function(req,res){
	var collection = db.collection("users")
	console.log("Put Request")
	console.log(req.body)
	collection.insert(req.body,{},function(e,results){
		if (e) res.status(500).send()
			res.send(results)
	})
})

//create new item
app.post('/items', function(req,res){
	var collection = db.collection("items")
	console.log(req.body)
	collection.insert(req.body,{},function(e,results){
		if (e) res.status(500).send()
			res.send(results)
	})
})

//get request for all items
app.get('/items',function(req,res){
	var collection = db.collection("items")

	collection.find({},{}).toArray(function(e,results){
		console.log(e);
		if(e) res.status(500).send()
			res.send(results)
	})
})

//get request for items this user liked
app.get('/items/:id',function(req,res){
	var collection = db.collection("items")
	collection.find({"likedBy": { $in: [req.params.id ] }},{}).toArray(function(e,results){
		console.log(e);
		if(e) res.status(500).send()
			res.send(results)
	})
})