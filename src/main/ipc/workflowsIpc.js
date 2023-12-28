import { ipcMain } from 'electron'
import WorkflowService from '../services/WorkflowService.js'

export default {
  setup() {
    ipcMain.handle('getWorkflow', async (event, key) => {
      console.log('getWorkflow', key)
      console.log('getWorkflow', WorkflowService.getWorkflow(key))
      return WorkflowService.getWorkflow(key)
    })
    ipcMain.handle('getWorkflows', async () => {
      return WorkflowService.getWorkflows()
    })
    ipcMain.handle('addWorkflow', async (event, workflow) => {
      if (!workflow.id) {
        workflow.id = Date.now()
      }
      WorkflowService.addWorkflow(workflow)
    })
    ipcMain.handle('addOrSetWorkflow', async (event, workflow) => {
      WorkflowService.addOrSetWorkflow(workflow)
    })
    ipcMain.handle('removeWorkflow', async (event, workflow) => {
      WorkflowService.removeWorkflow(workflow)
    })
    ipcMain.handle('setWorkflows', async (event, workflows) => {
      WorkflowService.setWorkflows(workflows)
    })
  }
}
