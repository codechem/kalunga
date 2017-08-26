const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
var electronVibrancy = require('./vendor/electron-vibrancy');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    width: 400,
    height: 400,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden',
    transparent: true
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('ready-to-show', function () {
    electronVibrancy.SetVibrancy(mainWindow, 0);

    // // non-resizing vibrant view at {0,0} with size {300,300} with Material 0
    // electronVibrancy.AddView(mainWindow, { Width: 300, Height: 300, X: 0, Y: 0, ResizeMask: 3, Material: 0 })

    // //Remove a view
    // var viewId = electronVibrancy.SetVibrancy(mainWindow, 0);
    // electronVibrancy.RemoveView(mainWindow, viewId);

    // // Add a view then update it
    // var viewId = electronVibrancy.SetVibrancy(mainWindow, 0);
    // electronVibrancy.UpdateView(mainWindow, { ViewId: viewId, Width: 600, Height: 600 });

    // // Multipe views with different materials
    // var viewId1 = electronVibrancy.AddView(mainWindow, { Width: 300, Height: 300, X: 0, Y: 0, ResizeMask: 3, Material: 0 })
    // var viewId2 = electronVibrancy.AddView(mainWindow, { Width: 300, Height: 300, X: 300, Y: 0, ResizeMask: 3, Material: 2 })

    // console.log(viewId1);
    // console.log(viewId2);

    // electronVibrancy.RemoveView(mainWindow,0);
    // electronVibrancy.RemoveView(mainWindow,1);

    // or

    // electronVibrancy.DisableVibrancy(mainWindow);
  });



  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
