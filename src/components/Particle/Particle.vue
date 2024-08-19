<template>
  <div></div>
</template>

<script>
/* eslint-disable */
import SeaParticle from './SeaParticle'
export default {
  name: 'seaParticle',

  data() {
    return {}
  },
  mounted() {
    this.init()
  },

  methods: {
    init() {
      SeaParticle.loadParticle('nc/4_result_11.nc')
    }
  }
}
</script>
