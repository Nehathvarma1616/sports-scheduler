const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

	// The render method takes the name of the HTML
	// page to be rendered as input.
	// This page should be in views folder in
	// the root directory.
	// We can pass multiple properties and values
	// as an object, here we are passing the only name
	res.render('home', { name: 'Nehath' });
});


module.exports = app;