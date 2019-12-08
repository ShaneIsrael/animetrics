import Api from './Api'

export default {
  getShowsAndAssets() {
    return Api().get('/api/v1/show/assets')
  },
}
