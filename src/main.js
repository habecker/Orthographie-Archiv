import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './../node_modules/jquery/dist/jquery.min.js'
import './../node_modules/bulma/css/bulma.min.css'
import 'vue-material-design-icons/styles.css'
import GithubCircle from 'vue-material-design-icons/GithubCircle.vue'
import Magnify from 'vue-material-design-icons/Magnify.vue'
import Regex from 'vue-material-design-icons/Regex.vue'
import FilterOutline from 'vue-material-design-icons/FilterOutline.vue'
import FolderText from 'vue-material-design-icons/FolderText.vue'
import Filter from 'vue-material-design-icons/Filter.vue'
import Multiselect from 'vue-multiselect'
import Numeric from 'vue-material-design-icons/Numeric.vue'

Vue.config.productionTip = false
Vue.component('github-icon', GithubCircle)
Vue.component('search-icon', Magnify)
Vue.component('regexp-icon', Regex)
Vue.component('numeric-icon', Numeric)
Vue.component('folder-text-icon', FolderText)
Vue.component('filter-active', Filter)
Vue.component('filter-inactive', FilterOutline)
Vue.component('multiselect', Multiselect)

Vue.filter('selector', function (value) {
  if (!value) return ''
  switch (value) {
    case 'lt':
      return '<'
    case 'le':
      return '≤'
    case 'eq':
      return '='
    case 'gt':
      return '>'
    case 'ge':
    default:
      return '≥'
  }
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
