<template>
  <div class="item-list">
    <item v-for="item in $store.getters.displayItems" :item="item" :key="item.id"></item>

    <router-link
      v-if="$route.params.page > 1"
      :to="`/${$route.params.type}/${$route.params.page - 1}`">
      &lt; prev
    </router-link>
    <a v-else>&lt; prev</a>
    <span>
      {{$route.params.page || 1}}/{{$store.getters.maxPage}}
    </span>
    <router-link
      v-if="($route.params.page || 1) < $store.getters.maxPage"
      :to="`/${$route.params.type}/${Number($route.params.page || 1) + 1}`">
      more &gt;
    </router-link>
    <a v-else>more &gt;</a>
  </div>
</template>

<script>
import Item from '../components/Item.vue'

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

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
        type: this.$route.params.type
      })
        .then(() => {
          if (this.$route.params.page > this.$store.getters.maxPage) {
            this.$router.replace(`/${this.$route.params.type}/1`)
            return
          }
          this.$bar.finish()
        })
        .catch(() => this.$bar.fail())
    }
  },
  title () {
    return capitalizeFirstLetter(this.$route.params.type)
  }
}
</script>
