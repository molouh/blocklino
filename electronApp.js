var {electron, ipcMain, app, BrowserWindow, globalShortcut, dialog} = require('electron')
var { autoUpdater } = require("electron-updater")
var path = require('path')
var mainWindow, termWindow, factoryWindow, promptWindow, promptOptions, promptAnswer, htmlWindow, usbWindow, colorWindow
autoUpdater.autoDownload = false
autoUpdater.logger = null
function createWindow () {
	mainWindow = new BrowserWindow({width: 800, height: 600, icon: '../../www/media/icon.png', frame: false, movable: true})
	if (process.platform == 'win32' && process.argv.length >= 2) {
		mainWindow.loadURL(path.join(__dirname, '../../www/index.html?url='+process.argv[1]))
	} else {
		mainWindow.loadURL(path.join(__dirname, '../../www/index.html'))
	}
	mainWindow.setMenu(null)
	mainWindow.on('closed', function () {
		mainWindow = null
	})
}
function createTerm() {
	termWindow = new BrowserWindow({width: 640, height: 560, 'parent': mainWindow, resizable: false, movable: true, frame: false, modal: true}) 
	termWindow.loadURL(path.join(__dirname, "../../www/term.html"))
	termWindow.setMenu(null)
	termWindow.on('closed', function () { 
		termWindow = null 
	})
}
function createRepl() {
	termWindow = new BrowserWindow({width: 640, height: 515, 'parent': mainWindow, resizable: false, movable: true, frame: false, modal: true}) 
	termWindow.loadURL(path.join(__dirname, "../../www/repl.html"))
	termWindow.setMenu(null)
	termWindow.on('closed', function () { 
		termWindow = null 
	})
}
function createfactory() {
	factoryWindow = new BrowserWindow({width: 1066, height: 640, 'parent': mainWindow, resizable: true, movable: true, frame: false})
	factoryWindow.loadURL(path.join(__dirname, "../../www/factory.html"))
	factoryWindow.setMenu(null)
	factoryWindow.on('closed', function () { 
		factoryWindow = null 
	})
}
function createHTML() {
	htmlWindow = new BrowserWindow({width: 1066, height: 640, 'parent': mainWindow, resizable: true, movable: true, frame: false})
	htmlWindow.loadURL(path.join(__dirname, "../../www/ffau.html"))
	htmlWindow.setMenu(null)
	htmlWindow.on('closed', function () { 
		htmlWindow = null 
	})
}
function createUSB() {
	factoryWindow = new BrowserWindow({width: 1100, height: 200, 'parent': mainWindow, resizable: true, movable: true, frame: false})
	factoryWindow.loadURL(path.join(__dirname, "../../www/usb.html"))
	factoryWindow.setMenu(null)
	factoryWindow.on('closed', function () { 
		factoryWindow = null 
	})
}
function createColor() {
	colorWindow = new BrowserWindow({width: 420, height: 330, 'parent': mainWindow, resizable: true, movable: true, frame: false})
	colorWindow.loadURL(path.join(__dirname, "../../www/rvb.html"))
	colorWindow.setMenu(null)
	colorWindow.on('closed', function () { 
		colorWindow = null 
	})
}
function promptModal(options, callback) {
	promptOptions = options
	promptWindow = new BrowserWindow({width:360, height: 135, 'parent': mainWindow, resizable: false, movable: true, frame: false, modal: true})
	promptWindow.loadURL(path.join(__dirname, "../../www/modalVar.html"))
	promptWindow.on('closed', function () { 
		promptWindow = null 
		callback(promptAnswer)
	})
}
function open_console(mainWindow = BrowserWindow.getFocusedWindow()) {
	if (mainWindow) mainWindow.webContents.toggleDevTools()
}
function refresh(mainWindow = BrowserWindow.getFocusedWindow()) {
	mainWindow.webContents.reloadIgnoringCache()
}
app.on('ready',  function () {
	createWindow()
	globalShortcut.register('F8', open_console)
	globalShortcut.register('F5', refresh)
})
app.on('activate', function () {
	if (mainWindow === null) createWindow()
})
app.on('window-all-closed', function () {
	globalShortcut.unregisterAll()
	if (process.platform !== 'darwin') app.quit()
})
ipcMain.on("version", function () {
	autoUpdater.checkForUpdates()  
})
ipcMain.on("prompt", function () {
	createTerm()  
})
ipcMain.on("repl", function () {
	createRepl()  
})
ipcMain.on("factory", function () {
	createfactory()       
})
ipcMain.on("html", function () {
	createHTML()       
})
ipcMain.on("color", function () {
	createColor()       
})
ipcMain.on("usb", function () {
	createUSB()       
})
ipcMain.on("addBlock", function (event, data) {
    mainWindow.webContents.send('BlockAdded', data)
})
ipcMain.on("reload", function (event) {
	mainWindow.loadURL(path.join(__dirname, '../../www/index.html'))
})
ipcMain.on("openDialog", function (event, data) {
    event.returnValue = JSON.stringify(promptOptions, null, '')
})
ipcMain.on("closeDialog", function (event, data) {
	promptAnswer = data
})
ipcMain.on("modalVar", function (event, arg) {
	promptModal(
		{"label": arg, "value": "", "ok": "OK"}, 
	    function(data) {
	       event.returnValue = data
        }
	)       
})
ipcMain.on('save-bin', function (event) {
	dialog.showSaveDialog(mainWindow,{
		title: 'Exporter les binaires',
		defaultPath: 'Programme.hex',
		filters: [{ name: 'Binaires', extensions: ['hex']}]
	},
	function(filename){
		event.sender.send('saved-bin', filename)
	})
})
ipcMain.on('save-png', function (event) {
	dialog.showSaveDialog(mainWindow,{
		title: 'Enregistrer au format .PNG',
		defaultPath: 'Programme',
		filters: [{ name: 'Capture', extensions: ['png'] }]
	},
	function(filename){
		event.sender.send('saved-png', filename)
	})
})
ipcMain.on('save-ino', function (event) {
	dialog.showSaveDialog(mainWindow,{
		title: 'Enregistrer au format .INO',
		defaultPath: 'Programme',
		filters: [{ name: 'Arduino', extensions: ['ino'] }]
	},
	function(filename){
		event.sender.send('saved-ino', filename)
	})
})
ipcMain.on('save-py', function (event) {
	dialog.showSaveDialog(mainWindow,{
		title: 'Enregistrer au format .PY',
		defaultPath: 'Programme',
		filters: [{ name: 'Python', extensions: ['py'] }]
	},
	function(filename){
		event.sender.send('saved-py', filename)
	})
})
ipcMain.on('save-bloc', function (event) {
	dialog.showSaveDialog(mainWindow,{
		title: 'Enregistrer au format .BLOC',
		defaultPath: 'Programme',
		filters: [{ name: 'Blocklino', extensions: ['bloc'] }]
	},
	function(filename){
		event.sender.send('saved-bloc', filename)
	})
})
ipcMain.on('save-csv', function (event) {
	dialog.showSaveDialog(mainWindow,{
		title: 'Exporter les données au format CSV',
		defaultPath: 'Programme',
		filters: [{ name: 'donnees', extensions: ['csv'] }]
	},
	function(filename){
		event.sender.send('saved-csv', filename)
	})
})
autoUpdater.on('error', function(error) {
	dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})
autoUpdater.on('update-available', function() {
	dialog.showMessageBox(mainWindow,{
		type: 'none',
		title: 'Mise à jour',
		message: "Une nouvelle version est disponible, voulez-vous la télécharger et l'installer maintenant ?",
		buttons: ['oui', 'non'],
		cancelId: 1,
		noLink: true
	},
	function(buttonIndex)  {
		if (buttonIndex === 0) {
			autoUpdater.downloadUpdate()
		}
		else {
			return
		}
	})
})
autoUpdater.on('update-not-available', function() {
	dialog.showMessageBox(mainWindow,{
		title: 'Mise à jour',
		message: 'Votre version est à jour.'
	})
})
autoUpdater.on('update-downloaded', function() {
	dialog.showMessageBox(mainWindow,{
		title: 'Mise à jour',
		message: "Téléchargement terminé, l'application va s'installer puis redémarrer..."
	}, function() {
		setImmediate(function(){
			autoUpdater.quitAndInstall()
		})
	})
})
module.exports.open_console = open_console
module.exports.refresh = refresh