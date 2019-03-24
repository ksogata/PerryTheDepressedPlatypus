const express = require('express');
const path = require('path');
const https = require('https');
const request = require('request');
var Promise = require('promise');
var firebase = require("firebase");
var bodyParser = require('body-parser');
var cors = require('cors')

var admin = require('firebase-admin');

var serviceAccount = require('./ulparakatest.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.options('*', cors());

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCjdIT-abgL0KxsPLUP3f7n3GtefLNw3G4",
  authDomain: "ulparakatest.firebaseapp.com",
  databaseURL: "https://ulparakatest.firebaseio.com",
  storageBucket: "ulparakatest.appspot.com",
};

firebase.initializeApp(config);
var firebaseRef = firebase.database();

//GET all the event data.
app.get('/api/getAllData', async (req, res) => {
  var final = [];
  const eventref = firebaseRef.ref('events');
  var tempArray = [];
  eventref.on('value', function(snapshot){
    for(var key in snapshot.val()){
      //var jsonO = {};
      //jsonO[key] = snapshot.val()[key];
      tempArray.push(snapshot.val()[key]);

      if (tempArray.length == 3) {
        final.push(tempArray);
        tempArray = [];
      }
    }
    if (tempArray.length != 0) {
      final.push(tempArray);
    }
    res.json({"result":final});
  }, function (error) {
    console.log("error: "+ error);
  });
});

//GET all search queries that start with the searched string. EX. Search string = Ba. Will return all events starting with "Ba".
app.get('/api/getSearchResult', async (req, res) => {
  console.log(req.query.name);
  const eventref = firebaseRef.ref('/events').orderByChild('name').startAt(req.query.name).endAt(req.query.name+'\uF7FF');
  var final = [];
  var tempArray = [];
  eventref.on('value', function(snapshot){
    //console.log(snapshot.val());
    for(var key in snapshot.val()){
      //var jsonO = {};
      //jsonO[key] = snapshot.val()[key];
      tempArray.push(snapshot.val()[key]);

      if (tempArray.length == 3) {
        final.push(tempArray);
        tempArray = [];
      }
    }
    if (tempArray.length != 0) {
      final.push(tempArray);
    }
    res.json({"result":final});
  }, function (error) {
    console.log("error: "+ error);
  });
});

function postEvent(experience_name, desc, tags, capacity, addr1, addr2, city, state, zip) {
  var postData = {
    description: desc,
    capacity: capacity,
    name: experience_name,
    state: state, 
    address1: addr1,
    address2: addr2, 
    city: city,
    zip: zip,
    eventtags: tags.split(',')
  }; 

  var newPostKey = firebaseRef.ref().child('events').push().key;
  var updates = {};
  updates['/events/' + newPostKey] = postData;
  console.log(postData);
  return firebaseRef.ref().update(updates);
}

app.post('/api/event', (req, res) => {
  try {
  postEvent(req.body.experience_name, req.body.desc, req.body.eventtags, req.body.capacity, req.body.addr1, req.body.addr2, req.body.city, req.body.state, req.body.zip);
  // res.header('Content-Type', 'application/json');
  res.json({"Message": "Success import"});
  }
  catch (e) {
    console.log(e);
    res.json({"Message": "Check JSON fields"});
  }
})

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
