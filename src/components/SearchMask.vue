<template>
  <div class="container">
    <transition name="slide">
      <section v-if="!hideWelcome" class="hero">
        <div class="hero-body">
          <div class="container">
            <div class="notification has-text-justified">
              <div class="columns is-vcentered">
                <div class="column" v-html="texts.welcome.intro"></div>
                <div class="column has-text-centered is-expanded">
                  <router-link class="button is-outlined is-rounded is-info" to="/about">Mehr Informationen</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </transition>
    <div class="container" id="search-container">
    <div class="box">
      <div class="field is-grouped">
        <div class="control is-medium has-icons-left is-expanded">
          <input class="input is-medium" :class="{'is-focused': !hideWelcome}" type="text" placeholder="Volltextsuche" v-model="searchRequest">
          <span class="icon is-medium is-left">
            <regexp-icon aria-label="Regulärer Ausdruck" v-if="isRegularExpression"/>
            <search-icon  aria-label="Normale Suche" v-else/>
          </span>
          <progress v-if="$store.state.errorOccured" class="progress is-small is-danger" max="100" :class="{'opaque': !$store.state.searchActive}" value="100"></progress>
          <progress v-else class="progress is-small is-info" max="100" :class="{'opaque': !$store.state.searchActive}"></progress>
        </div>
        
        <div v-if="$store.state.corpusMeta" class="control">
          <div class="dropdown is-right" :class="{'is-active': filter_visible}">
            <div class="dropdown-trigger">
              <button @click="filter_visible=!filter_visible" class="button is-medium" id="filter-button" aria-haspopup="true" aria-controls="filter-dropdown" aria-label="Filterung">
                <filter-active v-if="isFilterPresent" />
                <filter-inactive v-else />
              </button>
            </div>
            <div class="dropdown-menu" id="filter-dropdown" role="menu">
              <div class="dropdown-content">
                <button class="delete dropdown-delete" @click="filter_visible = false"></button>
                <div class="dropdown-item">
                  <h2 class="subtitle">
                    Filter
                  </h2>
                </div>
                <div class="dropdown-item">
                  <span class="is-size-6">
                    <div class="field is-inline">
                      <input class="is-checkradio is-circle is-small is-info" id="yearCheckbox" type="checkbox" v-model="yearProperty">
                      <label for="yearCheckbox">Nach Jahren</label>
                    </div>
                  </span>
                  <div class="field is-grouped">
                    <div class="control">
                      <div class="select is-normal">
                        <select v-model="filter.year.selector">                                        
                          <option value="lt">&lt;</option>
                          <option value="le">≤</option>
                          <option value="eq">=</option>
                          <option value="ge">≥</option>
                          <option value="gt">&gt;</option>
                        </select>
                      </div>
                    </div>
                    <div class="control is-expanded">
                      <input v-model="filter.year.value" type="number" class="input is-normal" placeholder="1950">
                    </div>
                  </div>
                </div>
                <div class="dropdown-item">
                  <span class="is-size-6">
                    <div class="field is-inline">
                      <input class="is-checkradio is-circle is-small is-info" id="topicCheckbox" type="checkbox" v-model="topicProperty">
                      <label for="topicCheckbox">Nach Thema</label>
                    </div>
                  </span>
                  <div class="field">
                    <div class="control is-expanded">
                      <multiselect v-model="filter.topic.value" :options=" $store.state.corpusMeta.topics" :show-labels="false" placeholder="Themen durchsuchen" multiple></multiselect>
                    </div>
                  </div>
                </div>
                <div class="dropdown-item">
                  <span class="is-size-6">
                    <div class="field is-inline">
                      <input class="is-checkradio is-circle is-small is-info" id="editionCheckbox" type="checkbox" v-model="editionProperty">
                      <label for="editionCheckbox">Nach Auflage</label>
                    </div>
                  </span>
                  <div class="field">
                    <div class="control is-expanded">
                      <multiselect v-model="filter.edition.value" :options=" $store.state.corpusMeta.editions" :show-labels="false" placeholder="Editionen durchsuchen" multiple></multiselect>
                    </div>
                  </div>
                </div>
                <div class="dropdown-item">
                  <span class="is-size-6">
                    <div class="field is-inline">
                      <input class="is-checkradio is-circle is-small is-info" id="tagCheckbox" type="checkbox" v-model="tagProperty">
                      <label for="tagCheckbox">Vorgefertigte Suchbegriffe</label>
                    </div>
                  </span>
                  <div class="field">
                    <div class="control is-expanded">
                      <multiselect v-model="filter.tag.value" :options=" $store.state.corpusMeta.tags" :show-labels="false" placeholder="Tags durchsuchen" multiple></multiselect>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field is-grouped is-grouped-multiline">
        <!-- <span class="tag is-">One <button class="delete"></button></span> -->
        <div class="control" v-if="isRegularExpression">
          <div class="tags has-addons">
            <span class="tag is-dark" aria-label="Regulärer Ausdruck"><regexp-icon/></span>
            <span class="tag is-warning">{{ searchRequest }}</span>
          </div>
        </div>
        <template v-else-if="searchRequest.length > 0">
          <div class="control" v-for="token in searchTokens" :key="token">
            <div class="tags has-addons">
              <span class="tag is-dark" aria-label="Normale Suche"><search-icon/></span>
              <span class="tag is-white">{{ token }}</span>
            </div>
          </div>
        </template>
        <div class="control" v-if="yearProperty">
          <div class="tags has-addons">
            <span class="tag is-dark">{{ filter.year.selector | selector }} </span>
            <span class="tag is-light is-info">{{ filter.year.value }}</span>
          </div>
        </div>
        <template v-if="topicProperty">
          <div class="control" v-for="topic in filter.topic.value" :key="topic">
            <div class="tags has-addons">
              <span class="tag is-dark" aria-label="Thema"><folder-text-icon/></span>
              <span class="tag is-white">{{ topic }}</span>
            </div>
          </div>
        </template>
        <template v-if="editionProperty">
          <div class="control" aria-label="Auflage" v-for="topic in filter.edition.value" :key="topic">
            <div class="tags has-addons">
              <span class="tag is-dark"><numeric-icon/></span>
              <span class="tag is-white">{{ topic }}</span>
            </div>
          </div>
        </template>
        <template v-if="tagProperty">
          <div class="control" aria-label="Begriff" v-for="topic in filter.tag.value" :key="topic">
            <div class="tags has-addons">
              <span class="tag is-dark"><tag-icon/></span>
              <span class="tag is-white">{{ topic }}</span>
            </div>
          </div>
        </template>
      </div>
      <div v-if="regexErrorMessage" class="notification is-danger">
        <button class="delete" @click="regexErrorMessage = ''"></button>
        <p><strong>Bei der Auswertung des regulären Ausdrucks ist ein Fehler aufgetreten:</strong></p>
        <p><code>{{ regexErrorMessage }}</code></p>
      </div>
      <div v-if="$store.state.corpusError" class="notification is-danger">
        <p><strong>Beim Laden der Anwendung ist ein Fehler aufgetreten:</strong></p>
        <p><code>{{ $store.state.corpusError }}</code></p>
      </div>
      <div v-if="!isRouteQueryValid" class="notification is-warning">
        <button class="delete" @click="isRouteQueryValid = true"></button>
        <p><strong>Die Suchparameter aus der URL sind nicht gültig und konnten nicht übernommen werden. Die Suchmaske wurde zurückgesetzt.</strong></p>
      </div>
      <div v-if="$store.state.errorOccured" class="notification is-danger">
        <p><strong>Bei der Auswertung der Suchanfrage ist ein Fehler aufgetreten:</strong></p>
        <p><code>{{ $store.state.errorOccured }}</code></p>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import texts from '@/texts'

