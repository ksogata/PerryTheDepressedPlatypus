const express = require('express');
const path = require('path');
const https = require('https');
const request = require('request');
var Promise = require('promise');
var firebase = require("firebase");
var bodyParser = require('body-parser');

var admin = require('firebase-admin');

var serviceAccount = require('./ulparakatest.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCjdIT-abgL0KxsPLUP3f7n3GtefLNw3G4",
  authDomain: "ulparakatest.firebaseapp.com",
  databaseURL: "https://ulparakatest.firebaseio.com",
  storageBucket: "ulparakatest.appspot.com",
};

firebase.initializeApp(config);
var firebaseRef = firebase.database();

app.get('/api/getAllData', async (req, res) => {
  var final = [];
  const eventref = firebaseRef.ref('events');
  eventref.on('value', function(snapshot){
    for(var i in snapshot.val()){
      //console.log(snapshot.val()[i]);
      var hi = i.toString()
      var jsonO = {};
      jsonO[i] = snapshot.val()[i];
      final.push(jsonO);
    }
    res.json({"result":final});
  }, function (error) {
    console.log("error: "+ error);
  });
});

app.get('/api/getSearchResult', async (req, res) => {
  const eventref = firebaseRef.ref('/events').orderByChild('name').startAt(req.body.name).endAt(req.body.name+'\uF7FF');
  var final = [];
  eventref.on('value', function(snapshot){
    //console.log(snapshot.val());
    for(var i in snapshot.val()){
      //console.log(snapshot.val()[i]);
      var hi = i.toString()
      var jsonO = {};
      jsonO[i] = snapshot.val()[i];
      final.push(jsonO);
    }
    res.json({"result":final});
  }, function (error) {
    console.log("error: "+ error);
  });

});

app.get('/api/uma', (req, res) => {
	var events = {}
  db.collection('event').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      res.json({"sucess": doc});
      events.info = doc;
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });


});

app.get('*', (req, res) => {
	console.log("App running");
  res.json({'success': 'no errors'});
});

const port = process.env.PORT || 5000;
app.listen(port);


//first name last name
