import axios from 'axios'

const HOSTNAME = window._env_ ? window._env_.HOSTNAME : 'localhost'
const PORT = window._env_ ? window._env_.PORT : 3001
const URL = HOSTNAME.indexOf('localhost') === -1 ? `${HOSTNAME}/aniranks/` : `http://windforce.mynetgear.com:3001`
export default () => {  
  return axios.create({
    baseURL: URL
  })
}
