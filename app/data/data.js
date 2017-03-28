var db = firebase.database()
var ref = db.ref('data')

window.addEventListener('load', function () {
	document.getElementById('submit').addEventListener('click', function (e) {
		e.preventDefault()
		var data = {
			o1: {
				dist: document.getElementById('os1').value,
				time: document.getElementById('ot1').value
			},
			o2: { 
				dist: document.getElementById('os2').value,
				time: document.getElementById('ot2').value
			},
			t1: {
				dist: document.getElementById('ts1').value,
				time: document.getElementById('tt1').value
			},
			t2: {
				dist: document.getElementById('ts2').value,
				time: document.getElementById('tt2').value
			},
			b1: {
				dist: 30,
				time: 't'
			},
			b2: {
				dist: 120,
				time: 't'
			}
		}
		console.log(data)
		ref.push(data, function(err) {
			if(err) {
				console.error(err)
				alert(err)
			} else {
				alert('Data set!')
			}
		})
	})
})