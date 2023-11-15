<template>
  <h1>Paramètres</h1>
  <el-form ref="form" label-width="200px" label-position="left">
    <h2>Services Google</h2>
    <el-form-item label="Clé d'API Google">
      <el-input
        v-model="form.googleApiKey"
        @input="setConfig('googleApiKey', form.googleApiKey)"
      ></el-input>
    </el-form-item>
    <el-form-item label="Secret d'API Google">
      <el-input
        v-model="form.googleApiSecret"
        @input="setConfig('googleApiSecret', form.googleApiSecret)"
      ></el-input>
    </el-form-item>
    <el-form-item label="Connexion">
      <el-button v-if="!form.googleAuthToken" @click="triggerGoogleAuth">Se connecter</el-button>
      <el-input
        v-if="form.googleAuthToken"
        v-model="form.googleAuthToken.access_token"
        disabled
      ></el-input>
      <el-button v-if="form.googleAuthToken" style="margin-right: 20px" @click="triggerGoogleAuth"
        >Actualiser</el-button>
      <el-button v-if="form.googleAuthToken" style="margin-right: 20px" @click="refreshGoogleAuth"
        >Rafraichir</el-button
      >
      <p>{{ expiredIn }}</p>
    </el-form-item>
    <h2>Chat GPT</h2>
    <el-form-item label="Clé OpenAi">
      <el-input v-model="form.openAiKey" @input="setConfig('openAiKey', form.openAiKey)"></el-input>
    </el-form-item>
    <el-form-item label="Organisation (optionnel)">
      <el-input
        v-model="form.openAiKey"
        @input="setConfig('openAiOrganisationKey', form.openAiOrganisationKey)"
      ></el-input>
    </el-form-item>
    <h2>Shopify</h2>
    <el-form-item label="Nom boutique">
      <el-input
        v-model="form.shopifyShopName"
        @input="setConfig('shopifyShopName', form.shopifyShopName)"
      ></el-input>
    </el-form-item>
    <el-form-item label="Clé d'API shopify">
      <el-input
        v-model="form.shopifyApiKey"
        @input="setConfig('shopifyApiKey', form.shopifyApiKey)"
      ></el-input>
    </el-form-item>
    <el-form-item label="Mot de passe Api shopify">
      <el-input
        v-model="form.shopifyApiPassword"
        @input="setConfig('shopifyApiPassword', form.shopifyApiPassword)"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'
// import 'dayjs/locale/de' // ES 2015

dayjs.locale('fr')

dayjs.extend(relativeTime)

export default {
  name: 'Settings',
  data() {
    return {
      form: {
        googleApiKey: '',
        googleApiSecret: '',
        googleAuthToken: null,
        openAiKey: '',
        openAiOrganisationKey: '',
        shopifyShopName: '',
        shopifyApiKey: '',
        shopifyApiPassword: ''
      }
    }
  },
  computed: {

    expiredIn() {
      if (this.form.googleAuthToken && this.form.googleAuthToken.expiry_date > dayjs().unix()) {
        return 'Expire ' + dayjs().to(dayjs(this.form.googleAuthToken.expiry_date))
      } else if (
        this.form.googleAuthToken &&
        this.form.googleAuthToken.expiry_date < dayjs().unix()
      ) {
        return 'Expiré'
      }
      return null
    }
  },
  async created() {
    const ConfigToLoad = Object.keys(this.form)
    for (const key of ConfigToLoad) {
      this.form[key] = (await this.$electron.ipcRenderer.invoke('getConfig', key)) || ''
    }
  },
  methods: {
    async refreshGoogleAuth() {
      let token = await this.$electron.ipcRenderer.invoke('refresh-google-auth')
      console.log(JSON.parse(token))
    },
    // debug () {
    //   console.log(this.form.googleAuthToken)
    //   console.log(this.form.googleAuthToken.expiry_date)
    //   console.log(dayjs(this.form.googleAuthToken.expiry_date).format('DD/MM/YYYY HH:mm:ss'))
    //   console.log(dayjs().to(dayjs(this.form.googleAuthToken.expiry_date)))
    // },
    async setConfig(key, value) {
      await this.$electron.ipcRenderer.invoke('setConfig', key, value)
    },
    async triggerGoogleAuth() {
      try {
        const tokens = await this.$electron.ipcRenderer.invoke('trigger-google-auth')
        this.form.googleAuthToken = tokens
        console.log('Tokens received:', tokens)
        // Utilisez les tokens comme vous le souhaitez ici
      } catch (error) {
        console.error('There was an error in authentication:', error)
      }
    }
    // ... vos autres méthodes ...
  }
}
</script>
