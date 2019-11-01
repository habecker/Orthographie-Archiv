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
    <footer class="modal-card-foot is-block">
        <!-- <button class="button is-success">Save changes</button> -->
        <slot name="footer"></slot>
        <div class="field is-pulled-right">
          <button class="button" @click="$emit('cancel')">Schließen</button>
        </div>
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
import $ from 'jquery'

export default {
    name: "Modal",
    props: ['value', 'title'],
    data () {
      return { lastScroll: 0 }
    },
    watch: {
      value: function (newVal) {
        // Modal scroll bug workaround
        console.log("HI")
        if(newVal) {
          this.lastScroll = $('html').scrollTop()
          $('html').css('overflow', 'hidden')
          $('html').css('max-height', '100vh')
        } else {
          $('html').css('overflow', 'auto')
          $('html').css('max-height', 'inherit')
          $('html').scrollTop = this.lastScroll
        }
      }
    }
}
</script>