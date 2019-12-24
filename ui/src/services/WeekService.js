import Api from './Api'

export default {
  getWeeks() {
    return Api().get('/api/v1/weeks')
  },
  getWeeksBySeason(season, year) {
    return Api().get('/api/v1/weeks/season', {
      params: {
        season,
        year
      }
    })
  },
}