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
          <progress v-if="isRequesting" class="progress is-small is-info" max="100">15%</progress>
        </div>
        
        <div class="control">
          <div class="dropdown is-right" :class="{'is-active': filter.menuVisible}">
            <div class="dropdown-trigger">
              <button @click="filter.menuVisible=!filter.menuVisible" class="button is-medium" id="filter-button" aria-haspopup="true" aria-controls="filter-dropdown" aria-label="Filterung">
                <filter-active v-if="filter.present" />
                <filter-inactive v-else />
              </button>
            </div>
            <div class="dropdown-menu" id="filter-dropdown" role="menu">
              <div class="dropdown-content">
                <button class="delete dropdown-delete" @click="filter.menuVisible = false"></button>
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
                      <multiselect v-model="filter.topic.value" :options="filter.topic.options" :show-labels="false" placeholder="Auflage(n) auswählen" multiple></multiselect>
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
                      <multiselect v-model="filter.edition.value" :options="filter.edition.options" :show-labels="false" placeholder="Edition(en) auswählen" multiple></multiselect>
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
              <span class="tag is-info">{{ token }}</span>
            </div>
          </div>
        </template>
        <div class="control" v-if="yearProperty">
          <div class="tags has-addons">
            <span class="tag is-dark">{{ filter.year.selector | selector }} </span>
            <span class="tag is-info">{{ filter.year.value }}</span>
          </div>
        </div>
        <template v-if="topicProperty">
          <div class="control" v-for="topic in filter.topic.value" :key="topic">
            <div class="tags has-addons">
              <span class="tag is-dark"><folder-text-icon/></span>
              <span class="tag is-info">{{ topic }}</span>
            </div>
          </div>
        </template>
        <template v-if="editionProperty">
          <div class="control" v-for="topic in filter.edition.value" :key="topic">
            <div class="tags has-addons">
              <span class="tag is-dark"><numeric-icon/></span>
              <span class="tag is-info">{{ topic }}</span>
            </div>
          </div>
        </template>
      </div>
      <div v-if="regexErrorMessage" class="notification is-danger">
        <button class="delete" @click="regexErrorMessage = ''"></button>
        <p><strong>Bei der Auswertung des regulären Ausdrucks ist ein Fehler aufgetreten:</strong></p>
        <p><code>{{ regexErrorMessage }}</code></p>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'

export default {
  name: 'SearchMask',
  data() {
    return {
      hideWelcome: false,
      regexErrorMessage: "",
      isRequesting: false,
      isRouteQueryValid: true,
      filter: {
        present: false,
        menuVisible: true,
        year: {
          selector: 'lt',
          value: []
        },
        edition: {
          options: ['1. Auflage', '2. Auflage'],
          value: []
        },
        topic: {
          options: ['Thema A', 'Thema B'],
          value: []
        }
      }
    }
  },
  mounted () {
    this.fromRoute(this.$route.query)
  },
  computed: {
    isRegularExpression () {
        return this.validateRegExp(this.searchRequest)
    },
    searchRequest: {
      get: function () {
        if (this.$route.query.q)
          return this.$route.query.q
        return ""
      },
      set: function (value) {
        this.updateRoute(value, this.filter)
        this.executeRequest()
      }
    },
    searchTokens: {
      get: function () {
        return this.searchRequest.split(' ')
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
    }
  },
  watch: {
    filter: {
      handler() {
        this.updateRoute(this.searchRequest, this.filter)
      },
      deep: true
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
      if (this.yearProperty)
        Object.assign(object, {selector: filter.year.selector, year: filter.year.value})
      if (!_.isEqual(this.$route.query, object)) {
        this.$router.push({ path: '/', query: object})
        console.log("EQUAL")
      }
    },
    fromRoute(query) {
      let any = query.q
      if (query.year && query.selector && isNaN(query.year) && /(le|lt|gt|ge|eq)/.match(query.selector)) {
        this.filter.year.value = query.year 
        this.filter.year.selector = query.selector
        any = true
      }
      if (query.edition) {
        try {
          this.filter.edition.value = _.values(JSON.parse(query.edition))
          any = true
        } catch (error) {
          this.isRouteQueryValid = false
          Vue.set(this.filter.edition, 'value', [])
        }
      }
      if (query.topic) {
        try {
          Vue.set(this.filter.topic, 'value', [...JSON.parse(query.topic)])
          any = true
        } catch (error) {
          console.log(error)
          this.isRouteQueryValid = false
          Vue.set(this.filter.topic, 'value', [])
        }
      }
      if (any)
        this.executeRequest()
    },
    validateRegExp (pattern) {
      let validate =  pattern.length > 2 && (pattern[0] == '/') && (pattern[pattern.length - 1] == '/')
      try {
        validate = validate && new RegExp(pattern)
        this.regexErrorMessage = ''
      } catch (error) {
        this.regexErrorMessage = error.message
        this.isRequesting = false
      }
      return validate
    },
    executeRequest () {
      if (this.searchRequest.length > 0) {
        this.hideWelcome = true
        this.isRequesting = true
        
      } else {
        this.isRequesting = false
        //delete this.$route.query.q
      }
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

</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>