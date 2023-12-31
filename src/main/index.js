import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import configManager from './configManager'
import path from 'path'
import googleAuthIpc from './ipc/googleAuthIpc.js'
import sheetsIpc from './ipc/sheetsIpc.js'
import imagesIpc from "./ipc/imagesIpc.js";
import sourcesIpc from "./ipc/sourcesIpc.js";
import workflowsIpc from "./ipc/workflowsIpc.js";

// const isDevelopment = process.env.NODE_ENV !== 'production'

googleAuthIpc.setup()
sheetsIpc.setup()
sourcesIpc.setup()
workflowsIpc.setup()

// async function loadIpcHandlers() {
//   const directory = isDevelopment
//     ? path.join(process.cwd(), 'src', 'main', 'ipc')
//     : path.join(app.getAppPath(), 'build', 'main', 'ipc')
//
//   try {
//     const files = fs.readdirSync(directory)
//     for (const file of files) {
//       if (file.endsWith('.js')) {
//         // Convertissez le chemin du fichier en URL appropriée pour l'importation dynamique
//         const filePath = path.resolve(directory, file) // Obtenez le chemin absolu
//         const fileUrl = new URL(`file://${filePath}`).href // Convertissez-le en URL de fichier
//
//         await import(fileUrl)
//       }
//     }
//   } catch (e) {
//     console.error('Failed to load IPC handlers:', e)
//   }
// }
function createWindow() {
  ipcMain.handle('getConfig', async (event, key) => {
    return configManager.getConfig(key)
  })
  ipcMain.handle('setConfig', async (event, key, value) => {
    configManager.setConfig(key, value)
  })
  ipcMain.handle('deleteConfig', async (event, key) => {
    configManager.deleteConfig(key)
  })
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      webSecurity: true,
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  imagesIpc.setup(mainWindow)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // await loadIpcHandlers()
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
