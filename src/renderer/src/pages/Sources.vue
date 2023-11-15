<script>
export default {
  name: 'Sources',
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      await vm.loadSources()
    })
  },
  data() {
    return {
      sources: []
    }
  },
  methods: {
    addSource() {
      this.$router.push({
        name: 'source-edition',
        params: {
          id: null
        }
      })
    },
    async loadSources() {
      this.sources = await this.$electron.ipcRenderer.invoke('getSources')
      console.log(this.sources)
    }
  }
}
</script>

<template>
  <div class="sources">
    <h1>Mes sources</h1>
    <el-button type="primary" @click="addSource">Ajouter une source</el-button>
    <div class="sources-grid">
      <el-card
        v-for="source in sources"
        :key="source.id"
        shadow="hover"
        @click="$router.push({ name: 'source-edition', params: { id: source.id } })"
      >
        <h3>{{ source.name }}</h3>
      </el-card>
    </div>
  </div>
</template>

<style scoped></style>
