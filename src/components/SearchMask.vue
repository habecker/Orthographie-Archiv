<template>
  <div class="container">
    <transition name="slide">
      <section v-if="!hideWelcome" class="hero">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              Hero title
            </h1>
            <h2 class="subtitle">
              Hero subtitle
            </h2>
          </div>
        </div>
      </section>
    </transition>
    <div class="container" id="search-container">
    <div class="notification">
      <div class="field is-grouped">
        <div class="control is-medium has-icons-left is-expanded">
          <input class="input is-medium" type="text" placeholder="Volltextsuche" v-model="searchRequest">
          <span class="icon is-medium is-left">
            <regexp-icon v-if="isRegularExpression"/>
            <search-icon v-else/>
          </span>
          <progress class="progress is-small is-info" max="100" :class="{'opaque': !$store.state.searchActive}"></progress>
        </div>
        
        <div class="control">
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
                    <label class="checkbox">
                      <input type="checkbox" v-model="yearProperty">
                      Nach Jahren
                    </label>
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
                    <label class="checkbox">
                      <input type="checkbox" v-model="topicProperty">
                      Nach Thema
                    </label>
                  </span>
                  <div class="field">
                    <div class="control is-expanded">
                      <multiselect v-model="filter.topic.value" :options="filter.topic.options" :show-labels="false" placeholder="Auflagen durchsuchen" multiple></multiselect>
                    </div>
                  </div>
                </div>
                <div class="dropdown-item">
                  <span class="is-size-6">
                    <label class="checkbox">
                      <input type="checkbox" v-model="editionProperty">
                      Nach Auflage
                    </label>
                  </span>
                  <div class="field">
                    <div class="control is-expanded">
                      <multiselect v-model="filter.edition.value" :options="filter.edition.options" :show-labels="false" placeholder="Editionen durchsuchen" multiple></multiselect>
                    </div>
                  </div>
                </div>
                <div class="dropdown-item">
                  <span class="is-size-6">
                    <label class="checkbox">
                      <input type="checkbox" v-model="tagProperty">
                      Vorgefertigte Suchbegriffe
                    </label>
                  </span>
                  <div class="field">
                    <div class="control is-expanded">
                      <multiselect v-model="filter.tag.value" :options="filter.tag.options" :show-labels="false" placeholder="Tags durchsuchen" multiple></multiselect>
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
            <span class="tag is-dark"><regexp-icon/></span>
            <span class="tag is-warning">{{ searchRequest }}</span>
          </div>
        </div>
        <template v-else-if="searchRequest.length > 0">
          <div class="control" v-for="token in searchTokens" :key="token">
            <div class="tags has-addons">
              <span class="tag is-dark"><search-icon/></span>
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
              <span class="tag is-dark"><folder-text-icon/></span>
              <span class="tag is-white">{{ topic }}</span>
            </div>
          </div>
        </template>
        <template v-if="editionProperty">
          <div class="control" v-for="topic in filter.edition.value" :key="topic">
            <div class="tags has-addons">
              <span class="tag is-dark"><numeric-icon/></span>
              <span class="tag is-white">{{ topic }}</span>
            </div>
          </div>
        </template>
        <template v-if="tagProperty">
          <div class="control" v-for="topic in filter.tag.value" :key="topic">
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
      <div v-if="!isRouteQueryValid" class="notification is-warning">
        <button class="delete" @click="isRouteQueryValid = true"></button>
        <p><strong>Die Suchparameter aus der URL sind nicht gültig und konnten nicht übernommen werden. Die Suchmaske wurde zurückgesetzt.</strong></p>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
// import LZUTF8 from 'lzutf8'

const SEARCH_INTERVAL = 2000

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
      didRequest: false,
      now: 0,
      filter: {
        year: {
          selector: 'lt',
          value: []
        },
        edition: {
          options: ['1. Auflage', '2. Auflage', '3. Auflage', '4. Auflage', '5. Auflage', '6. Auflage', '7. Auflage', '8. Auflage', '9. Auflage', '10. Auflage', '11. Auflage', '12. Auflage', '13. Auflage', '14. Auflage', '15. Auflage', '16. Auflage', '17. Auflage', '18. Auflage', '19. Auflage', '20. Auflage', '21. Auflage', '22. Auflage', '23. Auflage', '24. Auflage', '25. Auflage', '26. Auflage', '27. Auflage', '28. Auflage', '29. Auflage', '30. Auflage'],
          value: []
        },
        topic: {
          options: ['Thema A', 'Thema B'],
          value: []
        },
        tag: {
          options: ['1. Vorschlag', '2. Vorschlag', '3. Vorschlag', '4. Vorschlag', '5. Vorschlag', '6. Vorschlag', '7. Vorschlag', '8. Vorschlag', '9. Vorschlag', '10. Vorschlag', '11. Vorschlag', '12. Vorschlag', '13. Vorschlag', '14. Vorschlag', '15. Vorschlag', '16. Vorschlag', '17. Vorschlag', '18. Vorschlag', '19. Vorschlag', '20. Vorschlag', '21. Vorschlag', '22. Vorschlag', '23. Vorschlag', '24. Vorschlag', '25. Vorschlag', '26. Vorschlag', '27. Vorschlag', '28. Vorschlag', '29. Vorschlag', '30. Vorschlag'],
          value: []
        }
      }
    }
  },
  mounted () {
    let self = this
    setInterval(function () {
        self.now = Date.now()
    }, 1000)
    this.fromRoute(this.$route.query)
  },
  computed: {
    allowRequest() {
      return this.now - this.lastRequest > SEARCH_INTERVAL
    },
    hasExpression () {
        return this.searchRequest && this.searchRequest.length > 0
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
        this.query = value
        this.updateRoute(value, this.filter)
        if (value && value.trim().length > 0) {
          this.executeRequest(true)
        }
      }
    },
    searchTokens: {
      get: function () {
        return _.uniq(this.searchRequest.trim().replace(/\s\s+/g, ' ').split(' '))
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
        return this.filter.year.value.length > 0
      },
      set (value) {
        if (!value)
          this.filter.year.value = []
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

      if (query.year && query.selector && isNaN(query.year) && /(le|lt|gt|ge|eq)/.match(query.selector)) {
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
      return validate
    },
    executeRequest (force) {
      if (!this.hasExpression && !this.isFilterPresent) {
        this.$store.commit('search/clear')
        return
      }
      if (force) {
        this.didRequest = false
        this.$store.commit('search/setActive')
      }
      if (this.didRequest) {
        return
      }
      if (!this.allowRequest) {
        this.didRequest = false
        return
      }
      this.lastRequest = Date.now()
      this.didRequest = true
      this.hideWelcome = true
      // import api from '@/api/search'

      this.$store.dispatch('search/request', {
          "filter": {
              "year": ["gt", 2007]
          },
          "tags": [],
          "expression": "[A-Za-z0-9]+",
          "is_regex": true,
          "orderBy": "year",
          "ordering": "ASC"
      })
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