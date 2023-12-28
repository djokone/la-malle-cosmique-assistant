<script>
export default {
  name: 'SourceEdition',
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      await vm.loadWorkflow()
      await vm.loadSources()
    })
  },
  data() {
    return {
      sources: [],
      documents: [],
      imageFiles: [],
      sheets: [],
      sheet: null,
      workflow: {
        id: null,
        selectedDocument: null,
        source_type: null,
        steps: [],
        name: '',
        url: '',
        created_at: '',
        updated_at: ''
      },
      newStep: {
        type: null,
        source: null,
        source_id: null,
        label: null,
        data: {}
      }
    }
  },
  computed: {
    buttonAction () {
      return this.$route.params.id ? 'Modifier' : 'Ajouter'
    },
    stepTypes () {
      return [
        { value: 'return', label: 'Sélectionner' },
        { value: 'run', label: 'Lancer' },
        { value: 'compare', label: 'Comparer' },
        { value: 'if', label: 'Condition' },
        { value: 'foreach', label: 'Parcourir' }
      ]
    },
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
          this.workflow.id = id
          this.loadWorkflow(id)
          this.loadSources()
        }
      }
    },
    'newStep.type': {
      async handler(type) {
        if (type) {
          this.generateLabel()
        }
      }
    },
    'newStep.source_id': {
      async handler(type) {
        if (type) {
          this.generateLabel()
        }
      }
    }
  },
  created() {
    // this.fetchSheets()
  },
  methods: {
    generateLabel () {
      if (this.stepTypes.find((t) => t.value === this.newStep.type)) {
        this.newStep.label = this.stepTypes.find((t) => t.value === this.newStep.type).label

      }
      if (this.sources.find((s) => s.id === this.newStep.source_id)) {
        this.newStep.label += ' ' + this.sources.find((s) => s.id === this.newStep.source_id).name
      }
    },
    async loadSources () {
      this.sources = await this.$electron.ipcRenderer.invoke('getSources')
      console.log(this.sources)
    },
    addStep () {
      this.workflow.steps.push(JSON.parse(JSON.stringify(this.newStep)))
      this.newStep = {
        type: null,
        source: null,
        source_id: null,
        label: null,
        data: {}
      }
    },
    async loadWorkflow(id) {
      try {
        console.log('load workflow')
        console.log(id)
        console.log(this.$route)
        if (!id && this.$route.params.id) {
          id = this.$route.params.id
        }
        console.log(id)
        if (id) {
          const workflow = await this.$electron.ipcRenderer.invoke('getWorkflow', id)
          console.log(workflow)
          this.workflow = {...this.workflow, ...workflow}
        }
      } catch (error) {
        console.error('Error fetching source:', error)
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
        let invokeMethod = 'addOrSetWorkflow'
        const workflow = await this.$electron.ipcRenderer.invoke(
          invokeMethod,
          JSON.parse(JSON.stringify(this.workflow))
        )
        console.log('save successfully')
        // console.log(source)
        this.workflow = { ...this.workflow, ...workflow }
        this.$router.push({ name: 'workflows' })
      } catch (error) {
        console.error('Error saving workflow:', error)
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
        <el-input v-model="workflow.name"></el-input>
      </el-form-item>
      <hr>
      <h2>Ajouter une étape</h2>
      <el-form-item label="Action">
        <el-select v-model="newStep.type" placeholder="Action">
          <el-option
            v-for="type in stepTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Appliquer sur : ">
        <el-select v-model="newStep.source_id" placeholder="Source">
          <el-option
            v-for="source in sources"
            :key="source.id"
            :label="source.name"
            :value="source.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Libellé ">
        <el-input v-model="newStep.label" placeholder="Action source"/>
      </el-form-item>
      <el-button @click="addStep">Ajouter cette étape</el-button>
      <hr>
      <div v-for="step in workflow.steps" >
        <el-form-item label="Action">
          <el-select v-model="step.type" placeholder="Action">
            <el-option
              v-for="type in stepTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Appliquer sur ">
          <el-select v-model="step.source_id" placeholder="Source">
            <el-option
              v-for="source in sources"
              :key="source.id"
              :label="source.name"
              :value="source.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Libellé ">
          <el-input v-model="step.label" placeholder="Action source"/>
        </el-form-item>
        <hr>
      </div>
      <el-button @click="save">{{ buttonAction }}</el-button>
    </el-form>
  </div>
</template>

<style scoped></style>
