var parser = require("xml2json");
var testString = '<xml><a>It Works!</a></xml>';     
var result = parser.toJson(testString); // parseString cannot be found??
console.log(testString + " " + result);







/*

UNDER CONSTRUCTION

-----



node marineAwardFinder.js [PRODUCTNAME]

will return array of json elements which list safety details of the product

---- improvement

	can take into account the brand, specias and product type (i.e frozom)
		|-> maybe we could do some if checks

*/


/*
var http = require("http"),
	request = require('request'),
	
	urlParser = require("url");
*/









/*


var query = encodeURIComponent(process.argv[2]);
var brand = "";
if (encodeURIComponent(process.argv[3]) != "undefined") { brand = encodeURIComponent(process.argv[3]);}

var productType = "";
if (encodeURIComponent(process.argv[4]) != "undefined") { productType = encodeURIComponent(process.argv[4]);}

var species = "";
if (encodeURIComponent(process.argv[5]) != "undefined") { species = encodeURIComponent(process.argv[5]);}

var url = "http://www.msc.org/where-to-buy/product-finder/msc_cfps_atom_feed?keywords="+query+"&brand="+brand+"&product_type="+productType+"&species="+species+"&country=GB&order=";

request(url, function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log(body + "\n\n\n");
		
	}
});
*/