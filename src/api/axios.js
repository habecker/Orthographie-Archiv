import axios from 'axios'

var _axios = null

export default function () {
  if (_axios) {
    return _axios
  } else {
    _axios = axios.create({
      baseURL: '/api'
    })
    return _axios
  }
}
