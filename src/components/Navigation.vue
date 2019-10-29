<template>
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
      <a class="navbar-item" href="/"  id="logo" title="Carl von Ossietzky Universität Oldenburg - Offen für neue Wege." rel="home"><img src="img/Logo-UOL.svg" alt="Carl von Ossietzky Universität Oldenburg - Offen für neue Wege.">Orthographiearchiv</a>

    
    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navigationBar">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navigationBar" class="navbar-menu">
    <div class="navbar-start">
      <!-- <a class="navbar-item is-active">
        Suchmaske
      </a> -->
    </div>
  
    <div class="navbar-end">
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          Mehr
        </a>

        <div class="navbar-dropdown">
          <a class="navbar-item">
            About
          </a>
          <a class="navbar-item">
            Kontakt
          </a>
        </div>
      </div>
    </div>
    <a class="navbar-item" href="https://github.com/habecker/orthographie" aria-label="Source-Code">
      <github-icon/>
    </a>
  </div>
</nav>
</template>

<script>
import $ from 'jquery';

$(document).ready(function() {

  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function() {

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

  });
});

export default {
  name: 'Navigation'
}
</script>
<style scoped lang="scss">
.navbar {
  
}

#logo-tile{
  max-width:10rem;
}

#logo-tile:first-child{
  margin-top:1rem;
  margin-left:1rem;
}

#logo-tile:nth-child(2){
  margin-top:1rem;
  margin-left:1rem;
}

#logo {
}

#logo > img {
    height:2rem;
    max-height:3rem;
    padding-right:1.5rem;
}
.navbar-item > span.material-design-icon, .navbar-item > span.material-design-icon > svg {
    //width:1.2rem;
    //height:1.2em;
    font-size:1.2rem;
    margin-right:0.3rem;
    bottom:auto;
}
</style>
