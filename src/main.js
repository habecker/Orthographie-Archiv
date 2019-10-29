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
import Tag from 'vue-material-design-icons/Tag.vue'
import FilterOutline from 'vue-material-design-icons/FilterOutline.vue'
import FolderText from 'vue-material-design-icons/FolderText.vue'
import Filter from 'vue-material-design-icons/Filter.vue'
import Multiselect from 'vue-multiselect'
import Numeric from 'vue-material-design-icons/Numeric.vue'
import Eye from 'vue-material-design-icons/Eye.vue'
import Download from 'vue-material-design-icons/Download.vue'
import Calendar from 'vue-material-design-icons/Calendar.vue'
import BullseyeArrow from 'vue-material-design-icons/BullseyeArrow.vue'
import SortAscending from 'vue-material-design-icons/SortAscending.vue'
import SortDescending from 'vue-material-design-icons/SortDescending.vue'
import Table from 'vue-material-design-icons/Table.vue'

Vue.config.productionTip = false
Vue.component('github-icon', GithubCircle)
Vue.component('search-icon', Magnify)
Vue.component('regexp-icon', Regex)
Vue.component('numeric-icon', Numeric)
Vue.component('folder-text-icon', FolderText)
Vue.component('bullseye-icon', BullseyeArrow)
Vue.component('tag-icon', Tag)
Vue.component('calendar-icon', Calendar)
Vue.component('details-icon', Eye)
Vue.component('download-icon', Download)
Vue.component('sort-asc-icon', SortAscending)
Vue.component('sort-desc-icon', SortDescending)
Vue.component('csv-icon', Table)
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
