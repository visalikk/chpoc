var express = require('express');
var app = express();
var baseUrl = "https://api.companieshouse.gov.uk/company/";
var bodyparser = require('body-parser');
var assert = require('assert');
var jQuery = require("jquery");
var request = require('request');

var compId;
var transId;


app.get('/chargefile/:id/:tId', function(req,res){

	console.log("Inside")

	 res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true); 

    compId=req.params.id; 

    transId= req.params.tId;  

    var result= getChargesFile(compId,transId);

    result.then(function(out1){
    	res.send(out1.links.document_metadata);
    },function(error){
    		});

    })


function getChargesFile(compId,transId) {
	console.log("Inside getChargesFile");	
	//var transId="MjAwOTc3MjM0NWFkaXF6a2N4";	

	// Set the headers
	var headers = {
    'Authorization':'Basic Nm1vdDZqakEyVG15N3BpZFk0c2hXejFYWHduVmo3X0pZdXVRV2lzNTo=',
	}

	// Configure the request
	var options = {
    	url: 'https://api.companieshouse.gov.uk/company/'+compId+'/filing-history/'+transId,
    	method: 'GET',
    	headers: headers,
	}	

	return new Promise(function(resolve,reject)
	{
		request.get(options,function(err,resp,body)
		{
			if(err){
				reject(err);
			}else{				
				resolve(JSON.parse(body));
			}
		})
	})
    
}


var server = app.listen(3003,function() {});