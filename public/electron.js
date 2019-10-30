const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1080,
		height: 800,
		frame: false,
		webPreferences: {
			devTools: isDev,
			nodeIntegration: true,
			enableBlinkFeatures: 'DisplayLocking,BuiltInModuleAll'
		}
	});
	mainWindow.loadURL(
		isDev
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
