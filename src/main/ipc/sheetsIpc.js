import { ipcMain } from 'electron'
import configManager from '../configManager.js'
import { google } from 'googleapis'
import SourceService from '../services/SourceService.js'

export default {
  setup: () => {
    console.log('setup sheets')
    SourceService.addOrSetSourceTypes({
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Source de données Google Sheets',
      params: [
        {
          name: 'spreadsheetId',
          label: 'Identifiant du document',
          type: 'string',
          required: false
        },
        {
          name: 'range',
          label: 'Plage de cellules',
          type: 'string',
          required: false
        }
      ]
    })
    ipcMain.handle('source-settings', async () => {
      return [
        {
          name: 'google-sheets',
          label: 'Google Sheets',
          description: 'Source de données Google Sheets',
          params: [
            {
              name: 'spreadsheetId',
              label: 'Identifiant du document',
              type: 'string',
              required: false
            },
            {
              name: 'range',
              label: 'Plage de cellules',
              type: 'string',
              required: false
            }
          ]
        }
      ]
    })
    ipcMain.handle('workflow-actions', async () => {
      return [
        {
          name: 'load-google-sheet-document',
          label: 'Charger un document',
          description: 'Charge un document Google Sheet',
          params: [
            {
              name: 'spreadsheetId',
              label: 'Identifiant du document',
              type: 'text',
              required: true
            }
          ]
        },
        {
          name: 'load-google-sheet',
          label: 'Charger une feuille de document',
          description: 'Charge une feuille de document Google Sheet',
          params: [
            {
              name: 'spreadsheetId',
              label: 'Identifiant du document',
              type: 'text',
              required: true
            },
            {
              name: 'range',
              label: 'Plage de cellules',
              type: 'text',
              required: true
            }
          ]
        }
      ]
    })

    ipcMain.handle('load-google-sheet-document', async (event, { spreadsheetId }) => {
      try {
        const tokens = configManager.getConfig('googleAuthToken') // Assurez-vous que les tokens sont stockés au préalable
        const oAuth2Client = new google.auth.OAuth2()
        oAuth2Client.setCredentials(tokens)
        const sheets = google.sheets({ version: 'v4', auth: oAuth2Client })
        const response = await sheets.spreadsheets.get({ spreadsheetId })
        // console.log(response.data.sheets)
        // eslint-disable-next-line prettier/prettier
        event.sender.send('google-sheet-data', response.data.sheets);
        return response.data.sheets // Retourne la liste des fichiers Sheets
      } catch (error) {
        console.error('Error listing sheets:', error)
        throw error
        // Gérer l'erreur
      }
    })
    ipcMain.handle('load-google-sheet', async (event, { spreadsheetId, range }) => {
      try {
        const tokens = configManager.getConfig('googleAuthToken') // Assurez-vous que les tokens sont stockés au préalable
        const oAuth2Client = new google.auth.OAuth2()
        oAuth2Client.setCredentials(tokens)
        const sheets = google.sheets({ version: 'v4', auth: oAuth2Client })
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range })
        console.log(response.data)
        // eslint-disable-next-line prettier/prettier
        // event.sender.send('google-sheet-data', response.data.sheets);
        return response.data // Retourne la liste des fichiers Sheets
      } catch (error) {
        console.error('Error listing sheets:', error)
        throw error
        // Gérer l'erreur
      }
    })

    ipcMain.handle('list-sheets', async () => {
      try {
        const tokens = configManager.getConfig('googleAuthToken') // Assurez-vous que les tokens sont stockés au préalable
        const oAuth2Client = new google.auth.OAuth2()
        oAuth2Client.setCredentials(tokens)

        const drive = google.drive({ version: 'v3', auth: oAuth2Client })
        const response = await drive.files.list({
          q: "mimeType='application/vnd.google-apps.spreadsheet'",
          fields: 'files(id, name, webViewLink)'
        })

        return response.data.files // Retourne la liste des fichiers Sheets
      } catch (error) {
        console.error('Error listing sheets:', error)
        throw error // Renvoyer l'erreur au processus de rendu
      }
    })

  }
}
