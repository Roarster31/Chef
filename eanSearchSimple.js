// Uses outpan, a secondary ean searcher

var http = require("http"),
	request = require('request'),
	cheerio = require("cheerio"),
	urlParser = require("url");

var barcode = encodeURIComponent(process.argv[2]);
// Api key 801b9053f247ebd30a131ec55a43e118
var url = "http://www.outpan.com/api/get-product.php?apikey=801b9053f247ebd30a131ec55a43e118&barcode=" + barcode;

request(url, function(error, response, body) {
	console.log("\n");
	if (!error && response.statusCode == 200) {
		console.log("Name of product is: \n" + JSON.parse(body).name);
		var attr = JSON.parse(body).attributes;
		console.log(attr);
	}
});
