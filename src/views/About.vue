<template>
  <section class="section">
    <div class="box" id="about" v-html="text">
    </div>
  </section>
</template>
<script>
import texts from '@/texts'


export default {
  name: 'About',
  data() {
    return {
      texts: texts,
      mail_key: texts.mail_key,
      mail_name: texts.mail_name
    }
  },
  computed: {
    text: function () {
      return this.texts.welcome.about.replace(this.mail_key, this.mail_name)
    }
  }
}
</script>
<style>
</style>