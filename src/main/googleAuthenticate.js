import { google } from 'googleapis'
import configManager from './configManager'

export async function authenticate() {
  const oAuth2Client = new google.auth.OAuth2(
    Credentials.client_id,
    Credentials.client_secret,
    Credentials.redirect_uris[0]
  );

  // Chargez le token ici; par exemple, à partir d'un fichier ou d'un stockage sécurisé
  const token = { /* ... votre token sauvegardé ... */ };
  oAuth2Client.setCredentials(token);

  return oAuth2Client;
}
