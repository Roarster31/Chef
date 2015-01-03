var http = require("http"),
	request = require('request'),
	cheerio = require("cheerio"),
	urlParser = require("url");

var query = encodeURIComponent(process.argv[2]);

var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyBPQh3L3yqwrvzm4tSV4sBgBakCpt-IQ2g&cx=006662848666275934582:hm0cll0o6jg&q=" + query + "&fields=items(title,link)";

findIngredients = function (body) {

	var $ = cheerio.load(body);
	var ingredients;

	$("p:contains('ingredient'), h1:contains('ingredient'), h2:contains('ingredient'), h3:contains('Ingredients')").filter(function(i, elem) {
		return $(elem).text().length < "ingredient".length*2;
	}).each(function(i, elem) {

		var found = false;
		$(elem).parent().find("p, h1, h2, h3").each(function(j,el){
			if(found){
				ingredients = $(el).text();
				return false;
			}else{
				found = el == elem;
			}
		});

		if(ingredients != undefined){
			return true;
		}else{
			return false;
		}

	});

	

	if(ingredients != undefined){

		console.log(ingredients + "\n\n");
		
		return true;
	}else{
		return false;
	}

}

parseLinkIndex = function (links, index) {

	if(links.length < index){
		console.log("Error: Ran out of options!");
		return false;
	}

	var link = links[index].link;

		console.log("fetching " + link + "\n\n");

		request(link, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				// var $ = cheerio.load(body);
				// console.log(body);
				if(!findIngredients(body)){
					console.log("trying next link \n\n");

					parseLinkIndex(links, (index+1));
				}
			}else{
				console.log("error\n\n");
				console.log(body);
			}
		});

}

request(url, function(error, response, body) {
	if (!error && response.statusCode == 200) {

		parseLinkIndex(JSON.parse(body).items, 0);
		

	}
});








