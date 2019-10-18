<template>
  <li>
    <a :href="item.url">{{ item.title }}</a>
    <span class="host"> ({{ item.url | host }})</span>
    {{ item.author }}
    {{ item.score }}
    {{ item.time | timeAgo }} ago
  </li>
</template>

<script>
export default {
  props: ['item']
}
</script>
