import Api from './Api'

export default {
  getYearlyTopTen(year, scoreType) {
    return Api().get('/api/v1/top/10/yearly', {
      params: {
        year,
        scoreType
      }
    })
  },
}
