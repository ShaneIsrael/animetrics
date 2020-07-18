import Api from './Api'

export default {
  getReddadzWeeklyCharts() {
    return Api().get('/api/v1/resources/rwc')
  },
  submitRWC(type, season, week, year, compressedImage, fullImage, token) {
    return Api().post('/api/v1/resources/rwc/submit', {type, season, week, year, compressedImage, fullImage, token}, {
      headers: { Authorization: token }
    })
  },
}