import Api from './Api'

export default {
  getAsset(id) {
    return Api().get('/api/v1/asset/', {
      params: {
        id
      }
    })
  },
}
