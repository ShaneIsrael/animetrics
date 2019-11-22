const axios = require('axios')

const baseURL = 'https://api.pushshift.io/reddit/search'

class PushShift {
  constructor(searchType) {
    this.searchType = searchType
    if (searchType === 'comment')
      this.URL = `${baseURL}/comment/`
    else
      this.URL = `${baseURL}/submission`
  }

  /**
   * Searches for results matching the query
   * @param {string} queryString The search query
   * @param {Object} optionalParams Optional search parameters
   */
  async search(queryString, optionalParams) {
    const p = optionalParams
    p.title = queryString
    const res = (await axios.get(this.URL, {
      params: p
    }))

    if (res && res.data) 
      return res.data.data
    else
      return []
  }
}

module.exports = PushShift