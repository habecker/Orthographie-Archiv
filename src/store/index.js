import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

import api from '@/api/search'


Vue.use(Vuex)
// var regexp = new RegExp('amet', 'gi');

// var str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque viverra justo nec ultrices dui sapien eget mi proin. Lobortis elemenamet nibh tellus molestie nunc non. Tincidunt praesent semper feugiat nibh sed pulvinar. Tellus at urna condimentum mattis. Sem nulla pharetra diam sit amet nisl suscipit. Ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus. Viverra adipiscing at in tellus. Arcu cursus vitae congue mauris rhoncus aenean. Eget est lorem ipsum dolor sit amet consectetur adipiscing. Pellentesque nec nam aliquam sem et. Netus et malesuada fames ac turpis egestas sed tempus. At imperdiet dui accumsan sit amet nulla facilisi. Nisl purus in mollis nunc. Fusce ut placerat orci nulla pellentesque. Magna fringilla urna porttitor rhoncus dolor purus non enim praesent. Vitae semper quis lectus nulla at ut volutpat diam ut';
var htmlEntities = {
  nbsp: ' ',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  copy: '©',
  reg: '®',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '@',
  apos: '\'',
  auml: 'ä',
  ouml: 'ö',
  uuml: 'ü',
  Auml: 'Ä',
  Ouml: 'Ö',
  Uuml: 'Ü',
  szlig: 'ß',
  raquo: '»',
  laquo: '«',
  ccedil: 'ç',
  ndash: '–',
  uarr: '↑',
  aacute: 'á',
  atilde: 'ã',
  bdquo: '„',
  ldquo: '“',
  ecirc: 'ê',
  agrave: 'à',
  eacute: 'é',
  lsquo: '‘',
  sect: '§',
  iuml: 'ï',
  rsquo: '’'
};

window.codes = []


function unescapeHTML(str) {
  let s = str.replace(/&([^;]+);/g, function (entity, entityCode) {
      var match;

      if (entityCode in htmlEntities) {
          return htmlEntities[entityCode];
          /*eslint no-cond-assign: 0*/
      } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
          /*eslint no-cond-assign: 0*/
      } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
      } else {
          window.codes.push(entity)
          return entity;
      }
  })
  return s
}

function thumbnail(regexp, str) {
  var window_size = 200

  if (regexp == null)
    return str.substr(0, _.min([200, str.length])) + '…'
  var current_window = 0
  var current_count = 0
  var windows = []
  var matchs = []
  var pos
  var match = regexp.exec(str)

  while (match) {
      if (match[0].length == 0)
        return Vue.filter('maxnchars')(str, 200) + '…'
      matchs.push(match)
      pos = [match.index, match.index + match[0].length]
      
      if (pos[0] < current_window + window_size) {
          current_count += 1
      } else {
          if (current_count > 0)
              windows.push([current_window, current_count])
          current_window = pos[0] - window_size/2 + match[0].length/2
          current_count = 1
      }
      match = regexp.exec(str)
  }
  if (current_count > 0)
      windows.push([current_window, current_count])

  var iwindow = 0;
  if (windows.length > 0)
      iwindow = _.maxBy(windows, (w) => w[1])[0]

  var thumbnail = '…'
  var last_index = iwindow + window_size
  _.forEach(_.reverse(matchs), (match) => {
      if (match.index < iwindow) {
          return false
      } else if (match.index + match[0].length < iwindow + window_size) {
          thumbnail = str.substring(match.index + match[0].length, last_index) + thumbnail
          thumbnail = '<span class="has-background-warning">' + str.substring(match.index, match.index + match[0].length) + '</span>' + thumbnail
          last_index = match.index
      } else if (match.index < iwindow + window_size) {
          thumbnail = '<span class="has-background-warning">' + str.substring(match.index, _.min([iwindow + window_size+1, match.index + match[0].length])) + '</span>' + thumbnail
          last_index = match.index
      }
  })

  thumbnail = str.substring(iwindow, last_index) + thumbnail

  if (iwindow > 0)
      thumbnail = '…' + thumbnail
  return thumbnail
}

function getSearchTokens(expression) {
  let str = expression.trim()
  if (str != '')
    return _.uniq(str.replace(/\s\s+/g, ' ').split(' '))
  return []
}

function getRegEx(state, replace_amp) {
  if (!state.searchRequest.expression || state.searchRequest.expression.trim().length == 0)
    return null
  if (state.searchRequest.is_regex) {
    return new RegExp(replace_amp? state.searchRequest.expression.replace('&', '@') : state.searchRequest.expression, "gu")
  }
  return new RegExp('(' + getSearchTokens(replace_amp? state.searchRequest.expression.replace('&', '@') : state.searchRequest.expression).join('|') + ')', "igu")
}

function markSearchResults(state, html) {
  var regex = getRegEx(state, true)
  if (regex == null)
    return html
  return markSearchResultsRegEx(regex, html)
}

function markSearchResultsRegEx(regexp, html) {
  return html.replace(regexp,"<span class=\"has-background-warning is-highlighted-in-modal\">$&</span>")
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
          'html': markSearchResults(state, unescapeHTML(row[8])).replace('@', '&amp;'),
          'thumbnail': thumbnail(getRegEx(state), Vue.filter('cleanText')(row[7]))
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
