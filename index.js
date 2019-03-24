const express = require('express');
const path = require('path');
const https = require('https');
const request = require('request');
var Promise = require('promise');
var firebase = require("firebase");

const app = express();

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCjdIT-abgL0KxsPLUP3f7n3GtefLNw3G4",
  authDomain: "ulparakatest.firebaseapp.com",
  databaseURL: "https://ulparakatest.firebaseio.com",
  storageBucket: "ulparakatest.appspot.com",
};
firebase.initializeApp(config);
console.log("Firebase initialized");

app.get('*', (req, res) => {
	console.log("App running");
  res.json({'success': 'no errors'});
    //res.sendFile(path.join(__dirname+'/velocity/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
