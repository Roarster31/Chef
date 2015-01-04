var express = require('express'),
	eanTool = require('./clEANer'),
	ingredientsTool = require('./nodebase')
var app = express()

app.get('/', function(req, res) {

	var result = { errors:[]};

	console.log("searching ean records for: " + req.query.ean + "\n\n");

	if(req.query.ean == undefined){
		result.errors.push("You must pass an ean number");
		res.send(result);
		return;
	}

	result.ean = req.query.ean;

	eanTool.searchEan(req.query.ean, function(product) {

		if(product == undefined){
			result.errors.push("Could not find ean product");
			res.send(result);
			return;
		}

		console.log("product found: " + product + "\n\n");

		result.productName = product;

		ingredientsTool.searchForProductIngredients(product, function(ingredients, image) {

			if(ingredients.length <= 0){
			result.errors.push("Could not find product ingredients");
			}

			result.productImage = image;
			result.ingredients = ingredients;
			res.send(result);

		}, function (reason){

			result.errors.push(reason);

			res.send(result);

		});

	}, function (reason){

			result.errors.push(reason);

			res.send(result);

		});
})

var server = app.listen(3110, function() {

	var host = server.address().address
	var port = server.address().port

	console.log('App listening at http://%s:%s', host, port)

})