<template>
<footer class="footer">
  <div class="content has-text-centered is-size-7">
    <p>
      2016 - 2019 Prof. Dr. Nanna Fuhrhop, <a href="https://uol.de/germanistik">Institut für Germanistik</a>, Carl von Ossietzky Universität Oldenburg, Fakultät III Sprach- und Kulturwissenschaften
    </p>
    <p></p>
    <p>
      Entwickelt von <a href="http://www.y2g.de/">Yannick Habecker</a>
    </p>
    <div id="footer-navigation" class="columns is-gapless">
        <div class="column"></div>
        <div class="column"></div>
        <div class="column"></div>
        <div class="column">
          <router-link to="/imprint">Impressum</router-link>
        </div>
        <div class="column">
          <router-link to="/privacy">Datenschutz</router-link>
        </div>
        <div class="column"></div>
        <div class="column"></div>
        <div class="column"></div>
    </div>       
  </div>
</footer>
</template>
<style lang="scss">

</style>
<script>
export default {
    name: "Footer"
}
</script>