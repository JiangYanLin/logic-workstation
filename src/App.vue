<template>
  <div id="app">
    <nav>
      <router-link to="/">逻辑公式化简与真值表</router-link>
      |
      <router-link to="/about">使用说明</router-link>
    </nav>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

</style>
<script>
</script>
