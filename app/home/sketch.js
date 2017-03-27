// Iniziamo definendo tutte le variabili
var mic
var table
var level
var lvlThreshSl
var toThreshSl
var toThresh
var ringing = false
var times = []
var predictions = []
// Contenuto iniziale della tavola
var init = '<thead> <tr>' +
	'<td>D O. Acqua</td>' +
	'<td>T O. Acqua</td>' +
	'<td>D Timer</td>' +
	'<td>T Timer</td>' +
	'<td>D Batteria</td>' +
	'<td>T Batteria</td>' +
	'</tr></thead>'

// Dati esperimento con orologio ad acqua
var expO = [
	{
		dist: 30,
		time: 16
	},
	{
		dist: 90,
		time: 29
	}
]

// Dati esperimento con cronometro
var expT = [
	{
		dist: 42.5,
		time: 1
	},
	{
		dist: 90,
		time: 2
	}
]

// Dati esperimento con batteria
var expB = [
	{
		dist: 30,
		time: 0.8
	},
	{
		dist: 120,
		time: 1.71
	}
]

var initialMillis

function setup() {
	// Creiamo la tabella
	table = select('#table')
	// Creiamo la rappresentazione grafica del volume
	var c = createCanvas(100, 200)
	c.parent(select('#graph'))

	// Iniziamo ad ascoltare attraverso il microfono
	mic = new p5.AudioIn()
	mic.start()

	// Creiamo il pannello di controllo
	lvlThreshSl = createSlider(1, height - 1, 37, 2)
	lvlThreshSl.parent(select('#lvlThreshold'))

	toThreshSl = createSlider(1, height - 1, 10, 2)
	toThreshSl.parent(select('#toThreshold'))

	initialMillis = 0

	// Iniziamo ad aspettare che qualcuno clicki sul pulsante "reset"
	document.getElementById('reset').addEventListener('click', () => reset(expO))
	// Inseriamo i dati nella tabella
	initTable(expO, expT, expB)
}

// Questo blocco si ripete all'infinito
function draw() {
	// Livelli minimi del volume perchè sia registrato
	lvlThresh = lvlThreshSl.value()
	toThresh = toThreshSl.value()
	background(51)
	// Rappresentazione grafica del livello del volume
	level = map(mic.getLevel(), 0, 1, 0, 100)
	fill(255)
	noStroke()
	rect(width / 2 - 25, height, 50, -level)

	// Rappresentazione del volume minimo per la registrazione
	stroke(255, 0, 0)
	strokeWeight(2)
	line(width, height - lvlThresh, 20, height - lvlThresh)

	// Rappresentazione del volume massimo perchè il suono venga registrato una seconda volta
	stroke(0, 0, 255)
	strokeWeight(2)
	line(width, height - toThresh, 20, height - toThresh)

	// Registrazione del livello
	if (level > lvlThresh && !ringing) {
		ringing = true
		times.push((millis() - initialMillis))
		// Aggiornamento della tabella
		makeTable(times)
	}

	// Questo vuol dire che il piatto ha suonato due volte di fila senza pausa
	if (ringing && level < toThresh) {
		ringing = false
	}
}

// Resettiamo sia tempo che tabella
function reset(expD) {
	times = []
	initialMillis = millis()
	initTable(expO, expT, expB)
}

// Creiamo una nuova tabella
function makeTable(vals) {
	initTable(expO, expT, expB)
}

// Inizializziamo / Reinizializziamo la tabella
function initTable(expD, expT, expB) {
	table.html(init)

	expD.forEach((d, i) => {
		// Rappresentazioni grafiche per ogni set di dati
		var eld = [
			createElement('td', d.dist + ' cm').id('space' + i),
			createElement('td', d.time + ' ml').id('t' + i)
		]
		var elt = [
			createElement('td', expT[i].dist + ' cm').id('space' + i),
			createElement('td', expT[i].time + ' s').id('time' + i),
		]
		var elb = [
			createElement('td', expB[i].dist + 'cm').id('space' + i),
			createElement('td', times[i] ? (times[i] / 1000).toFixed(2) + ' s' : 't').id('pre' + i)
		]
		// Creiamo una riga
		var tr = createElement('tr')

		// Aggiungiamo alla righa ogni colonna
		eld.forEach(el => {
			el.parent(tr)
		})
		elt.forEach(el => {
			el.parent(tr)
		})
		elb.forEach(el => {
			el.parent(tr)
		})
		// Aggiungiamo alla tabella la riga che abbiamo creato
		table.child(tr)
	})
}