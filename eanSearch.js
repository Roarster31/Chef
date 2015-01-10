var http = require("http"),
	request = require('request'),
	cheerio = require("cheerio"),
	urlParser = require("url");

module.exports = {
	searchEan: function(ean, callback) {
		return searchEan(ean, callback);
	}
};

//these are the headers required to fool decept (I think, maybe you don't need them all)
var baseRequest = request.defaults({
	headers: {
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
	},
	jar: true,
	gzip: true
})

searchEan = function(ean, callback) {

	var url = "http://www.ean-search.org/perl/ean-search.pl?q=" + ean;

	console.log("fetching " + url);

	//you also need to submit a Referer, and since the form just resubmits to the same page it is the same page.
	//Therefore we just use the url we're requesting... silly decept...
	baseRequest({
		url: url,
		headers: {
			'Referer': url
		}
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {

			var $ = cheerio.load(body);

			var anchorFound = false;
			var text;

			//we want the text after "product name for [ean #]" because they've been moderately clever and not used any ids.
			//Luckily for us they ALWAYS show "product name for [ean #]" even if they don't have a product, so we can use it as an anchor.
			$("p").each(function(i, elem) {

				if (anchorFound) {

					//if the text after "product name for [ean #]" is "results: 0" it couldn't find anything :'(
					if ($(this).text().trim().toLowerCase().indexOf("results: 0") == -1) {
						text = $(this).text().trim();
					}
					return false;
				} else if ($(this).text().toLowerCase().indexOf("product name for") != -1) {
					anchorFound = true;
				}

			});

			if(text != undefined){
				if (callback != undefined) {
							callback(null, text);
						}
			}else{
				if (callback != undefined) {
							callback("not found");
						}
			}

		} else {
			console.log("Error " + response.statusCode + "\n\n");
			console.log(body);

			if(callback != undefined){
				callback("Decept daily ip quota limit triggered");
			}
		}
	});

}

// search(process.argv[2]);