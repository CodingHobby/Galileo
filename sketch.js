var mic
var table
var level
var lvlThreshSl
var toThreshSl
var toThresh
var ringing = false
var times = []
var predictions = []
var init = '<thead> <tr>' +
	'<td>Space</td>' +
	'<td>Actual Time</td>' +
	'<td>Experiment Time</td>' +
	'</tr></thead>'

/* CHANGE EXPERIMENT DATA HERE */
var expD = [
	{
		dist: 30,
		time: 1
	},
	{
		dist: 90,
		time: 2
	}
]

var initialMillis

function setup() {
	table = select('#table')
	var c = createCanvas(100, 200)
	c.parent(select('#graph'))
	mic = new p5.AudioIn()
	mic.start()
	lvlThreshSl = createSlider(1, height - 1, 30, 2)
	lvlThreshSl.parent(select('#lvlThreshold'))

	toThreshSl = createSlider(1, height - 1, 10, 2)
	toThreshSl.parent(select('#toThreshold'))

	initialMillis = 0

	document.getElementById('reset').addEventListener('click', () => reset(expD))
	initTable(expD)
}

function draw() {
	lvlThresh = lvlThreshSl.value()
	toThresh = toThreshSl.value()
	background(51)
	level = map(mic.getLevel(), 0, 1, 0, 100)
	fill(255)
	noStroke()
	rect(width / 2 - 25, height, 50, -level)

	stroke(255, 0, 0)
	strokeWeight(2)
	line(width, height - lvlThresh, 20, height - lvlThresh)

	stroke(0, 0, 255)
	strokeWeight(2)
	line(width, height - toThresh, 20, height - toThresh)

	if (level > lvlThresh && !ringing) {
		ringing = true
		times.push((millis() - initialMillis))
		makeTable(times)
	}

	if (ringing && level < toThresh) {
		ringing = false
	}
}


function reset(expD) {
	times = []
	initialMillis = millis()
	initTable(expD)
}

function makeTable(vals) {
	initTable(expD)
}

function initTable(expD) {
	table.html(init)

	expD.forEach((d, i) => {
		var els = [
			createElement('td', d.dist + ' cm').id('space' + i),
			createElement('td', d.time + ' s').id('t' + i),
			createElement('td', times[i] ? (times[i] / 1000).toFixed(2) + ' s': 't').id('pre' + i)
		]
		var tr = createElement('tr')
		els.forEach(el => {
			el.parent(tr)
		})
		table.child(tr)
	})
}