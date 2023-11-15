import { BrowserWindow, ipcMain } from 'electron'
import AuthServer from '../google-auth-server.js'
import configManager from '../configManager.js'

export default {
  setup: () => {
    const server = new AuthServer(
      configManager.getConfig('googleApiKey'),
      configManager.getConfig('googleApiSecret'),
      'http://localhost:8123/callback'
    )
    ipcMain.handle('refresh-google-auth', async () => {
      try {
        const tokens = await server.refreshAccessToken()
        // configManager.setConfig('googleAuthToken', tokens)
        return JSON.stringify(tokens)
      } catch (error) {
        console.error('Authentication failed:', error)
        throw error
      }
    })
    ipcMain.handle('trigger-google-auth', async () => {
      const authUrl = server.getAuthUrl([
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
      ])

      let authWindow = new BrowserWindow({
        width: 500,
        height: 600,
        webPreferences: {
          nodeIntegration: false
        }
      })

      authWindow.loadURL(authUrl)
      authWindow.show()
      authWindow.on('closed', () => {
        server.stop() // Cette méthode arrête le serveur d'authentification
      })

      try {
        const tokens = await server.start(8123)
        configManager.setConfig('googleAuthToken', tokens)
        authWindow.close() // Fermez la fenêtre d'authentification
        return tokens
      } catch (error) {
        console.error('Authentication failed:', error)
        authWindow.close()
        throw error
      }
    })
  }
}
