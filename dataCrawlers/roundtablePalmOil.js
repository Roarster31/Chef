/*
node roundtablePalmOil.js [company name] 

returns Y or N depending on whether the company is a member of the round table
ro
*/
var http = require("http"),
	request = require('request'),
	cheerio = require("cheerio"),
	urlParser = require("url");
	
// Grab all the inputs from the console
// only productname is required
var query = encodeURIComponent(process.argv[2]);

// Create url
var url = "http://www.rspo.org/members?keywords="+query;

// Call web request
request(url, function(error, response, body) {
	if (!error && response.statusCode == 200) {

		var $ = cheerio.load(body);
	
		if ($('.table-responsive table tbody tr').length > 0){
			console.log("Y");
		} else {
			console.log("N");
		}
		
	}
});
