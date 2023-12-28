<script>
export default {
  name: 'SourceEdition',
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      await vm.loadSource()
    })
  },
  data() {
    return {
      documents: [],
      imageFiles: [],
      sheets: [],
      sheet: null,
      source: {
        id: null,
        selectedDocument: null,
        source_type: null,
        data: [],
        name: '',
        url: '',
        created_at: '',
        updated_at: ''
      }
    }
  },
  computed: {
    sheetColumns() {
      if (this.sheet) {
        return this.sheet.values[0]
      }
      return []
    },
    documentSheetSelect() {
      return this.documents.map((doc) => {
        return {
          label: doc.properties.title,
          value: '' + doc.properties.id
        }
      })
    },
    sourceTypes() {
      return [
        { value: 'google-sheet', label: 'Google sheets' },
        { value: 'images-folder', label: "Dossier d'images" }
      ]
    },
    title() {
      return this.source && this.source.id ? 'Modifier' : 'Ajouter une source'
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(id) {
        if (id) {
          this.source.id = id
          this.loadSource(id)
        }
      }
    },
    'source.name': {
      immediate: true,
      async handler(name) {
        if (name && name.length && this.source.source_type === 'google-sheet') {
          await this.fetchSheetDocument(name)
          this.source.selectedDocument = this.documents[0].properties.title
        }
      }
    },
    'source.selectedDocument': {
      immediate: true,
      async handler(name) {
        if (name) {
          await this.fetchSheet(this.source.name)
        }
      }
    },
    'source.url': {
      immediate: true,
      async handler(path) {
        console.log('change path')
        console.log(path)
        if (path && path.length && this.source.source_type === 'images-folder') {
          console.log('load images')
          await this.loadImagesFromDirectory(path)
        }
      }
    }
  },
  created() {
    this.fetchSheets()
  },
  methods: {
    deleteSource () {
      // console.log('')
      this.$electron.ipcRenderer.invoke('removeSource', JSON.parse(JSON.stringify(this.source)))
      this.$router.push({name: 'sources'})
    },
    async loadSource(id) {
      try {
        console.log('load source')
        console.log(id)
        const source = await this.$electron.ipcRenderer.invoke('getSource', id)
        this.source = {...this.source, ...source}
      } catch (error) {
        console.error('Error fetching source:', error)
      }
    },
    async loadImagesFromDirectory(directoryPath) {
      try {
        const imagePaths = await this.$electron.ipcRenderer.invoke('load-images', directoryPath)
        this.imageFiles = imagePaths
        this.source.data = imagePaths
      } catch (error) {
        console.error('Erreur lors de la demande de chargement des images:', error)
        this.imageFiles = [] // Retourner une liste vide en cas d'erreur
      }
    },
    async fetchSheetDocument(name) {
      try {
        this.documents = await this.$electron.ipcRenderer.invoke('load-google-sheet-document', {
          spreadsheetId: name
        })
        console.log('load successfully')
        console.log(this.documents)
      } catch (error) {
        console.error('Error fetching sheet:', error)
      }
    },
    async choosePath() {
      try {
        const path = await this.$electron.ipcRenderer.invoke('open-directory-dialog')
        if (path && path.length) {
          this.source.url = path[0]
        }
      } catch (e) {
        console.error(e)
      }
    },
    async fetchSheet(name) {
      try {
        this.sheet = await this.$electron.ipcRenderer.invoke('load-google-sheet', {
          spreadsheetId: name,
          range: this.source.selectedDocument
        })
        console.log('load successfully')
        console.log(this.sheet)
      } catch (error) {
        console.error('Error fetching sheet:', error)
      }
    },
    async fetchSheets() {
      try {
        this.sheets = await this.$electron.ipcRenderer.invoke('list-sheets')
        console.log(this.sheets)
      } catch (error) {
        console.error('Error fetching sheets:', error)
      }
    },
    async save() {
      try {
        let invokeMethod = 'addOrSetSource'
        const source = await this.$electron.ipcRenderer.invoke(invokeMethod, JSON.parse(JSON.stringify(this.source)))
        console.log('save successfully')
        // console.log(source)
        this.source = {...this.source, ...source}
        this.$router.push({name: 'sources'})
      } catch (error) {
        console.error('Error saving source:', error)
      }
    }
  }
}
</script>

<template>
  <div class="source-edition">
    <h1>{{ title }}</h1>
    <el-form label-width="200px" label-position="left">
      <el-form-item label="Label">
        <el-input v-model="source.name"></el-input>
      </el-form-item>
      <el-form-item label="Type de source">
        <el-select v-model="source.source_type" placeholder="Type de source">
          <el-option
            v-for="item in sourceTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div v-if="source.source_type === 'images-folder'">
        <el-form-item label="Dossier d'image">
          <el-input v-model="source.url" @click="choosePath"></el-input>
        </el-form-item>
        <el-scrollbar>
          <div class="scrollbar-flex-content">
            <el-image
              v-for="image in imageFiles"
              :src="image"
              :fit="'cover'"
              class="scrollbar-demo-item"
            />
          </div>
        </el-scrollbar>
      </div>
      <div v-if="source.source_type === 'google-sheet'">
        <el-form-item label="Nom">
          <el-select v-model="source.name" filterable placeholder="Select">
            <el-option v-for="item in sheets" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="documentSheetSelect.length" label="Feuille de calcul">
          <el-select v-model="source.selectedDocument" filterable placeholder="Select">
            <el-option
              v-for="item in documents"
              :label="item.properties.title"
              :value="item.properties.title"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="documentSheetSelect.length" label="Colonnes">
          <el-select v-model="col" filterable placeholder="Select">
            <el-option v-for="item in sheetColumns" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </div>
      <el-button @click="save">Ajouter</el-button>
      <el-button v-if="$route.params.id" @click="deleteSource">Supprimer</el-button>
    </el-form>
  </div>
</template>

<style scoped></style>
