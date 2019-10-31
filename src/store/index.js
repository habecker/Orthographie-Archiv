import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

import api from '@/api/search'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    results: [],
    results_start: 0,
    results_count: 0,
    results_step: 20,
    searchRequest: null,
    searchActive: false,
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
          'text': row[6],
          'html': row[7],
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
    },
    'search/setRequest': function (state, searchRequest) {
      state.results = []
      state.searchRequest = searchRequest
    },
    'search/setActive': function (state) {
      state.searchActive = true
    }
  },
  actions: {
    'search/request': function ({ commit }, searchRequest) {
      console.log("IH")
      commit('search/setActive')
      api.search(searchRequest).then((response) => {
        console.log(response)
        commit('search/clear')
        commit('search/setRequest', searchRequest)
        commit('search/append', response.data)
      })
    },
    'search/next': function ({ commit, state }) {
      if (state.results_start >= state.results_count)
        return
      
      commit('search/setActive')
      api.search(state.searchRequest, state.results_start + state.results_step).then((response) => {
        commit('search/append', response.data)
      })
    },
  },
  modules: {
  }
})
