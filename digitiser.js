var http = require("http"),
	request = require('request'),
	cheerio = require("cheerio"),
	urlParser = require("url"),
	crypto = require('crypto'),
	shasum = crypto.createHmac('sha1', 'Qp89Y8a1o9St1Ml4');

module.exports = {
  superSearch: function (ean, callback) {
    return superSearch(ean, callback);
  }
};


superSearch = function (ean, callback) {

	shasum.update(ean);

	var url = "http://digit-eyes.com/gtin/v2_0/?upc_code="+ean+"&app_key=//JWrdQNLa0v&signature="+shasum.digest("base64")+"&language=en&field_names=description,ingredients";

	console.log(url);
	request(url, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var productName = JSON.parse(body).description;
			var ingredients = JSON.parse(body).ingredients.split(",").map(function(text){ return text.trim(); });

			if(callback != undefined){
				callback(null, productName, ingredients);
			}
		}else if(response.statusCode == 404){
			if(callback != undefined){
				callback("Ean product not found");			
			}
		}else{
			if(callback != undefined){
				callback("Unknown digit eyes error");			
			}
		}
	});
}

// search("5000232170101");