/*
node marineAwardFinder.js [PRODUCTNAME] [(optional)BRAND] [(optional)PRODUCT TYPE i.e frozen, petfood etc] [(optional)BRAND]

will return conformation as to whether the product has a marine stewardship council award or not
*/
var http = require("http"),
	request = require('request'),
	parser = require("xml2json"),
	urlParser = require("url");
	
// Grab all the inputs from the console
// only productname is required
var query = encodeURIComponent(process.argv[2]);

//optional extras, if none present then input blank
var brand = "";
if (encodeURIComponent(process.argv[3]) != "undefined") { brand = encodeURIComponent(process.argv[3]);}

var productType = "";
if (encodeURIComponent(process.argv[4]) != "undefined") { productType = encodeURIComponent(process.argv[4]);}

var species = "";
if (encodeURIComponent(process.argv[5]) != "undefined") { species = encodeURIComponent(process.argv[5]);}

// Create url
var url = "http://www.msc.org/where-to-buy/product-finder/msc_cfps_atom_feed?keywords="+query+"&brand="+brand+"&product_type="+productType+"&species="+species+"&country=GB&order=";

// Call web request
request(url, function(error, response, body) {
	if (!error && response.statusCode == 200) {

		// Parse the xml into json
		var result = parser.toJson(body); 
		var jsonResult = JSON.parse(result);

		// Determine the results from the search
		if(jsonResult.feed.entry.length > 0) {
			console.log("Product does have a marine award");
		} else {
			console.log("Product does NOT have a marine award");
		}

		// Extra code if the entrys need to be looped through
		/*for (i = 0; i < jsonResult.feed.entry.length; i++){

		}*/
		//console.log(jsonResult.feed.entry[0]);
		
		
	}
});
