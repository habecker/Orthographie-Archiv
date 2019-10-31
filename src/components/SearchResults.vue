<template>
  <div v-if="$store.state.searchRequest" class="container is-fullhd">
    <div class="box">
        <div class="columns is-size-7 has-text-centered is-vcentered">
            <div class="column is-3">
                <div class="is-pulled-left">{{ $store.state.results_count }} Treffer</div>
            </div>
            <div class="column is-6">
                <button class="button is-small"><span class="icon"><csv-icon/></span> <span>Export</span></button>
            </div>
            <div class="column is-3">
                <div class="field is-grouped is-pulled-right">
                    <div class="control is-marginless">
                        <button class="button is-small"><sort-asc-icon/></button>
                    </div>
                    <div class="control is-expanded">
                        <div class="select is-small">
                            <select>
                                <option selected>Country</option>
                                <option>Select dropdown</option>
                                <option>With options</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-for="r in $store.state.results" :key="r['id']" :id="'row_'+r['id']" class="columns is-vcentered result-columns">
            <div class="column is-4">
                <div class="field is-grouped is-grouped-multiline">
                    <div class="control">
                        <span class="tags has-addons">
                            <span class="tag is-dark"><calendar-icon/></span>
                            <span class="tag is-light is-info">{{ r['year'] }}</span>
                        </span>
                    </div>
                    <div class="control">
                        <span class="tags has-addons">
                            <span class="tag is-dark"><numeric-icon/></span>
                            <span class="tag is-light is-success">{{ r['edition_text'] }}</span>
                        </span>
                    </div>
                    <div class="control">
                        <span class="tags has-addons">
                            <span class="tag is-dark"><folder-text-icon/></span>
                            <span class="tag is-light">{{ r['topic'] }}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="column is-3 has-text-centered is-hidden-touch">        
                <div class="field is-grouped is-grouped-multiline">
                    <div class="control">
                        <span class="tags has-addons">
                            <span class="tag is-dark"><tag-icon/></span>
                            <span class="tag is-secondary">A</span>
                        </span>
                    </div>
                    <div class="control">
                        <span class="tags has-addons">
                            <span class="tag is-dark"><tag-icon/></span>
                            <span class="tag is-secondary">B</span>
                        </span>
                    </div>
                    <div class="control">
                        <span class="tags has-addons">
                            <span class="tag is-dark"><tag-icon/></span>
                            <span class="tag is-secondary">C</span>
                        </span>
                    </div>
                </div>
                
                <p class="is-size-7"><strong>{{ r['file'] }}</strong></p>  
            </div>
            <div class="column is-3 has-text-justified is-size-7 is-hidden-touch">
                <p v-html="dummyText"></p>
            </div>
            <div class="column is-6 has-text-justified is-size-7 is-hidden-desktop">
                <p class="is-size-7"><strong>{{ r['file'] }}</strong></p>
                <p v-html="dummyText"></p>
            </div>
            <div class="column is-2 is-clearfix">
                <div class="field is-grouped is-expanded is-pulled-right">
                    <div class="control">
                        <button class="button is-light is-inline-block">
                            <details-icon></details-icon> <span class="is-hidden-tablet">Details</span>
                        </button>
                    </div>
                    <div class="control">
                        <button class="button is-light is-inline-block">
                            <download-icon></download-icon> <span class="is-hidden-tablet">Herunterladen</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns has-text-centered is-vcentered is-mobile">
            <div class="column is-3">
            </div>
            <div class="column is-6">
                <button class="button is-loading" v-if="$store.state.searchActive">Loading</button>
                <button class="button" v-else-if="!isCompleted" @click.prevent="$store.dispatch('search/next')">Mehr</button>
            </div>
            <div class="column is-3">
                <div class="is-pulled-right">{{ $_.min([$store.state.results_count, $store.state.results_start +  $store.state.results_step]) }}/{{ $store.state.results_count }}</div>
            </div>
        </div>

    </div>
    <ResultModal v-model="currentResult" @cancel="currentResult = null"></ResultModal>
  </div>
</template>

<script>
import ResultModal from './ResultModal'

export default {
  name: 'SearchResults',
  data() {
    return {
        openOrderBy: false,
        dummyText: '...' + "Wenn man die <strong>Beugungsendungen</strong> wiedergeben will, z.B., um Mißverständnisse zu vermeiden, gilt folgendes: Endet eine Abkürzungn mit dem letzten Buchstaben des abgekürzten Wortes, so wird die Beugungsendung unmittelbar angehängt. dem Hrn. (= dem Herrn) die Bde. (= die Bände)".substring(0, 180) + '...',
        range: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        currentResult: null
    }
  },
  computed: {
      isCompleted() {
          return this.$store.state.results_start + this.$store.state.results_step >= this.$store.state.results_count
      }
  },
  components: {
      ResultModal
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.result-columns {
    border-bottom: solid 2px #fafafa;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
