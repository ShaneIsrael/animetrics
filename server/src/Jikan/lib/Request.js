const fetch = require('cross-fetch')
const URL = require('url').URL

module.exports = class Request {
    constructor(){
        this.baseURL = "http://localhost:9001/public/v3"
    }
    
    async send(args, params) {
        var res = await fetch(this.createUrl(args, params))
        var data = await res.json()
        if (res.status !== 200) throw new Error(`Status: ${res.status}, BaseURL: ${this.baseURL}, Data: ${JSON.stringify(data)}`)
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