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





var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://mongodb-stitch-risk_poc-gkzfm:poc1@cluster0-xoq2x.mongodb.net/mflix';

app.get('/company/:id', function(req,res){

	 res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true); 

    compId=req.params.id;
    var result= getDataDB(compId);
    console.log("result"+result);

    var finalresult={};

    result.then(function(out1){
    	console.log("result"+out1);    	
    	if(out1!=null){
    		finalresult=out1;
    		res.send(finalresult);
    	}else{    		
    		console.log("Document Not Present in DB");    		
    		var data1=getData(compId);
    		data1.then(function(out){
    			//console.log(out);
    			var finalresult1=insertDataDB(out,compId);
    			finalresult1.then(function(newout){
    				finalresult=newout;
    				console.log("finalresult"+finalresult.company_number);
    				res.send(finalresult);
    			},
    			function(error){
    			});
    			    			
    		},
    		function(error){
    		});	    		
    	} 
    	//console.log("+++++++++final"+finalresult.company_number);   	
    	//res.send(finalresult);
    },
    function(error){
    		});

});


function getDataDB(compId){
	return new Promise(function(resolve,reject)
			{
		MongoClient.connect(url, function(err, db) {
  		if (err) throw err;  		
  		var dbo = db.db("mflix");  		
  		console.log("CompanyId"+compId);
  		var mysearch={company_number:compId}
  		
  			dbo.collection("company_initial_new").findOne(mysearch, function(err, result) {
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


function insertDataDB(data,compId)
{
	
	return new Promise(function(resolve,reject)
			{
	MongoClient.connect(url, function(err, db) {
  		if (err) throw err;
  		var dbo = db.db("mflix");  		
  		dbo.collection("company_initial_new").insertOne(data, function(err, res) {
    	if(err){
				reject(err);
			}else{			
    		console.log("1 document inserted");

    		//getting  charges data from companyHouse
    		var chargesdata=getChargesData(compId);
    		chargesdata.then(function(chargesdataout){
    			console.log("chargesdataout")
    			//console.log(chargesdataout);
    			var updateout=updateData(compId,chargesdataout);
    			updateout.then(function(unewout){
    				//console.log(unewout);
    				resolve(unewout);
    			},function(error){

    			});

    			},
    		function(error){
    		});


    		//getting  Officers data from companyHouse
    		var officersdata=getOfficersData(compId);
    		officersdata.then(function(officersdataout){
    			console.log("officersdataout")
    			console.log(officersdataout);
    			//changing items to officeitems
    			officersdataout.officeitems = officersdataout.items;
				delete officersdataout.items;

				//changes links to officerlinks
				officersdataout.officerlinks = officersdataout.links;
				delete officersdataout.links;

    			var updateoutoff=updateData(compId,officersdataout);
    			updateoutoff.then(function(unewoutoff){
    				console.log(unewoutoff);
    				resolve(unewoutoff);
    			},function(error){

    			});

    			},
    		function(error){
    		});



    		//getting  Accounts data from companyHouse
    		var accountsdata=getAccountsData(compId);
    		accountsdata.then(function(accountsout){
                accoutArray=[];
				for(var c in accountsout.items)
                {   
                if(accountsout.items[c].category=='accounts') 
                accoutArray.push(accountsout.items[c]);                
                    
                }
                accountdata.accountInfo=accoutArray;
    			console.log("accountsout")
    			console.log(accountdata);

                ////////////////////

                accountsout.filingitems=accountsout.items;
                delete accountsout.items;
                accountsout.accountInfo=accoutArray;


                /////////////////

    			var updateout=updateData(compId,accountsout);
    			updateout.then(function(unewout){
    				//console.log(unewout);
    				resolve(unewout);
    			},function(error){

    			});

    			},
    		function(error){
    		});



    		//AfterInsertion --calling getDataDB Method

    		/*var newr = getDataDB(compId);
    		newr.then(function(insertout){
    			
    			console.log("insertout"+insertout.company_number);
    			resolve(insertout); 
    			
    		},
    		function(error){
    		});*/

    		 

    		}  		

    		db.close();
  });
});
	
});
}


function updateData(compId,chargesdata)
{
	console.log("Inside updateData");
	console.log(chargesdata);

return new Promise(function(resolve,reject)
			{
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mflix");
  var myquery = {company_number:compId};
  var newvalues = { $set: chargesdata };
  dbo.collection("company_initial_new").updateOne(myquery, newvalues, function(err, res) {
    if(err){
				reject(err);
			}else{
				console.log("1 document updated");	

				var newr = getDataDB(compId);
    			newr.then(function(insertout){
    			
    			console.log("insertout"+insertout.company_number);
    			resolve(insertout); 
    			
    		},
    		function(error){
    		});
			}  
    
    db.close();
  });
});
});
}





function getData(compId) {
	console.log("Inside getData");		
	var restGetUrl = baseUrl+compId

	// Set the headers
	var headers = {
    'Authorization':'Basic Nm1vdDZqakEyVG15N3BpZFk0c2hXejFYWHduVmo3X0pZdXVRV2lzNTo=',
	}

	// Configure the request
	var options = {
    	url: 'https://api.companieshouse.gov.uk/company/'+compId,
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



function getChargesData(compId) {
	console.log("Inside getChargesData");		
	var restGetUrl = baseUrl+compId

	// Set the headers
	var headers = {
    'Authorization':'Basic Nm1vdDZqakEyVG15N3BpZFk0c2hXejFYWHduVmo3X0pZdXVRV2lzNTo=',
	}

	// Configure the request
	var options = {
    	url: 'https://api.companieshouse.gov.uk/company/'+compId+'/charges',
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

function getOfficersData(compId) {
	console.log("Inside getOfficersData");		
	var restGetUrl = baseUrl+compId

	// Set the headers
	var headers = {
    'Authorization':'Basic Nm1vdDZqakEyVG15N3BpZFk0c2hXejFYWHduVmo3X0pZdXVRV2lzNTo=',
	}

	// Configure the request
	var options = {
    	url: 'https://api.companieshouse.gov.uk/company/'+compId+'/officers',
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

function getAccountsData(compId) {
	console.log("Inside getAccountsData");			

	// Set the headers
	var headers = {
    'Authorization':'Basic Nm1vdDZqakEyVG15N3BpZFk0c2hXejFYWHduVmo3X0pZdXVRV2lzNTo=',
	}

	// Configure the request
	var options = {
    	url: 'https://api.companieshouse.gov.uk/company/'+compId+'/filing-history',
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


var server = app.listen(3000,function() {});