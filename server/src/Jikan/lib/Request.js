const fetch = require('cross-fetch')
const URL = require('url').URL

module.exports = class Request {
    constructor(){
        this.baseURL = "http://localhost:9001/v3"
	//this.baseURL = "https://api.jikan.moe/v3"
    }
    
    async send(args, params) {
        var res = await fetch(this.createUrl(args, params))
        var data = await res.json()
        if (res.status !== 200) {
	  if (data.error || data.message) {
            let err = new Error(data.error || data.message)
            err.status = res.status
            err.trace = res.trace
            err.baseURL = this.baseURL
            err.args = args
	    err.params = params
            throw err
	  } else {
	    let err = new Error(JSON.stringify(data))
	    err.status = res.status
	    err.trace = res.trace
	    err.baseURL = this.baseURL
            err.args = args
	    err.params = params
	    throw err
	  }
        }
        else return data
    }

    createUrl (args, params) {
        const url = new URL(this.baseURL)
        url.pathname += `/${args.filter(a => a).join("/")}`
            for (let p in params) {
                if (params[p]) {
                    url.searchParams.set(p, params[p])
            }
        }
        return url.href
    }
}
