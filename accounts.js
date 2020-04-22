var express = require('express');
var app = express();
var baseUrl = "https://api.companieshouse.gov.uk/company/";
var bodyparser = require('body-parser');
var assert = require('assert');
var jQuery = require("jquery");
var request = require('request');
var compId;
var accoutArray=[];
var accountdata={};


var fs = require('fs');
//var file=fs.createReadStream('download.pdf');
//var stat=fs.statSync('download.pdf');







var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://mongodb-stitch-risk_poc-gkzfm:poc1@cluster0-xoq2x.mongodb.net/mflix';

app.get('/document/:id', function(req,res){

 //res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
   //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
   // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true); 


    //res.setHeader('Content-Length',stat.size);
    //res.setHeader('Content-Type','application/octet-stream'); 
    //res.setHeader('Content-Disposition','filename=download.pdf');

    compId=req.params.id;
    console.log(compId);
    getDocumentData(compId,res);  

    // res.send("Success"); 

    });







function getDocumentData(compId,res) {
	console.log("Inside getDocumentData");			

	// Set the headers
	var headers = {
    'Authorization':'Basic Nm1vdDZqakEyVG15N3BpZFk0c2hXejFYWHduVmo3X0pZdXVRV2lzNTo=',
	}

	// Configure the request
	var options = {
    	url: 'https://document-api.companieshouse.gov.uk/document/'+compId+'/content',
    	method: 'GET',
    	headers: headers,
	}	

    request.get(options).on('response',function(response){
        res.setHeader('Content-Type',response.headers['content-type']);
    }).pipe(res);


    //request(options).pipe(fs.createWriteStream(compId+'.pdf'))
    
}


var server = app.listen(3002,function() {});