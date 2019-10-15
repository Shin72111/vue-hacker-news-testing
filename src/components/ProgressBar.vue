<template>
  <div :class="{hidden: hidden, error: error}" :style="{'width': `${percent}%`}"></div>
</template>

<script>
export default {
  data () {
    return {
      hidden: true,
      percent: 0,
      error: false
    }
  },
  methods: {
    start () {
      this.hidden = false
      this.percent = 0
      this.timer = setInterval(() => {
        this.percent++
      }, 100)
    },
    finish () {
      this.percent = 100
      this.hidden = true
      clearInterval(this.timer)
    },
    fail () {
      this.error = true
      this.percent = 100
    }
  }
}
</script>
