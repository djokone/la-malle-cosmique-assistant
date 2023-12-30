import { ipcMain } from 'electron'
import SourceService from '../services/SourceService.js'

export default {
  setup() {
    ipcMain.handle('getSourceTypes', async () => {
      return [

      ]
    })
    ipcMain.handle('getSource', async (event, key) => {
      console.log('getSource', key)
      console.log('getSource', SourceService.getSource(key))
      return SourceService.getSource(key)
    })
    ipcMain.handle('getSources', async () => {
      return SourceService.getSources()
    })
    ipcMain.handle('addSource', async (event, source) => {
      if (!source.id) {
        source.id = Date.now()
      }
      SourceService.addSource(source)
    })
    ipcMain.handle('addOrSetSource', async (event, source) => {
      SourceService.addOrSetSource(source)
    })
    ipcMain.handle('removeSource', async (event, source) => {
      SourceService.removeSource(source)
    })
    ipcMain.handle('setSources', async (event, sources) => {
      SourceService.setSources(sources)
    })
  }
}
