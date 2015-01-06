/*
node goodGuide.js [PRODUCTNAME] 

will return the good guides score on a product

first number represents a health score out of 10
second number represents a enviromental score out of 10
third number represents a society score out of 10
*/
var http = require("http"),
	request = require('request'),
	cheerio = require("cheerio"),
	urlParser = require("url");
	
// Grab all the inputs from the console
// only productname is required
var query = encodeURIComponent(process.argv[2]);

// Create url
var url = "http://www.goodguide.com/products?filter="+query;

// Call web request
request(url, function(error, response, body) {
	if (!error && response.statusCode == 200) {

		var $ = cheerio.load(body);
		var productUrl = "http://www.goodguide.com/" + $('.search-tile-content').find('.search-tile .image-container a').attr('href');

		request(productUrl, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				var ratings = [];
				$('.rating-cell').each(function(){
					ratings.push($(this).text().replace('\n','').replace('\n',''));
				});
				console.log(ratings);
			}
		});
		
	}
});
