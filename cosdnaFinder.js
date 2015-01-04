/*

node cosdnaFinder.js [PRODUCTNAME]

will return array of json elements which list safety details of the product


*/



var http = require("http"),
	request = require('request'),
	cheerio = require("cheerio"),
	urlParser = require("url");

var query = encodeURIComponent(process.argv[2]);

var url = "http://www.cosdna.com/eng/product.php?q=" + query;



findIngredients = function (body){
	var $ = cheerio.load(body);

	// Check to see if there is an items
	if($('#ResultTable tbody tr').length > 0){

		// Find the first item and then locate its link
		var pageLink = $('#ResultTable tbody tr td a').attr("href");

		// Now fire a new request to get the ingredients
		var productUrl = "http://www.cosdna.com/eng/" + pageLink;

		

		request(productUrl, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);

				// New Json object
				var jsonTable = [];

				// Remove the header of the table
				$('table.iStuffTable').find('tr').first().remove();

				// Loop through the remaining elements
				$('table.iStuffTable').find('tr').each(function(){
					var i = 0;
					var rowItem = new Object();

					// Loop through each cell and add it to the new json element
					$(this).find('td').each(function(){
						if(i == 0){rowItem.ingredient = $(this).text();}
						if(i == 1){rowItem.purpose = $(this).text();}
						if(i == 2){rowItem.acne = $(this).text();}
						if(i == 3){rowItem.irritant = $(this).text();}
						if(i == 4){
							// If it has a safety image asaigned then get the rating of it by removing the image html elements
							if($(this).html().indexOf("img") >= 0){ 
								rowItem.safety = $(this).html().replace('<img src="/images/d','').replace('.gif" title="">','');
							} else {
								// otherwise print blank (essential since some html codes can be returned)
								rowItem.safety = "";
							}
						}
						// prepare for next cell
						i++;
					});
					if(rowItem.purpose != "no matched results") {
						jsonTable.push(rowItem);
					}
				});
				console.log(jsonTable);
			}
		});

		

	} else {
		console.log("No product found");
	}

	// Now call a new request 

}

request(url, function(error, response, body) {
	if (!error && response.statusCode == 200) {
		findIngredients(body);
	}
});