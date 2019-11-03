import api from './axios'


export default {
  search (data, start) {
    let path = 'search/'
    if (start !== undefined) {
      path += start
    }
    return api().post(path, data)
  }
}