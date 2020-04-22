var express = require('express');
var app = express();
var baseUrl = "https://api.companieshouse.gov.uk/company/";
var bodyparser = require('body-parser');
var assert = require('assert');
var jQuery = require("jquery");
var request = require('request');
var appointmentId;

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://mongodb-stitch-risk_poc-gkzfm:poc1@cluster0-xoq2x.mongodb.net/mflix';

app.get('/appointment/:id', function(req,res){

	 res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true); 

    appointmentId=req.params.id;
    console.log(appointmentId); 

    var result= getAppointmentDataDB(appointmentId);
    console.log("result"+result);  

    var finalresult={};

    result.then(function(out1){
    	console.log("result"+out1);    	
    	if(out1!=null){
    		finalresult=out1;
    		res.send(finalresult);
    	}else
    	{ 
    	var appointmentresult=getAppointmentData(appointmentId);
    	appointmentresult.then(function(appointmentout){
    	var finalresult1=insertAppointmentData(appointmentout,appointmentId);
    			finalresult1.then(function(newout){
    				finalresult=newout;    				
    				res.send(finalresult);
    			},
    			function(error){
    			});


    	insertAppointmentData(appointmentout);
    	res.send(appointmentout);
    		},function(error){
    			});	
    		    		
    	} 
    	
    },
    function(error){
    		});

    });


function getAppointmentDataDB(appointmentId){
	return new Promise(function(resolve,reject)
			{
		MongoClient.connect(url, function(err, db) {
  		if (err) throw err;  		
  		var dbo = db.db("mflix");   		
  		var mysearch={"links.self":"/officers/"+appointmentId+"/appointments"}  		
  			dbo.collection("appointment").findOne(mysearch, function(err, result) {
    		if(err){
				reject(err);
			}else{
				resolve(result);
			}   	
    	db.close();
  });

  	});

		})

}

function insertAppointmentData(appointmentout,appointmentId)
{
return new Promise(function(resolve,reject)
	{
	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mflix");
  
  dbo.collection("appointment").insertOne(appointmentout, function(err, res) {
    if(err){
				reject(err);
			}else{
				console.log("Appointment document inserted");
				var newgetdata = getAppointmentData(appointmentId);
    			newgetdata.then(function(newgetout){    			
    			resolve(newgetout);     			
    		},
    		function(error){
    		});
			}
    
    db.close();
  });
});
});
}


function getAppointmentData(appointmentId) {
	console.log("Inside getAppointmentData");			

	// Set the headers
	var headers = {
    'Authorization':'Basic Nm1vdDZqakEyVG15N3BpZFk0c2hXejFYWHduVmo3X0pZdXVRV2lzNTo=',
	}

	// Configure the request
	var options = {
    	url: 'https://api.companieshouse.gov.uk/officers/'+appointmentId+'/appointments',
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


var server = app.listen(3001,function() {});