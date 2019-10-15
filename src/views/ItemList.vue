<template>
  <div class="item-list">
    <item v-for="item in $store.getters.displayItems" :item="item" :key="item.id"></item>
  </div>
</template>

<script>
import Item from '../components/Item.vue'

export default {
  components: {
    Item
  },
  beforeMount () {
    this.loadItems()
  },
  methods: {
    loadItems () {
      this.$bar.start()
      this.$store.dispatch('fetchListData', {
        type: 'top'
      })
        .then(items => {
          this.displayItems = items
          this.$bar.finish()
        })
        .catch(() => this.$bar.fail())
    }
  }
}
</script>
