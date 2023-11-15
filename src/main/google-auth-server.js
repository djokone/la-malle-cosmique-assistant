import express from 'express'
import { google } from 'googleapis'
import configManager from './configManager.js'

class AuthServer {
  constructor(clientId, clientSecret, redirectUri) {
    this.app = express()
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUri = redirectUri
    this.server = null
    this.oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
    this.initClient()
  }
  initClient() {
    // Charger les tokens stockés et les affecter au client OAuth2
    const tokens = configManager.getConfig('googleAuthToken')
    if (tokens) {
      console.log('tokens')
      console.log(tokens)
      this.oAuth2Client.setCredentials(tokens)
    }

    // Écouter l'événement de rafraîchissement des tokens
    this.oAuth2Client.on('tokens', (newTokens) => {
      if (newTokens.refresh_token) {
        // Conserver le nouveau token de rafraîchissement
        configManager.setConfig('googleAuthRefreshToken', newTokens.refresh_token)
      }
      // Vous pourriez vouloir conserver le nouveau token d'accès
      configManager.setConfig('googleAuthAccessToken', newTokens.access_token)
      configManager.setConfig('googleAuthToken', newTokens)
    })
  }

  refreshAccessToken() {
    const tokens = configManager.getConfig('googleAuthToken')
    if (tokens) {
      this.oAuth2Client.setCredentials(tokens)
    }
    return this.oAuth2Client.refreshAccessToken()
  }

  start(port) {
    return new Promise((resolve, reject) => {
      this.app.get('/callback', async (req, res) => {
        const { code } = req.query
        if (code) {
          try {
            const { tokens } = await this.oAuth2Client.getToken(code)
            console.log('tokens')
            console.log(tokens)
            this.oAuth2Client.setCredentials(tokens)
            res.send('Authentication successful! You can close this window.')
            resolve(tokens)
          } catch (error) {
            reject(error)
          } finally {
            this.stop() // Fermez le serveur après avoir échangé le code
          }
        } else {
          res.status(400).send('Missing code in request')
          this.stop()
        }
      })

      this.server = this.app.listen(port, () => {
        console.log(`Authentication server is listening on http://localhost:${port}`)
      })
    })
  }

  stop() {
    if (this.server) {
      this.server.close()
    }
  }

  getAuthUrl(scopes) {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    })
  }
}

// Exportez la classe AuthServer
export default AuthServer
