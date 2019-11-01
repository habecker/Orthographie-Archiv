import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

import api from '@/api/search'


Vue.use(Vuex)

function getSearchTokens(expression) {
  let str = _.escape(expression.trim())
  if (str != '')
    return _.uniq(str.replace(/\s\s+/g, ' ').split(' '))
  return []
}

function markSearchResults(state, html) {
  if (!state.searchRequest.expression || state.searchRequest.expression.trim().length == 0)
    return html
  if (state.searchRequest.is_regex) {
    return markSearchResultsRegEx(new RegExp(state.searchRequest.expression, "g"), html)
  }
  return markSearchResultsRegEx(new RegExp('(' + getSearchTokens(state.searchRequest.expression).join('|') + ')', "ig"), html)
}

function markSearchResultsRegEx(regexp, html) {
  return html.replace(regexp,"<span class=\"has-background-warning\">$&</span>")
}

export default new Vuex.Store({
  state: {
    results: [],
    results_start: 0,
    results_count: 0,
    results_step: 20,
    searchRequest: null,
    searchActive: false,
    errorOccured: false,
    corpusMeta: null,
    corpusError: null
  },
  mutations: {
    'search/append': function (state, data) {
      state.results = _.concat(state.results, _.map(data.results, function (row) {
        return {
          'id': row[0],
          'file': row[1],
          'topic': row[2],
          'year': row[3],
          'edition': row[4],
          'edition_text': row[5],
          'tags': row[6].split('\t'),
          'text': row[7],
          'html': markSearchResults(state, row[8]),
        }
      }))
      state.results_start = data.start
      state.results_count = data.count
      state.searchActive = false
    },
    'search/clear': function (state) {
      state.results = []
      state.results_count = 0
      state.results_start = 0
      state.errorOccured = false
    },
    'search/disable': function (state) {
      state.results = []
      state.results_count = 0
      state.results_start = 0
      state.searchRequest = null
      state.searchActive = false
      state.errorOccured = false
    },
    'search/setRequest': function (state, searchRequest) {
      state.results = []
      state.searchRequest = searchRequest
    },
    'search/setActive': function (state) {
      state.searchActive = true
    },
    'search/errorOccured': function (state, error) {
      state.errorOccured = error
    },
    'corpusMeta': function (state, meta) {
      state.corpusMeta = meta
    },
    'corpusError': function (state, error) {
      state.corpusError = error
    }
  },
  actions: {
    'search/request': function ({ commit }, searchRequest) {
      console.log("IH")
      commit('search/setActive')
      commit('search/setRequest', searchRequest)
      api.search(searchRequest).then((response) => {
        commit('search/clear')
        commit('search/append', response.data)
      }).catch((error) => {
        commit('search/errorOccured', error)
      })
    },
    'search/next': function ({ commit, state }) {
      if (state.results_start >= state.results_count)
        return
      
      commit('search/setActive')
      api.search(state.searchRequest, state.results_start + state.results_step).then((response) => {
        commit('search/append', response.data)
      }).catch((error) => {
        commit('search/errorOccured', error)
      })
    },
  },
  modules: {
  }
})
