const express = require('express');
const path = require('path');
const https = require('https');
const request = require('request');
var Promise = require('promise');

const app = express();

var users = ["Kyung Lee", "Simon Wu", "Subura Pyegnwe", "Uma Last", "Annie Last", "Kevin Saratoga"];

app.get('/api/getUsers', (req, res) => {
  res.json({"sucess": users});

});

app.get('*', (req, res) => {
	console.log("App running");
  res.json({'success': 'no errors'});
    //res.sendFile(path.join(__dirname+'/velocity/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);


//first name last name
