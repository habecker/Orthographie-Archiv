<template>
  <div class="home">
    <SearchMask/>
    <SearchResults/>
  </div>
</template>

<script>
// @ is an alias to /src
import SearchMask from '@/components/SearchMask.vue'
import SearchResults from '@/components/SearchResults.vue'
export default {
  name: 'home',
  components: {
    SearchMask,
    SearchResults
  }
}
</script>
