import axios from 'axios'

const HOSTNAME = window.location.href
const URL = HOSTNAME.indexOf('localhost') === -1 ? 'https://animetrics.co/a/': 'http://localhost:3001'
export default () => {  
  return axios.create({
    baseURL: URL
  })
}
