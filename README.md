# Chef

![Chef](https://github.com/Roarster31/Chef/blob/master/chef.gif)

Chef is a small Node.js script designed to fetch a list of ingedients for a product. It uses Google's search api to find pages with the product and ingredients on it and then parses the page for the ingredients.

To run, install node and the required npm dependencies. Then run with one argument - the product string to search for. I've mostly been using the text output by the tool on this page: http://www.decept.co.uk/ean-lookup

    node nodebase.js "Lurpak slightly salted spreadable"
