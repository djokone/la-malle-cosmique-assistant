import Store from 'electron-store'
const store = new Store()

const addSource = (source) => {
  const sources = store.get('sources') ?? []
  sources.push(source)
  store.set('sources', sources)
}
const removeSource = (source) => {
  const sources = store.get('sources')
  const newSources = sources.filter((s) => s.id !== source.id)
  store.set('sources', newSources)
}

const getSources = () => {
  return store.get('sources') ?? []
}

const setSources = (sources) => {
  store.set('sources', sources)
}
const addOrSetSource = (source) => {
  const sources = store.get('sources') ?? []
  if (!source.id) {
    source.id = Date.now()
    sources.push(source)
  } else {
    const sourceIndex = sources.findIndex((s) => s.id === source.id)
    sources[sourceIndex] = source
  }
  store.set('sources', sources)
}

const getSource = (id) => {
  const sources = store.get('sources')
  console.log(sources)
  return sources.find((s) => '' + s.id === '' + id)
}

export default {
  addOrSetSource,
  addSource,
  removeSource,
  getSources,
  setSources,
  getSource
}
