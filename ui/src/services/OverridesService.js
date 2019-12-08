import Api from './Api'

export default {
  overrideAssetPoster(id, url, token) {
    return Api().put('/api/v1/override/asset/poster', {id, url}, {
      headers: { Authorization: token }
    })
  },
  overrideAssetBanner(id, url, token) {
    return Api().put('/api/v1/override/asset/banner', {id, url}, {
      headers: { Authorization: token }
    })
  },
  overrideAssetAvatar(id, url, token) {
    return Api().put('/api/v1/override/asset/avatar', {id, url}, {
      headers: { Authorization: token }
    })
  },
  overrideShowTvdbId(id, tvdbId, token) {
    return Api().put('/api/v1/override/show/tvdbid', {id, tvdbId}, {
      headers: { Authorization: token }
    })
  },
}