<template>
  <li>
    <a :href="item.url">{{ item.title }}</a>
    {{ item.url }}
    {{ item.author }}
    {{ item.score }}
  </li>
</template>

<script>
export default {
  props: ['item']
}
</script>