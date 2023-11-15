<script>
export default {
  name: "Services",
  data () {
    return {
      services: []
    }
  },
  async created () {
    const rep = await this.$http.get('services')
    this.services = rep.data
  }
}
</script>

<template>
  <div class="services">
  </div>
</template>

<style scoped>

</style>
