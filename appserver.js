var express = require('express'),
	eanSearch = require('./eanSearch'),
	eanSearchV2 = require('./eanSearchV2'),
	productSearch = require('./productDataSearch')
var app = express()

app.get('/', function(req, res) {

	var result = {
		errors: [],
		sources: {}
	};

	console.log("searching ean records for: " + req.query.ean + "\n\n");

	if (req.query.ean == undefined) {
		result.errors.push("You must pass an ean number");
		res.send(result);
		return;
	}

	result.ean = req.query.ean;

	//this is our primary ean search api. If it fails we use the backup. We use this as
	//our primary search because it can also return ingredients
	console.log("beginning digit-eyes search");
	eanSearchV2.superSearch(req.query.ean, function(err, productName, ingredients) {

		if (err) {
			console.log("digit-eyes search failed");
			secondarySearch();
			return;
		} else {
			console.log("digit-eyes search succeeded");
			result.productName = productName;
			result.sources.name = "digit-eyes";

			if(searchForProductIngredients){
				result.ingredients = ingredients;
				result.sources.ingredients = "digit-eyes";
			}


				console.log("beginning Google search (from digit-eyes)");
				productSearch.searchForProductIngredients(productName, (result.ingredients == undefined), googleSearchCallback);

		}

	});

	//this is a backup ean search that we fall back to if the primary search fails
	var secondarySearch = function() {
		console.log("beginning ean-search search");
		eanSearch.searchEan(req.query.ean, function(err, productName) {

			if (err) {
				console.log("secondary search failed");
				result.errors.push(err);
				res.send(result);
				return;
			} else {
				console.log("ean-search search succeeded");
				result.productName = productName;
				result.sources.name = "ean-search";



					console.log("beginning Google search (from ean-search)");
					productSearch.searchForProductIngredients(productName, true, googleSearchCallback);

			}

		});

	}

	var googleSearchCallback = function(err, ingredients, image) {

		if (result.ingredients == undefined && err) {
			console.log("Google search failed");
			result.errors.push(err);
			res.send(result);
			return;
		} else if (result.ingredients == undefined && ingredients.length <= 0) {
			console.log("Google search did not produce any ingredients");
			result.errors.push("Could not find product ingredients");
		} else {
			console.log("Google search succeeded");
			result.productImage = image;
			result.sources.image = "Google";

			if (result.ingredients == undefined) {
				result.ingredients = ingredients;
				result.sources.ingredients = "Google";
			}

			res.send(result);
		}

	};


})


var server = app.listen(6128, function() {

	var host = server.address().address
	var port = server.address().port

	console.log('App listening at http://%s:%s', host, port)

})