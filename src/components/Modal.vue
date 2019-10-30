<template>
<div class="modal modal-large" :class="{'is-active': value}">
  <div class="modal-background" @click.prevent="$emit('cancel')"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title"> <slot name="title"></slot> </p>
      <button class="delete" aria-label="close" @click="$emit('cancel')"></button>
    </header>
    <section class="modal-card-body">
        <slot name="content"></slot>
    </section>
    <footer class="modal-card-foot">
        <slot name="footer"></slot>
        <!-- <button class="button is-success">Save changes</button> -->
        <button class="button" @click="$emit('cancel')">Schließen</button>
    </footer>
  </div>
</div>
</template>
<style lang="sass">
@import 'bulma/sass/utilities/_all'

@media (min-width: $desktop)
    .modal-large > .modal-card
        min-width:80vw

</style>
<script>
export default {
    name: "Footer",
    props: ['value', 'title']
}
</script>