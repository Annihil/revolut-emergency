const {app, BrowserWindow, Menu} = require("electron");
const path = require("path");
let mainWindow;

// hide menu bar on systems other than macOS
// on macOS we have to show it to allow copy, paste and other default system actions
if (process.platform !== 'darwin') {
  Menu.setApplicationMenu(null);
}

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
