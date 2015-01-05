/*
nodebase fetches the ingredients list of a product. By calling searchForProductIngredients the callback will receive a list of ingredients and the product's image.
*/

var http = require("http"),
	request = require('request'),
	cheerio = require("cheerio"),
	urlParser = require("url");

module.exports = {
  searchForProductIngredients: function (product, callback) {
    return searchForProductIngredients(product, callback);
  }
};

var baseRequest = request.defaults({
  headers: { 'User-Agent': 'ChefBot' },
  jar: true
})

//get the query text
var query = process.argv[2];


findIngredients = function(body) {
	var $ = cheerio.load(body);
	var ingredients = [];

	//firstly we look for text elements containing "ingredient". We want an "ingredient" heading because logically the list of ingredients should follow closely after.
	$("p, h1, h2, h3").filter(function(i, elem) {
		//we filter the resulting elements to those with text of length shorter than the length of "ingredient"*2. This leaves heading and filters paragraphs.
		var text = $(elem).text().toLowerCase();
		return text.indexOf("ingredient") != -1 && text.length < "ingredient".length * 2;
	}).each(function(i, elem) {


		var found = false;

		//Then we go through "ul, p, h1, h2, h3" in the heading's parent. We wait until we find the heading, then set found to true.
		//Then the following text in the DOM is assumed to be the list of ingredients unless it contains the keyword "allergy".
		$(elem).parent().find("ul, p, h1, h2, h3").each(function(j, el) {


			if (found) {

				//if we have a list next we need to act differently
				if ($(el).get(0).tagName == "ul") {
					ingredients = $(el).find("li").map(function() {
						return $(this).text().trim().replace(/,+$/, "");
					}).get();

					//return false to exit the each loop
					return false;

					//otherwise it's text and we check for allergy
				} else if ($(el).text().toLowerCase().indexOf("allergy") == -1) {
					ingredients = $(el).text().split(",").map(function(text) {
						return text.trim().replace(/,+$/, "");
					});

					//return false to exit the each loop
					return false;
				}

			} else {

				//set found to true if we're at the "ingredients" heading so that next iteration triggers the other if branch.
				found = el == elem;
			}
		});

		if (ingredients.length > 0) {
			return false;
		} else {
			return true;
		}

	});



	if (ingredients.length > 0) {

		console.log(ingredients);
		console.log("\n\n");

	}

	return ingredients;


}

parseLinkIndex = function(links, index, callback) {

	//if we've called this recursively and we've run out of items we should Error out
	if (links.length < index || links[index]) {
		console.log("Error: Ran out of options!");
		callback("Could not find product");
		return false;
	}

	//we know at this point we won't get an index out of bounds
	var link = links[index].link;

	console.log("fetching " + link + "\n\n");

	baseRequest(link, function(error, response, body) {
		if (!error && response.statusCode == 200) {

			var ingredients = findIngredients(body);
			//findIngredients returns a list of ingredients, so if it is no larger than 0 then we didn't get any and should try another link.
			if (ingredients.length <= 0) {
				console.log("trying next link \n\n");

				parseLinkIndex(links, (index + 1), callback);
			}else if(callback != undefined){
				callback(null, ingredients, links[index].pagemap.cse_image[0].src);
			}
		} else {
			console.log("error fetching " + link + "\n\n");

			//we could have encountered an error for numerous reasons, we'll just try the next link
			parseLinkIndex(links, (index + 1), callback);
		}
	});

}

searchForProductIngredients = function (productName, callback) {

var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyBPQh3L3yqwrvzm4tSV4sBgBakCpt-IQ2g&cx=006662848666275934582:hm0cll0o6jg&q=" + encodeURIComponent(productName) + "&fields=items(title,link,pagemap(cse_image))";

//go off and get the Google search result for the url
baseRequest(url, function(error, response, body) {
	if (!error && response.statusCode == 200) {

		//and then go ahead and parse the resulting list at the first index
		parseLinkIndex(JSON.parse(body).items, 0, callback);


	}else{
		console.log("Error\n");
		console.log(body);
		if(response.statusCode == 403){
			if(callback != undefined){
				callback("Google daily quota limit reached");
			}
		}
	}
});

}
