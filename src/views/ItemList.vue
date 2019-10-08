<template>
  <div class="item-list">
    <item v-for="item in displayItems" :item="item" :key="item.id"></item>
  </div>
</template>

<script>
import Item from '../components/Item.vue'

// Warning: @vue/test-utils should use version 1.0.0-beta.20. To install, use:
// npm install --save-dev @vue/test-utils@1.0.0-beta.20
//

export default {
  components: {
    Item
  },
  data () {
    return {
      displayItems: window.items
    }
  }
}
</script>
