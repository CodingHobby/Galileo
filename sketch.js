var mic
var level
var lvlThreshSl
var ringing = false
var times = []

var initialMillis

function setup() {
	var c = createCanvas(100, 300)
	c.parent(select('#graph'))
	mic = new p5.AudioIn()
	mic.start()
	lvlThreshSl = createSlider(0, 100, 10, 10)
	lvlThreshSl.parent(select('#lvlThreshold'))

	initialMillis = 0

	document.getElementById('reset').addEventListener('click',reset)
}

function draw() {
	lvlThresh = lvlThreshSl.value()
	background(51)
	level = map(mic.getLevel(), 0, 1, 0, 100)
	fill(255)
	noStroke()
	rect(width / 2 - 25, height, 50, -level)

	stroke(255, 0, 0)
	strokeWeight(2)
	line(width, height - lvlThresh, 20, height - lvlThresh)

	if (level > lvlThresh && !ringing) {
		console.log('HIGH', (millis()-initialMillis) / 1000)
		ringing = true
	}

	if (ringing && level < lvlThresh) {
		ringing = false
	}
}


function reset() {
	initialMillis = millis()
}