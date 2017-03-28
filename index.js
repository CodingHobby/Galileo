const electron = require('electron')
const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let main
let data

function createWindow() {
	const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
	main = new BrowserWindow({ width: width/2, height, x:0, y:0 })
	data = new BrowserWindow({ width: width/2, height, x:width/2, y:0, parent: main })

	// and load the index.html of the app.
	main.loadURL(url.format({
		pathname: path.join(__dirname, 'app/', 'home/', 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	data.loadURL(url.format({
		pathname: path.join(__dirname, 'app/', '/data', '/index.html'),
		protocol: 'file',
		slashes: 'true'
	}))


	main.on('closed', () => {
		win = null
	})
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
})