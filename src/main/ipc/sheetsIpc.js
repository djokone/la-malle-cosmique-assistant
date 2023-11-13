export default function registerSheetsIpc() {
    ipcMain.handle('load-google-sheet', async (event, { spreadsheetId, range }) => {
        try {
          const authClient = /* votre logique d'authentification OAuth */
          const sheets = google.sheets({ version: 'v4', auth: authClient });
          const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
          event.sender.send('google-sheet-data', response.data.values);
        } catch (error) {
          // Gérer l'erreur
        }
      });
      
      ipcMain.handle('write-google-sheet', async (event, { spreadsheetId, range, values }) => {
        try {
          const authClient = /* votre logique d'authentification OAuth */
          const sheets = google.sheets({ version: 'v4', auth: authClient })
          const resource = { values };
          const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource,
          });
          // Gérer la réponse ou le succès de l'opération
        } catch (error) {
          // Gérer l'erreur
        }
      });
}