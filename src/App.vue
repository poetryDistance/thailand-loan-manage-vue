<template>
  <div id="app">
    <router-view />
    <el-backtop target="#app" :visibility-height="300" :bottom="30" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  #app {
    overflow-y: auto;
  }
</style>
