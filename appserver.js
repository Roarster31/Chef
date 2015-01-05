var express = require('express'),
	eanTool = require('async'),
	eanTool = require('./clEANer'),
	digitiserTool = require('./digitiser'),
	ingredientsTool = require('./nodebase')
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

	console.log("beginning digit-eyes search");
	digitiserTool.superSearch(req.query.ean, function(err, productName, ingredients) {

		if (err) {
			console.log("digit-eyes search failed");
			secondarySearch();
			return;
		} else {
			console.log("digit-eyes search succeeded");
			result.productName = productName;
			result.ingredients = ingredients;
			result.sources.ingredients = "digit-eyes";
			result.sources.name = "digit-eyes";


				console.log("beginning Google search (from digit-eyes)");
				ingredientsTool.searchForProductIngredients(productName, googleSearchCallback);

		}

	});

	var secondarySearch = function() {
		console.log("beginning ean-search search");
		eanTool.searchEan(req.query.ean, function(err, productName) {

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
					ingredientsTool.searchForProductIngredients(productName, googleSearchCallback);

			}

		});

	}

	var googleSearchCallback = function(err, ingredients, image) {

		if (err && result.ingredients == undefined) {
			console.log("Google search failed");
			result.errors.push(err);
			res.send(result);
			return;
		} else if (ingredients.length <= 0 && result.ingredients == undefined) {
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


var server = app.listen(3110, function() {

	var host = server.address().address
	var port = server.address().port

	console.log('App listening at http://%s:%s', host, port)

})