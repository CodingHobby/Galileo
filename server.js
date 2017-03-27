// Questo codice, seppur apparentemente pleonastico, serve perchè la applicazione acceda al microfono.
// Prima importiamo tutte le dipendenze
var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000,
	path = require('path'),
	// Iniziamo ad ascoltare
	server = app.listen(port, function () {
		console.log('App running on port ' + port)
	})

// Serviamo del contenuto statico dalla cartella "app"
app.use(express.static('./app/'))
// Redirect alla home page
app.get('/', function(req, res) {
	res.redirect('/home')
})