const { app, BrowserWindow } = require("electron");
const path = require("path");
let mainWindow;

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1080,
		height: 800,
		webPreferences: {
			devTools: !!process.env.DEV,
			nodeIntegration: true,
			enableBlinkFeatures: 'DisplayLocking,BuiltInModuleAll'
		}
	});
	mainWindow.loadURL(
		!!process.env.DEV
			? "http://localhost:3000"
			: `file://${path.join(__dirname, "../build/index.html")}`
	);
	// mainWindow.webContents.openDevTools();
	mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
