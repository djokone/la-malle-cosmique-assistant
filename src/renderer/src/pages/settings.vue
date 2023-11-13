<template>
  <el-form ref="form" label-width="120px">
    <el-form-item label="Clé d'API Google">
      <el-input v-model="form.apiKey" @input="saveApiCredentials"></el-input>
    </el-form-item>
    <el-form-item label="Secret d'API Google">
      <el-input v-model="form.apiSecret" @input="saveApiCredentials"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      form: {
        apiKey: '',
        apiSecret: ''
      }
    }
  },
  async created() {
    this.form.apiKey = (await this.$electron.ipcRenderer.invoke('getConfig', 'googleApiKey')) || ''
    this.form.apiSecret =
      (await this.$electron.ipcRenderer.invoke('getConfig', 'googleApiSecret')) || ''
  },
  methods: {
    async saveApiCredentials() {
      await this.$electron.ipcRenderer.invoke('setConfig', 'googleApiKey', this.form.apiKey)
      await this.$electron.ipcRenderer.invoke('setConfig', 'googleApiSecret', this.form.apiSecret)
      console.log('save successfully')
    }
  }
}
</script>
