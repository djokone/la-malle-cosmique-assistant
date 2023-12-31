import {dialog, ipcMain} from "electron";
import express from "express";
import cors from "cors";
import path from "path";
import {v4} from "uuid";
import fs from "fs";
import SourceService from '../services/SourceService.js'

export default {
  setup: (mainWindow) => {
    const PORT = 8156 // Utilisez un port disponible
    let directoryMap = {}
    const imageServer = express()
    imageServer.use(cors())


    imageServer.use('/images', (req, res, next) => {
      const directoryKey = req.query.dir
      const fileName = req.query.file
      if (!directoryKey || !directoryMap[directoryKey]) {
        return res.status(404).send('Dossier non trouvé')
      }

      const directoryPath = directoryMap[directoryKey]
      const filePath = path.join(directoryPath, fileName)
      res.sendFile(filePath, (err) => {
        if (err) {
          next(err)
        }
      })
    })

    imageServer.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`)
    })
    function addDirectory(key, directoryPath) {
      console.log(`map ${key} to ${directoryPath}`)
      directoryMap[key] = directoryPath
    }

    SourceService.addOrSetSourceTypes({
      id: 'images',
      name: 'Images',
      description: 'Source de données images',
      params: [
        {
          name: 'directoryPath',
          label: 'Chemin du dossier',
          type: 'string',
          required: true
        }
      ]
    })

    ipcMain.handle('images-workflow-actions', async () => {
      return [
        {
          name: 'load-images',
          label: 'Charger des images',
          description: 'Charge des images depuis un dossier',
          params: [
            {
              name: 'directoryPath',
              label: 'Chemin du dossier',
              type: 'text',
              required: true
            }
          ]
        },
        {
          name: 'open-directory-dialog',
          label: 'Ouvrir un dossier',
          description: 'Ouvre une boîte de dialogue pour sélectionner un dossier',
          params: []
        }
      ]
    })

    ipcMain.handle('load-images', async (event, directoryPath) => {
      try {
        // updateDirectory(directoryPath)
        const directoryKey = v4()
        addDirectory(directoryKey, directoryPath)

        const baseUrl = `http://localhost:${PORT}/images/?dir=${directoryKey}&file=`
        const files = fs.readdirSync(directoryPath)
        // const baseUrl = `http://localhost:${PORT}/images/`
        const imageFiles = files
          .filter((file) => {
            return ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp'].includes(
              path.extname(file).toLowerCase()
            )
          })
          .map((file) => path.join(directoryPath, file))
        const imageUrls = imageFiles.map(
          (file) => `${baseUrl}${encodeURIComponent(path.basename(file))}`
        )
        return imageUrls
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error)
        return [] // Retourner une liste vide en cas d'erreur
      }
    })
    ipcMain.handle('open-directory-dialog', async () => {
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      })
      return result.filePaths
    })
  }
}