// import LZUTF8 from 'lzutf8'

const SEARCH_INTERVAL = 1000
const REQUEST_LIMIT_INTERVAL = 500 // 2 Hz

export default {
  name: 'SearchMask',
  data() {
    return {
      hideWelcome: false,
      regexErrorMessage: "",
      isRouteQueryValid: true,
      query: "",
      filter_visible: false,
      lastRequest: 0,
      lastSearchRequestChange: 0,
      didRequest: false,
      now: 0,
      texts: texts,
      filter: {
        ordering: 'ASC',
        orderBy: 'year',
        year: {
          selector: 'lt',
          value: null
        },
        edition: {
          value: []
        },
        topic: {
          value: []
        },
        tag: {
          value: []
        }
      }
    }
  },
  mounted () {
    let self = this
    setInterval(function () {
        self.now = Date.now()
    }, REQUEST_LIMIT_INTERVAL)
    this.fromRoute(this.$route.query)
  },
  computed: {
    allowRequest() {
      return this.now - this.lastRequest > REQUEST_LIMIT_INTERVAL && this.now - this.lastSearchRequestChange > SEARCH_INTERVAL
    },
    anyPresent () {
        return this.hasExpression || this.isFilterPresent
    },
    hasExpression () {
        return this.searchRequest && this.searchRequest.trim().length > 0
    },
    isFilterPresent () {
        return this.topicProperty || this.editionProperty || this.yearProperty || this.tagProperty
    },
    isRegularExpression () {
        return this.validateRegExp(this.searchRequest)
    },
    searchRequest: {
      get: function () {
        return this.query
      },
      set: function (value) {
        this.lastSearchRequestChange = Date.now()
        this.query = value
        this.updateRoute(value, this.filter)
        if (this.anyPresent) {
          this.executeRequest(true)
        }
      }
    },
    searchTokens: {
      get: function () {
        let str = this.searchRequest.trim()
        if (str != '')
          return _.uniq(str.replace(/\s\s+/g, ' ').split(' '))
        return []
      }
    },
    topicProperty: {
      get () {
        return this.filter.topic.value.length > 0
      },
      set (value) {
        if (!value)
          this.filter.topic.value = []
      }
    },
    editionProperty: {
      get () {
        return this.filter.edition.value.length > 0
      },
      set (value) {
        if (!value)
          this.filter.edition.value = []
      }
    },
    yearProperty: {
      get () {
        return this.filter.year.value !== null
      },
      set (value) {
        if (!value)
          this.filter.year.value = null
      }
    },
    tagProperty: {
      get () {
        return this.filter.tag.value.length > 0
      },
      set (value) {
        if (!value)
          this.filter.tag.value = []
      }
    }
  },
  watch: {
    filter: {
      handler() {
        this.updateRoute(this.searchRequest, this.filter)
        this.executeRequest(true)
      },
      deep: true
    },
    allowRequest: function () {
      this.executeRequest(false)
    },
    anyPresent: function(newVal) {
      if (!newVal)
        this.$store.commit('search/disable')
    }
  },
  methods: {
    updateRoute(query, filter) {
      let object = {}
      if (query && query.length > 0)
        Object.assign(object, {q: query})
      if (this.topicProperty)
        Object.assign(object, {topic: JSON.stringify(filter.topic.value)})
      if (this.editionProperty)
        Object.assign(object, {edition: JSON.stringify(filter.edition.value)})
      if (this.tagProperty)
        Object.assign(object, {tag: JSON.stringify(filter.tag.value)})
      if (this.yearProperty)
        Object.assign(object, {selector: filter.year.selector, year: filter.year.value})
      // let compressed = LZUTF8.compress(JSON.stringify(object),{outputEncoding: 'Base64'})
      if (!_.isEqual(this.$route.query, object)) {
        this.$router.push({ path: '/', query: object})//{c: compressed}
      }
    },
    makeRequestData() {
      let data = {
          "filter": {
          },
          "tags": [],
          "expression": this.searchRequest,
          "is_regex": this.isRegularExpression,
          "orderBy": "year",
          "ordering": "ASC"
      }
      if (this.isRegularExpression)
        data.expression = data.expression.substring(1,data.expression.length-1)
      else
        data.expression = _.escapeRegExp(data.expression)
      if (this.yearProperty)
        data.filter.year = [this.filter.year.selector, this.filter.year.value]
      if (this.topicProperty)
        data.filter.topic = this.filter.topic.value
      if (this.editionProperty)
        data.filter.edition_text = this.filter.edition.value
      if (this.tagProperty)
        data.filter.tags = this.filter.tag.value
      return data
    },
    fromRoute(query) {
      // if (!compressed_query.c)
      //   return
      // var query;
      // try {
      //   query = JSON.parse(LZUTF8.decompress(compressed_query.c,{inputEncoding: 'Base64'}))
      // } catch (error) {
      //   this.isRouteQueryValid = false
      //   return
      // }

      if (query.year && query.selector && !isNaN(query.year) && /(le|lt|gt|ge|eq)/.exec(query.selector)) {
        this.filter.year.value = query.year 
        this.filter.year.selector = query.selector
      }
      if (query.edition) {
        try {
          this.filter.edition.value = _.values(JSON.parse(query.edition))
        } catch (error) {
          this.isRouteQueryValid = false
          Vue.set(this.filter.edition, 'value', [])
        }
      }
      if (query.topic) {
        try {
          Vue.set(this.filter.topic, 'value', [...JSON.parse(query.topic)])
        } catch (error) {
          this.isRouteQueryValid = false
          Vue.set(this.filter.topic, 'value', [])
        }
      }
      if (query.tag) {
        try {
          Vue.set(this.filter.tag, 'value', [...JSON.parse(query.tag)])
        } catch (error) {
          this.isRouteQueryValid = false
          Vue.set(this.filter.tag, 'value', [])
        }
      }
      if (query.q)
        this.query = query.q
    },
    validateRegExp (pattern) {
      let validate =  pattern.length > 2 && (pattern[0] == '/') && (pattern[pattern.length - 1] == '/')
      try {
        validate = validate && new RegExp(pattern)
        this.regexErrorMessage = ''
      } catch (error) {
        this.regexErrorMessage = error.message
      }
      return !!validate
    },
    executeRequest (force) {
      if (!this.anyPresent) {
        return
      }
      if (force) {
        this.didRequest = false
        this.$store.commit('search/setActive')
      }
      if (this.didRequest) {
        return
      }
      this.hideWelcome = true
      if (!this.allowRequest) {
        this.didRequest = false
        return
      }
      this.lastRequest = Date.now()
      this.didRequest = true
      // import api from '@/api/search'

      this.$store.dispatch('search/request', this.makeRequestData())
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#filter-dropdown {
  min-width:20rem;
  max-width:100%;
}

.field-body {
  max-width:20rem;
}

.field-label {
  text-align:left;
}

.is-right {
  pointer-events: initial !important
}

.dropdown-delete {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  z-index: 1;

}

#search-container {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.hero-body {
  padding-bottom:2rem;
}

.slide-enter-active, .slide-leave-active {
transition: margin-top 0.5s ease-out;
}

.progress {
  height: 0.4rem!important;
}


/*
you set the css property before transition starts
*/
.slide-enter, .slide-leave-to {
margin-top: -9rem;
}

/*
you set the css property it will be when transition ends
*/
.slide-enter-to, .slide-leave {
margin-top: 0rem;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.opaque {
  opacity: 0;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>