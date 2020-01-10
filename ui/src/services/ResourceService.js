import Api from './Api'

export default {
  getReddadzWeeklyCharts() {
    return Api().get('/api/v1/resources/rwc')
  },
}