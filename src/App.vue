<template>
  <div id="app">
    <header class="header">
      <nav class="inner">
        <router-link to="/top">Top</router-link>
        <router-link to="/new">New</router-link>
        <router-link to="/show">Show</router-link>
        <router-link to="/ask">Ask</router-link>
        <router-link to="/job">Jobs</router-link>
      </nav>
    </header>
    <div class="view">
      <router-view :key="$route.params.type"/>
    </div>
  </div>
</template>


