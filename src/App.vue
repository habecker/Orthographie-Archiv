<template>
  <div id="app">
    <navigation/>
<!--     
    <div id="nav">
      <router-link to="/">Suche</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
    <footer-navigation/>
  </div>
</template>
<script>
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    'navigation': Navigation,
    'footer-navigation': Footer
  },
}
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
html,body{
  background-color: #fafafa !important;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<style lang="sass">
  [data-tooltip]
      &::before,
      &::after
          font-size: 0.6rem !important
</style>