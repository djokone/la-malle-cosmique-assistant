<script>
export default {
  name: 'Workflows',
  beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      await vm.loadWorkflows()
    })
  },
  data() {
    return {
      workflows: []
    }
  },
  methods: {
    addWorkflow() {
      this.$router.push({
        name: 'workflow-edition',
        params: {
          id: null
        }
      })
    },
    async loadWorkflows() {
      this.workflows = await this.$electron.ipcRenderer.invoke('getWorkflows')
      console.log(this.workflows)
    }
  }
}
</script>

<template>
  <div class="sources">
    <h1>Mes workflows</h1>
    <el-button type="primary" @click="addWorkflow">Ajouter un workflow</el-button>
    <div class="sources-grid">
      <el-card
        v-for="workflow in workflows"
        :key="workflow.id"
        shadow="hover"
        @click="$router.push({ name: 'workflow-edition', params: { id: workflow.id } })"
      >
        <h3>{{ workflow.name }}</h3>
      </el-card>
    </div>
  </div>
</template>

<style scoped></style>
