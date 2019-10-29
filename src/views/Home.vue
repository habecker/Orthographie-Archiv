<template>
  <div class="home">
    <SearchMask/>
  </div>
</template>

<script>
// @ is an alias to /src
import SearchMask from '@/components/SearchMask.vue'
export default {
  name: 'home',
  components: {
    SearchMask
  }
}
</script>
