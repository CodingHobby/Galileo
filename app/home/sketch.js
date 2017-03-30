// Iniziamo definendo tutte le variabili
var mic,
	table,
	level,
	lvlThreshSl,
	toThreshSl,
	toThresh,
	ringing = false,
	predictions = [],
	count = -1,

	db = firebase.database(),
	ref = db.ref('data'),
	expO = [],
	expT,
	expB

// Contenuto iniziale della tavola
init = '<thead> <tr>' +
	'<td>D O. Acqua</td>' +
	'<td>T O. Acqua</td>' +
	'<td>D Timer</td>' +
	'<td>T Timer</td>' +
	'<td>D Batteria</td>' +
	'<td>T Batteria</td>' +
	'</tr></thead>'

var initialMillis

function setup() {
	// Creiamo la tabella
	table = select('#table')
	table.html(init)
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
	document.getElementById('reset').addEventListener('click', () => {
		initialMillis = millis()
	})
	document.getElementById('reset-table').addEventListener('click', () => clearTable(select('#table')))
	// Inseriamo i dati nella tabella
	ref.on("value", function (data) {
		var stuff = data.val()
		var keys = Object.keys(stuff)
		var ts

		keys.forEach(function (key, i) {
			ts = stuff[key]
			console.log(ts)
			expO = [
				{
					dist: ts.o1.dist,
					time: ts.o1.time
				},
				{
					dist: ts.o2.dist,
					time: ts.o2.time
				}
			]

			expT = [
				{
					dist: ts.t1.dist,
					time: ts.t1.time
				},
				{
					dist: ts.t2.dist,
					time: ts.t2.time
				}
			]

			expB = [
				{
					dist: ts.b1.dist,
					time: ts.b1.time
				},
				{
					dist: ts.b2.dist,
					time: ts.b2.time
				}
			]

			reset(expO)

		})
	}, function (err) {
		alert(err)
		console.error(err)
	})
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
		count++;
		let bt = select('#bt' + count)
		if (bt)
			bt.html(((millis() - initialMillis) / 1000).toFixed('2'))
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
	initTable(expD, expT, expB)
}

// Inizializziamo / Reinizializziamo la tabella
function initTable(expD, expT, expB) {
	select('#table').html(init)
	let n = 0
	expD.forEach((d, i) => {
		// Rappresentazioni grafiche per ogni set di dati
		var eld = [
			createElement('td', (d.dist || 0) + ' cm').id('os' + i),
			createElement('td', (d.time || 0) + ' ml').id('ot' + i)
		]

		var elt = [
			createElement('td', (expT[i].dist || 0) + ' cm').id('ts' + i),
			createElement('td', (expT[i].time || 0) + ' s').id('tt' + i),
		]

		var elb = [
			createElement('td', (expB[i].dist || 0) + ' cm').id('bs' + i),
			createElement('td', 't').id('bt' + i)
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
		n++
	})
}

function clearTable(table) {
	count = -1
	table.html(init)
	initTable(expO, expT, expB)
}