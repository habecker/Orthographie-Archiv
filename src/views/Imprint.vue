<template>
  <section class="section">
    <div class="box">
      <h1 class="title" v-html="texts.imprint.title">Section</h1>
      <div class="container" v-html="text">
      </div>
    </div>
  </section>
</template>
<script>
import texts from '@/texts'


export default {
  name: 'Imprint',
  data() {
    return {
      texts: texts,
      mail_key: texts.mail_key,
      mail_name: texts.mail_name
    }
  },
  computed: {
    text: function () {
      return this.texts.imprint.html.replace(this.mail_key, this.mail_name)
    }
  }
}
</script>