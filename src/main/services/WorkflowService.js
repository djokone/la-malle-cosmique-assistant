import Store from 'electron-store'
const store = new Store()

const addWorkflow = (workflow) => {
  const workflows = store.get('workflows') ?? []
  workflows.push(workflow)
  store.set('workflows', workflows)
}
const removeWorkflow = (workflow) => {
  const workflows = store.get('workflows')
  const newWorkflows = workflows.filter((s) => s.id !== workflow.id)
  store.set('workflows', newWorkflows)
}

const getWorkflows = () => {
  return store.get('workflows') ?? []
}

const setWorkflows = (workflows) => {
  store.set('workflows', workflows)
}
const addOrSetWorkflow = (workflow) => {
  const workflows = store.get('workflows') ?? []
  if (!workflow.id) {
    workflow.id = Date.now()
    workflows.push(workflow)
  } else {
    const workflowIndex = workflows.findIndex((s) => s.id === workflow.id)
    workflows[workflowIndex] = workflow
  }
  store.set('workflows', workflows)
}

const getWorkflow = (id) => {
  const workflows = store.get('workflows')
  console.log(workflows)
  return workflows.find((s) => '' + s.id === '' + id)
}

export default {
  addOrSetWorkflow,
  addWorkflow,
  removeWorkflow,
  getWorkflows,
  setWorkflows,
  getWorkflow
}
